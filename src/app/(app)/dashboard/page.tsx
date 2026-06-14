'use client';

// ============================================================
// SpaceSafe X — Mission Control Dashboard
// Aerospace-grade information density. Engineering-first.
// ============================================================

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import {
  Satellite, Trash2, ShieldAlert, Brain, Rocket,
  AlertTriangle, Clock, Activity, Radio, Crosshair,
  Zap, ChevronRight, BarChart3, ArrowUpRight,
  TrendingUp, TrendingDown, Shield, CheckCircle2, Play,
} from 'lucide-react';
import Link from 'next/link';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatCountdown, getRiskLevel } from '@/lib/utils';
import {
  getDemoDashboardStats,
  getDemoLiveThreats,
  getDemoCollisionPredictions,
  getDemoMissions,
  getDemoSatellites,
} from '@/lib/demo-data';
import type { LiveThreat, CollisionPrediction, Mission } from '@/types';

// --- Live countdown hook ---
function useCountdown(initialSeconds: number): number {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => { setSeconds((s) => Math.max(0, s - 1)); }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);
  return seconds;
}

// ============================================================
// Mission Summary Panel
// ============================================================
function MissionSummary() {
  const threats = getDemoLiveThreats();
  const stats = getDemoDashboardStats();
  const criticalCount = threats.filter(t => t.status === 'critical').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-md border border-[#172554] bg-[#0B1220] p-4 mb-6 relative overflow-hidden"
    >
      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-6 h-[1px] bg-[#00D4FF]" />
      <div className="absolute top-0 left-0 w-[1px] h-6 bg-[#00D4FF]" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#00D4FF]" />
          <span
            className="text-xs font-bold tracking-[0.12em] uppercase text-[#F8FAFC]"
            style={{ fontFamily: 'Orbitron, monospace' }}
          >
            MISSION STATUS
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" style={{ boxShadow: '0 0 5px rgba(16,185,129,0.7)', animation: 'pulse-glow-green 2s infinite' }} />
          <span className="text-[9px] text-[#10B981] tracking-[0.12em] uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>SYSTEM NOMINAL</span>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'THREATS DETECTED', value: criticalCount.toString(), color: '#EF4444', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
          { label: 'COLLISIONS PREVENTED', value: '44', color: '#10B981', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
          { label: 'RISK REDUCTION', value: '83%', color: '#00D4FF', icon: <TrendingDown className="w-3.5 h-3.5" /> },
          { label: 'AI AGENTS ONLINE', value: '5/5', color: '#7C3AED', icon: <Brain className="w-3.5 h-3.5" /> },
          { label: 'TRACKING', value: '34.2K', color: '#F59E0B', icon: <Satellite className="w-3.5 h-3.5" /> },
        ].map((m) => (
          <div key={m.label} className="flex flex-col gap-1">
            <div className="flex items-center gap-1" style={{ color: m.color }}>
              {m.icon}
              <span
                className="text-[8px] tracking-[0.1em] uppercase"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#475569' }}
              >
                {m.label}
              </span>
            </div>
            <div
              className="text-xl font-bold"
              style={{ fontFamily: 'JetBrains Mono, monospace', color: m.color, letterSpacing: '-0.02em' }}
            >
              {m.value}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================
// Threat Row
// ============================================================
function ThreatRow({ threat, index }: { threat: LiveThreat; index: number }) {
  const countdown = useCountdown(threat.timeToImpact);
  const riskLevel = getRiskLevel(threat.riskScore);
  const isCritical = threat.status === 'critical';

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className={`relative p-4 rounded-sm border transition-all duration-200 ${
        isCritical
          ? 'bg-[rgba(239,68,68,0.06)] border-[rgba(239,68,68,0.25)] hover:border-[rgba(239,68,68,0.4)]'
          : 'bg-[rgba(245,158,11,0.04)] border-[rgba(245,158,11,0.2)] hover:border-[rgba(245,158,11,0.35)]'
      }`}
    >
      {/* Left accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px] rounded-l-sm"
        style={{ background: isCritical ? '#EF4444' : '#F59E0B' }}
      />

      <div className="flex items-start justify-between gap-3">
        {/* Left: Threat info */}
        <div className="flex-1 min-w-0 pl-1">
          {/* Status + Risk */}
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant={riskLevel}>{threat.status.toUpperCase()}</Badge>
            <span
              className="text-[9px] text-[#475569]"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              RISK: {threat.riskScore}%
            </span>
          </div>

          {/* Object pair */}
          <p
            className="text-sm font-semibold text-[#F8FAFC] truncate mb-1"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {threat.satelliteName}
            <span className="text-[#2d4a6e] mx-1.5">×</span>
            {threat.debrisName}
          </p>

          {/* AI Maneuver */}
          {threat.aiManeuver && (
            <p className="text-[10px] text-[#00D4FF]/70 truncate" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              <Zap className="inline w-2.5 h-2.5 mr-1 mb-px" />
              AI: {threat.aiManeuver}
            </p>
          )}
        </div>

        {/* Right: Countdown + Status */}
        <div className="text-right shrink-0">
          <p
            className="text-[8px] text-[#475569] tracking-[0.12em] uppercase mb-0.5"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            IMPACT IN
          </p>
          <p
            className={`text-base font-bold tabular-nums leading-none ${
              countdown < 3600 ? 'text-[#EF4444]' : countdown < 14400 ? 'text-[#F59E0B]' : 'text-[#94A3B8]'
            }`}
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            {formatCountdown(countdown)}
          </p>
          <div
            className="inline-flex items-center gap-1 mt-1.5 px-1.5 py-0.5 rounded-[2px] text-[8px] font-semibold tracking-wider uppercase"
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              background: 'rgba(16,185,129,0.1)',
              color: '#10B981',
              border: '1px solid rgba(16,185,129,0.25)',
            }}
          >
            READY
          </div>
        </div>
      </div>

      {/* Risk bar */}
      <div className="mt-2.5 pl-1">
        <Progress value={threat.riskScore} size="sm" />
      </div>
    </motion.div>
  );
}

// ============================================================
// Collision Prediction Row
// ============================================================
function CollisionMiniCard({ prediction, index }: { prediction: CollisionPrediction; index: number }) {
  const riskLevel = getRiskLevel(prediction.riskScore);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="p-3 rounded-sm border border-[#172554] bg-[#050816] hover:border-[#1e3a5f] transition-all duration-150"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span
          className="text-[8px] text-[#2d4a6e]"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {prediction.predictionId}
        </span>
        <Badge variant={riskLevel}>{prediction.status}</Badge>
      </div>
      <p className="text-xs font-semibold text-[#F8FAFC] truncate" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        {prediction.satelliteName}
      </p>
      <p className="text-[10px] text-[#475569] truncate" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        vs {prediction.debrisName}
      </p>
      <div className="flex items-center gap-3 mt-1.5">
        <span className="text-[9px] text-[#94A3B8]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          Pc: {(prediction.probability * 100).toFixed(3)}%
        </span>
        <span className="text-[9px] text-[#94A3B8]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {prediction.missDistance}km
        </span>
      </div>
    </motion.div>
  );
}

// ============================================================
// Mission Row
// ============================================================
function MissionRow({ mission, index }: { mission: Mission; index: number }) {
  const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
    active:    { bg: 'rgba(16,185,129,0.08)',  text: '#10B981', border: 'rgba(16,185,129,0.25)' },
    planned:   { bg: 'rgba(59,130,246,0.08)',  text: '#3B82F6', border: 'rgba(59,130,246,0.25)' },
    completed: { bg: 'rgba(71,85,105,0.08)',   text: '#475569', border: 'rgba(71,85,105,0.2)'  },
    aborted:   { bg: 'rgba(239,68,68,0.08)',   text: '#EF4444', border: 'rgba(239,68,68,0.25)' },
    paused:    { bg: 'rgba(245,158,11,0.08)',  text: '#F59E0B', border: 'rgba(245,158,11,0.25)' },
  };
  const style = statusStyles[mission.status] || statusStyles.planned;

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="flex items-center justify-between p-2.5 rounded-sm border border-[#172554] hover:border-[#1e3a5f] transition-all duration-150"
    >
      <div className="flex-1 min-w-0 mr-3">
        <p className="text-xs font-medium text-[#F8FAFC] truncate" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          {mission.missionName}
        </p>
        <p className="text-[9px] text-[#475569] truncate" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {mission.type}
        </p>
      </div>
      <span
        className="text-[8px] font-semibold px-1.5 py-0.5 rounded-[2px] border tracking-[0.1em] uppercase flex-shrink-0"
        style={{ fontFamily: 'JetBrains Mono, monospace', background: style.bg, color: style.text, borderColor: style.border }}
      >
        {mission.status}
      </span>
    </motion.div>
  );
}

// ============================================================
// Activity Chart
// ============================================================
function ActivitySparkline() {
  const bars = useMemo(() =>
    Array.from({ length: 24 }, (_, i) => ({
      height: 12 + Math.sin(i * 0.5) * 20 + Math.random() * 35 + (i > 20 ? 25 : 0),
      isHighlight: i > 21,
    })),
  []);

  return (
    <div className="flex items-end gap-[2px] h-16">
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${Math.min(bar.height, 100)}%` }}
          transition={{ duration: 0.4, delay: i * 0.015 }}
          className="flex-1 rounded-[1px]"
          style={{
            background: bar.isHighlight
              ? 'rgba(239,68,68,0.7)'
              : i === 23
                ? '#00D4FF'
                : 'rgba(0,212,255,0.25)',
          }}
        />
      ))}
    </div>
  );
}

// ============================================================
// Dashboard Page
// ============================================================
export default function DashboardPage() {
  const stats = getDemoDashboardStats();
  const threats = getDemoLiveThreats();
  const predictions = getDemoCollisionPredictions();
  const missions = getDemoMissions();
  const satellites = getDemoSatellites();
  const router = useRouter();

  const handleJudgeMode = useCallback(() => {
    router.push('/');
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('spacesafe:judge-mode'));
      }
    }, 500);
  }, [router]);

  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const update = () => setCurrentTime(new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC');
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5">

      {/* ================================ */}
      {/* Header                           */}
      {/* ================================ */}
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
            <Activity className="w-5 h-5 text-[#00D4FF]" />
            MISSION CONTROL
          </h1>
          <p
            className="text-[10px] text-[#475569] mt-0.5 tracking-widest uppercase"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            Real-time space traffic awareness
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[#172554]"
            style={{ background: 'rgba(11,18,32,0.8)' }}
          >
            <Radio className="w-3 h-3 text-[#10B981] animate-pulse" />
            <span
              className="text-[9px] text-[#94A3B8]"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {currentTime}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ================================ */}
      {/* Mission Summary                  */}
      {/* ================================ */}
      <MissionSummary />

      {/* ================================ */}
      {/* Stat Cards Row                   */}
      {/* ================================ */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        <StatCard icon={<Satellite className="w-4 h-4" />} title="Active Satellites" value={stats.activeSatellites} glowColor="cyan" trend="up" trendValue={3.2} />
        <StatCard icon={<Trash2 className="w-4 h-4" />} title="Tracked Debris" value={stats.trackedDebris} glowColor="amber" trend="up" trendValue={8.5} />
        <StatCard icon={<ShieldAlert className="w-4 h-4" />} title="Collision Risks" value={stats.collisionRisks} glowColor="red" trend="down" trendValue={12.0} />
        <StatCard icon={<Brain className="w-4 h-4" />} title="AI Recommendations" value={stats.aiRecommendations} glowColor="purple" />
        <StatCard icon={<Rocket className="w-4 h-4" />} title="Active Missions" value={stats.activeMissions} glowColor="green" />
      </div>

      {/* ================================ */}
      {/* Main Grid: Threats + Sidebar     */}
      {/* ================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">

        {/* Live Threat Center — 3 cols */}
        <Card variant="threat" className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-[#EF4444]">
                <AlertTriangle className="w-4 h-4" />
                LIVE THREAT CENTER
              </CardTitle>
              <div
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] border text-[9px] font-semibold"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  borderColor: 'rgba(239,68,68,0.3)',
                  color: '#EF4444',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#EF4444]"
                  style={{ animation: 'pulse-glow-red 1.2s infinite' }}
                />
                {threats.filter(t => t.status === 'critical').length} CRITICAL
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {threats.map((threat, i) => (
                <ThreatRow key={threat.id} threat={threat} index={i} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-4">

          {/* Activity Chart */}
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xs">
                <BarChart3 className="w-3.5 h-3.5 text-[#00D4FF]" />
                CONJUNCTION EVENTS (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActivitySparkline />
              <div className="flex justify-between mt-1.5">
                {['00:00', '06:00', '12:00', '18:00', 'NOW'].map(t => (
                  <span key={t} className="text-[8px] text-[#2d4a6e]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{t}</span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Orbital Distribution */}
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xs">
                <Crosshair className="w-3.5 h-3.5 text-[#7C3AED]" />
                ORBITAL DISTRIBUTION
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'LEO (200–2000km)', count: satellites.filter(s => s.orbitType === 'LEO').length, total: satellites.length, color: 'cyan' as const },
                  { label: 'MEO (2000–35000km)', count: satellites.filter(s => s.orbitType === 'MEO').length, total: satellites.length, color: 'purple' as const },
                  { label: 'GEO (35786km)', count: satellites.filter(s => s.orbitType === 'GEO').length, total: satellites.length, color: 'green' as const },
                  { label: 'SSO / Polar', count: satellites.filter(s => ['SSO', 'polar'].includes(s.orbitType)).length, total: satellites.length, color: 'amber' as const },
                ].map((orbit) => (
                  <div key={orbit.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[9px] text-[#94A3B8]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{orbit.label}</span>
                      <span className="text-[9px] text-[#F8FAFC] font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{orbit.count}</span>
                    </div>
                    <Progress value={(orbit.count / orbit.total) * 100} size="sm" color={orbit.color} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ================================ */}
      {/* Bottom: Predictions + Missions   */}
      {/* ================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Collision Predictions */}
        <Card variant="default">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xs">
                <ShieldAlert className="w-3.5 h-3.5 text-[#F59E0B]" />
                COLLISION PREDICTIONS
              </CardTitle>
              <Link href="/collision-engine">
                <Button variant="ghost" size="sm" className="text-[#94A3B8] hover:text-[#F8FAFC]">
                  All <ChevronRight className="w-3 h-3 ml-0.5" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {predictions.slice(0, 5).map((p, i) => (
                <CollisionMiniCard key={p.predictionId} prediction={p} index={i} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Missions */}
        <Card variant="default">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xs">
                <Rocket className="w-3.5 h-3.5 text-[#10B981]" />
                ACTIVE MISSIONS
              </CardTitle>
              <span
                className="text-[9px] text-[#475569]"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {missions.filter(m => m.status === 'active').length} ACTIVE
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {missions.map((m, i) => (
                <MissionRow key={m.missionId} mission={m} index={i} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ================================ */}
      {/* Quick Action Bar                 */}
      {/* ================================ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-4 p-3 rounded-md border border-[#172554] flex flex-wrap items-center justify-center gap-2"
      >
        {/* JUDGE MODE — most prominent action */}
        <button
          onClick={handleJudgeMode}
          className="flex items-center gap-2 h-9 px-4 rounded-sm border border-[#7C3AED]/60 bg-[rgba(124,58,237,0.1)] text-[#7C3AED] text-xs font-bold tracking-[0.08em] uppercase hover:bg-[rgba(124,58,237,0.2)] hover:border-[#7C3AED] hover:shadow-[0_0_18px_rgba(124,58,237,0.3)] transition-all duration-200 active:scale-[0.97] cursor-pointer"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          <Play className="w-3 h-3 fill-current" />
          JUDGE MODE
        </button>

        <div className="w-px h-5 bg-[#172554]" />

        <Link href="/earth-view">
          <Button variant="outline" size="sm" icon={<ArrowUpRight className="w-3 h-3" />}
            style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.04em' }}>
            3D Earth View
          </Button>
        </Link>
        <Link href="/kessler-simulator">
          <Button variant="outline" size="sm" icon={<ArrowUpRight className="w-3 h-3" />}
            style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.04em' }}>
            Kessler Simulator
          </Button>
        </Link>
        <Link href="/ai-agents">
          <Button variant="outline" size="sm" icon={<ArrowUpRight className="w-3 h-3" />}
            style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.04em' }}>
            AI Agent Panel
          </Button>
        </Link>
        <Link href="/collision-engine">
          <Button variant="outline" size="sm" icon={<ArrowUpRight className="w-3 h-3" />}
            style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.04em' }}>
            Collision Analysis
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
