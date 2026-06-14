// ============================================================
// SpaceSafe X — Utility Functions
// ============================================================

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { RiskLevel } from '@/types';

/**
 * Merge Tailwind CSS classes with proper conflict resolution.
 * Combines clsx (conditional classes) with tailwind-merge (dedup/override).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// --- Number & Date Formatting ---

/**
 * Format a number with locale-aware thousand separators and optional decimals.
 */
export function formatNumber(
  value: number,
  options?: { decimals?: number; compact?: boolean }
): string {
  const { decimals, compact = false } = options ?? {};

  if (compact) {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: decimals ?? 1,
    }).format(value);
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals ?? 0,
    maximumFractionDigits: decimals ?? 2,
  }).format(value);
}

/**
 * Format an ISO date string or Date into a human-readable display string.
 */
export function formatDate(
  date: string | Date,
  style: 'short' | 'medium' | 'long' | 'relative' = 'medium'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (style === 'relative') {
    return formatRelativeTime(d);
  }

  const formats: Record<string, Intl.DateTimeFormatOptions> = {
    short: { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' },
    medium: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    },
  };

  return d.toLocaleString('en-US', formats[style]);
}

/** Internal helper for relative time display (e.g. "3 minutes ago"). */
function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

/**
 * Format a countdown in seconds to a human-readable HH:MM:SS or MM:SS string.
 * Negative values return "EXPIRED".
 */
export function formatCountdown(seconds: number): string {
  if (seconds <= 0) return 'EXPIRED';

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

// --- Risk Utilities ---

/** Map a risk level to a Tailwind text color class. */
export function getRiskColor(riskLevel: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    low: 'text-green-400',
    moderate: 'text-yellow-400',
    high: 'text-orange-400',
    critical: 'text-red-500',
  };
  return map[riskLevel];
}

/** Map a risk level to a Tailwind background color class (with transparency). */
export function getRiskBgColor(riskLevel: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    low: 'bg-green-500/20 border-green-500/40',
    moderate: 'bg-yellow-500/20 border-yellow-500/40',
    high: 'bg-orange-500/20 border-orange-500/40',
    critical: 'bg-red-500/20 border-red-500/40',
  };
  return map[riskLevel];
}

/** Map a numeric risk score (0-100) to a RiskLevel enum. */
export function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 30) return 'moderate';
  return 'low';
}

/**
 * Calculate a composite risk score (0-100) from collision parameters.
 *
 * @param probability  - Collision probability (0-1)
 * @param velocity     - Relative velocity (km/s); higher = more destructive
 * @param distance     - Miss distance (km); lower = more dangerous
 */
export function calculateRiskScore(
  probability: number,
  velocity: number,
  distance: number
): number {
  // Clamp probability to [0, 1]
  const p = Math.max(0, Math.min(1, probability));

  // Velocity factor: 7.5 km/s is a typical LEO conjunction speed.
  // Scale so that 15 km/s → factor of 1.0
  const velocityFactor = Math.min(velocity / 15, 1);

  // Distance factor: inverse relationship, closer = higher risk.
  // 1 km miss → factor 1.0, 100 km miss → factor ~0.01
  const distanceFactor = Math.max(0, 1 - distance / 100);

  // Weighted combination
  const raw = p * 0.5 + velocityFactor * 0.25 + distanceFactor * 0.25;

  return Math.round(raw * 100);
}

// --- ID Generation ---

/**
 * Generate a unique-ish ID with an optional prefix.
 * Format: PREFIX-XXXXXXXX (8 hex chars from timestamp + random bits).
 */
export function generateId(prefix: string = 'id'): string {
  const timestamp = Date.now().toString(16).slice(-4);
  const random = Math.random().toString(16).slice(2, 6);
  return `${prefix}-${timestamp}${random}`;
}
