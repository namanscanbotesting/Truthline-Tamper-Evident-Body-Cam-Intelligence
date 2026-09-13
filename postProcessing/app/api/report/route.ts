import { NextRequest, NextResponse } from 'next/server';
import { getReport } from '@/lib/db';

export async function GET(request: NextRequest) {
  const reportId = request.nextUrl.searchParams.get('reportId');

  if (!reportId) {
    return NextResponse.json({ error: 'Report ID required' }, { status: 400 });
  }

  const report = await getReport(reportId);

  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  return NextResponse.json({ report });
}
