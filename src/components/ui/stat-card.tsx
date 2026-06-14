'use client';

// ============================================================
// SpaceSafe X — Aerospace Stat Card
// Dense data display with count-up animation
// ============================================================

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  trend?: 'up' | 'down';
  trendValue?: number;
  glowColor?: string;
  className?: string;
}

function useCountUp(target: number, duration: number = 1200): number {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number>(0);

  useEffect(() => {
    startTime.current = null;
    function animate(timestamp: number) {
      if (startTime.current === null) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) { rafId.current = requestAnimationFrame(animate); }
    }
    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [target, duration]);

  return count;
}

export function StatCard({
  icon,
  title,
  value,
  suffix,
  prefix,
  trend,
  trendValue,
  glowColor = 'cyan',
  className,
}: StatCardProps) {
  const animatedValue = useCountUp(value);

  const borderAccentColors: Record<string, string> = {
    cyan:   '#00D4FF',
    purple: '#7C3AED',
    green:  '#10B981',
    red:    '#EF4444',
    amber:  '#F59E0B',
    blue:   '#3B82F6',
  };

  const iconColors: Record<string, string> = {
    cyan:   'text-[#00D4FF] bg-[rgba(0,212,255,0.08)]',
    purple: 'text-[#7C3AED] bg-[rgba(124,58,237,0.08)]',
    green:  'text-[#10B981] bg-[rgba(16,185,129,0.08)]',
    red:    'text-[#EF4444] bg-[rgba(239,68,68,0.08)]',
    amber:  'text-[#F59E0B] bg-[rgba(245,158,11,0.08)]',
    blue:   'text-[#3B82F6] bg-[rgba(59,130,246,0.08)]',
  };

  const accentColor = borderAccentColors[glowColor] || '#00D4FF';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'relative rounded-md border border-[#172554] bg-[#0B1220]',
        'p-4 overflow-hidden',
        'hover:border-[#1e3a5f] transition-all duration-200',
        className
      )}
    >
      {/* Top-left corner accent */}
      <div className="absolute top-0 left-0 w-5 h-[1px]" style={{ background: accentColor }} />
      <div className="absolute top-0 left-0 w-[1px] h-5" style={{ background: accentColor }} />

      <div className="relative z-10">
        {/* Title + Icon row */}
        <div className="flex items-start justify-between mb-3">
          <p
            className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#94A3B8]"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            {title}
          </p>
          <div className={cn('flex items-center justify-center h-8 w-8 rounded shrink-0', iconColors[glowColor] || iconColors.cyan)}>
            {icon}
          </div>
        </div>

        {/* Value */}
        <div
          className="text-2xl font-bold text-[#F8FAFC] tabular-nums"
          style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em' }}
        >
          {prefix}{animatedValue.toLocaleString()}{suffix}
        </div>

        {/* Trend */}
        {trend && trendValue !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 mt-2 text-[10px] font-medium',
              trend === 'up' ? 'text-[#10B981]' : 'text-[#EF4444]'
            )}
          >
            {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{trendValue}%</span>
            <span className="text-[#475569]">24h</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
