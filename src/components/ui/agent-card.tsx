'use client';

// ============================================================
// SpaceSafe X — AI Agent Output Card Component
// ============================================================
// Displays an AI agent's decision with: name, icon, decision
// text, circular confidence gauge, reasoning (expandable),
// recommended action, and timestamp.
// Color-coded by agent type. Animated entry with stagger.
// ============================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Orbit,
  Trash2,
  Fuel,
  Target,
  Shield,
  ChevronDown,
  ChevronUp,
  Clock,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AgentName, AgentOutput } from '@/types';

// --- Agent theme configuration ---

interface AgentTheme {
  icon: React.ComponentType<{ className?: string }>;
  color: string;        // Primary color name
  bgClass: string;      // Background tint
  borderClass: string;  // Border accent
  textClass: string;    // Text color
  glowClass: string;    // Hover glow shadow
  dotColor: string;     // Status dot color
  ringColor: string;    // SVG circle stroke color (hex)
}

const agentThemes: Record<AgentName, AgentTheme> = {
  debris: {
    icon: Trash2,
    color: 'orange',
    bgClass: 'bg-orange-500/5',
    borderClass: 'border-orange-500/20',
    textClass: 'text-orange-400',
    glowClass: 'hover:shadow-[0_0_30px_rgba(249,115,22,0.1)]',
    dotColor: 'bg-orange-400',
    ringColor: '#f97316',
  },
  orbit: {
    icon: Orbit,
    color: 'blue',
    bgClass: 'bg-blue-500/5',
    borderClass: 'border-blue-500/20',
    textClass: 'text-blue-400',
    glowClass: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]',
    dotColor: 'bg-blue-400',
    ringColor: '#3b82f6',
  },
  fuel: {
    icon: Fuel,
    color: 'green',
    bgClass: 'bg-emerald-500/5',
    borderClass: 'border-emerald-500/20',
    textClass: 'text-emerald-400',
    glowClass: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]',
    dotColor: 'bg-emerald-400',
    ringColor: '#10b981',
  },
  mission: {
    icon: Target,
    color: 'purple',
    bgClass: 'bg-purple-500/5',
    borderClass: 'border-purple-500/20',
    textClass: 'text-purple-400',
    glowClass: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]',
    dotColor: 'bg-purple-400',
    ringColor: '#a855f7',
  },
  commander: {
    icon: Shield,
    color: 'cyan',
    bgClass: 'bg-cyan-500/5',
    borderClass: 'border-cyan-500/20',
    textClass: 'text-cyan-400',
    glowClass: 'hover:shadow-[0_0_30px_rgba(0,240,255,0.1)]',
    dotColor: 'bg-cyan-400',
    ringColor: '#00f0ff',
  },
};

// --- Circular Confidence Gauge ---
// Renders a circular progress ring showing agent confidence level.

function ConfidenceGauge({
  value,
  color,
  size = 56,
}: {
  value: number;
  color: string;
  size?: number;
}) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Center percentage text */}
      <span className="absolute text-xs font-bold text-white">
        {value}%
      </span>
    </div>
  );
}

// --- AgentCard ---

export interface AgentCardProps {
  /** Agent output data */
  agent: AgentOutput;
  /** Stagger animation index for sequential entry */
  index?: number;
  /** Additional CSS classes */
  className?: string;
}

export function AgentCard({ agent, index = 0, className }: AgentCardProps) {
  const [isReasoningExpanded, setIsReasoningExpanded] = useState(false);
  const theme = agentThemes[agent.agentName];
  const IconComponent = theme.icon;

  // Format the timestamp
  const formattedTime = new Date(agent.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.15,  // Staggered entry
        ease: 'easeOut',
      }}
      className={cn(
        'rounded-xl border backdrop-blur-md overflow-hidden transition-shadow duration-300',
        theme.bgClass,
        theme.borderClass,
        theme.glowClass,
        className
      )}
    >
      {/* Header: Agent name + icon + confidence gauge */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          {/* Agent icon with colored background */}
          <div
            className={cn(
              'flex items-center justify-center h-10 w-10 rounded-lg',
              theme.bgClass,
              theme.textClass
            )}
          >
            <IconComponent className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-white">
                {agent.agentDisplayName}
              </h4>
              {/* Live dot */}
              <span className={cn('h-1.5 w-1.5 rounded-full', theme.dotColor)} />
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Clock className="h-3 w-3 text-white/30" />
              <span className="text-[10px] text-white/30">{formattedTime}</span>
              <span className="text-white/10 mx-1">•</span>
              <Zap className="h-3 w-3 text-white/30" />
              <span className="text-[10px] text-white/30">
                {agent.executionTimeMs}ms
              </span>
            </div>
          </div>
        </div>

        {/* Circular confidence gauge */}
        <ConfidenceGauge value={agent.confidence} color={theme.ringColor} />
      </div>

      {/* Decision */}
      <div className="px-4 pb-3">
        <p className="text-sm text-white/90 font-medium leading-relaxed">
          {agent.decision}
        </p>
      </div>

      {/* Recommended Action */}
      <div className="mx-4 mb-3 rounded-lg bg-white/[0.03] border border-white/5 p-3">
        <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">
          Recommended Action
        </p>
        <p className={cn('text-sm font-medium', theme.textClass)}>
          {agent.recommendedAction}
        </p>
      </div>

      {/* Expandable Reasoning */}
      <div className="border-t border-white/5">
        <button
          onClick={() => setIsReasoningExpanded(!isReasoningExpanded)}
          className={cn(
            'w-full flex items-center justify-between px-4 py-2.5',
            'text-xs text-white/40 hover:text-white/60 transition-colors',
            'cursor-pointer'
          )}
        >
          <span className="uppercase tracking-wider font-medium">Reasoning</span>
          {isReasoningExpanded ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>

        <AnimatePresence>
          {isReasoningExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <p className="px-4 pb-4 text-xs text-white/50 leading-relaxed whitespace-pre-line">
                {agent.reasoning}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
