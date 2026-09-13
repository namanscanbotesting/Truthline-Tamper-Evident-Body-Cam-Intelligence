'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(`${baseUrl}/api/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { videoId } = await response.json();

      router.push(`/processing?videoId=${videoId}`);
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            Truthline
          </h1>
          <p className="text-gray-600">
            AI-Powered Police Report Generator
          </p>
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Body Camera Footage
            </label>
            <input
              type="file"
              name="video"
              accept="video/*"
              required
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
              disabled={uploading}
            />
            <p className="mt-2 text-sm text-gray-500">
              Accepted formats: MP4, MOV, AVI (max 100MB)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recording start time (optional)
            </label>
            <input
              type="datetime-local"
              name="recordingStartTime"
              className="w-full p-3 border rounded-lg"
              disabled={uploading}
            />
            <p className="mt-2 text-sm text-gray-500">
              If provided, report timestamps use real-world time instead of video
              time.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? 'Uploading...' : 'Upload & Generate Report'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
          <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
            <li>Upload your body camera video</li>
            <li>AI analyzes video and audio content</li>
            <li>Professional report generated automatically</li>
            <li>Review, edit, and sign the report</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
