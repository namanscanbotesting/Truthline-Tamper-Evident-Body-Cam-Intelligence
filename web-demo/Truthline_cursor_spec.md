# Truthline — Cursor Spec (Next.js + Solana Anchor + IPFS/Pinata + Public Verify)

**Project codename:** Truthline  
**Goal:** A simple web app that lets a user upload a video, play it locally, then “publish” it by:
1) hashing the exact bytes,  
2) uploading the file to IPFS via Piñata, and  
3) anchoring a tamper-evident receipt on Solana (custodial server signing).  

Then anyone can verify later (e.g., public defender) by uploading a file and confirming it matches the anchored commitment.

---

## Step-by-step scope (this spec covers Steps 1–4)

### Step 1
**Simple Next.js video player**: select a local video and play it.

### Step 2
**Hash + Solana anchor**: compute SHA-256 of the uploaded file (server-side, authoritative), then submit a Solana transaction storing the commitment.

### Step 3
**Store file on IPFS via Piñata**: upload the video to Piñata, receive a CID.

### Step 4
**Verify page**: anyone can upload a file and verify it matches the original published receipt (by Receipt ID link). Verification should check:
- the file hash matches the stored receipt hash, and
- the stored receipt hash matches what was anchored on Solana (memo extraction).

---

## Key integrity model (what we can and cannot claim)

### We can claim (and must implement)
- After publish time, anyone can detect tampering: changing the file changes SHA-256, which will not match the Solana-anchored hash.
- IPFS CID provides content addressing; if CID changes, content changed.

### We cannot claim (and should not market)
- That the published file is “authentic capture-time footage.” This is a web upload demo; authenticity requires on-device signing at capture time.

---

## Tech stack

- **Next.js 14+ (App Router)**
- **TypeScript**
- **Prisma + SQLite** (MVP persistence for receipts)
- **Piñata API** (pinFileToIPFS)
- **Solana web3.js** (custodial signing)
- **Solana Memo program** (store receipt commitment in transaction)

---

## Repository layout

```
truthline/
  app/
    page.tsx                     # upload + local playback + publish button
    receipt/[id]/page.tsx        # published receipt view (shareable link)
    verify/[id]/page.tsx         # verify file against a specific receipt
    api/
      publish/route.ts           # handles upload -> hash -> pinata -> solana -> db
      receipt/[id]/route.ts      # returns receipt JSON
      verify/[id]/route.ts       # server-side verify: parse chain memo + compare
  lib/
    hashing.ts                   # sha256 helpers (node)
    pinata.ts                    # pinFileToIPFS helper
    solana.ts                    # anchor receipt memo helper
    prisma.ts                    # prisma client
    memo.ts                      # memo encode/decode helpers
  prisma/
    schema.prisma
  .env.local.example
  package.json
  README.md
```

---

## Environment variables

Create `.env.local`:

### Piñata
- `PINATA_JWT=...`  
  Use Piñata JWT auth (recommended over API key/secret).

### Solana
- `SOLANA_RPC_URL=https://api.mainnet-beta.solana.com` (or devnet for testing)
- `SOLANA_KEYPAIR_JSON=[...]`  
  JSON array of 64 bytes (ed25519 secret key). Store securely; never ship to client.

### App
- `NEXT_PUBLIC_SOLANA_CLUSTER=devnet|mainnet-beta` (display only; no secrets)

### Database
- `DATABASE_URL="file:./dev.db"`

---

## Data model (Prisma)

`Receipt` represents a published video proof.

Fields:
- `id` (UUID)
- `sha256Hex` (string, authoritative server hash of the exact uploaded bytes)
- `ipfsCid` (string)
- `solanaTxSig` (string)
- `bytes` (int)
- `filename` (string, optional)
- `createdAt` (datetime)

---

## Receipt commitment format (what gets anchored on Solana)

We will store a compact, versioned JSON payload in a Solana Memo instruction.

**Memo payload (JSON, UTF-8):**
```json
{
  "v": 1,
  "app": "truthline",
  "receiptId": "<uuid>",
  "alg": "sha256",
  "sha256": "<64 hex chars>",
  "cid": "<ipfs cid>",
  "bytes": 123456
}
```

Notes:
- Keep it small to fit transaction limits.
- We will also store the same fields in DB, but **Solana is the immutable witness**.

---

## UI/UX pages

### `/` — Upload / Play / Publish
- File input: accept video/*
- Local playback: use `URL.createObjectURL(file)`
- Show filename, size
- “Publish” button:
  - uploads file to `/api/publish`
  - shows progress state (simple spinner is fine for MVP)
  - on success, redirect to `/receipt/[id]`

### `/receipt/[id]` — Public receipt
- Shows:
  - SHA-256
  - IPFS CID + link to a gateway (optional)
  - Solana tx signature + explorer link (optional)
  - Created timestamp
- Includes “Verify this receipt” link to `/verify/[id]`

### `/verify/[id]` — Public verifier
- Upload any file
- Compute SHA-256 in browser (client-side) and show it
- Fetch expected receipt from `/api/receipt/[id]`
- Compare hashes:
  - clientHash == receipt.sha256Hex => “Match”
- Also call `/api/verify/[id]` (server verifies chain memo matches DB):
  - if server says DB hash != chain memo hash => warn “Receipt DB mismatch; treat as compromised”
- Output a clear PASS/FAIL with reasons

---

# Implementation Plan (step-by-step)

## Step 1 — Next.js video player (local only)

### Acceptance Criteria
- User chooses a local video
- Video plays in `<video controls />`
- No networking needed

### Implementation notes
- Use `URL.createObjectURL(file)` and revoke on cleanup
- Keep state: selected file, object URL

---

## Step 2 — Hash + Solana anchor (server authoritative)

### Critical requirement
The **server** must compute the SHA-256 on the exact bytes it uploads to IPFS.  
Client hashing is informational only.

### Server hashing
- Use Node `crypto`:
  - `createHash("sha256")`
  - Update with Buffer
  - Output hex

### Solana anchoring
- Use `@solana/web3.js`
- Use Memo program id:
  - `MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr`
- Create transaction:
  - payer = custodial keypair
  - add memo instruction with payload
  - send and confirm

### Acceptance Criteria
- Server returns a tx signature
- Receipt data includes sha256 and txSig

---

## Step 3 — Upload to IPFS (Piñata)

### Pinata upload
- Use `pinFileToIPFS`
- Send multipart/form-data from server
- Receive CID

### Acceptance Criteria
- Server returns CID
- CID is stored in DB and in Solana memo

---

## Step 4 — Verify page (public defender flow)

### Verify flow
**Client:**
1) Upload file
2) Compute SHA-256 in browser (Web Crypto `crypto.subtle.digest("SHA-256", bytes)`)
3) Fetch receipt JSON
4) Compare and display result

**Server-side additional safeguard:**
- `/api/verify/[id]` fetches Solana transaction memo and ensures it matches DB receipt values.

### Acceptance Criteria
- Uploading the original file passes
- Uploading a modified file fails
- If DB was tampered (simulated), server verify detects mismatch with chain memo

---

# API Specifications

## `POST /api/publish`
**Purpose:** Upload video, hash, pin to IPFS, anchor on Solana, store receipt.

**Request:** multipart/form-data
- `file`: video file

**Response (200):**
```json
{
  "receiptId": "uuid",
  "sha256Hex": "…",
  "ipfsCid": "bafy…",
  "solanaTxSig": "…",
  "bytes": 12345,
  "createdAt": "ISO"
}
```

**Error responses:**
- 400 no file
- 413 file too large (optional)
- 500 pin/solana failure

---

## `GET /api/receipt/[id]`
Returns receipt JSON.

---

## `GET /api/verify/[id]`
Server-side check:
- loads receipt from DB
- fetches Solana tx by `solanaTxSig`
- extracts memo payload
- compares `sha256`, `cid`, `receiptId`
- returns results

**Response:**
```json
{
  "dbMatchesChain": true,
  "expected": { "sha256Hex": "...", "ipfsCid": "..." },
  "chain": { "sha256Hex": "...", "ipfsCid": "...", "receiptId": "..." }
}
```

---

# Development commands

## Setup
```bash
pnpm create next-app truthline --typescript --app
cd truthline
pnpm add @solana/web3.js prisma @prisma/client
pnpm add form-data
pnpm dlx prisma init
```

## Prisma
```bash
pnpm dlx prisma migrate dev --name init
```

## Run
```bash
pnpm dev
```

---

# Security and operational constraints (MVP-safe defaults)

- Do not expose:
  - `PINATA_JWT`
  - `SOLANA_KEYPAIR_JSON`
- Rate-limit `/api/publish` (basic IP-based middleware if deployed publicly).
- Use **devnet** while building; switch to mainnet only when ready.
- Large uploads: `request.formData()` buffers in memory; acceptable for demo-sized videos.
  - Production path: direct upload to object storage (R2/S3) + server-side processing.

---

# Deliverables Checklist

✅ Step 1: Local video upload + playback  
✅ Step 2: Server SHA-256 + Solana memo tx  
✅ Step 3: Piñata pinFileToIPFS returns CID  
✅ Step 4: Verify page compares local hash to receipt and cross-checks DB vs chain

---

# Next actions for Cursor (execute in order)

1) Create Next.js app router pages: `/`, `/receipt/[id]`, `/verify/[id]`
2) Add Prisma schema + migrate
3) Implement `/api/publish` with:
   - parse multipart file
   - compute sha256
   - upload to Piñata => cid
   - anchor memo on Solana => txSig
   - store receipt => DB
4) Implement verify flows:
   - client hashing
   - server chain memo extraction
5) Basic styling and clear PASS/FAIL messaging

---

## Notes on “cannot be tampered with”
The guarantee is: **any file alteration after publish will not match the on-chain commitment**.  
This is integrity after publish time, not capture authenticity.
