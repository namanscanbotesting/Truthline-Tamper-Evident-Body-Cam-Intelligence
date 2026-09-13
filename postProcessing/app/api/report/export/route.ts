import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { tmpdir } from 'os';
import path from 'path';
import { writeFile, readFile, mkdir, rm } from 'fs/promises';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { getReport } from '@/lib/db';

const execFileAsync = promisify(execFile);
export const runtime = 'nodejs';

function formatDateTime(value: any) {
  if (!value) return 'N/A';
  if (typeof value === 'string') return value;
  if (value.toDate && typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }
  return String(value);
}

async function generateDocxBuffer(report: any) {
  let Document: any;
  let Packer: any;
  let Paragraph: any;
  let TextRun: any;
  let HeadingLevel: any;
  let Table: any;
  let TableRow: any;
  let TableCell: any;
  let WidthType: any;
  try {
    const docx = await import('docx');
    Document = docx.Document;
    Packer = docx.Packer;
    Paragraph = docx.Paragraph;
    TextRun = docx.TextRun;
    HeadingLevel = docx.HeadingLevel;
    Table = docx.Table;
    TableRow = docx.TableRow;
    TableCell = docx.TableCell;
    WidthType = docx.WidthType;
  } catch (error) {
    throw new Error(
      'Missing dependency: docx. Run "pnpm install" to install it.'
    );
  }

  const title = new Paragraph({
    text: 'Uniform Incident / Offense Report',
    heading: HeadingLevel.HEADING_1
  });

  const sectionHeading = (text: string) =>
    new Paragraph({ text, heading: HeadingLevel.HEADING_2 });

  const labelValueTable = (rows: Array<[string, string]>) =>
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: rows.map(
        ([label, value]) =>
          new TableRow({
            children: [
              new TableCell({
                width: { size: 35, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ text: label })]
              }),
              new TableCell({
                width: { size: 65, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ text: value })]
              })
            ]
          })
      )
    });

  const adminInfo = labelValueTable([
    ['Agency ORI', '[PLACEHOLDER: agency_ori - required]'],
    ['Agency Name', '[PLACEHOLDER: agency_name - required]'],
    ['Case Number', '[PLACEHOLDER: case_number - required]'],
    ['Report Date', '[PLACEHOLDER: report_date - required]'],
    ['Report Time', '[PLACEHOLDER: report_time - required]'],
    ['Reporting Officer', report.officer_name || '[PLACEHOLDER: officer_name]'],
    ['Officer Badge/ID', report.badge_number || '[PLACEHOLDER: badge_number]'],
    ['Assisting Officer', '[PLACEHOLDER: assisting_officer]'],
    ['Supervisor', '[PLACEHOLDER: supervisor]']
  ]);

  const incidentInfo = labelValueTable([
    ['Type of Incident/Offense', report.incident_type || 'N/A'],
    ['Classification', report.classification || '[PLACEHOLDER: classification]'],
    ['Status', report.status || '[PLACEHOLDER: status]'],
    ['Offense Code', report.offense_code || '[PLACEHOLDER: offense_code]'],
    ['Statute/Code', report.statute_code || '[PLACEHOLDER: statute_code]'],
    ['Place of Occurrence', report.location || 'N/A'],
    ['Location Type', report.location_type || '[PLACEHOLDER: location_type]'],
    ['Incident Date', formatDateTime(report.date_time)],
    ['Incident Time', report.incident_time || '[PLACEHOLDER: incident_time]'],
    ['Sector/Beat', '[PLACEHOLDER: sector_beat]']
  ]);

  const useOfForceData = report.use_of_force || {};
  const useOfForce = labelValueTable([
    [
      'Force Used',
      useOfForceData.forceUsed || '[PLACEHOLDER: force_used]'
    ],
    [
      'Weapon/Tool',
      useOfForceData.weaponTool || '[PLACEHOLDER: weapon_tool]'
    ],
    [
      'Subject Resistance Level',
      useOfForceData.resistanceLevel || '[PLACEHOLDER: resistance_level]'
    ],
    [
      'Injuries - Officer',
      useOfForceData.officerInjuries || '[PLACEHOLDER: officer_injuries]'
    ],
    [
      'Injuries - Subject',
      useOfForceData.subjectInjuries || '[PLACEHOLDER: subject_injuries]'
    ],
    [
      'Medical Treatment Provided',
      useOfForceData.medicalResponse || '[PLACEHOLDER: medical_response]'
    ],
    [
      'Rounds Fired',
      useOfForceData.roundsFired || '[PLACEHOLDER: rounds_fired]'
    ]
  ]);

  const parties = report.involved_parties || {};
  const involvedParties = labelValueTable([
    ['Suspect #1', parties.suspect1 || '[PLACEHOLDER: suspect_1]'],
    ['Witness #1', parties.witness1 || '[PLACEHOLDER: witness_1]'],
    ['Witness #2', parties.witness2 || '[PLACEHOLDER: witness_2]']
  ]);

  const evidence = Array.isArray(report.evidence_items)
    ? report.evidence_items
    : [];
  const propertyEvidence = labelValueTable([
    ['Item #1', evidence[0] || '[PLACEHOLDER: evidence_item_1]'],
    ['Item #2', evidence[1] || '[PLACEHOLDER: evidence_item_2]']
  ]);

  const narrativeHeading = sectionHeading('Incident Narrative');
  const narrative = new Paragraph(report.narrative || 'N/A');

  const disclosureHeading = sectionHeading('AI-Generated Report Disclosure');
  const disclosure = new Paragraph(
    'This report was generated with AI assistance from body-worn camera footage analysis. All facts have been reviewed and verified by the reporting officer.'
  );

  const signatures = labelValueTable([
    ['Reporting Officer Signature', '[SIGNATURE]'],
    ['Supervisor Approval', '[SIGNATURE]'],
    ['Date', '[DATE]']
  ]);

  const doc = new Document({
    sections: [
      {
        children: [
          title,
          sectionHeading('Administrative Information'),
          adminInfo,
          sectionHeading('Incident Information'),
          incidentInfo,
          sectionHeading('Use of Force'),
          useOfForce,
          sectionHeading('Involved Parties'),
          involvedParties,
          sectionHeading('Property / Evidence'),
          propertyEvidence,
          narrativeHeading,
          narrative,
          disclosureHeading,
          disclosure,
          signatures
        ]
      }
    ]
  });

  return Packer.toBuffer(doc);
}

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

export async function GET(request: NextRequest) {
  const reportId = request.nextUrl.searchParams.get('reportId');
  const format = request.nextUrl.searchParams.get('format') || 'docx';

  if (!reportId) {
    return NextResponse.json({ error: 'Report ID required' }, { status: 400 });
  }

  const report = await getReport(reportId);
  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  const buffer = await generateDocxBuffer(report);

  if (format === 'docx') {
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="report-${reportId}.docx"`
      }
    });
  }

  if (format !== 'pdf') {
    return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
  }

  const tempDir = path.join(tmpdir(), 'truthline');
  await mkdir(tempDir, { recursive: true });
  const baseName = `report-${reportId}-${randomUUID()}`;
  const docxPath = path.join(tempDir, `${baseName}.docx`);
  const pdfPath = path.join(tempDir, `${baseName}.pdf`);

  try {
    await writeFile(docxPath, buffer);
    const convertedPath = await convertDocxToPdf(docxPath, tempDir);
    const pdfBuffer = await readFile(convertedPath);
    await rm(docxPath, { force: true });
    await rm(convertedPath, { force: true });

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="report-${reportId}.pdf"`
      }
    });
  } catch (error) {
    await rm(docxPath, { force: true });
    await rm(pdfPath, { force: true });
    console.error('[Export] PDF conversion failed:', error);
    return NextResponse.json(
      { error: 'PDF conversion failed. Install LibreOffice.' },
      { status: 500 }
    );
  }
}
