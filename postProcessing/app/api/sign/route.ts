import { NextRequest, NextResponse } from 'next/server';
import { signReport } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { reportId, narrative } = await request.json();

    await signReport({ id: reportId, narrative });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Sign] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    const stack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json(
      {
        error: 'Failed to sign report',
        details: process.env.NODE_ENV === 'development' ? message : undefined,
        stack: process.env.NODE_ENV === 'development' ? stack : undefined
      },
      { status: 500 }
    );
  }
}
