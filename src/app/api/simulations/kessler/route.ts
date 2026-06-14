// ============================================================
// SpaceSafe X — API Route: /api/simulations/kessler
// ============================================================
// GET: Returns pre-computed Kessler simulation result
// POST: Start a new Kessler simulation (demo: returns mock frames)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { isDemo } from '@/lib/config';
import { getDemoSimulationResult } from '@/lib/demo-data';
import type { ApiResponse, SimulationResult, SimulationConfig } from '@/types';

export async function GET(request: NextRequest) {
  try {
    if (isDemo()) {
      const result = getDemoSimulationResult();
      const response: ApiResponse<SimulationResult> = {
        success: true,
        data: result,
        message: 'Demo mode — returning pre-computed simulation',
      };
      return NextResponse.json(response, { status: 200 });
    }

    return NextResponse.json(
      { success: false, error: 'MongoDB not configured' } satisfies ApiResponse<never>,
      { status: 503 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Partial<SimulationConfig> = await request.json();

    if (isDemo()) {
      // Demo: simulate a slight delay then return the pre-computed result
      await new Promise(resolve => setTimeout(resolve, 1500));

      const result = getDemoSimulationResult();

      // Optionally customize based on config
      if (body.explosionIntensity) {
        result.config.explosionIntensity = body.explosionIntensity;
      }

      const response: ApiResponse<SimulationResult> = {
        success: true,
        data: result,
        message: 'Demo mode — Kessler simulation completed',
      };
      return NextResponse.json(response, { status: 200 });
    }

    return NextResponse.json(
      { success: false, error: 'Simulation engine not available' } satisfies ApiResponse<never>,
      { status: 503 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
