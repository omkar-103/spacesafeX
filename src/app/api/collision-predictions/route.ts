// ============================================================
// SpaceSafe X — API Route: /api/collision-predictions
// ============================================================
// GET: Returns all collision predictions (sorted by risk)
// POST: Trigger a new collision analysis (demo: runs mock computation)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { isDemo } from '@/lib/config';
import { getDemoCollisionPredictions } from '@/lib/demo-data';
import type { ApiResponse, CollisionPrediction } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const minRisk = parseInt(searchParams.get('minRisk') ?? '0');
    const limit = parseInt(searchParams.get('limit') ?? '50');

    if (isDemo()) {
      let predictions = getDemoCollisionPredictions();

      if (status && status !== 'all') {
        predictions = predictions.filter(p => p.status === status);
      }
      if (minRisk > 0) {
        predictions = predictions.filter(p => p.riskScore >= minRisk);
      }

      // Sort by risk score descending
      predictions.sort((a, b) => b.riskScore - a.riskScore);

      const response: ApiResponse<CollisionPrediction[]> = {
        success: true,
        data: predictions.slice(0, limit),
        message: 'Demo mode — returning mock collision predictions',
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

export async function POST(request: NextRequest) {
  try {
    if (isDemo()) {
      // Demo: simulate running a collision computation
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing time

      const predictions = getDemoCollisionPredictions();
      const response: ApiResponse<{ computed: number; critical: number }> = {
        success: true,
        data: {
          computed: predictions.length,
          critical: predictions.filter(p => p.status === 'critical').length,
        },
        message: 'Demo mode — collision analysis simulated',
      };
      return NextResponse.json(response, { status: 200 });
    }

    return NextResponse.json(
      { success: false, error: 'Collision engine not available' } satisfies ApiResponse<never>,
      { status: 503 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
