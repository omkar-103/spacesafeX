'use client';

// ============================================================
// SpaceSafe X — AI Agent Operations Center
// Animated pipeline, live reasoning, confidence scores.
// ============================================================

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain, Play, Trash2, Orbit, Fuel, Target, Shield,
  Zap, Activity, RotateCcw, CheckCircle2, ArrowRight,
  Radio, ChevronRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AgentCard } from '@/components/ui/agent-card';
import { getDemoAgentOutputs, getDemoCollisionPredictions } from '@/lib/demo-data';
import type { AgentOutput, AgentPipelineResult, AgentName } from '@/types';

// ============================================================
// Agent configuration
// ============================================================
interface AgentInfo {
  name: AgentName;
  displayName: string;
  role: string;
  responsibilities: string[];
  icon: React.ReactNode;
  color: string;
}

const AGENT_INFOS: AgentInfo[] = [
  {
    name: 'debris', displayName: 'Debris Tracking Agent', role: 'Debris Analysis & Detection', color: '#F59E0B',
    icon: <Trash2 className="w-5 h-5" />,
    responsibilities: ['Analyze nearby debris', 'Detect dangerous objects', 'Generate debris reports', 'Track trajectory changes'],
  },
  {
    name: 'orbit', displayName: 'Orbit Optimization Agent', role: 'Trajectory & Maneuver Planning', color: '#3B82F6',
    icon: <Orbit className="w-5 h-5" />,
    responsibilities: ['Analyze orbit trajectories', 'Compute avoidance maneuvers', 'Generate safer orbit paths', 'Check secondary conjunctions'],
  },
  {
    name: 'fuel', displayName: 'Fuel Management Agent', role: 'Propellant & Cost Analysis', color: '#10B981',
    icon: <Fuel className="w-5 h-5" />,
    responsibilities: ['Calculate maneuver fuel costs', 'Optimize fuel consumption', 'Evaluate propellant budget', 'Recommend rationing if needed'],
  },
  {
    name: 'mission', displayName: 'Mission Continuity Agent', role: 'Operations & Impact Assessment', color: '#7C3AED',
    icon: <Target className="w-5 h-5" />,
    responsibilities: ['Preserve mission objectives', 'Evaluate operational impact', 'Check crew safety', 'Coordinate communications'],
  },
  {
    name: 'commander', displayName: 'Commander Agent', role: 'Final Decision Authority', color: '#00D4FF',
    icon: <Shield className="w-5 h-5" />,
    responsibilities: ['Review all agent outputs', 'Synthesize recommendations', 'Generate final decision', 'Produce mission report'],
  },
];

// ============================================================
// Agent Architecture Card
// ============================================================
function AgentArchCard({ info, index, isActive }: { info: AgentInfo; index: number; isActive?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className="rounded-sm border bg-[#0B1220] p-4 hover:border-opacity-80 transition-all duration-200 relative"
      style={{
        borderColor: isActive ? info.color + '40' : '#172554',
        boxShadow: isActive ? `0 0 16px ${info.color}15` : 'none',
      }}
    >
      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-4 h-[1px]" style={{ background: info.color }} />
      <div className="absolute top-0 left-0 w-[1px] h-4" style={{ background: info.color }} />

      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-sm flex-shrink-0"
          style={{ background: info.color + '15', color: info.color }}
        >
          {info.icon}
        </div>
        <div>
          <h3
            className="text-xs font-semibold text-[#F8FAFC] leading-none mb-0.5"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {info.displayName}
          </h3>
          <p
            className="text-[9px] text-[#475569] tracking-wide"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            {info.role}
          </p>
        </div>
      </div>
      <ul className="space-y-1">
        {info.responsibilities.map((resp, i) => (
          <li key={i} className="flex items-start gap-1.5 text-[10px] text-[#94A3B8]">
            <ChevronRight className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: info.color + '80' }} />
            {resp}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ============================================================
// Pipeline Flow Visualization
// ============================================================
function PipelineFlow({ result, activeStep }: { result: AgentPipelineResult; activeStep: number }) {
  return (
    <div className="flex flex-col gap-2">
      {result.agents.map((agent, i) => {
        const info = AGENT_INFOS[i];
        const isActive = i === activeStep;
        const isDone = i < activeStep;
        const isPending = i > activeStep;

        return (
          <React.Fragment key={agent.agentName}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.12 }}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-sm border transition-all duration-300"
              style={{
                background: isDone ? info.color + '08' : isActive ? info.color + '12' : 'rgba(11,18,32,0.5)',
                borderColor: isDone ? info.color + '30' : isActive ? info.color + '50' : '#172554',
                boxShadow: isActive ? `0 0 12px ${info.color}20` : 'none',
                opacity: isPending ? 0.4 : 1,
              }}
            >
              {/* Status indicator */}
              <div
                className="flex items-center justify-center w-6 h-6 rounded-[2px] flex-shrink-0 text-[9px] font-bold"
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  background: info.color + '15',
                  color: info.color,
                }}
              >
                {isDone ? '\u2713' : isActive ? <Radio className="w-3 h-3 animate-pulse" /> : i + 1}
              </div>

              {/* Agent info */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-[10px] font-semibold text-[#F8FAFC] truncate"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {agent.agentDisplayName}
                </p>
                <p
                  className="text-[9px] text-[#475569] truncate"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {agent.decision.slice(0, 55)}...
                </p>
              </div>

              {/* Confidence */}
              <div className="text-right flex-shrink-0">
                <p
                  className="text-sm font-bold"
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: info.color }}
                >
                  {agent.confidence}%
                </p>
                <p className="text-[8px] text-[#2d4a6e]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {agent.executionTimeMs}ms
                </p>
              </div>
            </motion.div>

            {i < result.agents.length - 1 && (
              <div className="flex items-center justify-center">
                <div
                  className="h-4 w-[1px] transition-all duration-500"
                  style={{ background: i < activeStep ? info.color + '40' : '#172554' }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ============================================================
// AI Agents Page
// ============================================================
export default function AIAgentsPage() {
  const [pipelineResult, setPipelineResult] = useState<AgentPipelineResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeAgentStep, setActiveAgentStep] = useState(-1);
  const predictions = getDemoCollisionPredictions();
  const criticalPrediction = predictions.find(p => p.status === 'critical') || predictions[0];

  const handleRunPipeline = useCallback(() => {
    setIsRunning(true);
    setPipelineResult(null);
    setActiveAgentStep(-1);
    const result = getDemoAgentOutputs();
    result.agents.forEach((_, i) => {
      setTimeout(() => { setActiveAgentStep(i); }, (i + 1) * 1000);
    });
    setTimeout(() => {
      setPipelineResult(result);
      setIsRunning(false);
    }, (result.agents.length + 1) * 1000);
  }, []);

  const handleReset = useCallback(() => {
    setPipelineResult(null);
    setIsRunning(false);
    setActiveAgentStep(-1);
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2"
      >
        <div>
          <h1
            className="text-lg sm:text-xl font-bold text-[#F8FAFC] flex items-center gap-2"
            style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '0.06em' }}
          >
            <Brain className="w-5 h-5 text-[#7C3AED]" />
            AI AGENT SYSTEM
          </h1>
          <p
            className="text-[10px] text-[#475569] mt-0.5 tracking-widest uppercase"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            5 specialized agents via LangGraph pipeline
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pipelineResult && (
            <Button variant="ghost" size="sm" icon={<RotateCcw className="w-3.5 h-3.5" />} onClick={handleReset}
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Reset
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            icon={<Play className="w-3.5 h-3.5" />}
            loading={isRunning}
            onClick={handleRunPipeline}
            disabled={isRunning}
            style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.04em' }}
          >
            RUN AGENT PIPELINE
          </Button>
        </div>
      </motion.div>

      {/* Agent Architecture Grid */}
      <div className="mb-6">
        <p
          className="text-[9px] tracking-[0.2em] uppercase text-[#7C3AED] mb-3"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          AGENT ARCHITECTURE
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {AGENT_INFOS.map((info, i) => (
            <AgentArchCard
              key={info.name}
              info={info}
              index={i}
              isActive={i === activeAgentStep || (pipelineResult !== null && i <= activeAgentStep)}
            />
          ))}
        </div>
      </div>

      {/* Scenario Context */}
      <div
        className="mb-5 p-4 rounded-sm border flex items-center gap-4"
        style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.25)' }}
      >
        <div
          className="flex items-center justify-center w-10 h-10 rounded-sm flex-shrink-0"
          style={{ background: 'rgba(239,68,68,0.12)' }}
        >
          <Shield className="w-5 h-5 text-[#EF4444]" />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-[8px] tracking-[0.15em] uppercase text-[#475569] mb-1"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            ACTIVE SCENARIO
          </p>
          <p className="text-sm font-semibold text-[#F8FAFC]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {criticalPrediction.satelliteName} × {criticalPrediction.debrisName}
          </p>
          <p className="text-[10px] text-[#94A3B8]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            Miss: {criticalPrediction.missDistance}km · \u0394V: {criticalPrediction.relativeVelocity}km/s ·
            P(c): {(criticalPrediction.probability * 100).toFixed(4)}%
          </p>
        </div>
        <Badge variant="critical">CRITICAL</Badge>
      </div>

      {/* Pipeline + Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Pipeline Flow */}
        <Card variant="default" className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xs">
              <Activity className="w-3.5 h-3.5 text-[#00D4FF]" />
              AGENT PIPELINE
            </CardTitle>
            <CardDescription>Sequential decision chain</CardDescription>
          </CardHeader>
          <CardContent>
            {(isRunning || pipelineResult) ? (
              <PipelineFlow
                result={pipelineResult || getDemoAgentOutputs()}
                activeStep={activeAgentStep}
              />
            ) : (
              <div className="text-center py-8">
                <Brain className="w-10 h-10 text-[#172554] mx-auto mb-3" />
                <p
                  className="text-xs text-[#475569]"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  Click &ldquo;Run Agent Pipeline&rdquo; to start
                </p>
              </div>
            )}

            {pipelineResult && (
              <div className="mt-4 pt-3 border-t border-[#172554] space-y-2">
                {[
                  { label: 'TOTAL EXEC', value: `${pipelineResult.totalExecutionTimeMs}ms` },
                  { label: 'SESSION', value: pipelineResult.sessionId.slice(0, 12) },
                  { label: 'CONFIDENCE', value: `${pipelineResult.finalDecision.confidence}%` },
                ].map(m => (
                  <div key={m.label} className="flex justify-between">
                    <span className="text-[8px] text-[#475569] tracking-widest uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{m.label}</span>
                    <span className="text-[9px] text-[#00D4FF] font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{m.value}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Agent Decision Cards */}
        <div className="lg:col-span-2">
          {pipelineResult ? (
            <div className="space-y-3">
              <p
                className="text-[9px] tracking-[0.18em] uppercase text-[#10B981] flex items-center gap-1.5"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                <CheckCircle2 className="w-3 h-3" />
                AGENT DECISIONS COMPLETE
              </p>
              {pipelineResult.agents.map((agent, i) => (
                <AgentCard key={agent.agentName} agent={agent} index={i} />
              ))}
            </div>
          ) : isRunning ? (
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <div className="text-center">
                <div className="relative w-14 h-14 mx-auto mb-4">
                  <div
                    className="absolute inset-0 rounded-sm border border-[#00D4FF]/30"
                    style={{ animation: 'orbit-spin 3s linear infinite' }}
                  />
                  <div
                    className="absolute inset-2 rounded-sm border border-[#7C3AED]/20"
                    style={{ animation: 'orbit-spin 5s linear reverse infinite' }}
                  />
                  <Brain
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-[#00D4FF]"
                    style={{ animation: 'breathe 2s ease-in-out infinite' }}
                  />
                </div>
                <p
                  className="text-xs text-[#94A3B8] animate-pulse"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  Processing agent {activeAgentStep + 2} of 5...
                </p>
              </div>
            </div>
          ) : (
            <Card variant="glass" className="flex items-center justify-center min-h-[300px]">
              <CardContent className="text-center py-12">
                <Brain className="w-12 h-12 text-[#172554] mx-auto mb-3" />
                <p
                  className="text-sm text-[#475569]"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  Agent decisions will appear here
                </p>
                <p
                  className="text-[10px] text-[#2d4a6e] mt-1"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  Run the pipeline to see analysis
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
