'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface Report {
  id: string;
  narrative: string;
  officer_name: string;
  badge_number: string;
  incident_type: string;
  location: string;
  date_time: string;
  signed: number;
}

export default function ReportPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [editing, setEditing] = useState(false);
  const [editedNarrative, setEditedNarrative] = useState('');
  const [attested, setAttested] = useState(false);
  const searchParams = useSearchParams();
  const reportId = searchParams.get('reportId');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    if (!reportId) return;

    fetch(`${baseUrl}/api/report?reportId=${reportId}`)
      .then((res) => res.json())
      .then((data) => {
        setReport(data.report);
        setEditedNarrative(data.report.narrative);
      });
  }, [reportId]);

  async function handleSign() {
    const confirmed = confirm('Sign and finalize this report?');
    if (!confirmed) return;

    await fetch(`${baseUrl}/api/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reportId,
        narrative: editedNarrative
      })
    });

    alert('Report signed successfully!');
    window.location.reload();
  }

  function handleCopy() {
    navigator.clipboard.writeText(editedNarrative);
    alert('Report copied to clipboard!');
  }

  async function persistDraftIfNeeded() {
    if (!reportId || !report) return;
    if (editedNarrative === report.narrative) return;
    await fetch(`${baseUrl}/api/report/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId, narrative: editedNarrative })
    });
    setReport({ ...report, narrative: editedNarrative });
  }

  async function handleDownload(format: 'docx' | 'pdf') {
    if (!reportId) return;
    await persistDraftIfNeeded();
    window.location.href = `${baseUrl}/api/report/export?reportId=${reportId}&format=${format}`;
  }

  async function handleConvertEditedDocx(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002';
    const formData = new FormData();
    formData.append('docx', file);
    const res = await fetch(`${baseUrl}/api/report/convert`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      alert('PDF conversion failed. Ensure LibreOffice is installed.');
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report-edited.pdf';
    a.click();
    URL.revokeObjectURL(url);
    e.target.value = '';
  }

  if (!report) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-6">
            Incident Report
          </h1>

          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <strong>Officer:</strong> {report.officer_name || 'N/A'}
            </div>
            <div>
              <strong>Badge:</strong> {report.badge_number || 'N/A'}
            </div>
            <div>
              <strong>Type:</strong> {report.incident_type || 'N/A'}
            </div>
            <div>
              <strong>Location:</strong> {report.location || 'N/A'}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Narrative</h2>
              <button
                onClick={() => setEditing(!editing)}
                className="text-blue-600 hover:text-blue-800"
              >
                {editing ? 'Preview' : 'Edit'}
              </button>
            </div>

            {editing ? (
              <textarea
                value={editedNarrative}
                onChange={(e) => setEditedNarrative(e.target.value)}
                className="w-full h-96 p-4 border rounded-lg font-mono text-sm"
              />
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap font-serif">
                {editedNarrative}
              </div>
            )}
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Export</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleDownload('docx')}
                className="bg-gray-800 text-white py-2 px-4 rounded-lg text-sm hover:bg-gray-900"
              >
                Download DOCX (editable)
              </button>
              <button
                onClick={() => handleDownload('pdf')}
                className="bg-gray-700 text-white py-2 px-4 rounded-lg text-sm hover:bg-gray-800"
              >
                Download PDF
              </button>
              <label className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm cursor-pointer hover:bg-gray-100">
                Convert Edited DOCX → PDF
                <input
                  type="file"
                  accept=".docx"
                  onChange={handleConvertEditedDocx}
                  className="hidden"
                />
              </label>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Officers can edit the DOCX before converting to PDF for submission.
            </p>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <label className="flex items-start gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={attested}
                onChange={(e) => setAttested(e.target.checked)}
                className="mt-1"
              />
              <span>
                I have reviewed and edited this draft. I understand this report
                was generated with AI assistance and I am responsible for its
                accuracy.
              </span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleCopy}
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700"
            >
              📋 Copy to Clipboard
            </button>

            {!report.signed && (
              <button
                onClick={handleSign}
                disabled={!attested}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                ✓ Sign & Finalize Report
              </button>
            )}
          </div>

          {report.signed === 1 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              ✓ Report signed and finalized
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
