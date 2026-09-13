import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { anchorMemo, assertSolanaReady } from "@/lib/solana";
import { buildEventMemo } from "@/lib/memo";

type EventRequestBody = {
  event?: string;
  cameraDetails?: string;
  roomName?: string;
  transcript?: string;
  source?: string;
  occurredAt?: string;
};

const MAX_EVENT_LEN = 64;
const MAX_DETAILS_LEN = 160;
const MAX_TRANSCRIPT_LEN = 280;
const MAX_SOURCE_LEN = 64;

const normalizeEvent = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_-]/g, "");

const clampText = (value: string | undefined, max: number) => {
  if (!value || typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as EventRequestBody | null;
  const rawEvent = clampText(body?.event, MAX_EVENT_LEN);
  if (!rawEvent) {
    return NextResponse.json({ error: "Missing event" }, { status: 400 });
  }

  const event = normalizeEvent(rawEvent);
  if (!event) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  const camera = clampText(body?.cameraDetails, MAX_DETAILS_LEN);
  const room = clampText(body?.roomName, MAX_DETAILS_LEN);
  const transcript = clampText(body?.transcript, MAX_TRANSCRIPT_LEN);
  const source = clampText(body?.source, MAX_SOURCE_LEN);
  const occurredAt =
    clampText(body?.occurredAt, MAX_DETAILS_LEN) ?? new Date().toISOString();

  const tag = camera ? `${event}_${camera.replace(/\s+/g, "_")}` : event;
  const memoPayload = buildEventMemo({
    v: 1,
    app: "truthline",
    type: "event",
    event,
    tag,
    occurredAt,
    room,
    camera,
    transcript,
    source,
  });

  try {
    const { connection, keypair } = await assertSolanaReady();
    const signature = await anchorMemo(memoPayload, { connection, keypair });
    const eventId = crypto.randomUUID();

    const { data: savedEvent, error } = await supabase
      .from("events")
      .insert({
        id: eventId,
        event,
        tag,
        occurred_at: occurredAt,
        room,
        camera,
        transcript,
        source,
        solana_tx_sig: signature,
      })
      .select(
        "id, event, tag, occurred_at, room, camera, transcript, source, solana_tx_sig, created_at"
      )
      .single();

    if (error || !savedEvent) {
      throw new Error(error?.message || "Failed to save event");
    }

    return NextResponse.json(
      {
        id: savedEvent.id,
        event: savedEvent.event,
        tag: savedEvent.tag,
        occurredAt: savedEvent.occurred_at,
        room: savedEvent.room,
        camera: savedEvent.camera,
        transcript: savedEvent.transcript,
        source: savedEvent.source,
        solanaTxSig: savedEvent.solana_tx_sig,
        createdAt: new Date(savedEvent.created_at).toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

