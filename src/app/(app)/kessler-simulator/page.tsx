'use client';

// ============================================================
// SpaceSafe X — Kessler Cascade Simulator (Flagship Feature)
// ============================================================
// The most visually impressive page. Aerospace-grade.
// Split before/after, risk heatmap, explosion effects, AI chain.
// ============================================================

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Atom, Play, Pause, RotateCcw, SkipForward, Zap,
  AlertTriangle, ShieldCheck, TrendingDown, TrendingUp,
  Activity, Clock, Layers, Brain, Radio,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AgentCard } from '@/components/ui/agent-card';
import { getDemoSimulationResult, getDemoSatellites } from '@/lib/demo-data';
import { formatNumber } from '@/lib/utils';
import type { SimulationResult, SimulationFrame } from '@/types';

// ============================================================
// Animated Counter
// ============================================================
function AnimatedNumber({ value, duration = 1200, className }: { value: number; duration?: number; className?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    let start = ref.current;
    const end = value;
    const diff = end - start;
    const startTime = performance.now();
    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + diff * eased);
      setDisplay(current);
      ref.current = current;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [value, duration]);

  return <span className={className}>{display.toLocaleString()}</span>;
}

// ============================================================
// Debris Field Visualization
// ============================================================
function DebrisField({
  frame, maxDebris, isAIActive,
}: { frame: SimulationFrame | null; maxDebris: number; isAIActive: boolean }) {
  const particles = useMemo(() => {
    if (!frame) return [];
    const count = Math.min(frame.totalDebris, 180);
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + (frame.timestamp * 0.00001);
      const radius = 28 + Math.random() * 32;
      const cx = 50 + Math.cos(angle) * radius * (0.85 + Math.random() * 0.3);
      const cy = 50 + Math.sin(angle) * radius * (0.5 + Math.random() * 0.5);
      const size = 1.5 + Math.random() * 2.5;
      const gen = Math.floor(i / (count / 5));
      return { cx, cy, size, gen };
    });
  }, [frame]);

  // Risk heatmap zones
  const heatZones = useMemo(() => {
    if (!frame || frame.totalDebris < 10) return [];
    return Array.from({ length: 5 }, (_, i) => ({
      cx: 35 + Math.random() * 30,
      cy: 35 + Math.random() * 30,
      r: 8 + Math.random() * 12,
      intensity: 0.3 + Math.random() * 0.4,
    }));
  }, [frame?.totalDebris]);

  return (
    <div className="relative w-full aspect-square max-w-sm mx-auto">
      {/* Risk heatmap */}
      {!isAIActive && heatZones.map((zone, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${zone.cx - zone.r}%`,
            top: `${zone.cy - zone.r}%`,
            width: `${zone.r * 2}%`,
            height: `${zone.r * 2}%`,
            background: `radial-gradient(circle, rgba(239,68,68,${zone.intensity}) 0%, transparent 70%)`,
            animation: `breathe ${3 + i * 0.5}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* Earth center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #1565a0, #0a3d6b)',
          boxShadow: `0 0 30px ${isAIActive ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.2)'}, inset -5px -3px 15px rgba(0,0,0,0.5)`,
        }}
      />

      {/* Debris particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.7 + Math.random() * 0.3, scale: 1 }}
          transition={{ duration: 0.2, delay: i * 0.003 }}
          className="absolute rounded-full"
          style={{
            left: `${p.cx}%`, top: `${p.cy}%`,
            width: `${p.size}px`, height: `${p.size}px`,
            background: isAIActive
              ? p.gen < 2 ? 'rgba(16,185,129,0.9)' : 'rgba(245,158,11,0.6)'
              : p.gen < 1 ? 'rgba(239,68,68,0.95)' : p.gen < 3 ? 'rgba(249,115,22,0.75)' : 'rgba(245,158,11,0.55)',
            boxShadow: isAIActive
              ? `0 0 ${p.size * 2}px rgba(16,185,129,0.5)`
              : `0 0 ${p.size * 2}px rgba(239,68,68,0.5)`,
          }}
        />
      ))}

      {/* Collision explosion flashes */}
      {frame?.collisionEvents.map((event, i) => (
        <motion.div
          key={event.id}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: event.prevented ? 2 : 4, opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute rounded-full"
          style={{
            left: `${42 + Math.sin(i) * 8}%`, top: `${42 + Math.cos(i) * 8}%`,
            width: '12px', height: '12px',
            background: event.prevented ? 'rgba(16,185,129,0.9)' : 'rgba(239,68,68,0.9)',
            boxShadow: event.prevented
              ? '0 0 20px rgba(16,185,129,0.7)'
              : '0 0 30px rgba(239,68,68,0.8)',
          }}
        />
      ))}

      {/* Status badge */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[9px] font-bold tracking-[0.1em] uppercase"
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            background: isAIActive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
            color: isAIActive ? '#10B981' : '#EF4444',
            border: `1px solid ${isAIActive ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: isAIActive ? '#10B981' : '#EF4444',
              animation: isAIActive ? 'pulse-glow-green 2s infinite' : 'pulse-glow-red 1s infinite',
            }}
          />
          {isAIActive ? 'AI ACTIVE' : 'NO AI'}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Metric Comparison Card
// ============================================================
function MetricComparison({ label, before, after, unit, icon, lowerIsBetter = true }: {
  label: string; before: number; after: number; unit?: string;
  icon: React.ReactNode; lowerIsBetter?: boolean;
}) {
  const improvement = before > 0 ? Math.round(((before - after) / before) * 100) : 0;
  const isImproved = lowerIsBetter ? after < before : after > before;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-sm border border-[#172554] bg-[#0B1220] p-4 relative"
    >
      <div className="absolute top-0 left-0 w-4 h-[1px]" style={{ background: isImproved ? '#10B981' : '#EF4444' }} />
      <div className="absolute top-0 left-0 w-[1px] h-4" style={{ background: isImproved ? '#10B981' : '#EF4444' }} />

      <div className="flex items-center gap-2 mb-3">
        {icon}
        <p
          className="text-[9px] tracking-[0.12em] uppercase text-[#475569]"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {label}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[8px] text-[#EF4444]/60 uppercase tracking-wider mb-0.5" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Without AI</p>
          <p className="text-xl font-bold text-[#EF4444] tabular-nums" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            <AnimatedNumber value={before} />{unit && <span className="text-xs ml-0.5">{unit}</span>}
          </p>
        </div>
        <div>
          <p className="text-[8px] text-[#10B981]/60 uppercase tracking-wider mb-0.5" style={{ fontFamily: 'JetBrains Mono, monospace' }}>With AI</p>
          <p className="text-xl font-bold text-[#10B981] tabular-nums" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            <AnimatedNumber value={after} />{unit && <span className="text-xs ml-0.5">{unit}</span>}
          </p>
        </div>
      </div>

      <div className={`flex items-center gap-1 mt-2.5 text-[9px] font-medium ${isImproved ? 'text-[#10B981]' : 'text-[#EF4444]'}`}
        style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        {isImproved ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
        <span>{Math.abs(improvement)}% {isImproved ? 'reduction' : 'increase'}</span>
      </div>
    </motion.div>
  );
}

// ============================================================
// Kessler Simulator Page
// ============================================================
export default function KesslerSimulatorPage() {
  const simResult = getDemoSimulationResult();
  const satellites = getDemoSatellites();

  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'without-ai' | 'with-ai' | 'complete'>('idle');
  const [showAgents, setShowAgents] = useState(false);
  const [speed, setSpeed] = useState(1);

  const totalSteps = simResult.frames.length;
  const currentFrame = simResult.frames[Math.min(currentStep, totalSteps - 1)] || null;
  const isAIPhase = phase === 'with-ai';
  const progressPercent = (currentStep / Math.max(totalSteps - 1, 1)) * 100;

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= totalSteps) {
          setIsRunning(false);
          if (phase === 'without-ai') {
            setTimeout(() => { setPhase('with-ai'); setCurrentStep(0); setIsRunning(true); }, 1500);
          } else if (phase === 'with-ai') {
            setPhase('complete');
            setShowAgents(true);
          }
          return prev;
        }
        return next;
      });
    }, 700 / speed);
    return () => clearInterval(interval);
  }, [isRunning, totalSteps, phase, speed]);

  const handleStart = useCallback(() => {
    setPhase('without-ai');
    setCurrentStep(0);
    setIsRunning(true);
    setShowAgents(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setCurrentStep(0);
    setPhase('idle');
    setShowAgents(false);
  }, []);

  const handleSkipToResults = useCallback(() => {
    setIsRunning(false);
    setCurrentStep(totalSteps - 1);
    setPhase('complete');
    setShowAgents(true);
  }, [totalSteps]);

  const explosionSat = satellites.find(s => s.satelliteId === simResult.config.initialSatelliteId);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-2"
      >
        <div>
          <h1
            className="text-lg sm:text-xl font-bold text-[#F8FAFC] flex items-center gap-2"
            style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '0.06em' }}
          >
            <Atom className="w-5 h-5 text-[#EF4444]" />
            KESSLER CASCADE SIMULATOR
          </h1>
          <p
            className="text-[10px] text-[#475569] mt-0.5 tracking-widest uppercase"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            Cascading debris event simulation with AI intervention
          </p>
        </div>

        {phase !== 'idle' && (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[#172554]"
            style={{ background: 'rgba(11,18,32,0.8)' }}
          >
            <Radio className={`w-3 h-3 ${isRunning ? 'text-[#EF4444] animate-pulse' : 'text-[#475569]'}`} />
            <span
              className="text-[9px] tracking-[0.12em] uppercase"
              style={{ fontFamily: 'JetBrains Mono, monospace', color: '#94A3B8' }}
            >
              {phase === 'without-ai' ? 'PHASE 1 — NO AI' :
               phase === 'with-ai' ? 'PHASE 2 — AI ACTIVE' :
               'SIMULATION COMPLETE'}
            </span>
          </div>
        )}
      </motion.div>

      {/* ================================ */}
      {/* Idle: Start Screen               */}
      {/* ================================ */}
      {phase === 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-6"
        >
          <div
            className="rounded-md border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.04)] p-8 text-center relative"
          >
            <div className="absolute top-0 left-0 w-6 h-[1px] bg-[#EF4444]" />
            <div className="absolute top-0 left-0 w-[1px] h-6 bg-[#EF4444]" />

            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-sm border border-[rgba(239,68,68,0.3)] mb-5"
              style={{ background: 'rgba(239,68,68,0.1)' }}
            >
              <Atom className="w-8 h-8 text-[#EF4444]" style={{ animation: 'orbit-spin 8s linear infinite' }} />
            </div>

            <h2
              className="text-lg font-bold text-[#F8FAFC] mb-2"
              style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '0.05em' }}
            >
              KESSLER CASCADE SCENARIO
            </h2>
            <p
              className="text-sm text-[#94A3B8] max-w-md mx-auto mb-6 leading-relaxed"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {explosionSat?.satelliteName || 'A defunct satellite'} explodes in orbit, generating {simResult.config.debrisCount}+ debris fragments. Watch the cascade effect — then see how AI agents prevent catastrophic chain reactions.
            </p>

            {/* Scenario Parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 max-w-sm mx-auto">
              {[
                { label: 'INTENSITY', value: `${simResult.config.explosionIntensity}/10` },
                { label: 'DEBRIS', value: simResult.config.debrisCount.toString() },
                { label: 'DURATION', value: `${simResult.config.durationHours}h` },
                { label: 'TIMESTEP', value: `${simResult.config.timeStepSeconds}s` },
              ].map((p) => (
                <div key={p.label} className="text-center p-2 rounded-sm border border-[#172554]">
                  <p className="text-[8px] text-[#475569] tracking-widest uppercase mb-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{p.label}</p>
                  <p className="text-sm font-bold text-[#F8FAFC]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{p.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="danger" size="lg"
                icon={<Play className="w-4 h-4" />}
                onClick={handleStart}
                style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.04em' }}
              >
                START SIMULATION
              </Button>
              <Button
                variant="outline" size="lg"
                icon={<SkipForward className="w-4 h-4" />}
                onClick={handleSkipToResults}
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Skip to Results
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ================================ */}
      {/* Active Simulation View            */}
      {/* ================================ */}
      {phase !== 'idle' && (
        <>
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 rounded-sm border border-[#172554]">
            <div className="flex items-center gap-2">
              <Button
                variant={isRunning ? 'outline' : 'primary'} size="sm"
                icon={isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                onClick={() => setIsRunning(!isRunning)}
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {isRunning ? 'Pause' : 'Resume'}
              </Button>
              <Button variant="ghost" size="sm" icon={<RotateCcw className="w-3.5 h-3.5" />} onClick={handleReset}
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Reset
              </Button>
              <Button variant="ghost" size="sm" icon={<SkipForward className="w-3.5 h-3.5" />} onClick={handleSkipToResults}
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Skip to Results
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[9px] text-[#475569]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>SPEED:</span>
              {[1, 2, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className="px-2 py-0.5 rounded-[2px] text-[9px] font-bold transition-all cursor-pointer"
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    background: speed === s ? 'rgba(0,212,255,0.15)' : 'transparent',
                    color: speed === s ? '#00D4FF' : '#475569',
                    border: `1px solid ${speed === s ? 'rgba(0,212,255,0.3)' : '#172554'}`,
                  }}
                >
                  {s}x
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[9px] text-[#475569]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                STEP {currentStep + 1}/{totalSteps}
              </span>
              <div className="w-24">
                <Progress value={progressPercent} size="sm" />
              </div>
            </div>
          </div>

          {/* Main Simulation Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

            {/* Debris Visualization */}
            <Card
              variant={isAIPhase ? 'success' : 'danger'}
              className="lg:col-span-2"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={`flex items-center gap-2 text-xs ${isAIPhase ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                    <Atom className={`w-4 h-4 ${isAIPhase ? 'text-[#10B981]' : 'text-[#EF4444]'}`} style={{ animation: 'orbit-spin 6s linear infinite' }} />
                    {isAIPhase ? 'WITH AI INTERVENTION' : 'WITHOUT AI — CASCADE IN PROGRESS'}
                  </CardTitle>
                  <div
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] text-[9px] font-bold"
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      background: isAIPhase ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      color: isAIPhase ? '#10B981' : '#EF4444',
                      border: `1px solid ${isAIPhase ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: isAIPhase ? '#10B981' : '#EF4444',
                        animation: isAIPhase ? 'pulse-glow-green 2s infinite' : 'pulse-glow-red 1s infinite',
                      }}
                    />
                    {isAIPhase ? 'PROTECTED' : 'UNCONTROLLED'}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <DebrisField
                  frame={currentFrame}
                  maxDebris={simResult.beforeAI.totalDebrisGenerated}
                  isAIActive={isAIPhase}
                />
              </CardContent>
            </Card>

            {/* Live Stats */}
            <div className="space-y-3">
              <Card variant="default">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xs">
                    <Activity className="w-3.5 h-3.5 text-[#00D4FF]" />
                    LIVE STATISTICS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { label: 'Total Debris', value: currentFrame?.totalDebris || 0, max: simResult.beforeAI.totalDebrisGenerated, color: 'red' as const },
                      { label: 'Collisions', value: currentFrame?.totalCollisions || 0, max: simResult.beforeAI.totalCollisions, color: 'amber' as const },
                      { label: 'Risk Zones', value: currentFrame?.riskZones.length || 0, max: 10, color: 'purple' as const },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <div className="flex justify-between mb-1">
                          <span className="text-[9px] text-[#94A3B8]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{stat.label}</span>
                          <span className="text-[9px] text-[#F8FAFC] font-bold tabular-nums" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                            <AnimatedNumber value={stat.value} duration={200} />
                          </span>
                        </div>
                        <Progress value={(stat.value / Math.max(stat.max, 1)) * 100} size="sm" color={stat.color} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Phase Status */}
              <div
                className="p-4 rounded-sm border text-center"
                style={{
                  background: isAIPhase ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
                  borderColor: isAIPhase ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)',
                }}
              >
                {isAIPhase ? (
                  <div className="flex items-center justify-center gap-2">
                    <Brain className="w-4 h-4 text-[#10B981]" />
                    <span className="text-xs font-bold text-[#10B981]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      AI AGENTS ACTIVE
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#EF4444]" style={{ animation: 'threat-blink 1.2s infinite' }} />
                    <span className="text-xs font-bold text-[#EF4444]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      NO AI PROTECTION
                    </span>
                  </div>
                )}
              </div>

              {/* Recent events */}
              {currentFrame && currentFrame.collisionEvents.length > 0 && (
                <Card variant="default">
                  <CardContent className="p-3">
                    <p className="text-[8px] uppercase tracking-[0.15em] text-[#475569] mb-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      RECENT EVENTS
                    </p>
                    <div className="space-y-1">
                      {currentFrame.collisionEvents.map((event) => (
                        <div key={event.id} className="flex items-center gap-2 text-[9px]">
                          <Zap className={`w-2.5 h-2.5 flex-shrink-0 ${event.prevented ? 'text-[#10B981]' : 'text-[#EF4444]'}`} />
                          <span style={{ color: '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }}>
                            {event.prevented ? 'PREVENTED' : 'COLLISION'}: +{event.newDebrisCount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </>
      )}

      {/* ================================ */}
      {/* Results Comparison                */}
      {/* ================================ */}
      {phase === 'complete' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Impact Number */}
          <div className="text-center mb-8">
            <p
              className="text-[9px] tracking-[0.2em] uppercase text-[#10B981] mb-3"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              SIMULATION COMPLETE — AI INTERVENTION RESULTS
            </p>
            <div className="inline-block">
              <div
                className="text-6xl sm:text-7xl font-bold text-[#10B981] tabular-nums leading-none"
                style={{ fontFamily: 'JetBrains Mono, monospace', textShadow: '0 0 40px rgba(16,185,129,0.3)' }}
              >
                <AnimatedNumber
                  value={Math.round(((simResult.beforeAI.totalCollisions - simResult.afterAI.totalCollisions) / simResult.beforeAI.totalCollisions) * 100)}
                  duration={2000}
                />%
              </div>
              <p
                className="text-sm text-[#94A3B8] mt-1"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Total Risk Reduction · {simResult.beforeAI.totalCollisions - simResult.afterAI.totalCollisions} Collisions Prevented
              </p>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            <MetricComparison label="Total Collisions" before={simResult.beforeAI.totalCollisions} after={simResult.afterAI.totalCollisions} icon={<AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />} />
            <MetricComparison label="Debris Generated" before={simResult.beforeAI.totalDebrisGenerated} after={simResult.afterAI.totalDebrisGenerated} icon={<Layers className="w-3.5 h-3.5 text-[#F59E0B]" />} />
            <MetricComparison label="Peak Risk Score" before={simResult.beforeAI.peakRiskScore} after={simResult.afterAI.peakRiskScore} icon={<Activity className="w-3.5 h-3.5 text-[#7C3AED]" />} />
            <MetricComparison label="Affected Satellites" before={simResult.beforeAI.affectedSatellites} after={simResult.afterAI.affectedSatellites} icon={<Zap className="w-3.5 h-3.5 text-[#00D4FF]" />} />
            <MetricComparison label="Cascade Generations" before={simResult.beforeAI.cascadeGenerations} after={simResult.afterAI.cascadeGenerations} icon={<Atom className="w-3.5 h-3.5 text-[#EF4444]" />} />
            <MetricComparison label="Time to Stabilize (h)" before={Math.round(simResult.beforeAI.timeToStabilize / 3600)} after={Math.round(simResult.afterAI.timeToStabilize / 3600)} unit="h" icon={<Clock className="w-3.5 h-3.5 text-[#10B981]" />} />
          </div>

          {/* AI Agent Decision Chain */}
          {showAgents && simResult.aiInterventions[0] && (
            <div className="mb-6">
              <p
                className="text-[9px] tracking-[0.2em] uppercase text-[#7C3AED] mb-3 flex items-center gap-2"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                <Brain className="w-3 h-3" />
                AI AGENT DECISION CHAIN
                <span className="ml-auto text-[#475569]">
                  {simResult.aiInterventions[0].totalExecutionTimeMs}ms total
                </span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {simResult.aiInterventions[0].agents.map((agent, i) => (
                  <AgentCard key={agent.agentName} agent={agent} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Restart */}
          <div className="text-center">
            <Button
              variant="outline" size="lg"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={handleReset}
              style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.04em' }}
            >
              Run Another Simulation
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
