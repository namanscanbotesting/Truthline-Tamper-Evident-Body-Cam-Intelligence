# Clearance MVP

Local MVP for police report generation from body‑cam footage using Gemini and Firebase (Storage + Firestore).

## Key Notes
- Only `https://ipfs.io/ipfs/` URLs are allowed for `/api/generate-report`.
- IPFS file size is capped at **250 MB**.
- IPFS reports use the same analysis pipeline as the upload flow.
- PDF export requires **LibreOffice** (`soffice` or `libreoffice`) to be installed.
- DOCX export is generated server‑side; officers can edit DOCX before converting to PDF.
- Firestore must be created for the project (test mode ok for MVP).

## Environment Variables
Set these in `.env.local`:

```
GEMINI_API_KEY=...
# or GOOGLE_API_KEY=...

FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...firebaseapp.com
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...appspot.com
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...

# Optional
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Install & Run
```
pnpm install
pnpm dev
```

Open: http://localhost:3000

## Packages Installed
Runtime dependencies:
- `next`
- `react`
- `react-dom`
- `@google/generative-ai`
- `firebase`
- `docx`

Dev dependencies:
- `typescript`
- `tailwindcss`
- `postcss`
- `autoprefixer`
- `@types/node`
- `@types/react`
- `@types/react-dom`

## External Dependencies
- **LibreOffice** (required for DOCX → PDF conversion)
  - macOS: `brew install --cask libreoffice`
  - Verify: `soffice --version`

## Upload Flow
1) Upload video (optional: set recording start time for real‑world timestamps).
2) AI generates a draft report.
3) Officer edits and signs.
4) Export DOCX or convert edited DOCX to PDF.

## IPFS Report API
`POST /api/generate-report`

Body:
```json
{
  "urls": [
    "https://ipfs.io/ipfs/QmQ2giWPYnwCopghUsDREETtNMDAAd5eoantcMzed2aRjf"
  ],
  "recordingStartTime": "2025-12-21T00:39:16-05:00"
}
```

Response:
```json
{
  "results": [
    { "url": "...", "draft": { "narrative": "...", "incidentType": "...", "...": "..." } }
  ]
}
```

## PDF Export
- Download DOCX: `/api/report/export?reportId=...&format=docx`
- Download PDF: `/api/report/export?reportId=...&format=pdf`
- Convert edited DOCX → PDF: `POST /api/report/convert` with `form-data` key `docx`

If PDF export fails, verify LibreOffice:
```
soffice --version
```

## Firestore/Storage Rules (MVP)
Use test rules during MVP:

Firestore:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Storage:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```
