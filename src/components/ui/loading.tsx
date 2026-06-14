'use client';

// ============================================================
// SpaceSafe X — Loading Components
// ============================================================
// FullPageLoader: Orbital animation with spinning satellite
// Skeleton: Pulse animation for content loading
// SpinnerLoader: Small inline spinner
// ============================================================

import React from 'react';
import { cn } from '@/lib/utils';

// --- FullPageLoader ---
// A full-screen loader with an orbital ring + satellite animation
// and pulsing "SpaceSafe X" text.

export function FullPageLoader({ message = 'Initializing Systems...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-0.5 w-0.5 rounded-full bg-white animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: 0.3 + Math.random() * 0.7,
            }}
          />
        ))}
      </div>

      {/* Orbital animation */}
      <div className="relative h-32 w-32 mb-8">
        {/* Center planet/core */}
        <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 shadow-[0_0_40px_rgba(0,240,255,0.4)]" />

        {/* Orbit ring 1 */}
        <div
          className="absolute inset-0 rounded-full border border-cyan-500/20"
          style={{ animation: 'spin 4s linear infinite' }}
        >
          {/* Satellite dot */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.8)]" />
        </div>

        {/* Orbit ring 2 — tilted, slower */}
        <div
          className="absolute inset-3 rounded-full border border-purple-500/20"
          style={{
            animation: 'spin 6s linear infinite reverse',
            transform: 'rotateX(60deg)',
          }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
        </div>

        {/* Orbit ring 3 — vertical, fastest */}
        <div
          className="absolute inset-6 rounded-full border border-cyan-500/10"
          style={{
            animation: 'spin 3s linear infinite',
            transform: 'rotateY(60deg)',
          }}
        >
          <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-xl font-bold text-white mb-2 tracking-wider">
        <span className="text-cyan-400">SpaceSafe</span>{' '}
        <span className="text-purple-400">X</span>
      </h1>

      {/* Loading message */}
      <p className="text-sm text-white/40 animate-pulse">{message}</p>

      {/* Loading bar */}
      <div className="mt-6 w-48 h-1 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
          style={{
            animation: 'loadingBar 2s ease-in-out infinite',
          }}
        />
      </div>

      {/* Inline keyframes for the loading bar */}
      <style>{`
        @keyframes loadingBar {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 60%; margin-left: 20%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}

// --- Skeleton ---
// Pulse animation for placeholder content during loading.

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Make skeleton circular (for avatars) */
  circle?: boolean;
}

export function Skeleton({ className, circle = false, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-white/[0.06] rounded',
        circle && 'rounded-full',
        className
      )}
      {...props}
    />
  );
}

// --- SpinnerLoader ---
// Small inline spinner for buttons, table cells, etc.

export interface SpinnerLoaderProps {
  /** Size in pixels */
  size?: number;
  /** Color class (Tailwind text color) */
  className?: string;
}

export function SpinnerLoader({ size = 16, className }: SpinnerLoaderProps) {
  return (
    <svg
      className={cn('animate-spin text-cyan-400', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role="status"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
