'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Processing() {
  const [status, setStatus] = useState('Analyzing video...');
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoId = searchParams.get('videoId');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const startedRef = useRef(false);

  useEffect(() => {
    if (!videoId) {
      router.push('/');
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;

    async function process() {
      try {
        setStatus('Analyzing video and audio...');
        setProgress(20);

        const response = await fetch(`${baseUrl}/api/process`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId })
        });

        if (!response.ok) {
          throw new Error('Processing failed');
        }

        setProgress(60);
        setStatus('Generating report narrative...');

        const { reportId } = await response.json();

        setProgress(100);
        setStatus('Complete!');

        setTimeout(() => {
          router.push(`/report?reportId=${reportId}`);
        }, 1000);
      } catch (error) {
        console.error('Processing error:', error);
        setStatus('Processing failed. Please try again.');
      }
    }

    process();
  }, [videoId, router]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">
          Processing Video
        </h1>

        <div className="space-y-4">
          <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-center text-gray-700">{status}</p>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">
              ✓ Extracting audio and video content
              <br />
              ✓ Analyzing scene and identifying subjects
              <br />
              ✓ Transcribing spoken words
              <br />
              ✓ Generating professional report narrative
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
