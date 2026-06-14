// ============================================================
// SpaceSafe X — Core Type Definitions
// ============================================================

// --- Orbital Mechanics ---

export interface OrbitalElements {
  semiMajorAxis: number;      // km
  eccentricity: number;       // 0-1
  inclination: number;        // degrees
  raan: number;               // Right Ascension of Ascending Node (degrees)
  argumentOfPerigee: number;  // degrees
  meanAnomaly: number;        // degrees
  epoch: string;              // ISO timestamp
}

export interface CartesianPosition {
  x: number;  // km (ECI frame)
  y: number;
  z: number;
}

export interface CartesianVelocity {
  vx: number;  // km/s
  vy: number;
  vz: number;
}

// --- Satellite ---

export type SatelliteStatus = 'active' | 'inactive' | 'decommissioned' | 'maneuvering';
export type MissionType = 'communication' | 'earth-observation' | 'weather' | 'navigation' | 'research' | 'military' | 'commercial';
export type OrbitType = 'LEO' | 'MEO' | 'GEO' | 'HEO' | 'SSO' | 'polar';

export interface Satellite {
  _id?: string;
  satelliteId: string;
  satelliteName: string;
  noradId: string;
  orbitType: OrbitType;
  orbitData: OrbitalElements;
  position?: CartesianPosition;
  velocity?: CartesianVelocity;
  riskScore: number;          // 0-100
  status: SatelliteStatus;
  missionType: MissionType;
  operator: string;
  launchDate: string;
  mass: number;               // kg
  size: number;               // meters (characteristic length)
  power: number;              // watts
  fuelRemaining: number;      // percentage 0-100
  healthStatus: HealthStatus;
  createdAt?: string;
  updatedAt?: string;
}

// --- Debris ---

export type DebrisSize = 'small' | 'medium' | 'large';
export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface Debris {
  _id?: string;
  debrisId: string;
  name: string;
  orbitData: OrbitalElements;
  position?: CartesianPosition;
  velocity?: CartesianVelocity;
  size: DebrisSize;
  characteristicLength: number;  // meters
  mass: number;                  // kg
  origin: string;                // Source event/satellite
  riskLevel: RiskLevel;
  detectedAt: string;
  lastTracked: string;
}

// --- Collision Prediction ---

export interface CollisionPrediction {
  _id?: string;
  predictionId: string;
  satelliteId: string;
  satelliteName: string;
  debrisId: string;
  debrisName: string;
  probability: number;          // 0-1
  riskScore: number;            // 0-100
  missDistance: number;          // km
  relativeVelocity: number;     // km/s
  estimatedImpactTime: string;  // ISO timestamp
  timeToImpact: number;         // seconds
  avoidanceManeuver?: AvoidanceManeuver;
  status: 'monitoring' | 'warning' | 'critical' | 'resolved';
  createdAt?: string;
}

export interface AvoidanceManeuver {
  deltaV: CartesianVelocity;
  totalDeltaV: number;           // km/s
  fuelCost: number;              // kg
  fuelPercentage: number;        // percentage of remaining fuel
  burnDuration: number;          // seconds
  burnStartTime: string;         // ISO timestamp
  newOrbit: OrbitalElements;
  safetyMargin: number;          // km (new miss distance)
}

// --- AI Agents ---

export type AgentName = 'debris' | 'orbit' | 'fuel' | 'mission' | 'commander';

export interface AgentOutput {
  agentName: AgentName;
  agentDisplayName: string;
  decision: string;
  confidence: number;           // 0-100
  reasoning: string;
  recommendedAction: string;
  timestamp: string;
  executionTimeMs: number;
  metadata?: Record<string, unknown>;
}

export interface AgentLog {
  _id?: string;
  sessionId: string;
  agentName: AgentName;
  decision: string;
  confidence: number;
  reasoning: string;
  recommendedAction: string;
  inputData: Record<string, unknown>;
  outputData: Record<string, unknown>;
  executionTimeMs: number;
  timestamp: string;
}

export interface AgentPipelineResult {
  sessionId: string;
  agents: AgentOutput[];
  finalDecision: AgentOutput;    // Commander's output
  totalExecutionTimeMs: number;
  timestamp: string;
}

// --- Missions ---

export type MissionStatus = 'planned' | 'active' | 'completed' | 'aborted' | 'paused';

export interface Mission {
  _id?: string;
  missionId: string;
  missionName: string;
  type: MissionType;
  satelliteId?: string;
  status: MissionStatus;
  description: string;
  objectives: string[];
  launchDate: string;
  estimatedLifespan: number;     // months
  aiReport?: MissionAIReport;
  createdAt?: string;
  updatedAt?: string;
}

export interface MissionAIReport {
  orbitRecommendation: string;
  coverageEstimation: string;
  missionLifespan: string;
  riskAssessment: string;
  overallScore: number;          // 0-100
  recommendations: string[];
}

// --- Digital Twin ---

export type HealthStatus = 'nominal' | 'degraded' | 'critical' | 'offline';

export interface SubsystemHealth {
  name: string;
  status: HealthStatus;
  temperature: number;           // Celsius
  powerConsumption: number;      // watts
  lastCheckTimestamp: string;
}

export interface DigitalTwin {
  _id?: string;
  satelliteId: string;
  healthStatus: HealthStatus;
  fuelLevel: number;             // percentage
  batteryLevel: number;          // percentage
  solarPanelEfficiency: number;  // percentage
  subsystems: SubsystemHealth[];
  currentOrbit: OrbitalElements;
  missionObjectives: string[];
  riskIndicators: RiskIndicator[];
  lastUpdated: string;
}

export interface RiskIndicator {
  type: string;
  severity: RiskLevel;
  description: string;
  value: number;
}

// --- Space Weather ---

export interface SpaceWeather {
  _id?: string;
  solarFlux: number;             // SFU (Solar Flux Units)
  kpIndex: number;               // 0-9
  radiationLevel: number;        // particles/cm²/s
  stormAlert: StormAlert | null;
  sunspotNumber: number;
  solarWindSpeed: number;        // km/s
  magneticFieldBz: number;       // nT
  timestamp: string;
}

export type StormSeverity = 'minor' | 'moderate' | 'strong' | 'severe' | 'extreme';

export interface StormAlert {
  severity: StormSeverity;
  type: string;
  description: string;
  startTime: string;
  estimatedEndTime: string;
  affectedRegions: string[];
}

// --- Simulation (Kessler) ---

export interface SimulationConfig {
  initialSatelliteId: string;
  explosionIntensity: number;    // 1-10
  debrisCount: number;
  timeStepSeconds: number;
  durationHours: number;
  enableAI: boolean;
}

export interface SimulationFrame {
  timestamp: number;             // seconds from start
  debrisObjects: DebrisParticle[];
  collisionEvents: CollisionEvent[];
  totalDebris: number;
  totalCollisions: number;
  riskZones: RiskZone[];
}

export interface DebrisParticle {
  id: string;
  position: CartesianPosition;
  velocity: CartesianVelocity;
  size: number;
  generation: number;            // 0 = original, 1 = first cascade, etc.
}

export interface CollisionEvent {
  id: string;
  timestamp: number;
  position: CartesianPosition;
  object1Id: string;
  object2Id: string;
  newDebrisCount: number;
  prevented: boolean;            // true if AI prevented this
}

export interface RiskZone {
  center: CartesianPosition;
  radius: number;                // km
  riskLevel: RiskLevel;
}

export interface SimulationResult {
  _id?: string;
  simulationId: string;
  config: SimulationConfig;
  beforeAI: SimulationMetrics;
  afterAI: SimulationMetrics;
  frames: SimulationFrame[];
  aiInterventions: AgentPipelineResult[];
  createdAt: string;
}

export interface SimulationMetrics {
  totalCollisions: number;
  totalDebrisGenerated: number;
  peakRiskScore: number;
  affectedSatellites: number;
  cascadeGenerations: number;
  timeToStabilize: number;       // seconds
}

// --- Maneuvers ---

export type ManeuverType = 'collision-avoidance' | 'orbit-raising' | 'orbit-lowering' | 'deorbit' | 'station-keeping';
export type ManeuverStatus = 'planned' | 'executing' | 'completed' | 'cancelled' | 'failed';

export interface Maneuver {
  _id?: string;
  maneuverId: string;
  satelliteId: string;
  type: ManeuverType;
  deltaV: number;                // km/s total
  fuelCost: number;              // kg
  status: ManeuverStatus;
  executionTime: string;
  plannedBy: 'ai' | 'manual';
  agentSessionId?: string;
  createdAt?: string;
}

// --- User ---

export interface User {
  _id?: string;
  firebaseUid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'operator' | 'admin' | 'viewer';
  lastLogin: string;
  createdAt?: string;
}

// --- Live Threat Center ---

export interface LiveThreat {
  id: string;
  satelliteName: string;
  debrisName: string;
  riskScore: number;
  probability: number;
  timeToImpact: number;          // seconds
  estimatedImpactTime: string;
  aiManeuver?: string;
  status: 'monitoring' | 'warning' | 'critical';
}

// --- Dashboard Stats ---

export interface DashboardStats {
  activeSatellites: number;
  trackedDebris: number;
  collisionRisks: number;
  aiRecommendations: number;
  activeMissions: number;
}

// --- API Response Wrapper ---

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// --- Demo Mode ---

export interface DemoConfig {
  isDemo: boolean;
  hasGemini: boolean;
  hasMongoDB: boolean;
  hasFirebase: boolean;
  hasCesium: boolean;
}
