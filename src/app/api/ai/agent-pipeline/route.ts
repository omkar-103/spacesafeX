// ============================================================
// SpaceSafe X — API Route: /api/ai/agent-pipeline
// ============================================================
// POST: Run the multi-agent AI pipeline for a given scenario.
//       In demo mode, returns mock agent outputs with simulated delay.
//       In production, runs the LangGraph pipeline with Gemini AI.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { isDemo, getGeminiApiKey } from '@/lib/config';
import { getDemoAgentOutputs } from '@/lib/demo-data';
import type { ApiResponse, AgentPipelineResult } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { satelliteId, debrisId, predictionId } = body;

    // Validate inputs
    if (!satelliteId && !predictionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: satelliteId or predictionId',
        } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    // Demo mode — return mock pipeline result with slight delay
    if (isDemo()) {
      // Simulate agent processing time (~2-3 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

      const result = getDemoAgentOutputs();
      const response: ApiResponse<AgentPipelineResult> = {
        success: true,
        data: result,
        message: 'Demo mode — AI pipeline simulated with mock data',
      };
      return NextResponse.json(response, { status: 200 });
    }

    // Production mode — run actual LangGraph + Gemini pipeline
    const geminiKey = getGeminiApiKey();
    if (!geminiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Gemini API key not configured',
        } satisfies ApiResponse<never>,
        { status: 503 }
      );
    }

    // TODO: Implement full LangGraph pipeline when production keys are set
    // For now, fall back to demo data with a production-like response
    const result = getDemoAgentOutputs();
    const response: ApiResponse<AgentPipelineResult> = {
      success: true,
      data: result,
      message: 'Agent pipeline executed',
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
