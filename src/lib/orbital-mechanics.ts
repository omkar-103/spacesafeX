// ============================================================
// SpaceSafe X — Orbital Mechanics Utilities
// ============================================================
// Simplified physics models for visualization purposes.
// Not intended as a replacement for SGP4/SDP4 propagators;
// these give "good enough" results for 3-D rendering & UI display.
// ============================================================

import type {
  OrbitalElements,
  CartesianPosition,
  CartesianVelocity,
  DebrisParticle,
} from '@/types';

// --- Constants ---

/** Standard gravitational parameter for Earth (km³/s²) */
const MU_EARTH = 398600.4418;

/** Degrees → Radians conversion factor */
const DEG2RAD = Math.PI / 180;

/** Radians → Degrees conversion factor */
const RAD2DEG = 180 / Math.PI;

/** Earth's mean radius (km) */
export const EARTH_RADIUS_KM = 6371;

// --- Keplerian ↔ Cartesian Conversions ---

/**
 * Solve Kepler's equation  M = E − e·sin(E)  for the eccentric anomaly E
 * using a Newton-Raphson iteration (converges in 4-6 iterations for e < 1).
 */
function solveKepler(meanAnomaly: number, eccentricity: number): number {
  const M = meanAnomaly;
  const e = eccentricity;
  let E = M; // initial guess

  for (let i = 0; i < 30; i++) {
    const dE = (M - E + e * Math.sin(E)) / (1 - e * Math.cos(E));
    E += dE;
    if (Math.abs(dE) < 1e-12) break;
  }
  return E;
}

/**
 * Convert Keplerian orbital elements to ECI Cartesian position (km).
 *
 * This performs the standard 6-step transform:
 *   1. Solve Kepler's equation for E
 *   2. Compute true anomaly ν
 *   3. Compute orbital-plane position (r, ν)
 *   4. Rotate through ω, i, Ω into ECI frame
 */
export function keplerToCartesian(orbital: OrbitalElements): CartesianPosition {
  const { semiMajorAxis: a, eccentricity: e, inclination, raan, argumentOfPerigee, meanAnomaly } = orbital;

  // Convert angles to radians
  const i = inclination * DEG2RAD;
  const Ω = raan * DEG2RAD;
  const ω = argumentOfPerigee * DEG2RAD;
  const M = meanAnomaly * DEG2RAD;

  // 1. Solve Kepler's equation
  const E = solveKepler(M, e);

  // 2. True anomaly
  const sinν = (Math.sqrt(1 - e * e) * Math.sin(E)) / (1 - e * Math.cos(E));
  const cosν = (Math.cos(E) - e) / (1 - e * Math.cos(E));
  const ν = Math.atan2(sinν, cosν);

  // 3. Distance from focus
  const r = a * (1 - e * Math.cos(E));

  // 4. Position in orbital plane
  const xOrb = r * Math.cos(ν);
  const yOrb = r * Math.sin(ν);

  // 5. Rotate into ECI (3-1-3 Euler rotation: Ω, i, ω)
  const cosΩ = Math.cos(Ω);
  const sinΩ = Math.sin(Ω);
  const cosI = Math.cos(i);
  const sinI = Math.sin(i);
  const cosω = Math.cos(ω);
  const sinω = Math.sin(ω);

  const x =
    (cosΩ * cosω - sinΩ * sinω * cosI) * xOrb +
    (-cosΩ * sinω - sinΩ * cosω * cosI) * yOrb;
  const y =
    (sinΩ * cosω + cosΩ * sinω * cosI) * xOrb +
    (-sinΩ * sinω + cosΩ * cosω * cosI) * yOrb;
  const z = (sinω * sinI) * xOrb + (cosω * sinI) * yOrb;

  return { x, y, z };
}

/**
 * Compute the velocity vector (km/s) from Keplerian elements.
 * Uses the vis-viva equation and orbital-plane velocity rotation.
 */
export function keplerToVelocity(orbital: OrbitalElements): CartesianVelocity {
  const { semiMajorAxis: a, eccentricity: e, inclination, raan, argumentOfPerigee, meanAnomaly } = orbital;

  const i = inclination * DEG2RAD;
  const Ω = raan * DEG2RAD;
  const ω = argumentOfPerigee * DEG2RAD;
  const M = meanAnomaly * DEG2RAD;

  const E = solveKepler(M, e);

  // Compute p = semi-latus rectum
  const p = a * (1 - e * e);

  // True anomaly
  const sinν = (Math.sqrt(1 - e * e) * Math.sin(E)) / (1 - e * Math.cos(E));
  const cosν = (Math.cos(E) - e) / (1 - e * Math.cos(E));
  const ν = Math.atan2(sinν, cosν);

  // Orbital-plane velocity components
  const sqrtMuOverP = Math.sqrt(MU_EARTH / p);
  const vxOrb = -sqrtMuOverP * Math.sin(ν);
  const vyOrb = sqrtMuOverP * (e + Math.cos(ν));

  // Rotate into ECI
  const cosΩ = Math.cos(Ω);
  const sinΩ = Math.sin(Ω);
  const cosI = Math.cos(i);
  const sinI = Math.sin(i);
  const cosω = Math.cos(ω);
  const sinω = Math.sin(ω);

  const vx =
    (cosΩ * cosω - sinΩ * sinω * cosI) * vxOrb +
    (-cosΩ * sinω - sinΩ * cosω * cosI) * vyOrb;
  const vy =
    (sinΩ * cosω + cosΩ * sinω * cosI) * vxOrb +
    (-sinΩ * sinω + cosΩ * cosω * cosI) * vyOrb;
  const vz = (sinω * sinI) * vxOrb + (cosω * sinI) * vyOrb;

  return { vx, vy, vz };
}

// --- Orbit Propagation ---

/**
 * Propagate an orbit forward (or backward) in time by updating the mean anomaly.
 *
 * Uses the mean motion  n = √(μ/a³)  and advances M by n·Δt.
 * Returns a new OrbitalElements with the updated meanAnomaly and epoch.
 */
export function propagateOrbit(
  elements: OrbitalElements,
  deltaTimeSec: number
): OrbitalElements {
  const { semiMajorAxis: a } = elements;

  // Mean motion (rad/s)
  const n = Math.sqrt(MU_EARTH / (a * a * a));

  // Advance mean anomaly (in degrees)
  const deltaM = (n * deltaTimeSec) * RAD2DEG;
  let newM = (elements.meanAnomaly + deltaM) % 360;
  if (newM < 0) newM += 360;

  // Advance epoch
  const oldEpoch = new Date(elements.epoch);
  const newEpoch = new Date(oldEpoch.getTime() + deltaTimeSec * 1000);

  return {
    ...elements,
    meanAnomaly: newM,
    epoch: newEpoch.toISOString(),
  };
}

// --- Collision Probability (Simplified) ---

/**
 * Estimate collision probability between a satellite and a debris object
 * using a simplified geometric model.
 *
 * This is NOT the full Monte-Carlo or Alfano method — just a quick
 * approximation for visualization and demo purposes based on miss distance
 * and relative velocity.
 *
 * @returns Probability in range [0, 1]
 */
export function calculateCollisionProbability(
  sat: { position: CartesianPosition; velocity: CartesianVelocity },
  debris: { position: CartesianPosition; velocity: CartesianVelocity }
): number {
  // Position difference
  const dx = sat.position.x - debris.position.x;
  const dy = sat.position.y - debris.position.y;
  const dz = sat.position.z - debris.position.z;
  const missDistance = Math.sqrt(dx * dx + dy * dy + dz * dz); // km

  // Relative velocity magnitude
  const dvx = sat.velocity.vx - debris.velocity.vx;
  const dvy = sat.velocity.vy - debris.velocity.vy;
  const dvz = sat.velocity.vz - debris.velocity.vz;
  const relVelocity = Math.sqrt(dvx * dvx + dvy * dvy + dvz * dvz); // km/s

  // Characteristic combined cross-section area (simplified as a sphere of 10 m radius → area in km²)
  const crossSection = Math.PI * (0.01) ** 2; // π * (10m in km)²

  // Probability based on geometric encounter:
  //   P ≈ (σ / (2π d²)) · exp(-d² / (2·σ_eff²))
  // where σ_eff accounts for velocity-induced encounter volume
  const sigmaEff = 0.5 + relVelocity * 0.02; // km — effective encounter radius
  const exponent = -(missDistance * missDistance) / (2 * sigmaEff * sigmaEff);
  const probability = (crossSection / (2 * Math.PI * sigmaEff * sigmaEff)) * Math.exp(exponent);

  // Clamp to [0, 1]
  return Math.min(1, Math.max(0, probability));
}

// --- Debris Cloud Generation ---

/**
 * Generate a cloud of debris particles around a center position.
 * Used for Kessler cascade simulations and debris field visualization.
 *
 * @param center  - Explosion/fragmentation center (ECI km)
 * @param count   - Number of particles to generate
 * @param spread  - Maximum offset from center (km)
 * @returns Array of DebrisParticle objects
 */
export function generateDebrisCloud(
  center: CartesianPosition,
  count: number,
  spread: number
): DebrisParticle[] {
  const particles: DebrisParticle[] = [];

  for (let i = 0; i < count; i++) {
    // Random spherical offset
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = spread * Math.cbrt(Math.random()); // cube root for uniform volume distribution

    const offsetX = r * Math.sin(phi) * Math.cos(theta);
    const offsetY = r * Math.sin(phi) * Math.sin(theta);
    const offsetZ = r * Math.cos(phi);

    // Random velocity perturbation (km/s), scale with spread
    const velocityScale = spread * 0.001; // ~1 m/s per km of spread
    const vx = (Math.random() - 0.5) * 2 * velocityScale;
    const vy = (Math.random() - 0.5) * 2 * velocityScale;
    const vz = (Math.random() - 0.5) * 2 * velocityScale;

    particles.push({
      id: `debris-frag-${i.toString().padStart(4, '0')}`,
      position: {
        x: center.x + offsetX,
        y: center.y + offsetY,
        z: center.z + offsetZ,
      },
      velocity: { vx, vy, vz },
      size: 0.01 + Math.random() * 0.5, // 1 cm to 50 cm
      generation: 0,
    });
  }

  return particles;
}

// --- Delta-V Calculations ---

/**
 * Calculate the approximate delta-V (km/s) needed to transfer between two orbits
 * using a simplified Hohmann-like estimate.
 *
 * For co-planar orbits this is exact for circular→circular Hohmann transfer.
 * For inclined orbits, a plane-change penalty is added.
 */
export function calculateDeltaV(
  currentOrbit: OrbitalElements,
  targetOrbit: OrbitalElements
): number {
  const a1 = currentOrbit.semiMajorAxis;
  const a2 = targetOrbit.semiMajorAxis;

  // Hohmann transfer orbit semi-major axis
  const aTransfer = (a1 + a2) / 2;

  // Velocities at departure and arrival (circular orbit speeds)
  const v1 = Math.sqrt(MU_EARTH / a1);
  const vTransfer1 = Math.sqrt(MU_EARTH * (2 / a1 - 1 / aTransfer));
  const vTransfer2 = Math.sqrt(MU_EARTH * (2 / a2 - 1 / aTransfer));
  const v2 = Math.sqrt(MU_EARTH / a2);

  // Two burns: departure and arrival
  const dv1 = Math.abs(vTransfer1 - v1);
  const dv2 = Math.abs(v2 - vTransfer2);

  // Plane change cost (simplified: ΔV ≈ 2·v·sin(Δi/2))
  const di = Math.abs(currentOrbit.inclination - targetOrbit.inclination) * DEG2RAD;
  const planeChangeCost = di > 0.001 ? 2 * v1 * Math.sin(di / 2) : 0;

  return dv1 + dv2 + planeChangeCost;
}

// --- Utility: Orbital Period ---

/**
 * Calculate the orbital period (seconds) for a given semi-major axis (km).
 */
export function orbitalPeriod(semiMajorAxisKm: number): number {
  return 2 * Math.PI * Math.sqrt(semiMajorAxisKm ** 3 / MU_EARTH);
}

/**
 * Calculate circular orbital velocity (km/s) at a given altitude above Earth's surface.
 */
export function circularVelocity(altitudeKm: number): number {
  const r = EARTH_RADIUS_KM + altitudeKm;
  return Math.sqrt(MU_EARTH / r);
}
