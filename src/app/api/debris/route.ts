// ============================================================
// SpaceSafe X — API Route: /api/debris
// ============================================================
// GET: Returns all tracked debris objects (demo data or MongoDB)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { isDemo } from '@/lib/config';
import { getDemoDebris } from '@/lib/demo-data';
import type { ApiResponse, Debris } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const riskLevel = searchParams.get('riskLevel');
    const size = searchParams.get('size');
    const limit = parseInt(searchParams.get('limit') ?? '200');

    if (isDemo()) {
      let debris = getDemoDebris();

      if (riskLevel && riskLevel !== 'all') {
        debris = debris.filter(d => d.riskLevel === riskLevel);
      }
      if (size && size !== 'all') {
        debris = debris.filter(d => d.size === size);
      }

      const response: ApiResponse<Debris[]> = {
        success: true,
        data: debris.slice(0, limit),
        message: 'Demo mode — returning mock debris data',
      };
      return NextResponse.json(response, { status: 200 });
    }

    return NextResponse.json(
      { success: false, error: 'MongoDB not configured' } satisfies ApiResponse<never>,
      { status: 503 }
    );
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
