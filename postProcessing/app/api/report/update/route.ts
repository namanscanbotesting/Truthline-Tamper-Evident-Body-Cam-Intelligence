import { NextRequest, NextResponse } from 'next/server';
import { updateReportNarrative } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { reportId, narrative } = await request.json();

    if (!reportId) {
      return NextResponse.json(
        { error: 'Report ID required' },
        { status: 400 }
      );
    }

    await updateReportNarrative({ id: reportId, narrative });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Report Update] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update report' },
      { status: 500 }
    );
  }
}
