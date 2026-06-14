'use client';

// ============================================================
// SpaceSafe X — Military-Style Badge Component
// ============================================================

import React from 'react';
import { cn } from '@/lib/utils';
import type { RiskLevel } from '@/types';

type BadgeVariant = RiskLevel | 'info' | 'neutral' | 'active' | 'standby' | 'critical';

const badgeVariantStyles: Record<BadgeVariant, string> = {
  critical: 'bg-[rgba(239,68,68,0.15)] text-[#EF4444] border-[rgba(239,68,68,0.4)]',
  high:     'bg-[rgba(239,68,68,0.1)] text-[#EF4444] border-[rgba(239,68,68,0.3)]',
  moderate: 'bg-[rgba(245,158,11,0.1)] text-[#F59E0B] border-[rgba(245,158,11,0.3)]',
  low:      'bg-[rgba(16,185,129,0.1)] text-[#10B981] border-[rgba(16,185,129,0.3)]',
  info:     'bg-[rgba(0,212,255,0.1)] text-[#00D4FF] border-[rgba(0,212,255,0.3)]',
  neutral:  'bg-[rgba(148,163,184,0.1)] text-[#94A3B8] border-[rgba(148,163,184,0.2)]',
  active:   'bg-[rgba(16,185,129,0.12)] text-[#10B981] border-[rgba(16,185,129,0.35)]',
  standby:  'bg-[rgba(71,85,105,0.2)] text-[#475569] border-[rgba(71,85,105,0.3)]',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = 'neutral', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5',
        'text-[9px] font-semibold tracking-[0.12em] uppercase',
        'border rounded-[2px]',
        'leading-none',
        badgeVariantStyles[variant] ?? badgeVariantStyles.neutral,
        className
      )}
      style={{ fontFamily: 'JetBrains Mono, monospace' }}
      {...props}
    >
      {children}
    </span>
  );
}
