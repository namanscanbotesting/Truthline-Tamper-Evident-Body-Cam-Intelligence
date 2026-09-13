import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { insertVideo, uploadVideoToStorage } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;
    const recordingStartTime =
      (formData.get('recordingStartTime') as string | null) || null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const videoId = randomUUID();
    const originalName = file.name;
    const ext = originalName.includes('.') ? `.${originalName.split('.').pop()}` : '';
    const filename = `${videoId}${ext}`;
    const storagePath = `videos/${filename}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const contentType = file.type || 'video/mp4';
    await uploadVideoToStorage({ storagePath, buffer, contentType });

    await insertVideo({
      id: videoId,
      filename: originalName,
      storagePath,
      contentType,
      recordingStartTime
    });

    console.log(`[Upload] Saved video: ${filename}`);

    return NextResponse.json({
      success: true,
      videoId,
      filename
    });
  } catch (error) {
    console.error('[Upload] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    const stack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json(
      {
        error: 'Upload failed',
        details: process.env.NODE_ENV === 'development' ? message : undefined,
        stack: process.env.NODE_ENV === 'development' ? stack : undefined
      },
      { status: 500 }
    );
  }
}
