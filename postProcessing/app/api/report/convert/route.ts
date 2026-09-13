import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { tmpdir } from 'os';
import path from 'path';
import { writeFile, readFile, mkdir, rm } from 'fs/promises';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
export const runtime = 'nodejs';

async function convertDocxToPdf(docxPath: string, outDir: string) {
  const candidates = ['soffice', 'libreoffice'];
  let lastError: unknown = null;

  for (const cmd of candidates) {
    try {
      await execFileAsync(cmd, [
        '--headless',
        '--convert-to',
        'pdf',
        '--outdir',
        outDir,
        docxPath
      ]);
      const pdfPath = docxPath.replace(/\.docx$/i, '.pdf');
      return pdfPath;
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(
    `PDF conversion failed. Install LibreOffice to enable conversion. ${String(
      lastError || ''
    )}`
  );
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('docx') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No DOCX file uploaded' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const tempDir = path.join(tmpdir(), 'clearance');
    await mkdir(tempDir, { recursive: true });
    const baseName = `edited-${randomUUID()}`;
    const docxPath = path.join(tempDir, `${baseName}.docx`);

    await writeFile(docxPath, buffer);
    const pdfPath = await convertDocxToPdf(docxPath, tempDir);
    const pdfBuffer = await readFile(pdfPath);

    await rm(docxPath, { force: true });
    await rm(pdfPath, { force: true });

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="report-edited.pdf"`
      }
    });
  } catch (error) {
    console.error('[Convert] Error:', error);
    return NextResponse.json(
      { error: 'DOCX conversion failed. Install LibreOffice.' },
      { status: 500 }
    );
  }
}
