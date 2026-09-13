import { NextRequest, NextResponse } from 'next/server';
import { generateReportFromVideo } from '@/lib/gemini';

export const runtime = 'nodejs';

const MAX_BYTES = 250 * 1024 * 1024;
const ALLOWED_PREFIX = 'https://ipfs.io/ipfs/';

async function downloadToBuffer(url: string) {
  const controller = new AbortController();
  const response = await fetch(url, { signal: controller.signal });

  if (!response.ok || !response.body) {
    throw new Error(`Failed to download: ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || 'video/mp4';
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > MAX_BYTES) {
      controller.abort();
      throw new Error(`File exceeds ${MAX_BYTES} bytes`);
    }
    chunks.push(value);
  }

  const buffer = Buffer.concat(chunks);
  return { buffer, contentType };
}

export async function POST(request: NextRequest) {
  try {
    const { urls, recordingStartTime } = await request.json();

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'urls array required' },
        { status: 400 }
      );
    }

    const results = [];

    for (const url of urls) {
      if (typeof url !== 'string' || !url.startsWith(ALLOWED_PREFIX)) {
        results.push({
          url,
          error: `URL must start with ${ALLOWED_PREFIX}`
        });
        continue;
      }

      try {
        const { buffer, contentType } = await downloadToBuffer(url);
        const draft = await generateReportFromVideo(buffer, contentType, {
          recordingStartTime
        });
        results.push({ url, draft });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        results.push({ url, error: message });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
