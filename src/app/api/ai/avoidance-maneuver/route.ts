// ============================================================
// SpaceSafe X — API Route: /api/ai/avoidance-maneuver
// ============================================================
// POST: Generate an AI avoidance maneuver recommendation
//       for a given collision prediction.
//       Demo mode: returns mock maneuver with simulated Gemini reasoning.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { isDemo, getGeminiApiKey } from '@/lib/config';
import { getDemoCollisionPredictions } from '@/lib/demo-data';
import type { ApiResponse, AvoidanceManeuver } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { predictionId, satelliteId } = body;

    if (!predictionId && !satelliteId) {
      return NextResponse.json(
        { success: false, error: 'Missing predictionId or satelliteId' } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    if (isDemo()) {
      // Demo: return the maneuver from the matched prediction
      await new Promise(resolve => setTimeout(resolve, 800));

      const predictions = getDemoCollisionPredictions();
      const prediction = predictionId
        ? predictions.find(p => p.predictionId === predictionId)
        : predictions.find(p => p.satelliteId === satelliteId && p.avoidanceManeuver);

      if (!prediction?.avoidanceManeuver) {
        // Generate a mock maneuver
        const mockManeuver: AvoidanceManeuver = {
          deltaV: { vx: 0.0012, vy: -0.0008, vz: 0.0003 },
          totalDeltaV: 0.0015,
          fuelCost: 2.1,
          fuelPercentage: 3.5,
          burnDuration: 45,
          burnStartTime: new Date(Date.now() + 3600 * 1000).toISOString(),
          newOrbit: {
            semiMajorAxis: 6785,
            eccentricity: 0.0001,
            inclination: 51.6,
            raan: 123.4,
            argumentOfPerigee: 90,
            meanAnomaly: 180,
            epoch: new Date().toISOString(),
          },
          safetyMargin: 12.5,
        };

        return NextResponse.json(
          { success: true, data: mockManeuver, message: 'Demo mode — maneuver generated' } satisfies ApiResponse<AvoidanceManeuver>,
          { status: 200 }
        );
      }

      return NextResponse.json(
        { success: true, data: prediction.avoidanceManeuver, message: 'Demo mode — maneuver retrieved' } satisfies ApiResponse<AvoidanceManeuver>,
        { status: 200 }
      );
    }

    // Production: use Gemini to generate maneuver
    const geminiKey = getGeminiApiKey();
    if (!geminiKey) {
      return NextResponse.json(
        { success: false, error: 'Gemini API key not configured' } satisfies ApiResponse<never>,
        { status: 503 }
      );
    }

    // TODO: Implement Gemini-powered maneuver generation
    return NextResponse.json(
      { success: false, error: 'Production Gemini integration pending' } satisfies ApiResponse<never>,
      { status: 501 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
