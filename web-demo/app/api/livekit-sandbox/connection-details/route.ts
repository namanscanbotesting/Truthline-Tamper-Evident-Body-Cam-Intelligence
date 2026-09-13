import { NextResponse } from "next/server";

type SandboxRequestBody = {
  room_name?: string;
  participant_name?: string;
  room_config?: Record<string, unknown>;
};

export async function POST(request: Request) {
  const sandboxId = process.env.LIVEKIT_SANDBOX_ID;
  if (!sandboxId) {
    return NextResponse.json(
      { error: "Missing LIVEKIT_SANDBOX_ID environment variable." },
      { status: 500 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as SandboxRequestBody;
  const hardcodedRoomConfig: SandboxRequestBody["room_config"] = {
    agents: [
      {
        agent_name: "truthline-agent-gemini",
        metadata: '{"source":"sandbox"}',
      },
    ],
  };
  const roomConfig = body.room_config ?? hardcodedRoomConfig;

  try {
    const response = await fetch(
      "https://cloud-api.livekit.io/api/sandbox/connection-details",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Sandbox-ID": sandboxId,
        },
        body: JSON.stringify({ ...body, room_config: roomConfig }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorBody.error || "Sandbox token request failed." },
        { status: response.status }
      );
    }

    const json = await response.json();
    return NextResponse.json(json, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Sandbox token request failed.",
      },
      { status: 500 }
    );
  }
}

