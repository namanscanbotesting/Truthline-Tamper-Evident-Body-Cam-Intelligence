import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { generateReportFromVideo } from '@/lib/gemini';
import {
  downloadVideoFromStorage,
  getVideo,
  getReportByVideoId,
  insertReport,
  updateVideoAnalysis
} from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { videoId } = await request.json();

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID required' }, { status: 400 });
    }

    const video = await getVideo(videoId);

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    console.log(`[Process] Starting analysis for: ${video.filename}`);

    const existingReport = await getReportByVideoId(videoId);
    if (existingReport?.id) {
      console.log(`[Process] Using existing report: ${existingReport.id}`);
      return NextResponse.json({
        success: true,
        reportId: existingReport.id,
        reused: true
      });
    }

    const storagePath = video.storage_path as string;
    const contentType = (video.content_type as string) || 'video/mp4';
    const recordingStartTime = video.recording_start_time as
      | string
      | undefined;
    const buffer = await downloadVideoFromStorage(storagePath);
    const draft = await generateReportFromVideo(buffer, contentType, {
      recordingStartTime
    });
    const narrative = draft.narrative;

    const reportId = randomUUID();

    await insertReport({
      id: reportId,
      videoId,
      narrative,
      officerName: draft.officerName || null,
      badgeNumber: draft.badgeNumber || null,
      incidentType: draft.incidentType || null,
      location: draft.location || null,
      classification: draft.classification || null,
      status: draft.status || null,
      offenseCode: draft.offenseCode || null,
      statuteCode: draft.statuteCode || null,
      locationType: draft.locationType || null,
      incidentTime: draft.incidentTime || null,
      useOfForce: draft.useOfForce || null,
      involvedParties: draft.involvedParties || null,
      evidenceItems: draft.evidenceItems || null
    });

    await updateVideoAnalysis({ id: videoId, analysis: draft });

    console.log(`[Process] Report generated: ${reportId}`);

    return NextResponse.json({
      success: true,
      reportId
    });
  } catch (error) {
    console.error('[Process] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    const stack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json(
      {
        error: 'Processing failed',
        details: process.env.NODE_ENV === 'development' ? message : undefined,
        stack: process.env.NODE_ENV === 'development' ? stack : undefined
      },
      { status: 500 }
    );
  }
}
