// ============================================================
// SpaceSafe X — Comprehensive Mock Data Provider (Demo Mode)
// ============================================================
// Provides realistic satellite, debris, collision, mission,
// threat, simulation, and agent output data for the demo UI.
// All data uses types from @/types/index.ts.
// ============================================================

import type {
  Satellite,
  Debris,
  CollisionPrediction,
  DashboardStats,
  LiveThreat,
  AgentOutput,
  AgentPipelineResult,
  SimulationResult,
  SimulationFrame,
  SimulationMetrics,
  Mission,
  DemoConfig,
  OrbitalElements,
  CartesianPosition,
  CartesianVelocity,
  AvoidanceManeuver,
  DebrisParticle,
  CollisionEvent,
  RiskZone,
} from '@/types';

// ── Helpers ──────────────────────────────────────────────────

/** Shorthand to produce an ISO date string relative to "now". */
function futureISO(seconds: number): string {
  return new Date(Date.now() + seconds * 1000).toISOString();
}
function pastISO(seconds: number): string {
  return new Date(Date.now() - seconds * 1000).toISOString();
}
const NOW = new Date().toISOString();

// ── Orbital Templates ────────────────────────────────────────
// Realistic-ish orbital elements for well-known spacecraft.

function makeOrbit(
  alt: number,
  ecc: number,
  inc: number,
  raan: number,
  argP: number,
  ma: number
): OrbitalElements {
  return {
    semiMajorAxis: 6371 + alt,
    eccentricity: ecc,
    inclination: inc,
    raan,
    argumentOfPerigee: argP,
    meanAnomaly: ma,
    epoch: NOW,
  };
}

function makePos(x: number, y: number, z: number): CartesianPosition {
  return { x, y, z };
}

function makeVel(vx: number, vy: number, vz: number): CartesianVelocity {
  return { vx, vy, vz };
}

// ═══════════════════════════════════════════════════════════
//  SATELLITES  (16 entries)
// ═══════════════════════════════════════════════════════════

export function getDemoSatellites(): Satellite[] {
  return [
    {
      satelliteId: 'SAT-ISS-001',
      satelliteName: 'International Space Station (ISS)',
      noradId: '25544',
      orbitType: 'LEO',
      orbitData: makeOrbit(408, 0.0001, 51.6, 247.5, 130.5, 45.3),
      position: makePos(-2531.1, 4885.7, 3941.2),
      velocity: makeVel(-5.57, -3.63, 3.98),
      riskScore: 42,
      status: 'active',
      missionType: 'research',
      operator: 'NASA / ESA / JAXA / Roscosmos',
      launchDate: '1998-11-20T00:00:00Z',
      mass: 419725,
      size: 108.5,
      power: 215000,
      fuelRemaining: 78,
      healthStatus: 'nominal',
    },
    {
      satelliteId: 'SAT-HST-002',
      satelliteName: 'Hubble Space Telescope',
      noradId: '20580',
      orbitType: 'LEO',
      orbitData: makeOrbit(540, 0.0003, 28.5, 120.3, 85.2, 178.9),
      position: makePos(4521.3, -2100.8, 3311.5),
      velocity: makeVel(2.31, 6.44, -2.98),
      riskScore: 35,
      status: 'active',
      missionType: 'research',
      operator: 'NASA / ESA',
      launchDate: '1990-04-24T00:00:00Z',
      mass: 11110,
      size: 13.2,
      power: 5500,
      fuelRemaining: 0,
      healthStatus: 'degraded',
    },
    {
      satelliteId: 'SAT-SL1-003',
      satelliteName: 'Starlink-1547',
      noradId: '45210',
      orbitType: 'LEO',
      orbitData: makeOrbit(550, 0.0001, 53.0, 178.2, 90.0, 22.7),
      position: makePos(-3102.5, 5420.1, -2100.3),
      velocity: makeVel(4.82, 2.95, 4.76),
      riskScore: 18,
      status: 'active',
      missionType: 'communication',
      operator: 'SpaceX',
      launchDate: '2020-06-13T00:00:00Z',
      mass: 260,
      size: 3.2,
      power: 3200,
      fuelRemaining: 92,
      healthStatus: 'nominal',
    },
    {
      satelliteId: 'SAT-SL2-004',
      satelliteName: 'Starlink-2184',
      noradId: '48901',
      orbitType: 'LEO',
      orbitData: makeOrbit(550, 0.0001, 53.0, 210.5, 88.3, 105.8),
      position: makePos(1204.5, -5890.3, 2801.7),
      velocity: makeVel(-3.41, -1.22, 6.21),
      riskScore: 22,
      status: 'active',
      missionType: 'communication',
      operator: 'SpaceX',
      launchDate: '2021-09-14T00:00:00Z',
      mass: 260,
      size: 3.2,
      power: 3200,
      fuelRemaining: 95,
      healthStatus: 'nominal',
    },
    {
      satelliteId: 'SAT-SL3-005',
      satelliteName: 'Starlink-3901',
      noradId: '53024',
      orbitType: 'LEO',
      orbitData: makeOrbit(550, 0.0001, 53.0, 55.8, 92.1, 260.4),
      position: makePos(5230.2, 1700.3, -3210.8),
      velocity: makeVel(-1.98, 5.72, 4.11),
      riskScore: 15,
      status: 'active',
      missionType: 'communication',
      operator: 'SpaceX',
      launchDate: '2023-01-20T00:00:00Z',
      mass: 295,
      size: 3.4,
      power: 3400,
      fuelRemaining: 97,
      healthStatus: 'nominal',
    },
    {
      satelliteId: 'SAT-GPS-006',
      satelliteName: 'GPS IIF-12 (Navstar 76)',
      noradId: '41019',
      orbitType: 'MEO',
      orbitData: makeOrbit(20180, 0.005, 55.0, 38.9, 45.1, 312.5),
      position: makePos(15210.3, 19803.5, 10200.1),
      velocity: makeVel(-1.82, 1.43, -2.51),
      riskScore: 8,
      status: 'active',
      missionType: 'navigation',
      operator: 'US Space Force',
      launchDate: '2016-02-05T00:00:00Z',
      mass: 1630,
      size: 5.3,
      power: 3100,
      fuelRemaining: 65,
      healthStatus: 'nominal',
    },
    {
      satelliteId: 'SAT-GPS-007',
      satelliteName: 'GPS III SV06',
      noradId: '52680',
      orbitType: 'MEO',
      orbitData: makeOrbit(20200, 0.003, 55.0, 98.7, 120.3, 85.2),
      position: makePos(-18900.5, 12100.3, -14500.8),
      velocity: makeVel(2.11, 2.55, 0.92),
      riskScore: 5,
      status: 'active',
      missionType: 'navigation',
      operator: 'US Space Force',
      launchDate: '2023-01-18T00:00:00Z',
      mass: 2161,
      size: 6.1,
      power: 4480,
      fuelRemaining: 88,
      healthStatus: 'nominal',
    },
    {
      satelliteId: 'SAT-SEN-008',
      satelliteName: 'Sentinel-2B',
      noradId: '42063',
      orbitType: 'SSO',
      orbitData: makeOrbit(786, 0.0001, 98.5, 198.4, 90.0, 143.7),
      position: makePos(-3800.2, -2800.5, 5800.3),
      velocity: makeVel(1.95, -6.82, -1.44),
      riskScore: 28,
      status: 'active',
      missionType: 'earth-observation',
      operator: 'ESA / Copernicus',
      launchDate: '2017-03-07T00:00:00Z',
      mass: 1130,
      size: 3.4,
      power: 1700,
      fuelRemaining: 52,
      healthStatus: 'nominal',
    },
    {
      satelliteId: 'SAT-TDS-009',
      satelliteName: 'TDRS-13',
      noradId: '43175',
      orbitType: 'GEO',
      orbitData: makeOrbit(35786, 0.0002, 0.05, 275.0, 0.0, 180.0),
      position: makePos(42164.2, -120.5, 35.8),
      velocity: makeVel(0.009, 3.075, 0.0),
      riskScore: 12,
      status: 'active',
      missionType: 'communication',
      operator: 'NASA',
      launchDate: '2017-08-18T00:00:00Z',
      mass: 3454,
      size: 21.0,
      power: 3600,
      fuelRemaining: 45,
      healthStatus: 'nominal',
    },
    {
      satelliteId: 'SAT-MET-010',
      satelliteName: 'GOES-18',
      noradId: '51850',
      orbitType: 'GEO',
      orbitData: makeOrbit(35786, 0.0001, 0.03, 227.0, 0.0, 90.0),
      position: makePos(-29800.5, -28900.3, 22.1),
      velocity: makeVel(2.108, -2.173, 0.001),
      riskScore: 10,
      status: 'active',
      missionType: 'weather',
      operator: 'NOAA / NASA',
      launchDate: '2022-03-01T00:00:00Z',
      mass: 5192,
      size: 6.1,
      power: 4000,
      fuelRemaining: 72,
      healthStatus: 'nominal',
    },
    {
      satelliteId: 'SAT-OWB-011',
      satelliteName: 'OneWeb-0248',
      noradId: '49395',
      orbitType: 'LEO',
      orbitData: makeOrbit(1200, 0.0004, 87.9, 300.2, 50.5, 200.1),
      position: makePos(2100.5, 4800.3, 5200.2),
      velocity: makeVel(-5.21, 1.88, 3.62),
      riskScore: 20,
      status: 'active',
      missionType: 'communication',
      operator: 'OneWeb',
      launchDate: '2021-12-27T00:00:00Z',
      mass: 148,
      size: 1.3,
      power: 1500,
      fuelRemaining: 85,
      healthStatus: 'nominal',
    },
    {
      satelliteId: 'SAT-CS2-012',
      satelliteName: 'CryoSat-2',
      noradId: '36508',
      orbitType: 'polar',
      orbitData: makeOrbit(717, 0.0013, 92.0, 125.3, 270.0, 67.5),
      position: makePos(-1200.3, 1800.5, 6600.2),
      velocity: makeVel(-3.12, -6.55, 0.88),
      riskScore: 38,
      status: 'active',
      missionType: 'earth-observation',
      operator: 'ESA',
      launchDate: '2010-04-08T00:00:00Z',
      mass: 720,
      size: 4.6,
      power: 850,
      fuelRemaining: 25,
      healthStatus: 'degraded',
    },
    {
      satelliteId: 'SAT-TIA-013',
      satelliteName: 'Tiangong Space Station',
      noradId: '54216',
      orbitType: 'LEO',
      orbitData: makeOrbit(389, 0.0003, 41.5, 330.8, 145.2, 88.4),
      position: makePos(3800.2, 3200.5, -4100.3),
      velocity: makeVel(-4.52, 4.92, 2.88),
      riskScore: 45,
      status: 'active',
      missionType: 'research',
      operator: 'CNSA',
      launchDate: '2021-04-29T00:00:00Z',
      mass: 66000,
      size: 55.0,
      power: 100000,
      fuelRemaining: 68,
      healthStatus: 'nominal',
    },
    {
      satelliteId: 'SAT-ENV-014',
      satelliteName: 'Envisat (Defunct)',
      noradId: '27386',
      orbitType: 'SSO',
      orbitData: makeOrbit(770, 0.0001, 98.5, 45.5, 90.0, 310.3),
      position: makePos(-5200.1, 3200.5, 3100.8),
      velocity: makeVel(-2.55, -5.81, -3.22),
      riskScore: 72,
      status: 'inactive',
      missionType: 'earth-observation',
      operator: 'ESA',
      launchDate: '2002-03-01T00:00:00Z',
      mass: 8211,
      size: 26.0,
      power: 0,
      fuelRemaining: 0,
      healthStatus: 'offline',
    },
    {
      satelliteId: 'SAT-IMS-015',
      satelliteName: 'Iridium NEXT-152',
      noradId: '43927',
      orbitType: 'LEO',
      orbitData: makeOrbit(780, 0.0002, 86.4, 185.2, 270.0, 145.8),
      position: makePos(1500.3, -5500.2, 3900.8),
      velocity: makeVel(4.33, 2.12, 5.18),
      riskScore: 25,
      status: 'active',
      missionType: 'communication',
      operator: 'Iridium Communications',
      launchDate: '2019-01-11T00:00:00Z',
      mass: 860,
      size: 3.1,
      power: 2200,
      fuelRemaining: 71,
      healthStatus: 'nominal',
    },
    {
      satelliteId: 'SAT-WV3-016',
      satelliteName: 'WorldView-3',
      noradId: '40115',
      orbitType: 'SSO',
      orbitData: makeOrbit(617, 0.0001, 97.9, 265.8, 90.0, 55.2),
      position: makePos(4100.5, 2300.2, -4800.3),
      velocity: makeVel(-3.15, 6.11, 1.55),
      riskScore: 19,
      status: 'active',
      missionType: 'earth-observation',
      operator: 'Maxar Technologies',
      launchDate: '2014-08-13T00:00:00Z',
      mass: 2800,
      size: 5.7,
      power: 3800,
      fuelRemaining: 40,
      healthStatus: 'nominal',
    },
  ];
}

// ═══════════════════════════════════════════════════════════
//  DEBRIS  (22 entries)
// ═══════════════════════════════════════════════════════════

export function getDemoDebris(): Debris[] {
  return [
    {
      debrisId: 'DEB-COSMOS-001',
      name: 'Cosmos 2251 Fragment A',
      orbitData: makeOrbit(790, 0.004, 74.0, 210.3, 45.8, 122.5),
      position: makePos(-4200.3, 3100.5, 4000.2),
      velocity: makeVel(3.55, -4.21, 4.88),
      size: 'large',
      characteristicLength: 2.1,
      mass: 150,
      origin: 'Cosmos 2251 / Iridium 33 collision (2009)',
      riskLevel: 'high',
      detectedAt: '2009-02-10T16:56:00Z',
      lastTracked: pastISO(120),
    },
    {
      debrisId: 'DEB-COSMOS-002',
      name: 'Cosmos 2251 Fragment B',
      orbitData: makeOrbit(810, 0.008, 73.5, 215.1, 50.2, 180.3),
      position: makePos(3500.2, -4800.5, 2100.3),
      velocity: makeVel(-4.12, -2.35, 5.67),
      size: 'medium',
      characteristicLength: 0.8,
      mass: 35,
      origin: 'Cosmos 2251 / Iridium 33 collision (2009)',
      riskLevel: 'moderate',
      detectedAt: '2009-02-10T17:02:00Z',
      lastTracked: pastISO(300),
    },
    {
      debrisId: 'DEB-FY1C-003',
      name: 'Fengyun-1C Fragment 1',
      orbitData: makeOrbit(865, 0.012, 99.0, 88.5, 180.2, 45.6),
      position: makePos(-1800.5, 5200.3, -3800.2),
      velocity: makeVel(5.12, 1.88, -4.55),
      size: 'large',
      characteristicLength: 1.5,
      mass: 85,
      origin: 'Chinese ASAT test — Fengyun-1C (2007)',
      riskLevel: 'critical',
      detectedAt: '2007-01-11T22:26:00Z',
      lastTracked: pastISO(60),
    },
    {
      debrisId: 'DEB-FY1C-004',
      name: 'Fengyun-1C Fragment 2',
      orbitData: makeOrbit(820, 0.015, 98.8, 92.1, 175.5, 210.3),
      position: makePos(2800.5, 4500.2, 3600.3),
      velocity: makeVel(-3.88, 3.42, -4.21),
      size: 'medium',
      characteristicLength: 0.5,
      mass: 22,
      origin: 'Chinese ASAT test — Fengyun-1C (2007)',
      riskLevel: 'high',
      detectedAt: '2007-01-12T00:15:00Z',
      lastTracked: pastISO(180),
    },
    {
      debrisId: 'DEB-SL16-005',
      name: 'SL-16 R/B (Zenit-2)',
      orbitData: makeOrbit(850, 0.002, 71.0, 145.8, 220.3, 88.7),
      position: makePos(-5100.2, -2300.5, 3200.3),
      velocity: makeVel(2.88, -5.55, 3.92),
      size: 'large',
      characteristicLength: 11.4,
      mass: 8200,
      origin: 'SL-16 rocket body (derelict)',
      riskLevel: 'critical',
      detectedAt: '1992-11-20T00:00:00Z',
      lastTracked: pastISO(45),
    },
    {
      debrisId: 'DEB-DELTA-006',
      name: 'Delta II Stage Fragment',
      orbitData: makeOrbit(720, 0.01, 65.0, 310.2, 135.7, 290.5),
      position: makePos(4100.3, -1800.5, 4500.2),
      velocity: makeVel(-1.55, 6.22, 2.88),
      size: 'medium',
      characteristicLength: 0.6,
      mass: 42,
      origin: 'Delta II upper stage breakup',
      riskLevel: 'moderate',
      detectedAt: '2006-07-15T00:00:00Z',
      lastTracked: pastISO(200),
    },
    {
      debrisId: 'DEB-ARIANE-007',
      name: 'Ariane 5 Tank Fragment',
      orbitData: makeOrbit(610, 0.003, 7.0, 35.8, 180.0, 120.3),
      position: makePos(6500.2, 1200.3, 800.5),
      velocity: makeVel(-0.92, 7.12, 0.55),
      size: 'large',
      characteristicLength: 3.2,
      mass: 280,
      origin: 'Ariane 5 upper stage',
      riskLevel: 'high',
      detectedAt: '2015-08-20T00:00:00Z',
      lastTracked: pastISO(90),
    },
    {
      debrisId: 'DEB-BREEZE-008',
      name: 'Breeze-M Tank Debris',
      orbitData: makeOrbit(420, 0.155, 51.6, 188.3, 310.0, 55.8),
      position: makePos(-2100.5, 5800.3, -1500.2),
      velocity: makeVel(5.88, 2.12, 4.33),
      size: 'medium',
      characteristicLength: 1.2,
      mass: 120,
      origin: 'Breeze-M propellant tank rupture',
      riskLevel: 'high',
      detectedAt: '2012-10-06T00:00:00Z',
      lastTracked: pastISO(150),
    },
    {
      debrisId: 'DEB-PAINT-009',
      name: 'STS Paint Flake Cloud A',
      orbitData: makeOrbit(400, 0.001, 51.6, 240.5, 90.0, 310.2),
      position: makePos(3200.5, 4100.2, 3800.3),
      velocity: makeVel(-4.55, 3.82, 3.12),
      size: 'small',
      characteristicLength: 0.01,
      mass: 0.01,
      origin: 'Space Shuttle thermal protection',
      riskLevel: 'low',
      detectedAt: '2003-06-05T00:00:00Z',
      lastTracked: pastISO(3600),
    },
    {
      debrisId: 'DEB-TOOL-010',
      name: 'Lost EVA Tool Bag',
      orbitData: makeOrbit(395, 0.0008, 51.6, 250.2, 95.3, 180.5),
      position: makePos(-1500.2, 5100.3, 3900.5),
      velocity: makeVel(-5.12, -2.55, 4.21),
      size: 'medium',
      characteristicLength: 0.4,
      mass: 14,
      origin: 'ISS EVA incident (STS-126)',
      riskLevel: 'low',
      detectedAt: '2008-11-18T00:00:00Z',
      lastTracked: pastISO(600),
    },
    {
      debrisId: 'DEB-IRAS-011',
      name: 'IRAS Satellite Body',
      orbitData: makeOrbit(900, 0.0015, 99.0, 55.3, 270.0, 135.8),
      position: makePos(2200.3, -5800.5, 1800.2),
      velocity: makeVel(5.55, 1.22, -4.88),
      size: 'large',
      characteristicLength: 3.6,
      mass: 1083,
      origin: 'IRAS derelict satellite',
      riskLevel: 'critical',
      detectedAt: '1983-01-25T00:00:00Z',
      lastTracked: pastISO(30),
    },
    {
      debrisId: 'DEB-CZ4-012',
      name: 'CZ-4C Stage Fragment',
      orbitData: makeOrbit(780, 0.009, 98.2, 142.8, 200.5, 75.3),
      position: makePos(-4500.5, 2100.3, 4200.2),
      velocity: makeVel(2.22, -5.88, -3.45),
      size: 'medium',
      characteristicLength: 0.9,
      mass: 55,
      origin: 'CZ-4C upper stage breakup (2021)',
      riskLevel: 'high',
      detectedAt: '2021-03-18T00:00:00Z',
      lastTracked: pastISO(100),
    },
    {
      debrisId: 'DEB-ANTI-013',
      name: 'Kosmos-1408 Fragment A',
      orbitData: makeOrbit(480, 0.006, 82.6, 65.2, 110.3, 230.8),
      position: makePos(1800.3, -3200.5, 5500.2),
      velocity: makeVel(-4.88, -3.55, -2.12),
      size: 'large',
      characteristicLength: 1.8,
      mass: 95,
      origin: 'Russian ASAT test — Kosmos-1408 (2021)',
      riskLevel: 'critical',
      detectedAt: '2021-11-15T02:00:00Z',
      lastTracked: pastISO(75),
    },
    {
      debrisId: 'DEB-ANTI-014',
      name: 'Kosmos-1408 Fragment B',
      orbitData: makeOrbit(510, 0.012, 82.3, 68.5, 115.8, 290.2),
      position: makePos(-3300.5, 1800.2, 5200.3),
      velocity: makeVel(3.12, 5.55, -2.88),
      size: 'medium',
      characteristicLength: 0.6,
      mass: 28,
      origin: 'Russian ASAT test — Kosmos-1408 (2021)',
      riskLevel: 'high',
      detectedAt: '2021-11-15T03:12:00Z',
      lastTracked: pastISO(110),
    },
    {
      debrisId: 'DEB-BOLT-015',
      name: 'Thermal Blanket Fragment',
      orbitData: makeOrbit(415, 0.0005, 51.6, 252.1, 88.7, 55.3),
      position: makePos(2800.2, 4800.5, 2900.3),
      velocity: makeVel(-4.21, 3.12, 4.55),
      size: 'small',
      characteristicLength: 0.08,
      mass: 0.15,
      origin: 'ISS MLI shedding',
      riskLevel: 'low',
      detectedAt: '2019-04-10T00:00:00Z',
      lastTracked: pastISO(1800),
    },
    {
      debrisId: 'DEB-PEGASUS-016',
      name: 'Pegasus Rocket Fragment',
      orbitData: makeOrbit(690, 0.018, 82.0, 195.3, 300.2, 140.8),
      position: makePos(-5500.3, -1200.5, 3100.2),
      velocity: makeVel(1.88, -6.22, 3.55),
      size: 'medium',
      characteristicLength: 0.7,
      mass: 48,
      origin: 'Pegasus rocket body breakup',
      riskLevel: 'moderate',
      detectedAt: '2010-09-22T00:00:00Z',
      lastTracked: pastISO(250),
    },
    {
      debrisId: 'DEB-INSAT-017',
      name: 'INSAT-2D Debris',
      orbitData: makeOrbit(35780, 0.001, 0.1, 83.5, 0.0, 210.5),
      position: makePos(40200.5, 12800.3, 55.2),
      velocity: makeVel(-0.93, 2.92, 0.003),
      size: 'large',
      characteristicLength: 2.8,
      mass: 550,
      origin: 'INSAT-2D derelict (GEO)',
      riskLevel: 'moderate',
      detectedAt: '2003-10-04T00:00:00Z',
      lastTracked: pastISO(500),
    },
    {
      debrisId: 'DEB-TITAN-018',
      name: 'Titan III Transtage Fragment',
      orbitData: makeOrbit(830, 0.022, 32.5, 278.3, 155.8, 95.2),
      position: makePos(5800.3, 2500.2, -2100.5),
      velocity: makeVel(-2.55, 5.88, 3.12),
      size: 'medium',
      characteristicLength: 0.45,
      mass: 32,
      origin: 'Titan III-C Transtage breakup',
      riskLevel: 'moderate',
      detectedAt: '1998-02-14T00:00:00Z',
      lastTracked: pastISO(350),
    },
    {
      debrisId: 'DEB-GLOVE-019',
      name: 'Astronaut Glove (EVA)',
      orbitData: makeOrbit(398, 0.0003, 51.6, 245.8, 92.1, 300.5),
      position: makePos(-2800.5, 4500.3, 3800.2),
      velocity: makeVel(-5.22, -3.12, 3.88),
      size: 'small',
      characteristicLength: 0.25,
      mass: 0.4,
      origin: 'Gemini 4 EVA loss (1965)',
      riskLevel: 'low',
      detectedAt: '1965-06-03T00:00:00Z',
      lastTracked: pastISO(7200),
    },
    {
      debrisId: 'DEB-PROTON-020',
      name: 'Proton-M 3rd Stage',
      orbitData: makeOrbit(500, 0.035, 51.6, 310.5, 230.8, 170.3),
      position: makePos(4200.3, -3500.5, -3800.2),
      velocity: makeVel(3.88, 4.55, -3.22),
      size: 'large',
      characteristicLength: 6.5,
      mass: 3800,
      origin: 'Proton-M 3rd stage (derelict)',
      riskLevel: 'critical',
      detectedAt: '2014-05-16T00:00:00Z',
      lastTracked: pastISO(55),
    },
    {
      debrisId: 'DEB-VELA-021',
      name: 'Vela Hotel Fragment',
      orbitData: makeOrbit(111000, 0.6, 32.0, 155.8, 80.3, 240.5),
      position: makePos(85200.3, 55000.2, 30000.5),
      velocity: makeVel(-0.22, 0.88, -0.45),
      size: 'medium',
      characteristicLength: 0.3,
      mass: 15,
      origin: 'Vela Hotel nuclear detection satellite',
      riskLevel: 'low',
      detectedAt: '1984-01-01T00:00:00Z',
      lastTracked: pastISO(86400),
    },
    {
      debrisId: 'DEB-SL8-022',
      name: 'SL-8 R/B (Kosmos-3M)',
      orbitData: makeOrbit(975, 0.003, 82.9, 188.5, 135.2, 55.8),
      position: makePos(-3200.5, 4800.2, -3500.3),
      velocity: makeVel(4.55, 2.88, -4.12),
      size: 'large',
      characteristicLength: 7.5,
      mass: 1440,
      origin: 'Kosmos-3M rocket body (derelict)',
      riskLevel: 'high',
      detectedAt: '1978-06-12T00:00:00Z',
      lastTracked: pastISO(40),
    },
  ];
}

// ═══════════════════════════════════════════════════════════
//  COLLISION PREDICTIONS  (8 entries)
// ═══════════════════════════════════════════════════════════

export function getDemoCollisionPredictions(): CollisionPrediction[] {
  const maneuver1: AvoidanceManeuver = {
    deltaV: makeVel(0.0012, 0.0008, -0.0003),
    totalDeltaV: 0.0015,
    fuelCost: 0.8,
    fuelPercentage: 1.02,
    burnDuration: 12,
    burnStartTime: futureISO(1800),
    newOrbit: makeOrbit(410, 0.0002, 51.6, 247.5, 130.8, 45.9),
    safetyMargin: 8.5,
  };

  const maneuver2: AvoidanceManeuver = {
    deltaV: makeVel(0.0025, -0.0012, 0.0005),
    totalDeltaV: 0.0029,
    fuelCost: 0.3,
    fuelPercentage: 0.33,
    burnDuration: 8,
    burnStartTime: futureISO(5400),
    newOrbit: makeOrbit(553, 0.0002, 53.0, 178.5, 90.3, 23.1),
    safetyMargin: 12.3,
  };

  return [
    {
      predictionId: 'CPR-001',
      satelliteId: 'SAT-ISS-001',
      satelliteName: 'ISS',
      debrisId: 'DEB-FY1C-003',
      debrisName: 'Fengyun-1C Fragment 1',
      probability: 0.0082,
      riskScore: 92,
      missDistance: 0.45,
      relativeVelocity: 14.2,
      estimatedImpactTime: futureISO(3600),
      timeToImpact: 3600,
      avoidanceManeuver: maneuver1,
      status: 'critical',
    },
    {
      predictionId: 'CPR-002',
      satelliteId: 'SAT-SL1-003',
      satelliteName: 'Starlink-1547',
      debrisId: 'DEB-COSMOS-001',
      debrisName: 'Cosmos 2251 Fragment A',
      probability: 0.0034,
      riskScore: 78,
      missDistance: 1.2,
      relativeVelocity: 11.8,
      estimatedImpactTime: futureISO(7200),
      timeToImpact: 7200,
      avoidanceManeuver: maneuver2,
      status: 'warning',
    },
    {
      predictionId: 'CPR-003',
      satelliteId: 'SAT-HST-002',
      satelliteName: 'Hubble Space Telescope',
      debrisId: 'DEB-SL16-005',
      debrisName: 'SL-16 R/B (Zenit-2)',
      probability: 0.0015,
      riskScore: 85,
      missDistance: 2.1,
      relativeVelocity: 13.5,
      estimatedImpactTime: futureISO(14400),
      timeToImpact: 14400,
      status: 'warning',
    },
    {
      predictionId: 'CPR-004',
      satelliteId: 'SAT-TIA-013',
      satelliteName: 'Tiangong Space Station',
      debrisId: 'DEB-ANTI-013',
      debrisName: 'Kosmos-1408 Fragment A',
      probability: 0.012,
      riskScore: 95,
      missDistance: 0.3,
      relativeVelocity: 15.1,
      estimatedImpactTime: futureISO(2400),
      timeToImpact: 2400,
      status: 'critical',
    },
    {
      predictionId: 'CPR-005',
      satelliteId: 'SAT-SEN-008',
      satelliteName: 'Sentinel-2B',
      debrisId: 'DEB-CZ4-012',
      debrisName: 'CZ-4C Stage Fragment',
      probability: 0.0008,
      riskScore: 45,
      missDistance: 5.8,
      relativeVelocity: 10.2,
      estimatedImpactTime: futureISO(28800),
      timeToImpact: 28800,
      status: 'monitoring',
    },
    {
      predictionId: 'CPR-006',
      satelliteId: 'SAT-ENV-014',
      satelliteName: 'Envisat (Defunct)',
      debrisId: 'DEB-SL8-022',
      debrisName: 'SL-8 R/B (Kosmos-3M)',
      probability: 0.0055,
      riskScore: 88,
      missDistance: 0.8,
      relativeVelocity: 14.8,
      estimatedImpactTime: futureISO(10800),
      timeToImpact: 10800,
      status: 'critical',
    },
    {
      predictionId: 'CPR-007',
      satelliteId: 'SAT-SL2-004',
      satelliteName: 'Starlink-2184',
      debrisId: 'DEB-BREEZE-008',
      debrisName: 'Breeze-M Tank Debris',
      probability: 0.0002,
      riskScore: 28,
      missDistance: 12.5,
      relativeVelocity: 9.1,
      estimatedImpactTime: futureISO(43200),
      timeToImpact: 43200,
      status: 'monitoring',
    },
    {
      predictionId: 'CPR-008',
      satelliteId: 'SAT-CS2-012',
      satelliteName: 'CryoSat-2',
      debrisId: 'DEB-PEGASUS-016',
      debrisName: 'Pegasus Rocket Fragment',
      probability: 0.0018,
      riskScore: 62,
      missDistance: 3.4,
      relativeVelocity: 12.3,
      estimatedImpactTime: futureISO(21600),
      timeToImpact: 21600,
      status: 'warning',
    },
  ];
}

// ═══════════════════════════════════════════════════════════
//  MISSIONS  (6 entries)
// ═══════════════════════════════════════════════════════════

export function getDemoMissions(): Mission[] {
  return [
    {
      missionId: 'MSN-001',
      missionName: 'Starlink Gen2 Phase 4',
      type: 'communication',
      satelliteId: 'SAT-SL3-005',
      status: 'active',
      description: 'Deploy constellation of 160 Starlink V2 Mini satellites into shell 4 (53° inclination, 550 km).',
      objectives: [
        'Deploy 160 satellites to operational orbit',
        'Achieve 99.5% uptime for broadband service',
        'Maintain collision avoidance compliance',
      ],
      launchDate: '2024-11-15T00:00:00Z',
      estimatedLifespan: 60,
      aiReport: {
        orbitRecommendation: 'Optimal shell altitude of 550 km confirmed; minimal conjunction risk in target shell.',
        coverageEstimation: 'Full coverage between ±53° latitude after 120 days post-deployment.',
        missionLifespan: 'Estimated 5-year operational life with 93% fleet availability.',
        riskAssessment: 'Low overall risk. Monitor Fengyun-1C debris cloud for shell intersection.',
        overallScore: 87,
        recommendations: [
          'Pre-position ground stations in South America for improved telemetry',
          'Schedule automated collision avoidance for first 30 days',
          'Reserve 5% propellant budget for debris avoidance',
        ],
      },
    },
    {
      missionId: 'MSN-002',
      missionName: 'ISS Reboost & Resupply',
      type: 'research',
      satelliteId: 'SAT-ISS-001',
      status: 'active',
      description: 'Periodic orbit reboost of the International Space Station using Progress MS-28 and crew resupply.',
      objectives: [
        'Raise orbital altitude by 2.5 km',
        'Deliver 2,400 kg of supplies',
        'Replace CO₂ scrubber modules',
      ],
      launchDate: '2026-05-20T00:00:00Z',
      estimatedLifespan: 1,
      aiReport: {
        orbitRecommendation: 'Target altitude of 410.5 km; avoid reboost window overlap with Fengyun debris crossing.',
        coverageEstimation: 'N/A — Station-keeping mission.',
        missionLifespan: 'ISS operational through 2030; structural integrity nominal.',
        riskAssessment: 'Moderate risk due to increased debris density at 400-420 km altitude band.',
        overallScore: 74,
        recommendations: [
          'Perform PDAM (Pre-Determined Avoidance Maneuver) 6 hours before conjunction CPR-001',
          'Verify Progress docking clearance with ISS attitude',
          'Update TLE catalog before reboost burn',
        ],
      },
    },
    {
      missionId: 'MSN-003',
      missionName: 'Sentinel-2C Earth Observation',
      type: 'earth-observation',
      satelliteId: 'SAT-SEN-008',
      status: 'active',
      description: 'Continuation of Copernicus land monitoring with multispectral imagery at 10m resolution.',
      objectives: [
        'Maintain 5-day revisit time',
        'Generate global land-cover maps',
        'Support wildfire and flood response',
      ],
      launchDate: '2024-09-05T00:00:00Z',
      estimatedLifespan: 84,
      aiReport: {
        orbitRecommendation: 'Sun-synchronous orbit at 786 km nominal; maintain LTAN at 10:30.',
        coverageEstimation: 'Global coverage every 5 days; enhanced overlap at high latitudes.',
        missionLifespan: 'Projected 7+ years with current fuel reserves (52%).',
        riskAssessment: 'Low risk. One medium-priority conjunction (CPR-005) in next 8 hours.',
        overallScore: 91,
        recommendations: [
          'Calibrate MSI instrument during next eclipse season',
          'Coordinate with Sentinel-2B for tandem acquisitions',
        ],
      },
    },
    {
      missionId: 'MSN-004',
      missionName: 'Tiangong Crew Rotation (Shenzhou-21)',
      type: 'research',
      satelliteId: 'SAT-TIA-013',
      status: 'planned',
      description: 'Crew rotation mission for Tiangong space station with 3 taikonauts and scientific equipment.',
      objectives: [
        'Safely dock Shenzhou-21 with Tianhe core module',
        'Complete 6-month crew rotation',
        'Install new space debris tracking sensor',
      ],
      launchDate: '2026-07-15T00:00:00Z',
      estimatedLifespan: 6,
    },
    {
      missionId: 'MSN-005',
      missionName: 'Envisat Controlled De-Orbit',
      type: 'earth-observation',
      satelliteId: 'SAT-ENV-014',
      status: 'planned',
      description: 'Active debris removal mission to de-orbit the defunct 8-ton Envisat satellite using a chaser vehicle.',
      objectives: [
        'Rendezvous with non-cooperative Envisat',
        'Attach de-orbit sail or propulsion module',
        'Guide re-entry over South Pacific Ocean Uninhabited Area',
      ],
      launchDate: '2027-03-01T00:00:00Z',
      estimatedLifespan: 3,
      aiReport: {
        orbitRecommendation: 'Target de-orbit periapsis at 120 km for controlled re-entry within 6 months.',
        coverageEstimation: 'N/A — debris removal mission.',
        missionLifespan: 'Active removal phase: 3 months. Atmospheric re-entry: ~6 months post-capture.',
        riskAssessment: 'High risk. Envisat is tumbling at ~4°/s. Collision with SL-8 R/B (CPR-006) imminent.',
        overallScore: 58,
        recommendations: [
          'Classify tumble axis using ground radar prior to approach',
          'Use robotic arm with compliant grasping for capture',
          'Reserve 30% chaser fuel for contingency maneuvers',
          'Coordinate with 18th SDS for debris tracking during de-orbit',
        ],
      },
    },
    {
      missionId: 'MSN-006',
      missionName: 'GPS III Block II Deployment',
      type: 'navigation',
      satelliteId: 'SAT-GPS-007',
      status: 'completed',
      description: 'Deployment of GPS III SV06 to operational orbit in Plane B, Slot 4 of the GPS constellation.',
      objectives: [
        'Achieve MEO insertion at 20,200 km',
        'Commission L1C/A, L2C, L5 signals',
        'Begin M-code broadcast for military users',
      ],
      launchDate: '2023-01-18T00:00:00Z',
      estimatedLifespan: 180,
      aiReport: {
        orbitRecommendation: 'Operational orbit confirmed at 20,200 km ± 50 km.',
        coverageEstimation: '99.7% position accuracy globally with current constellation geometry.',
        missionLifespan: '15-year design life; all subsystems nominal.',
        riskAssessment: 'Very low risk. MEO debris environment is sparse.',
        overallScore: 96,
        recommendations: [
          'Monitor station-keeping ΔV budget quarterly',
          'Coordinate orbit slot with legacy GPS IIR satellites',
        ],
      },
    },
  ];
}

// ═══════════════════════════════════════════════════════════
//  DASHBOARD STATS
// ═══════════════════════════════════════════════════════════

export function getDemoDashboardStats(): DashboardStats {
  return {
    activeSatellites: 15,
    trackedDebris: 22,
    collisionRisks: 8,
    aiRecommendations: 14,
    activeMissions: 4,
  };
}

// ═══════════════════════════════════════════════════════════
//  LIVE THREATS  (6 entries)
// ═══════════════════════════════════════════════════════════

export function getDemoLiveThreats(): LiveThreat[] {
  return [
    {
      id: 'LT-001',
      satelliteName: 'Tiangong Space Station',
      debrisName: 'Kosmos-1408 Fragment A',
      riskScore: 95,
      probability: 0.012,
      timeToImpact: 2400,
      estimatedImpactTime: futureISO(2400),
      aiManeuver: 'Emergency retrograde burn: ΔV 0.003 km/s, burn in T-18 min',
      status: 'critical',
    },
    {
      id: 'LT-002',
      satelliteName: 'ISS',
      debrisName: 'Fengyun-1C Fragment 1',
      riskScore: 92,
      probability: 0.0082,
      timeToImpact: 3600,
      estimatedImpactTime: futureISO(3600),
      aiManeuver: 'Prograde boost: ΔV 0.0015 km/s, burn in T-30 min',
      status: 'critical',
    },
    {
      id: 'LT-003',
      satelliteName: 'Envisat (Defunct)',
      debrisName: 'SL-8 R/B (Kosmos-3M)',
      riskScore: 88,
      probability: 0.0055,
      timeToImpact: 10800,
      estimatedImpactTime: futureISO(10800),
      aiManeuver: 'Unable — satellite is defunct. Alert ADR mission team.',
      status: 'critical',
    },
    {
      id: 'LT-004',
      satelliteName: 'Hubble Space Telescope',
      debrisName: 'SL-16 R/B (Zenit-2)',
      riskScore: 85,
      probability: 0.0015,
      timeToImpact: 14400,
      estimatedImpactTime: futureISO(14400),
      aiManeuver: 'No propulsion available. Recommend attitude change to minimize cross-section.',
      status: 'warning',
    },
    {
      id: 'LT-005',
      satelliteName: 'Starlink-1547',
      debrisName: 'Cosmos 2251 Fragment A',
      riskScore: 78,
      probability: 0.0034,
      timeToImpact: 7200,
      estimatedImpactTime: futureISO(7200),
      aiManeuver: 'Autonomous collision avoidance: ΔV 0.0029 km/s, burn in T-90 min',
      status: 'warning',
    },
    {
      id: 'LT-006',
      satelliteName: 'CryoSat-2',
      debrisName: 'Pegasus Rocket Fragment',
      riskScore: 62,
      probability: 0.0018,
      timeToImpact: 21600,
      estimatedImpactTime: futureISO(21600),
      aiManeuver: 'Cross-track maneuver: ΔV 0.001 km/s, burn in T-5 hr',
      status: 'warning',
    },
  ];
}

// ═══════════════════════════════════════════════════════════
//  AGENT OUTPUTS  (5 agents + commander pipeline)
// ═══════════════════════════════════════════════════════════

export function getDemoAgentOutputs(): AgentPipelineResult {
  const sessionId = 'AGENT-SESSION-2026-001';
  const baseTime = Date.now();

  const debrisAgent: AgentOutput = {
    agentName: 'debris',
    agentDisplayName: 'Debris Tracking Agent',
    decision: 'HIGH PRIORITY — Fengyun-1C Fragment 1 on collision course with ISS. Miss distance 0.45 km, closing velocity 14.2 km/s.',
    confidence: 94,
    reasoning:
      'Analyzed 342 tracked objects in ISS orbital shell (400-420 km). Cross-referenced TLE catalog updates from 18th Space Defense Squadron. Fragment FY1C-003 trajectory refined using 3 radar passes in last 6 hours. Probability of collision (Pc) computed via Monte-Carlo sampling with 10,000 iterations: Pc = 8.2×10⁻³, exceeding the 1×10⁻⁴ COLA threshold by 82×. Object characterization indicates 1.5 m metallic fragment with high radar cross-section — impact would be catastrophic.',
    recommendedAction:
      'Immediately escalate to Orbit Agent for avoidance maneuver computation. Recommend PDAM (Pre-Determined Avoidance Maneuver) execution no later than T-30 minutes to conjunction.',
    timestamp: new Date(baseTime).toISOString(),
    executionTimeMs: 1842,
    metadata: {
      objectsAnalyzed: 342,
      radarPasses: 3,
      pcThresholdExceeded: true,
      monteCarloIterations: 10000,
    },
  };

  const orbitAgent: AgentOutput = {
    agentName: 'orbit',
    agentDisplayName: 'Orbit Optimization Agent',
    decision: 'Computed optimal avoidance maneuver: prograde burn ΔV = 1.5 m/s at T-30 min. New miss distance: 8.5 km.',
    confidence: 91,
    reasoning:
      'Evaluated 48 candidate maneuver vectors across prograde, retrograde, and radial axes. Optimal solution minimizes fuel expenditure while achieving > 5 km safety margin. Prograde burn of 1.5 m/s raises ISS orbit by ~2.5 km at conjunction point, increasing miss distance from 0.45 km to 8.5 km. Burn duration: 12 seconds using Progress MS-28 thrusters. Post-maneuver orbit remains within acceptable station-keeping bounds (407.5-412.5 km). No secondary conjunctions created within 72-hour screening window.',
    recommendedAction:
      'Execute prograde burn of 1.5 m/s at T-30 min using Progress MS-28 OCS thrusters. Duration: 12 sec. Verify attitude alignment 5 min prior to burn.',
    timestamp: new Date(baseTime + 1842).toISOString(),
    executionTimeMs: 2155,
    metadata: {
      candidateManeuvers: 48,
      optimalDeltaV: 0.0015,
      newMissDistance: 8.5,
      burnDuration: 12,
      secondaryConjunctions: 0,
    },
  };

  const fuelAgent: AgentOutput = {
    agentName: 'fuel',
    agentDisplayName: 'Fuel Management Agent',
    decision: 'Maneuver approved. Fuel cost: 0.8 kg (1.02% of reserves). Remaining fuel post-maneuver: 76.98%. Budget is healthy.',
    confidence: 97,
    reasoning:
      'ISS current propellant reserve: 78% (~612 kg usable in Progress OCS tanks). Proposed burn consumes 0.8 kg, reducing reserves to 76.98%. This is well within the 20% minimum reserve threshold. Projected fuel budget for the next 90 days (including 2 planned reboosts and 1 attitude correction): 68.2% remaining. No fuel constraint on performing this maneuver. Compared against historical maneuver frequency: ISS averages 2.3 debris avoidance maneuvers per year; this would be the 1st of 2026.',
    recommendedAction:
      'Authorize fuel expenditure. No rationing required. Schedule post-maneuver fuel audit and update mission planning timeline.',
    timestamp: new Date(baseTime + 3997).toISOString(),
    executionTimeMs: 1203,
    metadata: {
      currentFuelPercent: 78,
      fuelCostKg: 0.8,
      postManeuverPercent: 76.98,
      projectedFuel90Days: 68.2,
      minimumReserveThreshold: 20,
    },
  };

  const missionAgent: AgentOutput = {
    agentName: 'mission',
    agentDisplayName: 'Mission Continuity Agent',
    decision: 'Maneuver will not impact ongoing ISS operations. Science schedule: minor 8-minute interruption to microgravity experiments.',
    confidence: 88,
    reasoning:
      'Reviewed ISS activity timeline for next 24 hours: 3 science experiments in progress (2 microgravity, 1 Earth observation). Prograde burn will cause 8-minute attitude disturbance, temporarily pausing JAXA Crystal Growth experiment (CG-19). No EVA scheduled within 48 hours. Crew sleep cycle unaffected (burn at 14:32 UTC). Visiting vehicle schedule: no Crew Dragon or Soyuz docking within 72 hours. Communication blackout: none — TDRS coverage nominal throughout maneuver window.',
    recommendedAction:
      'Proceed with maneuver. Notify JAXA science team of 8-minute CG-19 pause. No crew wake-up required. Update ISS on-board timeline.',
    timestamp: new Date(baseTime + 5200).toISOString(),
    executionTimeMs: 1678,
    metadata: {
      activeExperiments: 3,
      interruptedExperiments: 1,
      interruptionDuration: '8 minutes',
      evaConflict: false,
      commBlackout: false,
    },
  };

  const commanderAgent: AgentOutput = {
    agentName: 'commander',
    agentDisplayName: 'Commander Agent',
    decision: 'EXECUTE MANEUVER — All agents concur. Authorize ISS prograde burn of 1.5 m/s at T-30 min to avoid Fengyun-1C Fragment 1.',
    confidence: 93,
    reasoning:
      'Synthesized inputs from all 4 specialist agents. Debris Agent confirmed critical threat (Pc = 8.2×10⁻³, 82× above threshold). Orbit Agent computed optimal avoidance with 8.5 km safety margin and zero secondary conjunctions. Fuel Agent confirmed negligible cost (1.02% reserves). Mission Agent confirmed minimal operational impact (8 min science pause). All confidence scores above 88%. Risk of inaction: potential catastrophic collision endangering 7 crew members and $150B asset. Risk of action: 0.8 kg fuel, 8-minute science pause. Decision: EXECUTE.',
    recommendedAction:
      'Authorize ISS PDAM: prograde burn ΔV = 1.5 m/s at 14:32 UTC via Progress MS-28 OCS. Notify MCC-Houston, MCC-Moscow, and JAXA Tsukuba. Update TLE post-maneuver. Schedule conjunction re-screening at T+2 hours.',
    timestamp: new Date(baseTime + 6878).toISOString(),
    executionTimeMs: 1455,
    metadata: {
      agentVotes: { debris: 'execute', orbit: 'execute', fuel: 'approve', mission: 'approve' },
      consensusReached: true,
      riskOfInaction: 'catastrophic',
      riskOfAction: 'negligible',
      crewEndangered: 7,
    },
  };

  return {
    sessionId,
    agents: [debrisAgent, orbitAgent, fuelAgent, missionAgent, commanderAgent],
    finalDecision: commanderAgent,
    totalExecutionTimeMs: 8333,
    timestamp: new Date(baseTime + 6878).toISOString(),
  };
}

// ═══════════════════════════════════════════════════════════
//  KESSLER SIMULATION RESULT (pre-computed)
// ═══════════════════════════════════════════════════════════

export function getDemoSimulationResult(): SimulationResult {
  const simulationId = 'SIM-KESSLER-2026-001';

  const beforeAI: SimulationMetrics = {
    totalCollisions: 47,
    totalDebrisGenerated: 2340,
    peakRiskScore: 99,
    affectedSatellites: 12,
    cascadeGenerations: 5,
    timeToStabilize: 172800, // 48 hours
  };

  const afterAI: SimulationMetrics = {
    totalCollisions: 3,
    totalDebrisGenerated: 85,
    peakRiskScore: 62,
    affectedSatellites: 2,
    cascadeGenerations: 1,
    timeToStabilize: 14400, // 4 hours
  };

  // Generate a handful of representative frames for the UI timeline
  const frames: SimulationFrame[] = [];
  const totalSteps = 20;
  for (let step = 0; step <= totalSteps; step++) {
    const t = step * (172800 / totalSteps); // spread across 48h
    const debrisGrowth = Math.min(2340, Math.floor(2340 * (1 - Math.exp(-step / 5))));
    const collisions = Math.min(47, Math.floor(47 * (1 - Math.exp(-step / 4))));

    // Generate a few representative debris particles per frame
    const debrisObjects: DebrisParticle[] = [];
    const numParticles = Math.min(10, Math.max(1, Math.floor(debrisGrowth / 50)));
    for (let p = 0; p < numParticles; p++) {
      const angle = (p / numParticles) * 2 * Math.PI;
      const radius = 6800 + Math.random() * 400;
      debrisObjects.push({
        id: `sim-deb-${step}-${p}`,
        position: {
          x: radius * Math.cos(angle) * Math.cos(step * 0.1),
          y: radius * Math.sin(angle),
          z: radius * Math.cos(angle) * Math.sin(step * 0.1),
        },
        velocity: {
          vx: -7.5 * Math.sin(angle),
          vy: 7.5 * Math.cos(angle) * 0.5,
          vz: 7.5 * Math.cos(angle) * 0.3,
        },
        size: 0.05 + Math.random() * 0.5,
        generation: Math.min(5, Math.floor(step / 4)),
      });
    }

    const collisionEvents: CollisionEvent[] = [];
    if (step === 3 || step === 7 || step === 12) {
      collisionEvents.push({
        id: `sim-col-${step}`,
        timestamp: t,
        position: {
          x: 6800 * Math.cos(step),
          y: 6800 * Math.sin(step),
          z: 500 * Math.sin(step * 2),
        },
        object1Id: `sim-deb-${step}-0`,
        object2Id: step === 3 ? 'SAT-SL1-003' : `sim-deb-${step - 1}-0`,
        newDebrisCount: 15 + Math.floor(Math.random() * 30),
        prevented: false,
      });
    }

    const riskZones: RiskZone[] = [];
    if (step > 2) {
      riskZones.push({
        center: {
          x: 6800 * Math.cos(step * 0.3),
          y: 6800 * Math.sin(step * 0.3),
          z: 200 * Math.sin(step),
        },
        radius: 50 + step * 10,
        riskLevel: step > 10 ? 'critical' : step > 5 ? 'high' : 'moderate',
      });
    }

    frames.push({
      timestamp: t,
      debrisObjects,
      collisionEvents,
      totalDebris: debrisGrowth,
      totalCollisions: collisions,
      riskZones,
    });
  }

  // AI intervention pipeline result (reuse agent outputs)
  const aiInterventions = [getDemoAgentOutputs()];

  return {
    simulationId,
    config: {
      initialSatelliteId: 'SAT-ENV-014',
      explosionIntensity: 7,
      debrisCount: 500,
      timeStepSeconds: 60,
      durationHours: 48,
      enableAI: true,
    },
    beforeAI,
    afterAI,
    frames,
    aiInterventions,
    createdAt: NOW,
  };
}

// ═══════════════════════════════════════════════════════════
//  DEMO CONFIG
// ═══════════════════════════════════════════════════════════

export function getDemoConfig(): DemoConfig {
  return {
    isDemo: true,
    hasGemini: false,
    hasMongoDB: false,
    hasFirebase: false,
    hasCesium: false,
  };
}
