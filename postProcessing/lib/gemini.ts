import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey =
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error(
    'Missing Gemini API key. Set GEMINI_API_KEY (or GOOGLE_API_KEY) in .env.local.'
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

interface ReportDraft {
  narrative: string;
  incidentType?: string;
  classification?: string;
  status?: string;
  offenseCode?: string;
  statuteCode?: string;
  location?: string;
  locationType?: string;
  incidentDateTime?: string;
  incidentTime?: string;
  officerName?: string;
  badgeNumber?: string;
  useOfForce?: {
    forceUsed?: string;
    weaponTool?: string;
    resistanceLevel?: string;
    officerInjuries?: string;
    subjectInjuries?: string;
    medicalResponse?: string;
    roundsFired?: string;
  };
  involvedParties?: {
    suspect1?: string;
    witness1?: string;
    witness2?: string;
  };
  evidenceItems?: string[];
}

export async function generateReportFromVideo(
  buffer: Buffer,
  contentType: string,
  context?: { recordingStartTime?: string }
): Promise<ReportDraft> {
  console.log(`[Gemini] Generating report, bytes: ${buffer.length}`);

  try {
    const base64Video = buffer.toString('base64');

    const recordingStartTime = context?.recordingStartTime || '[PLACEHOLDER]';

    const prompt = `
You are a police report drafting assistant. Produce a detailed, well-formatted incident report.
Use facts only. Do NOT speculate. If unknown, use [PLACEHOLDER: field_name - what is missing].

TIMESTAMPS:
- Use real-world timestamps based on recordingStartTime when provided.
- If recordingStartTime is [PLACEHOLDER], use [PLACEHOLDER: real_world_time].
- Use second-level precision for critical events.

DETAILS:
- Include environment, subject descriptors, officer actions, commands, compliance/non-compliance,
  use-of-force specifics, injuries, medical response, evidence, and post-event actions when visible/audible.
- Minimize placeholders by extracting all observable details.
- Avoid repetitive command lists; summarize repeated commands and cite 1-2 representative timestamps.

OUTPUT RULES:
- Return VALID JSON ONLY (no markdown).
- Narrative must be chronological, neutral, professional.
- Add disclosure line: "This report was drafted with AI assistance and reviewed by the reporting officer."
- Max 700 words.

recordingStartTime: ${recordingStartTime}

RETURN THIS JSON SHAPE:
{
  "incidentType": "string or [PLACEHOLDER: incident_type - what is missing]",
  "classification": "string or [PLACEHOLDER: classification - what is missing]",
  "status": "string or [PLACEHOLDER: status - what is missing]",
  "offenseCode": "string or [PLACEHOLDER: offense_code - what is missing]",
  "statuteCode": "string or [PLACEHOLDER: statute_code - what is missing]",
  "location": "string or [PLACEHOLDER: location - what is missing]",
  "locationType": "string or [PLACEHOLDER: location_type - what is missing]",
  "incidentDateTime": "ISO 8601 or [PLACEHOLDER: incident_datetime - what is missing]",
  "incidentTime": "HH:MM or [PLACEHOLDER: incident_time - what is missing]",
  "officerName": "string or [PLACEHOLDER: officer_name - what is missing]",
  "badgeNumber": "string or [PLACEHOLDER: badge_number - what is missing]",
  "useOfForce": {
    "forceUsed": "string or [PLACEHOLDER: force_used - what is missing]",
    "weaponTool": "string or [PLACEHOLDER: weapon_tool - what is missing]",
    "resistanceLevel": "string or [PLACEHOLDER: resistance_level - what is missing]",
    "officerInjuries": "string or [PLACEHOLDER: officer_injuries - what is missing]",
    "subjectInjuries": "string or [PLACEHOLDER: subject_injuries - what is missing]",
    "medicalResponse": "string or [PLACEHOLDER: medical_response - what is missing]",
    "roundsFired": "string or [PLACEHOLDER: rounds_fired - what is missing]"
  },
  "involvedParties": {
    "suspect1": "string or [PLACEHOLDER: suspect_1 - what is missing]",
    "witness1": "string or [PLACEHOLDER: witness_1 - what is missing]",
    "witness2": "string or [PLACEHOLDER: witness_2 - what is missing]"
  },
  "evidenceItems": ["string list, or [PLACEHOLDER: evidence_items - what is missing]"],
  "narrative": "Full narrative text"
}
`;

    const model = genAI.getGenerativeModel({
      model: process.env.VIDEO_MODEL || 'gemini-2.0-flash-exp'
    });

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: contentType || 'video/mp4',
          data: base64Video
        }
      }
    ]);

    const text = result.response.text();
    console.log(`[Gemini] Raw response:`, text.substring(0, 200));

    const cleanText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    let analysis: ReportDraft;
    try {
      analysis = JSON.parse(cleanText);
    } catch (parseError) {
      console.error(
        `[Gemini] JSON parse failed, snippet:`,
        cleanText.slice(0, 500)
      );
      throw parseError;
    }

    console.log(`[Gemini] Report draft complete`);
    return analysis;
  } catch (error) {
    console.error(`[Gemini] Analysis failed:`, error);
    throw error;
  }
}

