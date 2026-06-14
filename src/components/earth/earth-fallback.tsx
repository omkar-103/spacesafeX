'use client';

// ============================================================
// SpaceSafe X — Cinematic Earth Visualization
// ============================================================
// Premium CSS/SVG Earth with realistic appearance:
// - Layered continent gradients + ocean tones
// - Atmospheric limb glow (cyan-tinted)
// - Day/night terminator with city lights
// - Cloud layer with drift animation
// - SVG orbital paths with satellite dots
// - Floating satellite labels with connector lines
// - Collision warning indicators
// - Dense animated starfield
// ============================================================

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Satellite, Debris } from '@/types';

export interface EarthFallbackProps {
  satellites: Satellite[];
  debris: Debris[];
  showSatellites?: boolean;
  showDebris?: boolean;
  showOrbits?: boolean;
  showRiskZones?: boolean;
  onSelectSatellite?: (satellite: Satellite) => void;
  selectedSatelliteId?: string | null;
  compact?: boolean; // For use in hero section (no controls overlay)
}

// --- Star generation (deterministic) ---
function generateStars(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const seed = i * 2654435761;
    return {
      x: ((seed * 17) % 10000) / 100,
      y: ((seed * 31) % 10000) / 100,
      size: ((seed * 7) % 4) * 0.4 + 0.3,
      opacity: ((seed * 13) % 70) / 100 + 0.15,
      delay: ((seed * 11) % 500) / 100,
      isCyan: i % 13 === 0,
      isPurple: i % 19 === 0,
    };
  });
}

// --- Orbital ring configurations ---
interface OrbitConfig {
  radiusX: number;
  radiusY: number;
  rotation: number;
  tiltX: number;
  duration: number;
  color: string;
  dotCount: number;
  label: string;
  altitude: string;
}

const ORBIT_CONFIGS: OrbitConfig[] = [
  {
    radiusX: 48, radiusY: 16, rotation: -12, tiltX: 68,
    duration: 18, color: 'rgba(0,212,255,0.35)', dotCount: 3,
    label: 'LEO', altitude: '408km',
  },
  {
    radiusX: 56, radiusY: 20, rotation: 28, tiltX: 58,
    duration: 26, color: 'rgba(124,58,237,0.3)', dotCount: 4,
    label: 'STARLINK', altitude: '550km',
  },
  {
    radiusX: 63, radiusY: 15, rotation: -42, tiltX: 74,
    duration: 38, color: 'rgba(16,185,129,0.25)', dotCount: 5,
    label: 'GPS', altitude: '20,200km',
  },
];

// --- Named satellites for labels ---
const SATELLITE_LABELS = [
  { name: 'ISS', altitude: '408km', color: '#00D4FF', orbit: 0, position: 0 },
  { name: 'STARLINK-3254', altitude: '550km', color: '#7C3AED', orbit: 1, position: 0.3 },
  { name: 'GPS-IIR-21', altitude: '20,200km', color: '#10B981', orbit: 2, position: 0.6 },
];

// ============================================================
// Main Earth Component
// ============================================================

export default function EarthFallback({
  satellites,
  debris,
  showSatellites = true,
  showDebris = true,
  showOrbits = true,
  showRiskZones = true,
  onSelectSatellite,
  selectedSatelliteId,
  compact = false,
}: EarthFallbackProps) {
  const [selectedSat, setSelectedSat] = useState<string | null>(null);
  const stars = useMemo(() => generateStars(compact ? 120 : 200), [compact]);

  const handleSatClick = useCallback(
    (satellite: Satellite) => {
      setSelectedSat(satellite.satelliteId);
      onSelectSatellite?.(satellite);
    },
    [onSelectSatellite]
  );

  const earthSize = compact ? 'min(58vw, 58vh)' : 'min(55vw, 55vh)';

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      style={{ background: 'radial-gradient(ellipse 120% 100% at 50% 50%, #030a1a 0%, #050816 60%, #020008 100%)' }}
    >
      {/* ============================================ */}
      {/* Dense Starfield                              */}
      {/* ============================================ */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.isCyan
                ? 'rgba(0,212,255,0.7)'
                : star.isPurple
                  ? 'rgba(124,58,237,0.6)'
                  : `rgba(255,255,255,${star.opacity})`,
              animation: `star-twinkle ${2.5 + star.delay}s ease-in-out ${star.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ============================================ */}
      {/* Earth Globe Container                        */}
      {/* ============================================ */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative" style={{ width: earthSize, height: earthSize }}>

          {/* --- Outer atmospheric corona --- */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              inset: '-22%',
              background: 'radial-gradient(circle, transparent 42%, rgba(0,150,255,0.06) 52%, rgba(0,212,255,0.04) 62%, transparent 72%)',
              filter: 'blur(12px)',
              animation: 'atmo-pulse 5s ease-in-out infinite',
            }}
          />

          {/* --- Atmospheric limb glow (inner) --- */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              inset: '-8%',
              background: 'radial-gradient(circle, transparent 52%, rgba(60,180,255,0.18) 57%, rgba(0,212,255,0.08) 63%, transparent 70%)',
              filter: 'blur(6px)',
            }}
          />

          {/* --- Earth Sphere --- */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: `
                radial-gradient(circle at 28% 22%, rgba(34,130,45,0.6) 0%, transparent 22%),
                radial-gradient(circle at 62% 38%, rgba(28,110,35,0.5) 0%, transparent 18%),
                radial-gradient(circle at 52% 72%, rgba(42,148,55,0.45) 0%, transparent 20%),
                radial-gradient(circle at 18% 52%, rgba(34,130,45,0.4) 0%, transparent 16%),
                radial-gradient(circle at 78% 62%, rgba(38,120,48,0.35) 0%, transparent 14%),
                radial-gradient(circle at 35% 82%, rgba(34,120,45,0.3) 0%, transparent 12%),
                radial-gradient(circle at 88% 28%, rgba(28,100,38,0.25) 0%, transparent 10%),
                radial-gradient(circle at 50% 3%, rgba(220,238,255,0.75) 0%, transparent 10%),
                radial-gradient(circle at 50% 97%, rgba(210,232,255,0.65) 0%, transparent 8%),
                radial-gradient(circle at 30% 50%, rgba(190,220,255,0.06) 0%, transparent 28%),
                linear-gradient(140deg,
                  #0a3d6b 0%, #1565a0 18%,
                  #0d5c2e 28%, #1a6db5 42%,
                  #0d5c30 54%, #196bb0 68%,
                  #0a3d6b 82%, #1060a8 100%
                )
              `,
              boxShadow: `
                inset -30px -18px 70px rgba(0,0,0,0.65),
                inset 12px 12px 50px rgba(100,200,255,0.08),
                0 0 80px rgba(0,140,255,0.12),
                0 0 160px rgba(0,100,200,0.06)
              `,
              animation: 'earth-rotate 35s linear infinite',
            }}
          >
            {/* Cloud layer */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `
                  radial-gradient(ellipse 65% 10% at 32% 28%, rgba(255,255,255,0.28) 0%, transparent 100%),
                  radial-gradient(ellipse 50% 8% at 62% 52%, rgba(255,255,255,0.22) 0%, transparent 100%),
                  radial-gradient(ellipse 55% 9% at 22% 68%, rgba(255,255,255,0.2) 0%, transparent 100%),
                  radial-gradient(ellipse 40% 7% at 72% 33%, rgba(255,255,255,0.16) 0%, transparent 100%),
                  radial-gradient(ellipse 60% 8% at 48% 82%, rgba(255,255,255,0.14) 0%, transparent 100%),
                  radial-gradient(ellipse 45% 6% at 82% 72%, rgba(255,255,255,0.12) 0%, transparent 100%)
                `,
                animation: 'clouds-drift 55s linear infinite',
                opacity: 0.9,
              }}
            />

            {/* Specular highlight (sunlight) */}
            <div
              className="absolute"
              style={{
                top: '8%', left: '12%', width: '38%', height: '38%',
                background: 'radial-gradient(circle at 38% 38%, rgba(255,255,255,0.22) 0%, transparent 65%)',
                filter: 'blur(10px)',
              }}
            />

            {/* Day/Night terminator */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(108deg, transparent 38%, rgba(0,0,10,0.35) 52%, rgba(0,0,10,0.72) 100%)',
              }}
            />

            {/* City lights on night side */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `
                  radial-gradient(circle at 62% 42%, rgba(255,200,80,0.4) 0%, transparent 2%),
                  radial-gradient(circle at 70% 55%, rgba(255,180,60,0.35) 0%, transparent 1.5%),
                  radial-gradient(circle at 65% 62%, rgba(255,210,100,0.3) 0%, transparent 1.2%),
                  radial-gradient(circle at 78% 48%, rgba(255,190,70,0.25) 0%, transparent 1%),
                  radial-gradient(circle at 75% 70%, rgba(255,200,80,0.2) 0%, transparent 0.8%),
                  radial-gradient(circle at 58% 72%, rgba(255,180,60,0.22) 0%, transparent 1%)
                `,
                mixBlendMode: 'screen',
              }}
            />
          </div>

          {/* ============================================ */}
          {/* SVG Orbital Paths + Satellites               */}
          {/* ============================================ */}
          <AnimatePresence>
            {showOrbits && (
              <svg
                className="absolute inset-0 w-full h-full overflow-visible"
                viewBox="-20 -20 140 140"
                style={{ zIndex: 10 }}
              >
                {ORBIT_CONFIGS.map((orbit, idx) => {
                  const cx = 50;
                  const cy = 50;
                  const rx = orbit.radiusX;
                  const ry = orbit.radiusY;

                  return (
                    <g key={idx} style={{
                      transform: `rotate(${orbit.rotation}deg) rotateX(${orbit.tiltX}deg)`,
                      transformOrigin: '50% 50%',
                      transformBox: 'fill-box',
                    }}>
                      {/* Orbital ring */}
                      <ellipse
                        cx={cx} cy={cy}
                        rx={rx} ry={ry}
                        fill="none"
                        stroke={orbit.color}
                        strokeWidth="0.4"
                        strokeDasharray="3 3"
                      />
                    </g>
                  );
                })}
              </svg>
            )}
          </AnimatePresence>

          {/* ============================================ */}
          {/* Animated Satellite Dots                      */}
          {/* ============================================ */}
          {showOrbits && ORBIT_CONFIGS.map((orbit, ringIdx) => (
            Array.from({ length: orbit.dotCount }).map((_, dotIdx) => {
              const offsetFraction = dotIdx / orbit.dotCount;
              const satLabel = SATELLITE_LABELS.find(s => s.orbit === ringIdx && Math.abs(s.position - offsetFraction) < 0.15);
              const isCritical = ringIdx === 0 && dotIdx === 0;
              const satColor = ringIdx === 0 ? '#00D4FF' : ringIdx === 1 ? '#7C3AED' : '#10B981';
              const animDuration = orbit.duration + dotIdx * 3;
              const animDelay = -(offsetFraction * animDuration);

              return (
                <div
                  key={`sat-${ringIdx}-${dotIdx}`}
                  className="absolute"
                  style={{
                    top: '50%', left: '50%',
                    width: `${orbit.radiusX * 2}%`,
                    height: `${orbit.radiusY * 2}%`,
                    transform: `translate(-50%, -50%) rotate(${orbit.rotation}deg) rotateX(${orbit.tiltX}deg)`,
                    transformStyle: 'preserve-3d',
                    animation: `orbit-spin ${animDuration}s linear ${animDelay}s infinite`,
                    zIndex: 20,
                  }}
                >
                  {/* Satellite dot */}
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      width: isCritical ? '8px' : '5px',
                      height: isCritical ? '8px' : '5px',
                      background: isCritical
                        ? `radial-gradient(circle, #fff 20%, ${satColor} 60%)`
                        : satColor,
                      borderRadius: '50%',
                      boxShadow: isCritical
                        ? `0 0 8px ${satColor}, 0 0 16px ${satColor}60`
                        : `0 0 4px ${satColor}`,
                      zIndex: 30,
                    }}
                  />

                  {/* Threat indicator for ISS */}
                  {isCritical && (
                    <>
                      <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#EF4444]"
                        style={{
                          width: '20px', height: '20px',
                          animation: 'pulse-ring 1.5s ease-out infinite',
                          zIndex: 25,
                        }}
                      />
                    </>
                  )}
                </div>
              );
            })
          ))}

          {/* ============================================ */}
          {/* Satellite Labels (floating callouts)         */}
          {/* ============================================ */}
          {showSatellites && SATELLITE_LABELS.map((label, i) => {
            const positions = [
              { top: '18%', left: '72%' },
              { top: '62%', right: '70%', left: 'auto' },
              { top: '78%', left: '65%' },
            ];
            const pos = positions[i] || positions[0];
            const isISS = label.name === 'ISS';

            return (
              <motion.div
                key={label.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.3 }}
                className="absolute pointer-events-none"
                style={{ ...pos, zIndex: 50 }}
              >
                <div
                  className="flex items-center gap-1.5 px-2 py-1 rounded-sm border"
                  style={{
                    background: 'rgba(5,8,22,0.85)',
                    borderColor: label.color + '40',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {/* Dot */}
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      background: label.color,
                      boxShadow: `0 0 4px ${label.color}`,
                      animation: isISS ? 'pulse-glow-red 1.2s infinite' : 'pulse-glow-green 2s infinite',
                    }}
                  />
                  <div>
                    <div
                      className="text-[8px] font-bold tracking-[0.1em] uppercase"
                      style={{ color: label.color, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}
                    >
                      {label.name}
                    </div>
                    <div
                      className="text-[7px] tracking-wide"
                      style={{ color: '#94A3B8', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1, marginTop: '1px' }}
                    >
                      {label.altitude}
                    </div>
                  </div>
                  {/* Threat badge for ISS */}
                  {isISS && (
                    <div
                      className="text-[7px] font-bold tracking-widest uppercase px-1 py-0.5 rounded-[1px]"
                      style={{
                        background: 'rgba(239,68,68,0.15)',
                        color: '#EF4444',
                        border: '1px solid rgba(239,68,68,0.4)',
                        fontFamily: 'JetBrains Mono, monospace',
                        animation: 'threat-blink 1.2s infinite',
                      }}
                    >
                      !
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* ============================================ */}
          {/* Debris Particles                             */}
          {/* ============================================ */}
          {showDebris && Array.from({ length: Math.min(debris.length, 25) }).map((_, i) => {
            const seed = (i + 50) * 1234567;
            const x = ((seed * 23) % 8000) / 100 + 10;
            const y = ((seed * 37) % 8000) / 100 + 10;
            const size = ((seed * 11) % 3) + 1.5;
            const dur = ((seed * 7) % 400) / 100 + 3;
            const delay = ((seed * 19) % 300) / 100;

            return (
              <motion.div
                key={`debris-${i}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                  left: `${x}%`, top: `${y}%`,
                  width: `${size}px`, height: `${size}px`,
                  background: i % 3 === 0 ? 'rgba(245,158,11,0.7)' : 'rgba(239,68,68,0.6)',
                  boxShadow: '0 0 3px rgba(239,68,68,0.4)',
                  zIndex: 15,
                }}
                animate={{
                  x: [0, Math.sin(i) * 8, 0],
                  y: [0, Math.cos(i) * 8, 0],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}
              />
            );
          })}

          {/* ============================================ */}
          {/* Risk Zone Indicator                          */}
          {/* ============================================ */}
          {showRiskZones && (
            <div className="absolute pointer-events-none" style={{ top: '22%', left: '68%', zIndex: 40 }}>
              <div
                className="w-8 h-8 rounded-full border border-[#EF4444]/60 flex items-center justify-center"
                style={{ animation: 'pulse-ring 2s ease-out infinite', background: 'rgba(239,68,68,0.08)' }}
              >
                <div className="w-2 h-2 rounded-full bg-[#EF4444]" style={{ boxShadow: '0 0 6px rgba(239,68,68,0.8)' }} />
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* Interactive Satellite Dots (bottom overlay)  */}
          {/* ============================================ */}
          {satellites.slice(0, 8).map((sat, i) => {
            const seed = i * 777 + 100;
            const x = ((seed * 17) % 6000) / 100 + 20;
            const y = ((seed * 29) % 6000) / 100 + 20;
            const isSelected = selectedSatelliteId === sat.satelliteId || selectedSat === sat.satelliteId;

            return (
              <motion.button
                key={sat.satelliteId}
                className="absolute rounded-full cursor-pointer"
                style={{
                  left: `${x}%`, top: `${y}%`,
                  width: '10px', height: '10px',
                  background: isSelected ? '#00D4FF' : 'rgba(0,212,255,0.5)',
                  boxShadow: isSelected ? '0 0 12px rgba(0,212,255,0.8)' : '0 0 4px rgba(0,212,255,0.3)',
                  border: '1px solid rgba(0,212,255,0.5)',
                  zIndex: 60,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => handleSatClick(sat)}
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 0.9 }}
                title={sat.satelliteName}
              />
            );
          })}
        </div>
      </div>

      {/* ============================================ */}
      {/* Corner telemetry overlay (bottom-left)       */}
      {/* ============================================ */}
      {!compact && (
        <div className="absolute bottom-3 left-3 pointer-events-none" style={{ zIndex: 70 }}>
          <div
            className="flex flex-col gap-1 p-2 rounded-sm border border-[#172554]"
            style={{ background: 'rgba(5,8,22,0.85)', backdropFilter: 'blur(8px)' }}
          >
            {[
              { label: 'TRACKED', value: '34,247', color: '#00D4FF' },
              { label: 'DEBRIS', value: '2.4M+', color: '#F59E0B' },
              { label: 'RISKS', value: '3 CRIT', color: '#EF4444' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="text-[7px] tracking-[0.15em] text-[#475569] w-12 uppercase"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {item.label}
                </span>
                <span className="text-[9px] font-bold"
                  style={{ color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
