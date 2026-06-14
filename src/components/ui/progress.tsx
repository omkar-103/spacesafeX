'use client';

// ============================================================
// SpaceSafe X — Animated Progress Bar Component
// ============================================================
// Gradient fill from cyan→purple with animated shimmer.
// Color adapts based on value: green (<40), cyan (40-70),
// amber (70-90), red (>90).
// ============================================================

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Returns gradient classes based on the progress value.
 * Lower values = cooler colors, higher = warmer/alert colors.
 */
function getProgressColor(value: number): string {
  if (value >= 90) return 'from-red-500 to-red-400';
  if (value >= 70) return 'from-amber-500 to-orange-400';
  if (value >= 40) return 'from-cyan-500 to-purple-500';
  return 'from-emerald-500 to-cyan-400';
}

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Progress value from 0 to 100 */
  value: number;
  /** Override automatic color selection */
  color?: 'cyan' | 'purple' | 'green' | 'red' | 'amber' | 'auto';
  /** Show percentage label */
  showLabel?: boolean;
  /** Height of the bar */
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const colorOverrides: Record<string, string> = {
  cyan: 'from-cyan-500 to-cyan-400',
  purple: 'from-purple-600 to-purple-400',
  green: 'from-emerald-500 to-emerald-400',
  red: 'from-red-500 to-red-400',
  amber: 'from-amber-500 to-amber-400',
};

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, color = 'auto', showLabel = false, size = 'md', ...props }, ref) => {
    // Clamp value to 0-100
    const clampedValue = Math.min(100, Math.max(0, value));
    const gradientColor =
      color === 'auto' ? getProgressColor(clampedValue) : colorOverrides[color];

    return (
      <div className={cn('w-full', className)} {...props}>
        {/* Optional label */}
        {showLabel && (
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-white/50">Progress</span>
            <span className="text-xs font-medium text-white/80">
              {Math.round(clampedValue)}%
            </span>
          </div>
        )}

        {/* Track */}
        <div
          ref={ref}
          className={cn(
            'w-full rounded-full bg-white/5 overflow-hidden',
            sizeStyles[size]
          )}
        >
          {/* Fill bar with shimmer */}
          <div
            className={cn(
              'h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out',
              'relative overflow-hidden',
              gradientColor
            )}
            style={{ width: `${clampedValue}%` }}
            role="progressbar"
            aria-valuenow={clampedValue}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            {/* Animated shimmer overlay */}
            <div
              className={cn(
                'absolute inset-0',
                'bg-gradient-to-r from-transparent via-white/25 to-transparent',
                'animate-[shimmer_2s_infinite]',
              )}
              style={{
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s infinite linear',
              }}
            />
          </div>
        </div>
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
