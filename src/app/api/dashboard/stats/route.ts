// ============================================================
// SpaceSafe X — API Route: /api/dashboard/stats
// ============================================================
// GET: Returns aggregated dashboard statistics
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { isDemo } from '@/lib/config';
import { getDemoDashboardStats, getDemoLiveThreats } from '@/lib/demo-data';
import type { ApiResponse, DashboardStats, LiveThreat } from '@/types';

export async function GET(request: NextRequest) {
  try {
    if (isDemo()) {
      const stats = getDemoDashboardStats();
      const threats = getDemoLiveThreats();

      const response: ApiResponse<{ stats: DashboardStats; threats: LiveThreat[] }> = {
        success: true,
        data: { stats, threats },
        message: 'Demo mode — returning mock dashboard data',
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
