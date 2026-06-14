// ============================================================
// SpaceSafe X — Kessler Syndrome Simulation Engine
// ============================================================
// Pure TypeScript — no 'use client'.
// Models an orbital debris cascade (Kessler Syndrome) triggered
// by an explosion event, and compares outcomes with and without
// AI-based collision avoidance.
//
// Physics is intentionally simplified (2-D projected orbital
// mechanics) for real-time visualization.  Positions are
// expressed in a flat "orbital plane" coordinate system centred
// on Earth (km from centre).
// ============================================================

import type {
  SimulationConfig,
  SimulationMetrics,
  SimulationFrame,
  DebrisParticle,
  CollisionEvent,
  RiskZone,
  CartesianPosition,
  CartesianVelocity,
  SimulationResult,
  AgentPipelineResult,
  AgentOutput,
  RiskLevel,
} from '@/types';
import {
  EARTH_RADIUS_KM,
  generateDebrisCloud,
} from '@/lib/orbital-mechanics';
import { generateId } from '@/lib/utils';

// --- Internal constants ---

/** Collision detection radius (km) — two objects closer than this collide */
const COLLISION_RADIUS_KM = 15;

/** How many new fragments a collision spawns (multiplied by intensity) */
const FRAGMENTS_PER_COLLISION_BASE = 4;

/** Maximum debris objects before we cap (performance guard) */
const MAX_DEBRIS = 600;

/** Typical LEO altitude range (km above surface) — used for satellite placement */
const LEO_MIN = 300;
const LEO_MAX = 2000;

/** Number of simulated satellites in the environment */
const SATELLITE_COUNT = 12;

/** How many time-steps per second of "simulation time" we store as a frame */
const FRAMES_PER_HOUR = 60; // one frame per simulated minute

// ============================================================
// Satellite object used internally during simulation
// ============================================================
interface SimSatellite {
  id: string;
  position: CartesianPosition;
  velocity: CartesianVelocity;
  orbitalRadius: number; // km from Earth centre
  angle: number;         // current angle on circular orbit (radians)
  angularVelocity: number; // rad/s
  alive: boolean;
  protectedByAI: boolean;
  dodged: boolean;        // did it dodge during this sim?
}

// ============================================================
// Helper utilities
// ============================================================

/** 2-D distance between two positions (uses x,y only — top-down projection) */
function dist2d(a: CartesianPosition, b: CartesianPosition): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/** Seeded pseudo-random number generator for deterministic simulations */
class SeededRNG {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  /** Returns a float in [0, 1) */
  next(): number {
    // Mulberry32
    let t = (this.seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Returns a float in [min, max) */
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /** Returns an integer in [min, max] */
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }
}

/** Create satellites distributed across several orbital shells */
function createSatellites(rng: SeededRNG): SimSatellite[] {
  const sats: SimSatellite[] = [];

  // Distribute satellites in 3 orbital shells
  const shells = [
    EARTH_RADIUS_KM + 400,   // ISS-like
    EARTH_RADIUS_KM + 800,   // Sun-sync
    EARTH_RADIUS_KM + 1200,  // Mid-LEO
  ];

  for (let i = 0; i < SATELLITE_COUNT; i++) {
    const shellIdx = i % shells.length;
    const radius = shells[shellIdx] + rng.range(-50, 50);
    const angle = rng.range(0, 2 * Math.PI);

    // Circular orbital velocity ≈ sqrt(μ/r), but we use simplified angular velocity
    const angularVelocity = Math.sqrt(398600.4418 / (radius * radius * radius));

    sats.push({
      id: `sat-${i.toString().padStart(3, '0')}`,
      position: {
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
        z: 0,
      },
      velocity: {
        vx: -radius * angularVelocity * Math.sin(angle),
        vy: radius * angularVelocity * Math.cos(angle),
        vz: 0,
      },
      orbitalRadius: radius,
      angle,
      angularVelocity,
      alive: true,
      protectedByAI: false,
      dodged: false,
    });
  }

  return sats;
}

/** Propagate a satellite forward by dt seconds along its circular orbit */
function propagateSatellite(sat: SimSatellite, dt: number): void {
  sat.angle += sat.angularVelocity * dt;
  sat.position.x = sat.orbitalRadius * Math.cos(sat.angle);
  sat.position.y = sat.orbitalRadius * Math.sin(sat.angle);
}

/** Propagate a debris particle forward by dt seconds (linear drift) */
function propagateDebris(p: DebrisParticle, dt: number): void {
  p.position.x += p.velocity.vx * dt;
  p.position.y += p.velocity.vy * dt;
  p.position.z += p.velocity.vz * dt;
}

/** Determine the risk level from a risk score (0-100) */
function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 30) return 'moderate';
  return 'low';
}

// ============================================================
// KesslerSimulator Class
// ============================================================

export class KesslerSimulator {
  private config: SimulationConfig;
  private rng: SeededRNG;

  constructor(config: SimulationConfig) {
    this.config = config;
    // Deterministic seed derived from configuration
    this.rng = new SeededRNG(
      config.debrisCount * 17 + config.explosionIntensity * 31 + config.durationHours * 7
    );
  }

  // -------------------------------------------------------
  // Public: run WITHOUT AI intervention
  // -------------------------------------------------------
  runWithoutAI(): SimulationMetrics {
    const frames = this.generateFrames(false);
    return this.computeMetrics(frames, false);
  }

  // -------------------------------------------------------
  // Public: run WITH AI intervention
  // -------------------------------------------------------
  runWithAI(): SimulationMetrics {
    const frames = this.generateFrames(true);
    return this.computeMetrics(frames, true);
  }

  // -------------------------------------------------------
  // Public: generate animation frames
  // -------------------------------------------------------
  generateFrames(withAI: boolean): SimulationFrame[] {
    // Reset RNG for reproducibility
    this.rng = new SeededRNG(
      this.config.debrisCount * 17 + this.config.explosionIntensity * 31 + this.config.durationHours * 7
    );

    const { debrisCount, explosionIntensity, durationHours } = this.config;

    // Total frames and time-step per frame
    const totalFrames = durationHours * FRAMES_PER_HOUR;
    const dtPerFrame = (durationHours * 3600) / totalFrames; // seconds per frame

    // --- Create initial debris cloud from explosion ---
    const explosionRadius = EARTH_RADIUS_KM + this.rng.range(400, 900);
    const explosionAngle = this.rng.range(0, 2 * Math.PI);
    const explosionCenter: CartesianPosition = {
      x: explosionRadius * Math.cos(explosionAngle),
      y: explosionRadius * Math.sin(explosionAngle),
      z: 0,
    };

    // Use orbital-mechanics helper to seed the cloud
    let debris: DebrisParticle[] = generateDebrisCloud(
      explosionCenter,
      debrisCount,
      explosionIntensity * 20  // spread proportional to intensity
    );

    // Override IDs and add orbital velocity
    debris = debris.map((d, idx) => {
      // Give debris some orbital velocity (tangential to the explosion point)
      const speed = this.rng.range(2, 8); // km/s
      const angle = Math.atan2(d.position.y, d.position.x) + Math.PI / 2;
      const radialKick = this.rng.range(-1, 1); // radial perturbation

      return {
        ...d,
        id: `d-${idx.toString().padStart(4, '0')}`,
        velocity: {
          vx: speed * Math.cos(angle) + radialKick * Math.cos(angle - Math.PI / 2) + d.velocity.vx,
          vy: speed * Math.sin(angle) + radialKick * Math.sin(angle - Math.PI / 2) + d.velocity.vy,
          vz: d.velocity.vz * 0.1, // flatten into 2-D plane mostly
        },
        generation: 0,
        size: this.rng.range(0.01, 0.5 * explosionIntensity),
      };
    });

    // --- Create satellites ---
    const satellites = createSatellites(this.rng);

    // If AI mode, mark satellites as protected
    if (withAI) {
      satellites.forEach(s => { s.protectedByAI = true; });
    }

    // --- Simulation loop ---
    const frames: SimulationFrame[] = [];
    let totalCollisions = 0;
    let nextDebrisId = debrisCount;
    let currentGeneration = 0;

    for (let f = 0; f < totalFrames; f++) {
      const timestamp = f * dtPerFrame;
      const collisionEvents: CollisionEvent[] = [];

      // 1. Propagate all debris
      for (const p of debris) {
        propagateDebris(p, dtPerFrame);

        // Apply very simplified gravity: slight inward pull toward Earth centre
        const r = Math.sqrt(p.position.x ** 2 + p.position.y ** 2);
        if (r > EARTH_RADIUS_KM * 0.9) {
          const gravAccel = 398600.4418 / (r * r); // km/s²
          const ax = -gravAccel * (p.position.x / r) * dtPerFrame;
          const ay = -gravAccel * (p.position.y / r) * dtPerFrame;
          p.velocity.vx += ax;
          p.velocity.vy += ay;
        }
      }

      // 2. Propagate satellites
      for (const sat of satellites) {
        if (sat.alive) propagateSatellite(sat, dtPerFrame);
      }

      // 3. Remove debris that re-entered (below Earth surface)
      debris = debris.filter(d => {
        const r = Math.sqrt(d.position.x ** 2 + d.position.y ** 2);
        return r > EARTH_RADIUS_KM;
      });

      // 4. Check debris-to-debris collisions (sparse — only check nearby pairs)
      if (debris.length < MAX_DEBRIS) {
        const debrisCollisions: number[] = []; // indices to remove
        const newFragments: DebrisParticle[] = [];

        // Randomised subset check to keep O(n) per frame
        const checksPerFrame = Math.min(debris.length * 2, 200);
        for (let c = 0; c < checksPerFrame; c++) {
          const i = this.rng.int(0, debris.length - 1);
          const j = this.rng.int(0, debris.length - 1);
          if (i === j) continue;

          const d = dist2d(debris[i].position, debris[j].position);
          if (d < COLLISION_RADIUS_KM * (0.5 + debris[i].size + debris[j].size)) {
            // Collision!
            const newCount = Math.ceil(
              FRAGMENTS_PER_COLLISION_BASE * (1 + explosionIntensity * 0.3) * this.rng.range(0.5, 1.5)
            );
            currentGeneration = Math.max(
              currentGeneration,
              Math.max(debris[i].generation, debris[j].generation) + 1
            );

            collisionEvents.push({
              id: generateId('col'),
              timestamp,
              position: { ...debris[i].position },
              object1Id: debris[i].id,
              object2Id: debris[j].id,
              newDebrisCount: newCount,
              prevented: false,
            });

            // Generate fragments
            for (let n = 0; n < newCount && debris.length + newFragments.length < MAX_DEBRIS; n++) {
              newFragments.push({
                id: `d-${(nextDebrisId++).toString().padStart(4, '0')}`,
                position: {
                  x: debris[i].position.x + this.rng.range(-10, 10),
                  y: debris[i].position.y + this.rng.range(-10, 10),
                  z: 0,
                },
                velocity: {
                  vx: (debris[i].velocity.vx + debris[j].velocity.vx) / 2 + this.rng.range(-2, 2),
                  vy: (debris[i].velocity.vy + debris[j].velocity.vy) / 2 + this.rng.range(-2, 2),
                  vz: 0,
                },
                size: this.rng.range(0.01, 0.2),
                generation: currentGeneration,
              });
            }

            debrisCollisions.push(i, j);
            totalCollisions++;
          }
        }

        // Remove collided debris and add fragments
        const removeSet = new Set(debrisCollisions);
        debris = debris.filter((_, idx) => !removeSet.has(idx));
        debris.push(...newFragments);
      }

      // 5. Check debris-to-satellite collisions
      for (const sat of satellites) {
        if (!sat.alive) continue;

        for (let di = 0; di < debris.length; di++) {
          const d = dist2d(sat.position, debris[di].position);
          if (d < COLLISION_RADIUS_KM * 1.5) {
            if (withAI && sat.protectedByAI) {
              // AI dodges: move satellite to a safe orbit (increase radius briefly)
              sat.orbitalRadius += this.rng.range(20, 60);
              sat.dodged = true;

              collisionEvents.push({
                id: generateId('col'),
                timestamp,
                position: { ...sat.position },
                object1Id: sat.id,
                object2Id: debris[di].id,
                newDebrisCount: 0,
                prevented: true,
              });
            } else {
              // Collision with satellite → cascade!
              sat.alive = false;
              const cascadeCount = Math.ceil(
                FRAGMENTS_PER_COLLISION_BASE * 2 * (1 + explosionIntensity * 0.2)
              );
              currentGeneration++;

              collisionEvents.push({
                id: generateId('col'),
                timestamp,
                position: { ...sat.position },
                object1Id: sat.id,
                object2Id: debris[di].id,
                newDebrisCount: cascadeCount,
                prevented: false,
              });

              // Generate cascade fragments from destroyed satellite
              for (let n = 0; n < cascadeCount && debris.length < MAX_DEBRIS; n++) {
                debris.push({
                  id: `d-${(nextDebrisId++).toString().padStart(4, '0')}`,
                  position: {
                    x: sat.position.x + this.rng.range(-15, 15),
                    y: sat.position.y + this.rng.range(-15, 15),
                    z: 0,
                  },
                  velocity: {
                    vx: sat.velocity.vx + this.rng.range(-3, 3),
                    vy: sat.velocity.vy + this.rng.range(-3, 3),
                    vz: 0,
                  },
                  size: this.rng.range(0.05, 0.4),
                  generation: currentGeneration,
                });
              }

              totalCollisions++;
            }
            break; // One collision per satellite per frame
          }
        }
      }

      // 6. Build risk zones around dense debris clusters
      const riskZones: RiskZone[] = this.computeRiskZones(debris);

      // 7. Build frame snapshot — include alive satellites as larger "debris" entries
      const satelliteParticles: DebrisParticle[] = satellites
        .filter(s => s.alive)
        .map(s => ({
          id: s.id,
          position: { ...s.position },
          velocity: { ...s.velocity },
          size: s.protectedByAI && withAI ? 3 : 2, // larger dot
          generation: -1, // sentinel: this is a satellite, not debris
        }));

      frames.push({
        timestamp,
        debrisObjects: [
          ...debris.map(d => ({ ...d, position: { ...d.position }, velocity: { ...d.velocity } })),
          ...satelliteParticles,
        ],
        collisionEvents,
        totalDebris: debris.length,
        totalCollisions,
        riskZones,
      });
    }

    return frames;
  }

  // -------------------------------------------------------
  // Compute aggregate metrics from a completed frame set
  // -------------------------------------------------------
  private computeMetrics(frames: SimulationFrame[], withAI: boolean): SimulationMetrics {
    const lastFrame = frames[frames.length - 1];
    const firstFrame = frames[0];

    // Total collisions across all frames
    let totalCollisions = 0;
    let totalDebrisGenerated = 0;
    let maxGeneration = 0;
    let preventedCollisions = 0;

    for (const frame of frames) {
      for (const evt of frame.collisionEvents) {
        if (evt.prevented) {
          preventedCollisions++;
        } else {
          totalCollisions++;
          totalDebrisGenerated += evt.newDebrisCount;
        }
        // Track cascade depth from debris in the frame
      }
    }

    // Peak risk score = peak debris count normalised to 0-100
    const peakDebris = Math.max(...frames.map(f => f.totalDebris));
    const peakRiskScore = Math.min(100, Math.round((peakDebris / (this.config.debrisCount * 6)) * 100));

    // Affected satellites: count how many were destroyed
    const allSatIds = new Set<string>();
    const destroyedSatIds = new Set<string>();
    for (const frame of frames) {
      for (const evt of frame.collisionEvents) {
        if (evt.object1Id.startsWith('sat-')) {
          allSatIds.add(evt.object1Id);
          if (!evt.prevented) destroyedSatIds.add(evt.object1Id);
        }
      }
    }

    // Cascade generations = max generation found in final debris
    for (const d of lastFrame.debrisObjects) {
      if (d.generation > maxGeneration) maxGeneration = d.generation;
    }

    // Time to stabilize = first frame where debris count stops growing
    let timeToStabilize = this.config.durationHours * 3600;
    let maxDebrisSoFar = 0;
    let stableFor = 0;
    for (const frame of frames) {
      if (frame.totalDebris > maxDebrisSoFar) {
        maxDebrisSoFar = frame.totalDebris;
        stableFor = 0;
      } else {
        stableFor++;
        if (stableFor >= 10) {
          timeToStabilize = frame.timestamp;
          break;
        }
      }
    }

    return {
      totalCollisions,
      totalDebrisGenerated,
      peakRiskScore,
      affectedSatellites: destroyedSatIds.size,
      cascadeGenerations: maxGeneration,
      timeToStabilize,
    };
  }

  // -------------------------------------------------------
  // Compute risk zones from current debris distribution
  // -------------------------------------------------------
  private computeRiskZones(debris: DebrisParticle[]): RiskZone[] {
    const zones: RiskZone[] = [];

    // Divide space into angular sectors and detect clusters
    const sectorCount = 8;
    const sectorSize = (2 * Math.PI) / sectorCount;

    for (let s = 0; s < sectorCount; s++) {
      const angleMin = s * sectorSize;
      const angleMax = (s + 1) * sectorSize;
      const midAngle = (angleMin + angleMax) / 2;

      // Count debris in this sector
      let count = 0;
      let avgRadius = 0;
      for (const d of debris) {
        let angle = Math.atan2(d.position.y, d.position.x);
        if (angle < 0) angle += 2 * Math.PI;
        if (angle >= angleMin && angle < angleMax) {
          count++;
          avgRadius += Math.sqrt(d.position.x ** 2 + d.position.y ** 2);
        }
      }

      if (count > 3) {
        avgRadius /= count;
        const density = count / debris.length;
        const riskScore = Math.min(100, Math.round(density * 400));

        zones.push({
          center: {
            x: avgRadius * Math.cos(midAngle),
            y: avgRadius * Math.sin(midAngle),
            z: 0,
          },
          radius: 100 + count * 10,
          riskLevel: riskLevelFromScore(riskScore),
        });
      }
    }

    return zones;
  }
}

// ============================================================
// Demo Data Generator
// ============================================================
// Provides pre-computed results for immediate display
// without waiting for simulation to run.
// ============================================================

export function getDemoSimulationResult(): SimulationResult {
  const config: SimulationConfig = {
    initialSatelliteId: 'sat-000',
    explosionIntensity: 6,
    debrisCount: 50,
    timeStepSeconds: 60,
    durationHours: 6,
    enableAI: true,
  };

  const simulator = new KesslerSimulator(config);
  const beforeAI = simulator.runWithoutAI();
  const afterAI = simulator.runWithAI();
  const frames = simulator.generateFrames(true);

  // Generate mock AI interventions
  const aiInterventions: AgentPipelineResult[] = [
    createDemoAgentPipeline(
      'Debris cloud approaching ISS orbit — recommend evasive maneuver for SAT-001',
      95,
    ),
    createDemoAgentPipeline(
      'Secondary cascade detected in 800km shell — activating collision avoidance for SAT-004, SAT-007',
      88,
    ),
    createDemoAgentPipeline(
      'Risk zone expanding — pre-emptive orbit adjustment for SAT-010, SAT-011',
      91,
    ),
  ];

  return {
    simulationId: generateId('sim'),
    config,
    beforeAI,
    afterAI,
    frames,
    aiInterventions,
    createdAt: new Date().toISOString(),
  };
}

/** Create a realistic-looking agent pipeline result for demo purposes */
function createDemoAgentPipeline(decision: string, confidence: number): AgentPipelineResult {
  const sessionId = generateId('sess');
  const timestamp = new Date().toISOString();

  const agentOutputs: AgentOutput[] = [
    {
      agentName: 'debris',
      agentDisplayName: 'Debris Tracking Agent',
      decision: 'Debris cloud trajectory analysed — multiple fragments on collision course',
      confidence: confidence - 3,
      reasoning: 'Tracked debris cluster velocity vectors indicate intersection with satellite orbital plane within 2 orbital periods.',
      recommendedAction: 'Flag high-risk conjunctions for immediate processing',
      timestamp,
      executionTimeMs: 145,
    },
    {
      agentName: 'orbit',
      agentDisplayName: 'Orbit Analysis Agent',
      decision: 'Optimal avoidance maneuver calculated — Δv = 0.023 km/s',
      confidence,
      reasoning: 'Hohmann-like maneuver raising perigee by 12 km provides sufficient miss distance while minimising fuel expenditure.',
      recommendedAction: 'Execute prograde burn of 2.3 m/s at next ascending node',
      timestamp,
      executionTimeMs: 238,
    },
    {
      agentName: 'fuel',
      agentDisplayName: 'Fuel Optimization Agent',
      decision: 'Fuel budget sufficient — maneuver costs 0.4% of remaining propellant',
      confidence: confidence - 1,
      reasoning: 'Current fuel reserves at 73%. Proposed burn of 0.023 km/s consumes 0.29 kg of propellant.',
      recommendedAction: 'Approve maneuver — well within operational margins',
      timestamp,
      executionTimeMs: 89,
    },
    {
      agentName: 'mission',
      agentDisplayName: 'Mission Priority Agent',
      decision: 'Maneuver does not conflict with mission schedule',
      confidence: confidence + 1,
      reasoning: 'No observation windows or communication passes affected. Ground track adjustment is negligible.',
      recommendedAction: 'Clear for execution — no mission impact',
      timestamp,
      executionTimeMs: 112,
    },
    {
      agentName: 'commander',
      agentDisplayName: 'Commander Agent',
      decision,
      confidence,
      reasoning: 'All subordinate agents concur. Risk/reward analysis strongly favours the evasive maneuver.',
      recommendedAction: 'EXECUTE avoidance maneuver immediately',
      timestamp,
      executionTimeMs: 67,
    },
  ];

  return {
    sessionId,
    agents: agentOutputs,
    finalDecision: agentOutputs[agentOutputs.length - 1],
    totalExecutionTimeMs: agentOutputs.reduce((sum, a) => sum + a.executionTimeMs, 0),
    timestamp,
  };
}
