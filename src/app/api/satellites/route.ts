// ============================================================
// SpaceSafe X — API Route: /api/satellites
// ============================================================
// GET: Returns all tracked satellites (demo data or MongoDB)
// POST: Add a new satellite (demo: returns mock success)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { isDemo } from '@/lib/config';
import { getDemoSatellites } from '@/lib/demo-data';
import type { ApiResponse, Satellite } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orbitType = searchParams.get('orbitType');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') ?? '100');

    // Demo mode: return mock data
    if (isDemo()) {
      let satellites = getDemoSatellites();

      if (orbitType && orbitType !== 'all') {
        satellites = satellites.filter(s => s.orbitType === orbitType);
      }
      if (status && status !== 'all') {
        satellites = satellites.filter(s => s.status === status);
      }

      const response: ApiResponse<Satellite[]> = {
        success: true,
        data: satellites.slice(0, limit),
        message: 'Demo mode — returning mock satellite data',
      };

      return NextResponse.json(response, { status: 200 });
    }

    // Production mode: query MongoDB
    // TODO: Implement MongoDB query when credentials are available
    const response: ApiResponse<Satellite[]> = {
      success: false,
      error: 'MongoDB not configured',
    };
    return NextResponse.json(response, { status: 503 });
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (isDemo()) {
      // Demo: return mock created satellite
      const body = await request.json();
      const response: ApiResponse<{ satelliteId: string }> = {
        success: true,
        data: { satelliteId: `sat-demo-${Date.now()}` },
        message: 'Demo mode — satellite creation simulated',
      };
      return NextResponse.json(response, { status: 201 });
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
