// ============================================================
// SpaceSafe X — API Route: /api/missions
// ============================================================
// GET: Returns all missions
// POST: Create a new AI-planned mission
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { isDemo } from '@/lib/config';
import { getDemoMissions } from '@/lib/demo-data';
import type { ApiResponse, Mission } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    if (isDemo()) {
      let missions = getDemoMissions();

      if (status && status !== 'all') {
        missions = missions.filter(m => m.status === status);
      }

      const response: ApiResponse<Mission[]> = {
        success: true,
        data: missions,
        message: 'Demo mode — returning mock missions',
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
    if (isDemo()) {
      const body = await request.json();

      const response: ApiResponse<{ missionId: string; aiReport: string }> = {
        success: true,
        data: {
          missionId: `mission-demo-${Date.now()}`,
          aiReport: 'Demo mode — AI mission plan generated successfully',
        },
        message: 'Demo mode — mission created',
      };
      return NextResponse.json(response, { status: 201 });
    }

    return NextResponse.json(
      { success: false, error: 'Service unavailable' } satisfies ApiResponse<never>,
      { status: 503 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
