// ============================================================
// SpaceSafe X — Configuration Manager
// ============================================================
// Checks for required environment variables and determines
// whether the app should run in demo mode (mock data).
// Demo mode is the default when any credential is missing.
// ============================================================

import type { DemoConfig } from '@/types';

/**
 * Build the demo-mode configuration object.
 * Each flag indicates whether the corresponding service credential is available.
 */
export function getDemoConfig(): DemoConfig {
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasMongoDB = !!process.env.MONGODB_URI;
  const hasFirebase = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const hasCesium = !!process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;

  // App is in demo mode when ANY credential is missing
  const isDemo = !hasGemini || !hasMongoDB || !hasFirebase || !hasCesium;

  return {
    isDemo,
    hasGemini,
    hasMongoDB,
    hasFirebase,
    hasCesium,
  };
}

/**
 * Quick boolean check: are we running in demo mode?
 * Safe to call from both server components and API routes.
 */
export function isDemo(): boolean {
  return getDemoConfig().isDemo;
}

// --- Individual credential accessors ---

/** Return the Gemini API key or undefined. */
export function getGeminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY;
}

/** Return the MongoDB connection URI or undefined. */
export function getMongoUri(): string | undefined {
  return process.env.MONGODB_URI;
}

/** Return the Firebase API key (public, usable client-side) or undefined. */
export function getFirebaseApiKey(): string | undefined {
  return process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
}

/** Return the CesiumIon access token (public, usable client-side) or undefined. */
export function getCesiumToken(): string | undefined {
  return process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;
}
