'use client';

// ============================================================
// SpaceSafe X — Premium Landing Page
// ============================================================
// Aerospace mission-control aesthetic.
// Hero: 2-column with realistic Earth + animated satellites.
// Judge Mode: RUN FULL DEMO 90-second guided experience.
// ============================================================

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import {
  Satellite,
  ShieldCheck,
  Brain,
  Globe2,
  Atom,
  Zap,
  ArrowRight,
  ChevronDown,
  Radio,
  Eye,
  Trash2,
  Orbit,
  Fuel,
  Target,
  Shield,
  Play,
  X,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Activity,
  Cpu,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import EarthFallback from '@/components/earth/earth-fallback';
import { getDemoSatellites, getDemoLiveThreats } from '@/lib/demo-data';

// ============================================================
// Animated Counter Hook
// ============================================================

function useCounter(end: number, duration = 2000, trigger = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, trigger]);
  return count;
}

// ============================================================
// Hero Metric Counter
// ============================================================

function HeroMetric({ value, suffix, label, color = '#00D4FF' }: {
  value: number; suffix: string; label: string; color?: string;
}) {
  const count = useCounter(value);
  return (
    <div className="flex flex-col">
      <div
        className="text-2xl sm:text-3xl font-bold tabular-nums leading-none"
        style={{ fontFamily: 'JetBrains Mono, monospace', color, letterSpacing: '-0.02em' }}
      >
        {count.toLocaleString()}{suffix}
      </div>
      <div
        className="text-[9px] tracking-[0.14em] uppercase mt-1"
        style={{ fontFamily: 'JetBrains Mono, monospace', color: '#475569' }}
      >
        {label}
      </div>
    </div>
  );
}

// ============================================================
// Feature Card
// ============================================================

function FeatureCard({ icon, title, description, accent, index }: {
  icon: React.ReactNode; title: string; description: string; accent: string; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative rounded-md border border-[#172554] bg-[#0B1220] p-5 hover:border-[#1e3a5f] transition-all duration-250"
      style={{ transition: 'border-color 0.2s ease, box-shadow 0.2s ease' }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-6 h-[1px] rounded-full" style={{ background: accent }} />
      <div className="absolute top-0 left-0 w-[1px] h-6 rounded-full" style={{ background: accent }} />

      <div
        className="inline-flex items-center justify-center w-9 h-9 rounded-sm mb-3"
        style={{ background: accent + '15', color: accent }}
      >
        {icon}
      </div>
      <h3
        className="text-sm font-semibold text-[#F8FAFC] mb-1.5 tracking-wide"
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      >
        {title}
      </h3>
      <p className="text-xs text-[#94A3B8] leading-relaxed">{description}</p>
    </motion.div>
  );
}

// ============================================================
// Why Matters Stat
// ============================================================

function WhyStat({ value, label, sublabel, color = '#00D4FF', index }: {
  value: string; label: string; sublabel: string; color?: string; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col p-6 rounded-md border border-[#172554] bg-[#0B1220] relative overflow-hidden"
    >
      {/* Accent */}
      <div className="absolute top-0 left-0 w-8 h-[1px]" style={{ background: color }} />
      <div className="absolute top-0 left-0 w-[1px] h-8" style={{ background: color }} />

      <div
        className="text-3xl sm:text-4xl font-bold leading-none mb-2"
        style={{ fontFamily: 'Orbitron, monospace', color, letterSpacing: '-0.01em' }}
      >
        {value}
      </div>
      <div
        className="text-sm font-semibold text-[#F8FAFC] mb-1"
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      >
        {label}
      </div>
      <div className="text-xs text-[#475569] leading-relaxed">{sublabel}</div>
    </motion.div>
  );
}

// ============================================================
// Agent Pipeline Node
// ============================================================

function AgentNode({ name, role, icon, color, index, active }: {
  name: string; role: string; icon: React.ReactNode; color: string; index: number; active?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex flex-col items-center gap-1.5"
    >
      <div
        className="flex items-center justify-center w-10 h-10 rounded-sm border transition-all duration-300"
        style={{
          background: active ? color + '20' : 'rgba(11,18,32,0.9)',
          borderColor: active ? color + '60' : '#172554',
          color,
          boxShadow: active ? `0 0 12px ${color}30` : 'none',
        }}
      >
        {icon}
      </div>
      <div className="text-center">
        <div
          className="text-[9px] font-semibold tracking-[0.1em] uppercase"
          style={{ fontFamily: 'JetBrains Mono, monospace', color }}
        >
          {name.split(' ')[0]}
        </div>
        <div className="text-[8px] text-[#475569]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {role.slice(0, 10)}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// JUDGE MODE — Full Demo Overlay
// ============================================================

interface DemoStep {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  duration: number; // ms
}

const DEMO_STEPS: DemoStep[] = [
  { id: 1, title: 'EARTH TELEMETRY LOCK',       subtitle: 'Scanning 34,247 tracked objects in real-time...',            icon: <Globe2 className="w-5 h-5" />,        duration: 4000 },
  { id: 2, title: 'THREAT DETECTED',             subtitle: 'ISS × Fengyun-1C Fragment — Conjunction in 00:42:18',        icon: <AlertTriangle className="w-5 h-5" />, duration: 5000 },
  { id: 3, title: 'COLLISION PREDICTION',        subtitle: 'P(collision) = 1 in 1,000 · Miss distance: 0.3km · ΔV: 14.2km/s', icon: <Target className="w-5 h-5" />,      duration: 5000 },
  { id: 4, title: 'AI AGENT PIPELINE ACTIVE',   subtitle: 'Debris → Orbit → Fuel → Mission → Commander initializing...', icon: <Brain className="w-5 h-5" />,         duration: 8000 },
  { id: 5, title: 'AVOIDANCE MANEUVER READY',   subtitle: 'Prograde boost +0.5m/s · Fuel cost: 1.4kg · 99.2% confidence',icon: <Zap className="w-5 h-5" />,           duration: 5000 },
  { id: 6, title: 'KESSLER CASCADE SIMULATED',  subtitle: '44 potential collisions prevented · Risk reduced 93.6%',      icon: <Atom className="w-5 h-5" />,          duration: 6000 },
  { id: 7, title: 'MISSION SUCCESS',             subtitle: 'All assets protected · AI System: NOMINAL · Uptime: 100%',   icon: <CheckCircle2 className="w-5 h-5" />,  duration: 5000 },
];

function JudgeModeOverlay({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [agentStep, setAgentStep] = useState(-1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const step = DEMO_STEPS[currentStep];
  const totalDuration = DEMO_STEPS.reduce((a, s) => a + s.duration, 0);

  useEffect(() => {
    let elapsed = 0;
    let stepStart = 0;
    let stepIdx = 0;

    const tick = setInterval(() => {
      elapsed += 100;
      const stepElapsed = elapsed - stepStart;
      const currentDur = DEMO_STEPS[stepIdx]?.duration || 8000;
      setProgress((elapsed / totalDuration) * 100);

      // Agent step animation during step 4
      if (stepIdx === 3) {
        const agentProgress = Math.floor((stepElapsed / currentDur) * 5);
        setAgentStep(Math.min(agentProgress, 4));
      }

      if (stepElapsed >= currentDur) {
        stepStart = elapsed;
        if (stepIdx < DEMO_STEPS.length - 1) {
          stepIdx++;
          setCurrentStep(stepIdx);
          setAgentStep(-1);
        } else {
          clearInterval(tick);
          setTimeout(onClose, 2000);
        }
      }
    }, 100);

    intervalRef.current = tick;
    return () => clearInterval(tick);
  }, [onClose, totalDuration]);

  const agentColors = ['#F59E0B', '#3B82F6', '#10B981', '#7C3AED', '#00D4FF'];
  const agentNames = ['DEBRIS', 'ORBIT', 'FUEL', 'MISSION', 'CMD'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(5,8,22,0.96)', backdropFilter: 'blur(20px)' }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-sm border border-[#172554] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#00D4FF]/40 transition-all"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="w-full max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-[#00D4FF]/30 mb-4"
            style={{ background: 'rgba(0,212,255,0.06)' }}
          >
            <Radio className="w-3 h-3 text-[#00D4FF] animate-pulse" />
            <span
              className="text-[9px] tracking-[0.2em] uppercase text-[#00D4FF]"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              JUDGE MODE ACTIVE — FULL PLATFORM DEMO
            </span>
          </div>
          <p className="text-xs text-[#475569]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            Step {currentStep + 1} of {DEMO_STEPS.length}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-[1px] bg-[#172554] mb-8 relative">
          <motion.div
            className="h-full bg-[#00D4FF]"
            style={{ width: `${progress}%`, boxShadow: '0 0 8px rgba(0,212,255,0.6)' }}
            transition={{ duration: 0.1 }}
          />
          {/* Step markers */}
          {DEMO_STEPS.map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full border border-[#172554]"
              style={{
                left: `${(i / (DEMO_STEPS.length - 1)) * 100}%`,
                background: i <= currentStep ? '#00D4FF' : '#172554',
                boxShadow: i === currentStep ? '0 0 8px rgba(0,212,255,0.8)' : 'none',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>

        {/* Current Step Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-8"
          >
            {/* Step icon */}
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-sm border border-[#00D4FF]/30 mb-4"
              style={{ background: 'rgba(0,212,255,0.08)', color: '#00D4FF' }}
            >
              {step.icon}
            </div>

            <h2
              className="text-xl sm:text-2xl font-bold text-[#F8FAFC] mb-2"
              style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '0.06em' }}
            >
              {step.title}
            </h2>
            <p
              className="text-sm text-[#94A3B8]"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {step.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Agent pipeline (visible during step 4) */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            {agentNames.map((name, i) => (
              <React.Fragment key={name}>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-8 h-8 rounded-sm border flex items-center justify-center text-[9px] font-bold transition-all duration-500"
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      background: i <= agentStep ? agentColors[i] + '20' : 'rgba(11,18,32,0.9)',
                      borderColor: i <= agentStep ? agentColors[i] + '60' : '#172554',
                      color: i <= agentStep ? agentColors[i] : '#2d4a6e',
                      boxShadow: i === agentStep ? `0 0 12px ${agentColors[i]}40` : 'none',
                    }}
                  >
                    {i <= agentStep ? '✓' : '·'}
                  </div>
                  <span
                    className="text-[7px] tracking-wide"
                    style={{ fontFamily: 'JetBrains Mono, monospace', color: i <= agentStep ? agentColors[i] : '#2d4a6e' }}
                  >
                    {name}
                  </span>
                </div>
                {i < agentNames.length - 1 && (
                  <div className="w-4 h-px mt-[-10px]" style={{ background: i < agentStep ? '#00D4FF' : '#172554' }} />
                )}
              </React.Fragment>
            ))}
          </motion.div>
        )}

        {/* Final metrics (step 7) */}
        {currentStep === 6 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-3"
          >
            {[
              { label: 'COLLISIONS PREVENTED', value: '44', color: '#10B981' },
              { label: 'RISK REDUCTION', value: '93.6%', color: '#00D4FF' },
              { label: 'AGENTS ONLINE', value: '5 / 5', color: '#7C3AED' },
            ].map(m => (
              <div key={m.label} className="text-center p-3 rounded-sm border border-[#172554] bg-[#0B1220]">
                <div
                  className="text-xl font-bold"
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: m.color }}
                >
                  {m.value}
                </div>
                <div
                  className="text-[7px] tracking-[0.12em] uppercase mt-1 text-[#475569]"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {m.label}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Step list */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {DEMO_STEPS.map((s, i) => (
            <div
              key={s.id}
              className="text-[8px] px-2 py-1 rounded-[2px] border tracking-[0.08em] uppercase transition-all duration-200"
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                borderColor: i < currentStep ? '#10B981' + '40' : i === currentStep ? '#00D4FF' + '60' : '#172554',
                color: i < currentStep ? '#10B981' : i === currentStep ? '#00D4FF' : '#2d4a6e',
                background: i === currentStep ? 'rgba(0,212,255,0.06)' : 'transparent',
              }}
            >
              {i < currentStep ? '✓ ' : ''}{i === currentStep ? '▶ ' : ''}{s.id}. {s.title.split(' ')[0]}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// Landing Page
// ============================================================

export default function LandingPage() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const [showJudgeMode, setShowJudgeMode] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const satellites = getDemoSatellites();
  const threats = getDemoLiveThreats();

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 300);
    // Listen for judge mode trigger from navbar
    const handleJudgeModeEvent = () => setShowJudgeMode(true);
    window.addEventListener('spacesafe:judge-mode', handleJudgeModeEvent);
    return () => {
      clearTimeout(t);
      window.removeEventListener('spacesafe:judge-mode', handleJudgeModeEvent);
    };
  }, []);

  const features = [
    {
      icon: <Globe2 className="w-4 h-4" />,
      title: 'CesiumJS 3D Earth',
      description: 'Interactive globe with real-time satellite tracking at true orbital scale.',
      accent: '#00D4FF',
    },
    {
      icon: <ShieldCheck className="w-4 h-4" />,
      title: 'Collision Prediction',
      description: 'Advanced conjunction analysis: probability, miss distance, impact time.',
      accent: '#10B981',
    },
    {
      icon: <Brain className="w-4 h-4" />,
      title: 'Multi-Agent AI',
      description: '5 AI agents via LangGraph producing autonomous decisions in <10 seconds.',
      accent: '#7C3AED',
    },
    {
      icon: <Atom className="w-4 h-4" />,
      title: 'Kessler Simulator',
      description: 'Cascading debris simulation with before/after AI intervention comparison.',
      accent: '#EF4444',
    },
    {
      icon: <Eye className="w-4 h-4" />,
      title: 'Live Threat Center',
      description: 'Real-time threat tracking with risk scores, countdowns, AI maneuvers.',
      accent: '#F59E0B',
    },
    {
      icon: <Zap className="w-4 h-4" />,
      title: 'Autonomous Avoidance',
      description: 'AI-generated maneuvers with ΔV computation and fuel optimization.',
      accent: '#00D4FF',
    },
  ];

  const agents = [
    { name: 'Debris Agent',     role: 'Track & analyze',  icon: <Trash2 className="w-4 h-4" />, color: '#F59E0B' },
    { name: 'Orbit Agent',      role: 'Trajectory plan',  icon: <Orbit className="w-4 h-4" />,  color: '#3B82F6' },
    { name: 'Fuel Agent',       role: 'Cost optimize',    icon: <Fuel className="w-4 h-4" />,   color: '#10B981' },
    { name: 'Mission Agent',    role: 'Mission protect',  icon: <Target className="w-4 h-4" />, color: '#7C3AED' },
    { name: 'Commander Agent',  role: 'Final authority',  icon: <Shield className="w-4 h-4" />, color: '#00D4FF' },
  ];

  const whyStats = [
    { value: '23,000+', label: 'Tracked Objects',         sublabel: 'Active satellites and debris being monitored in Earth orbit',                               color: '#00D4FF' },
    { value: '1M+',     label: 'Debris Fragments',        sublabel: 'Untracked fragments >1cm capable of catastrophic satellite destruction',                    color: '#F59E0B' },
    { value: '$300B+',  label: 'Assets In Orbit',         sublabel: 'Value of commercial, government, and military satellite infrastructure at risk',             color: '#10B981' },
    { value: '1 Hit',   label: 'Can Create Thousands More',sublabel: 'A single collision generates debris that causes cascading events — the Kessler Syndrome',  color: '#EF4444' },
  ];

  return (
    <div className="relative overflow-x-hidden" style={{ background: '#050816' }}>

      {/* ======================================== */}
      {/* JUDGE MODE BUTTON (Fixed)                */}
      {/* ======================================== */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 2, type: 'spring', stiffness: 300, damping: 25 }}
        onClick={() => setShowJudgeMode(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-sm border border-[#7C3AED]/60 bg-[#050816] hover:bg-[rgba(124,58,237,0.1)] hover:border-[#7C3AED] hover:shadow-[0_0_28px_rgba(124,58,237,0.35)] transition-all duration-200 group active:scale-[0.97]"
        id="judge-mode-btn"
        aria-label="Launch Judge Mode demo"
      >
        <Play className="w-3.5 h-3.5 text-[#7C3AED] fill-current" />
        <span
          className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#7C3AED]"
          style={{ fontFamily: 'Orbitron, monospace' }}
        >
          JUDGE MODE
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" style={{ boxShadow: '0 0 6px rgba(124,58,237,0.8)' }} />
      </motion.button>

      {/* Judge Mode Overlay */}
      <AnimatePresence>
        {showJudgeMode && (
          <JudgeModeOverlay onClose={() => setShowJudgeMode(false)} />
        )}
      </AnimatePresence>

      {/* ======================================== */}
      {/* HERO SECTION                             */}
      {/* ======================================== */}
      <motion.section
        style={{ opacity: heroOpacity }}
        className="relative min-h-screen flex flex-col pt-14"
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(23,37,84,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(23,37,84,0.3) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

              {/* ---- LEFT: Content ---- */}
              <div className="order-2 lg:order-1 flex flex-col">

                {/* Mission Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-[#00D4FF]/25 mb-6 self-start"
                  style={{ background: 'rgba(0,212,255,0.05)' }}
                >
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#10B981]"
                    style={{ boxShadow: '0 0 6px rgba(16,185,129,0.8)', animation: 'pulse-glow-green 2s infinite' }} />
                  <span
                    className="text-[9px] tracking-[0.18em] uppercase text-[#94A3B8]"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    DEMO MODE — AI SYSTEM ONLINE
                  </span>
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="mb-4"
                  style={{ fontFamily: 'Orbitron, monospace', fontWeight: 700, letterSpacing: '0.04em', lineHeight: 1.05 }}
                >
                  <span
                    className="block text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] text-[#F8FAFC] uppercase"
                  >
                    PROTECTING ORBITS.
                  </span>
                  <span
                    className="block text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] uppercase"
                  >
                    ENSURING{' '}
                    <span style={{ color: '#00D4FF', textShadow: '0 0 24px rgba(0,212,255,0.35)' }}>
                      TOMORROW.
                    </span>
                  </span>
                </motion.h1>

                {/* Subheading */}
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-sm sm:text-base text-[#94A3B8] leading-relaxed mb-7 max-w-xl"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  SpaceSafe X autonomously monitors orbital traffic, predicts collisions, simulates debris cascades, and generates AI-powered avoidance strategies in real time.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                  className="flex flex-col sm:flex-row items-start gap-3 mb-8"
                >
                  <Link href="/dashboard">
                    <Button variant="primary" size="lg" icon={<Satellite className="w-4 h-4" />}
                      style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.04em' }}>
                      Launch Mission Control
                    </Button>
                  </Link>
                  <button
                    onClick={() => setShowJudgeMode(true)}
                    className="flex items-center gap-2 h-11 px-5 rounded-sm border border-[#7C3AED]/50 text-sm font-semibold text-[#7C3AED] bg-[rgba(124,58,237,0.06)] hover:bg-[rgba(124,58,237,0.14)] hover:border-[#7C3AED]/80 hover:shadow-[0_0_16px_rgba(124,58,237,0.25)] transition-all duration-200 active:scale-[0.97]"
                    style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.04em' }}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    ▶ JUDGE MODE
                  </button>
                </motion.div>

                {/* Hero Metrics */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#172554]"
                >
                  <HeroMetric value={15847}  suffix="+"   label="Tracked Satellites"    color="#00D4FF" />
                  <HeroMetric value={2400}   suffix="K+"  label="Debris Objects"        color="#F59E0B" />
                  <HeroMetric value={98}     suffix=".7%" label="Prediction Accuracy"   color="#10B981" />
                  <div className="flex flex-col">
                    <div
                      className="text-2xl sm:text-3xl font-bold leading-none"
                      style={{ fontFamily: 'JetBrains Mono, monospace', color: '#7C3AED', letterSpacing: '-0.02em' }}
                    >
                      24/7
                    </div>
                    <div
                      className="text-[9px] tracking-[0.14em] uppercase mt-1"
                      style={{ fontFamily: 'JetBrains Mono, monospace', color: '#475569' }}
                    >
                      Autonomous Monitoring
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* ---- RIGHT: Earth Visualization ---- */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: heroLoaded ? 1 : 0, scale: heroLoaded ? 1 : 0.95 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="order-1 lg:order-2 relative"
                style={{ height: '500px', minHeight: '400px' }}
              >
                <EarthFallback
                  satellites={satellites}
                  debris={[]}
                  showSatellites={true}
                  showDebris={false}
                  showOrbits={true}
                  showRiskZones={true}
                  compact={true}
                />

                {/* Live threat overlay */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 }}
                  className="absolute top-4 right-4 flex flex-col gap-2"
                  style={{ zIndex: 80 }}
                >
                  {threats.slice(0, 2).map(threat => (
                    <div
                      key={threat.id}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-sm border"
                      style={{
                        background: 'rgba(5,8,22,0.9)',
                        borderColor: threat.status === 'critical' ? 'rgba(239,68,68,0.4)' : 'rgba(245,158,11,0.3)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{
                          background: threat.status === 'critical' ? '#EF4444' : '#F59E0B',
                          animation: 'pulse-glow-red 1.2s infinite',
                        }}
                      />
                      <div>
                        <div className="text-[8px] font-semibold text-[#F8FAFC] truncate" style={{ fontFamily: 'JetBrains Mono, monospace', maxWidth: '140px' }}>
                          {threat.satelliteName}
                        </div>
                        <div className="text-[7px] text-[#94A3B8]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          RISK: {threat.riskScore}% · {Math.floor(threat.timeToImpact / 3600)}h{Math.floor((threat.timeToImpact % 3600) / 60)}m
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        >
          <span className="text-[8px] tracking-[0.2em] text-[#2d4a6e] uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            SCROLL
          </span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown className="w-4 h-4 text-[#2d4a6e]" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ======================================== */}
      {/* WHY SPACESAFE MATTERS                    */}
      {/* ======================================== */}
      <section className="relative z-10 py-20 px-4 sm:px-6 border-t border-[#172554]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p
              className="text-[9px] tracking-[0.2em] uppercase text-[#00D4FF] mb-2"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              MISSION CRITICALITY
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold text-[#F8FAFC]"
              style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '0.04em' }}
            >
              WHY SPACESAFE MATTERS
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {whyStats.map((stat, i) => (
              <WhyStat key={stat.label} {...stat} index={i} />
            ))}
          </div>

          {/* Urgency statement */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 p-5 rounded-md border border-[#EF4444]/20 bg-[rgba(239,68,68,0.04)] flex items-start gap-4"
          >
            <AlertTriangle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
            <div>
              <p
                className="text-sm font-semibold text-[#F8FAFC] mb-1"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                The Kessler Syndrome Threat
              </p>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                A single high-energy collision in LEO can produce thousands of new debris fragments, each capable of triggering further collisions in a self-sustaining cascade. Without autonomous intervention, entire orbital shells can become permanently inaccessible within decades. SpaceSafe X exists to prevent this.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================================== */}
      {/* PLATFORM CAPABILITIES                    */}
      {/* ======================================== */}
      <section className="relative z-10 py-20 px-4 sm:px-6 border-t border-[#172554]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p
              className="text-[9px] tracking-[0.2em] uppercase text-[#00D4FF] mb-2"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              PLATFORM CAPABILITIES
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold text-[#F8FAFC]"
              style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '0.04em' }}
            >
              SPACE SITUATIONAL AWARENESS
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ======================================== */}
      {/* AI AGENTS SECTION                        */}
      {/* ======================================== */}
      <section className="relative z-10 py-20 px-4 sm:px-6 border-t border-[#172554]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p
                className="text-[9px] tracking-[0.2em] uppercase text-[#7C3AED] mb-3"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                MULTI-AGENT AI SYSTEM
              </p>
              <h2
                className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] mb-4"
                style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '0.04em' }}
              >
                5 AI AGENTS.<br />
                <span style={{ color: '#7C3AED' }}>ONE DECISION.</span>
              </h2>
              <p
                className="text-sm text-[#94A3B8] leading-relaxed mb-6"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Each agent specializes in a critical domain — debris tracking, orbital mechanics, fuel optimization, mission continuity, and command authority. They collaborate through a LangGraph pipeline to produce autonomous, explainable decisions in under 10 seconds.
              </p>
              <Link href="/ai-agents">
                <Button variant="secondary" icon={<Brain className="w-4 h-4" />}
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Explore Agent System
                </Button>
              </Link>
            </motion.div>

            {/* Right: Pipeline Visualization */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-md border border-[#172554] bg-[#0B1220]"
            >
              {/* Pipeline header */}
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#172554]">
                <Activity className="w-4 h-4 text-[#7C3AED]" />
                <span
                  className="text-xs font-semibold text-[#F8FAFC] tracking-widest uppercase"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  AGENT PIPELINE — ACTIVE
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" style={{ animation: 'pulse-glow-green 2s infinite' }} />
                  <span className="text-[9px] text-[#10B981]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>NOMINAL</span>
                </div>
              </div>

              {/* Agent nodes */}
              <div className="flex items-center justify-between gap-2">
                {agents.map((agent, i) => (
                  <React.Fragment key={agent.name}>
                    <AgentNode {...agent} index={i} active={i <= 2} />
                    {i < agents.length - 1 && (
                      <div
                        className="flex-1 h-px"
                        style={{ background: i < 2 ? `${agents[i+1].color}30` : '#172554' }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Pipeline status */}
              <div className="mt-6 pt-4 border-t border-[#172554] grid grid-cols-3 gap-3">
                {[
                  { label: 'EXEC TIME', value: '8.4s', color: '#00D4FF' },
                  { label: 'CONFIDENCE', value: '96%', color: '#10B981' },
                  { label: 'DECISION', value: 'MANEUVER', color: '#7C3AED' },
                ].map(m => (
                  <div key={m.label} className="text-center">
                    <div className="text-xs font-bold" style={{ color: m.color, fontFamily: 'JetBrains Mono, monospace' }}>
                      {m.value}
                    </div>
                    <div className="text-[7px] tracking-widest uppercase text-[#475569] mt-0.5" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================== */}
      {/* KESSLER SHOWCASE                         */}
      {/* ======================================== */}
      <section className="relative z-10 py-20 px-4 sm:px-6 border-t border-[#172554]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p
              className="text-[9px] tracking-[0.2em] uppercase text-[#EF4444] mb-3"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              FLAGSHIP FEATURE
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] mb-3"
              style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '0.04em' }}
            >
              KESSLER CASCADE SIMULATOR
            </h2>
            <p
              className="text-sm text-[#94A3B8] max-w-xl"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Witness a real cascading debris event. Watch AI agents autonomously intervene to prevent collisions and eliminate the chain reaction.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            {/* Without AI */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-md border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.04)] p-6 relative"
            >
              <div className="absolute top-0 left-0 w-5 h-[1px] bg-[#EF4444]" />
              <div className="absolute top-0 left-0 w-[1px] h-5 bg-[#EF4444]" />
              <p
                className="text-[9px] tracking-[0.2em] uppercase text-[#EF4444]/60 mb-4"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                WITHOUT AI INTERVENTION
              </p>
              <div
                className="text-5xl font-bold text-[#EF4444] mb-1 tabular-nums"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                47
              </div>
              <p className="text-xs text-[#94A3B8] mb-4">Collisions in cascade</p>
              <div className="space-y-2">
                {[
                  { label: 'Debris Generated', value: '2,340 fragments' },
                  { label: 'Satellites Destroyed', value: '12' },
                  { label: 'Cascade Generations', value: '5' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-xs">
                    <span className="text-[#475569]">{row.label}</span>
                    <span className="text-[#EF4444]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* With AI */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-md border border-[rgba(16,185,129,0.25)] bg-[rgba(16,185,129,0.04)] p-6 relative"
            >
              <div className="absolute top-0 left-0 w-5 h-[1px] bg-[#10B981]" />
              <div className="absolute top-0 left-0 w-[1px] h-5 bg-[#10B981]" />
              <p
                className="text-[9px] tracking-[0.2em] uppercase text-[#10B981]/60 mb-4"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                WITH AI INTERVENTION
              </p>
              <div
                className="text-5xl font-bold text-[#10B981] mb-1 tabular-nums"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                3
              </div>
              <p className="text-xs text-[#94A3B8] mb-4">Collisions prevented</p>
              <div className="space-y-2">
                {[
                  { label: 'Debris Generated', value: '85 fragments' },
                  { label: 'Satellites Saved', value: '10' },
                  { label: 'Risk Reduction', value: '93.6%' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-xs">
                    <span className="text-[#475569]">{row.label}</span>
                    <span className="text-[#10B981]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6"
          >
            <Link href="/kessler-simulator">
              <Button variant="danger" size="lg" icon={<Atom className="w-4 h-4" />}
                style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.04em' }}>
                Launch Kessler Simulator
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ======================================== */}
      {/* FINAL CTA                                */}
      {/* ======================================== */}
      <section className="relative z-10 py-24 px-4 sm:px-6 border-t border-[#172554]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p
              className="text-[9px] tracking-[0.2em] uppercase text-[#00D4FF] mb-6"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              MISSION CONTROL READY
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] mb-4"
              style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '0.04em' }}
            >
              READY TO EXPLORE<br />
              <span style={{ color: '#00D4FF' }}>MISSION CONTROL?</span>
            </h2>
            <p
              className="text-sm text-[#94A3B8] max-w-2xl mx-auto mb-8 leading-relaxed"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Real-time tracking. AI-powered predictions. Autonomous collision avoidance. All in your browser, all in one platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/dashboard">
                <Button variant="primary" size="lg" icon={<Satellite className="w-4 h-4" />}
                  style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.04em' }}>
                  Open Dashboard
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
              <Link href="/earth-view">
                <Button variant="outline" size="lg" icon={<Globe2 className="w-4 h-4" />}
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  View 3D Earth
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================================== */}
      {/* FOOTER (inline)                          */}
      {/* ======================================== */}
      <footer className="relative z-10 border-t border-[#172554] py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#475569]">
            <Satellite className="w-3 h-3" />
            <span
              className="text-[9px] tracking-[0.15em] uppercase"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              SpaceSafe X &copy; 2026 — AI Space Traffic Management
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" style={{ boxShadow: '0 0 5px rgba(16,185,129,0.7)' }} />
            <span
              className="text-[9px] tracking-[0.12em] uppercase text-[#94A3B8]"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              Systems Operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
