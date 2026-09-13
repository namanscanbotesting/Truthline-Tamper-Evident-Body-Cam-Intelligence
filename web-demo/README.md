# Clearance

Clearance is a Next.js app that simulates a body cam streaming to a LiveKit
agent, then anchors tamper-evident records on Solana and stores video data on
IPFS. It is a demo that shows the full chain of custody: livestream, analysis,
event alerts, immutable receipts, and public verification.

## How the livestream works (LiveKit Agent pipeline)

The `/upload` simulator is the body cam stand-in. When you click "Upload &
Analyze," the app:

1. Connects to LiveKit using sandbox credentials.
2. Captures the local video element stream (`captureStream`) and publishes it
   as LiveKit camera + microphone tracks.
3. Starts video analysis (Overshoot or local server) plus optional audio
   detection, and forwards text summaries to the LiveKit room on the
   `video.description` topic.
4. Receives LiveKit transcription events and renders them in the timeline.

This is the relevant control flow in `app/upload/page.tsx`:

- LiveKit connection details are fetched from
  `POST /api/livekit-sandbox/connection-details`.
- The room is configured to include a LiveKit agent named
  `clearance-agent-gemini`.
- The video file is turned into a stream using `HTMLVideoElement.captureStream`
  and published with `livekit-client` as a `LocalVideoTrack` and
  `LocalAudioTrack`.
- Analysis results are sent into the LiveKit room via `room.localParticipant.sendText`
  with the `video.description` topic.

The LiveKit agent can then subscribe to the camera/microphone tracks and the
description topic to drive its own inference or alerting.

## How events are anchored on Solana

Event alerts (weapon, shots fired, camera blocked, etc.) can be written by the
agent or any trusted service by calling `POST /api/events`:

1. The API normalizes and clamps the event payload.
2. It builds a compact JSON memo with event metadata.
3. It anchors the memo on-chain via the Solana Memo program.
4. It stores the event in Supabase for quick lookup on `/events`.

Each event row includes the `solana_tx_sig` to verify the memo payload on-chain.

## How video receipts are made tamper-evident

When you click "Publish" in the simulator:

1. The file is uploaded to Vercel Blob for temporary handling.
2. The server re-fetches that blob and computes the SHA-256 digest (authoritative).
3. The file is pinned to IPFS via Pinata, returning a CID.
4. A JSON memo payload is anchored on Solana with:
   - receipt ID
   - SHA-256 hash
   - IPFS CID
   - byte size
5. The receipt is stored in Supabase and the user is redirected to
   `/receipt/[id]`.

Verification uses `/verify/[id]`:

- The client recomputes SHA-256 from the selected file.
- The server compares the stored receipt with the Solana memo payload.
- A mismatch means the file or the database was tampered with after publish.

## Representing a real body cam

This app is a simulator. It models what a production body cam system would do,
but it does not claim capture-time authenticity. In a real deployment you would:

- Capture video/audio on-device and sign each segment with a hardware key.
- Stream the signed segments to LiveKit in real time.
- Persist raw footage to decentralized storage (IPFS) or a trusted archive.
- Anchor segment hashes and metadata on-chain (Solana memo) for public proof.

Clearance demonstrates the integrity guarantees after publish time: if the
footage changes, the hashes and the Solana memo will no longer match.

## Supabase setup

Create the `receipts` table:

```sql
create table if not exists receipts (
  id uuid primary key,
  sha256_hex text not null,
  ipfs_cid text not null,
  solana_tx_sig text not null,
  bytes integer not null,
  filename text,
  created_at timestamp with time zone default now() not null
);
create index if not exists receipts_sha256_hex_idx on receipts (sha256_hex);
create index if not exists receipts_ipfs_cid_idx on receipts (ipfs_cid);
create index if not exists receipts_solana_tx_sig_idx on receipts (solana_tx_sig);
```

Create the `events` table:

```sql
create table if not exists events (
  id uuid primary key,
  event text not null,
  tag text not null,
  occurred_at timestamp with time zone not null,
  room text,
  camera text,
  transcript text,
  source text,
  solana_tx_sig text not null,
  created_at timestamp with time zone default now() not null
);
create index if not exists events_occurred_at_idx on events (occurred_at);
create index if not exists events_event_idx on events (event);
create index if not exists events_solana_tx_sig_idx on events (solana_tx_sig);
```

## Environment variables

Server-side:

```bash
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
PINATA_JWT=...
SOLANA_RPC_URL=...
SOLANA_KEYPAIR_JSON=...
LIVEKIT_SANDBOX_ID=...
```

Client-side (public):

```bash
NEXT_PUBLIC_SOLANA_CLUSTER=devnet
NEXT_PUBLIC_LIVEKIT_URL=...
NEXT_PUBLIC_LIVEKIT_ROOM=...
NEXT_PUBLIC_OVERSHOOT_API_URL=https://cluster1.overshoot.ai/api/v0.2
NEXT_PUBLIC_OVERSHOOT_API_KEY=...
NEXT_PUBLIC_VIDEO_REVIEW_URL=http://127.0.0.1:8000
NEXT_PUBLIC_AUDIO_DETECT_URL=http://127.0.0.1:8000
```

Notes:
- `NEXT_PUBLIC_LIVEKIT_URL` and `NEXT_PUBLIC_LIVEKIT_ROOM` are optional if using
  sandbox credentials. The sandbox endpoint will return a room and token.
- `NEXT_PUBLIC_OVERSHOOT_API_KEY` enables cloud video analysis; if omitted, the
  app falls back to a local analysis server on port 8000.

## Local development

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.

## Key routes

- `/` landing page
- `/upload` body cam simulator + LiveKit streaming
- `/receipt/[id]` public receipt
- `/verify/[id]` verify an uploaded file
- `/events` on-chain alert log

## API routes

- `POST /api/livekit-sandbox/connection-details` returns LiveKit room token.
- `POST /api/events` anchors an alert memo and saves it in Supabase.
- `POST /api/publish` hashes, pins to IPFS, anchors memo, saves receipt.
- `GET /api/receipt/[id]` fetches receipt JSON.
- `GET /api/verify/[id]` verifies DB receipt against the Solana memo.
