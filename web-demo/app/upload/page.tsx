"use client";

import { upload } from "@vercel/blob/client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LocalAudioTrack,
  LocalVideoTrack,
  Room,
  RoomEvent,
  Track,
} from "livekit-client";
import { RealtimeVision } from "@overshoot/sdk";

type PublishState = "idle" | "uploading" | "success" | "error";
type LiveKitStatus = "disconnected" | "connecting" | "connected" | "error";
type LogEntry = {
  id: string;
  message: string;
  level: "info" | "success" | "warn";
  timestamp: string;
  tier?: LogTier;
  offsetSec: number; // Video time offset in seconds
  sendToLiveKit?: boolean;
};
type SandboxConnectionDetails = {
  serverUrl: string;
  participantToken: string;
  roomName: string;
  participantName: string;
};
type ReviewStatus = "idle" | "connecting" | "streaming" | "error";
type LogTier = "scene" | "critical" | "warning" | "action" | "transcription" | "audio" | "no_activity";
type ParsedSegment = { tier: LogTier; text: string; sendToLiveKit?: boolean };
type OvershootResult = {
  result: string;
  inference_latency_ms?: number;
  total_latency_ms?: number;
};
type OvershootVision = {
  start?: () => void | Promise<void>;
  stop?: () => void;
  close?: () => void;
  destroy?: () => void;
};

const LIVEKIT_TEXT_TOPIC = "video.description";

function formatVideoTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const OVERSHOOT_API_URL =
  process.env.NEXT_PUBLIC_OVERSHOOT_API_URL ??
  "https://cluster1.overshoot.ai/api/v0.2";
const OVERSHOOT_API_KEY = process.env.NEXT_PUBLIC_OVERSHOOT_API_KEY ?? "";
const HAS_OVERSHOOT_KEY = OVERSHOOT_API_KEY.trim().length > 0;
const REVIEW_FALLBACK_URL =
  process.env.NEXT_PUBLIC_VIDEO_REVIEW_URL ?? "http://127.0.0.1:8000";
const AUDIO_DETECT_URL =
  process.env.NEXT_PUBLIC_AUDIO_DETECT_URL ?? "http://127.0.0.1:8000";

const ALERT_KEYWORDS = [
  "⚠️",
  "GUN DRAWN",
  "TASER DRAWN",
  "TASER FIRED",
  "SHOTS FIRED",
  "WEAPON!",
  "GUN VISIBLE",
  "GUN POINTED",
  "CAMERA BLOCKED",
  "CAMERA OBSCURED",
  "PERSON ON FLOOR",
  "PERSON DOWN",
  "PERSON PRONE",
];

// CSS colors matching livekit-gemini-agent video_review.html
const tierStyles: Record<LogTier, string> = {
  scene:
    "border-l-[3px] border-l-[#c792ea] bg-gradient-to-r from-[rgba(199,146,234,0.1)] to-transparent",
  critical:
    "border-l-4 border-l-[#ff0000] bg-gradient-to-r from-[rgba(255,0,0,0.2)] via-[rgba(255,0,0,0.08)] to-transparent font-semibold",
  warning:
    "border-l-[3px] border-l-[#f59e0b] bg-gradient-to-r from-[rgba(245,158,11,0.12)] to-transparent",
  action:
    "border-l-[3px] border-l-[#ff5e5e]",
  transcription:
    "border-l-[3px] border-l-[#6ee7a8]",
  audio:
    "border-l-[3px] border-l-[#60a5fa] bg-gradient-to-r from-[rgba(96,165,250,0.1)] to-transparent",
  no_activity:
    "border-l-[3px] border-l-[#2b3140] opacity-60 italic",
};

function parseTierFromMessage(message: string): {
  tier: LogTier;
  text: string;
} {
  const match = message.match(/^\s*\[(scene|critical|warning|action)\]\s*/i);
  if (match) {
    const tier = match[1].toLowerCase() as LogTier;
    return { tier, text: message.replace(match[0], "").trim() };
  }
  const upper = message.toUpperCase();

  // Check for critical alerts FIRST (highest priority - includes SHOTS FIRED from audio)
  if (ALERT_KEYWORDS.some((keyword) => upper.includes(keyword))) {
    return { tier: "critical", text: message };
  }

  // Check for audio events (ML-detected sounds that aren't critical)
  if (upper.includes("AUDIO:")) {
    return { tier: "audio", text: message };
  }

  // Check for "no activity" messages
  if (upper.includes("NO NEW ACTIVITY") || upper.includes("NO ACTIVITY") || /^\d+:\d+-\d+:\d+\s+NO/i.test(message)) {
    return { tier: "no_activity", text: message };
  }

  return { tier: "action", text: message };
}

function normalizeEntryTier(entry: LogEntry): LogEntry {
  if (entry.tier) return entry;
  if (entry.level === "warn") {
    return { ...entry, tier: "warning" };
  }
  return { ...entry, tier: "action" };
}

function isTimestampLine(line: string) {
  return /^\d{1,2}:\d{2}:\d{2}\s*(AM|PM)$/i.test(line.trim());
}

function sanitizeSegment(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !isTimestampLine(line));
  return lines.join(" ").replace(/\s+/g, " ").trim();
}

function parseTieredMessage(message: string): Array<ParsedSegment> {
  if (!message.trim()) return [];

  let working = message.trim();
  const headerMatch = working.match(/^\s*(scene|action|warning|critical)\b\s*/i);
  const headerTier = headerMatch
    ? (headerMatch[1].toLowerCase() as LogTier)
    : null;
  if (headerMatch) {
    working = working.replace(headerMatch[0], "");
  }

  const tagRegex = /\[(scene|action|warning|critical)\]/gi;
  const matches = [...working.matchAll(tagRegex)];

  if (matches.length === 0) {
    const parsed = parseTierFromMessage(working);
    const cleaned = sanitizeSegment(parsed.text);
    if (!cleaned) return [];
    const upper = cleaned.toUpperCase();
    const tier =
      ALERT_KEYWORDS.some((keyword) => upper.includes(keyword)) && parsed.tier !== "critical"
        ? "critical"
        : parsed.tier;
    return [{ tier, text: cleaned }];
  }

  const segments: Array<ParsedSegment> = [];
  let startIndex = 0;
  let currentTier: LogTier = headerTier ?? "action";

  for (const match of matches) {
    const tagIndex = match.index ?? 0;
    if (tagIndex > startIndex) {
      const raw = working.slice(startIndex, tagIndex);
      const cleaned = sanitizeSegment(raw);
      if (cleaned) {
        const upper = cleaned.toUpperCase();
        const tier = ALERT_KEYWORDS.some((keyword) => upper.includes(keyword))
          ? "critical"
          : currentTier;
        segments.push({ tier, text: cleaned });
      }
    }
    currentTier = match[1].toLowerCase() as LogTier;
    startIndex = tagIndex + match[0].length;
  }

  const tail = sanitizeSegment(working.slice(startIndex));
  if (tail) {
    const upper = tail.toUpperCase();
    const tier = ALERT_KEYWORDS.some((keyword) => upper.includes(keyword))
      ? "critical"
      : currentTier;
    segments.push({ tier, text: tail });
  }

  return segments;
}

function mapKindToTier(kind?: string): LogTier | null {
  if (!kind) return null;
  const normalized = kind.toLowerCase();
  if (normalized === "scene") return "scene";
  if (normalized === "action") return "action";
  if (normalized === "warning") return "warning";
  if (normalized === "critical") return "critical";
  if (normalized === "transcript") return "transcription";
  if (normalized === "audio") return "audio";
  if (normalized === "no_activity") return "no_activity";
  if (normalized === "status") return "action";
  return null;
}

function payloadToEntries(payload: { kind?: string; text?: string }): ParsedSegment[] {
  if (!payload.text) return [];

  // Always check for critical keywords first - they override any tier
  const upper = payload.text.toUpperCase();
  if (ALERT_KEYWORDS.some((keyword) => upper.includes(keyword))) {
    return [{ tier: "critical" as LogTier, text: payload.text }];
  }

  const tier = mapKindToTier(payload.kind);
  if (tier) {
    return [
      {
        tier,
        text: payload.text,
        sendToLiveKit: payload.kind?.toLowerCase() !== "status",
      },
    ];
  }
  return parseTieredMessage(payload.text);
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<PublishState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [allEvents, setAllEvents] = useState<LogEntry[]>([]);
  const [videoTime, setVideoTime] = useState(0);
  const [livekitUrl, setLivekitUrl] = useState(
    () => process.env.NEXT_PUBLIC_LIVEKIT_URL ?? ""
  );
  const [livekitToken, setLivekitToken] = useState<string>("");
  const [roomName, setRoomName] = useState(
    () => process.env.NEXT_PUBLIC_LIVEKIT_ROOM ?? ""
  );
  const [participantName, setParticipantName] = useState<string>("");
  const [livekitStatus, setLivekitStatus] =
    useState<LiveKitStatus>("disconnected");
  const [livekitError, setLivekitError] = useState<string | null>(null);
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>("idle");
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [analysisProvider, setAnalysisProvider] = useState<"local" | "overshoot">("local");
  const roomRef = useRef<Room | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastPreviewUrlRef = useRef<string | null>(null);
  const visionRef = useRef<OvershootVision | null>(null);
  const reviewWatchdogRef = useRef<number | null>(null);
  const reviewResultSeenRef = useRef(false);
  const lastTranscriptRef = useRef<{ text: string; time: number } | null>(null);
  const fallbackSourceRef = useRef<EventSource | null>(null);
  const fallbackActiveRef = useRef(false);
  const reviewEventTimersRef = useRef<number[]>([]);
  const audioSourceRef = useRef<EventSource | null>(null);
  const audioEventTimersRef = useRef<number[]>([]);
  const sentLiveKitIdsRef = useRef<Set<string>>(new Set());
  const publishedTracksRef = useRef<{
    video?: LocalVideoTrack;
    audio?: LocalAudioTrack;
  }>({});

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  // Compute displayed logs: only show events up to current video time, sorted chronologically (newest first)
  // Exclude transcription events - they appear in a separate section
  const displayedLogs = useMemo(() => {
    return allEvents
      .filter((e) => e.offsetSec <= videoTime && e.tier !== "transcription")
      .sort((a, b) => b.offsetSec - a.offsetSec); // Newest (higher time) first
  }, [allEvents, videoTime]);

  // Compute displayed transcripts: transcription events up to current video time
  const displayedTranscripts = useMemo(() => {
    return allEvents
      .filter((e) => e.offsetSec <= videoTime && e.tier === "transcription")
      .sort((a, b) => b.offsetSec - a.offsetSec); // Newest first
  }, [allEvents, videoTime]);

  const flushLiveKitText = useCallback(
    (currentTime: number) => {
      if (livekitStatus !== "connected") return;
      const alreadySent = sentLiveKitIdsRef.current;
      const pending = allEvents
        .filter((entry) => entry.offsetSec <= currentTime && entry.tier !== "transcription")
        .filter((entry) => entry.sendToLiveKit !== false)
        .filter((entry) => !alreadySent.has(entry.id));

      if (pending.length === 0) return;

      pending
        .slice()
        .sort((a, b) => a.offsetSec - b.offsetSec)
        .forEach((entry) => {
          alreadySent.add(entry.id);
          void sendTextToLiveKit(entry.message);
        });
    },
    [allEvents, livekitStatus]
  );

  // Handle video time updates (for seeking and playback)
  const handleVideoTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      const currentTime = video.currentTime;
      setVideoTime(currentTime);
      flushLiveKitText(currentTime);
    }
  }, [flushLiveKitText]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (roomRef.current) {
        cleanupLiveKitTracks(roomRef.current);
        roomRef.current.disconnect();
        roomRef.current = null;
      }
      stopReviewStream({ silent: true });
      stopAudioDetection({ silent: true });
    };
  }, []);

  useEffect(() => {
    if (livekitStatus !== "connected") return;
    if (!previewUrl) return;
    if (lastPreviewUrlRef.current === previewUrl) return;
    const room = roomRef.current;
    const videoElement = videoRef.current;
    if (!room || !videoElement) return;
    lastPreviewUrlRef.current = previewUrl;
    void publishFromVideoElement(videoElement, room).catch((err) => {
      setLivekitStatus("error");
      setLivekitError(
        err instanceof Error ? err.message : "Failed to publish track."
      );
    });
  }, [previewUrl, livekitStatus]);

  useEffect(() => {
    if (!file) {
      setAllEvents([]);
      setVideoTime(0);
      sentLiveKitIdsRef.current.clear();
      stopReviewStream();
      stopAudioDetection({ silent: true });
      stopFallbackReviewStream({ silent: true });
      setReviewStatus("idle");
      setReviewError(null);
    }
  }, [file]);

  useEffect(() => {
    flushLiveKitText(videoTime);
  }, [videoTime, allEvents, livekitStatus, flushLiveKitText]);

  function cleanupLiveKitTracks(room?: Room | null) {
    const activeRoom = room ?? roomRef.current;
    const { video, audio } = publishedTracksRef.current;
    if (video) {
      activeRoom?.localParticipant.unpublishTrack(video);
      video.stop();
      publishedTracksRef.current.video = undefined;
    }
    if (audio) {
      activeRoom?.localParticipant.unpublishTrack(audio);
      audio.stop();
      publishedTracksRef.current.audio = undefined;
    }
  }

  function getCaptureStream(videoElement: HTMLVideoElement) {
    const elementWithCapture = videoElement as HTMLVideoElement & {
      captureStream?: () => MediaStream;
      mozCaptureStream?: () => MediaStream;
    };
    return (
      elementWithCapture.captureStream?.() ??
      elementWithCapture.mozCaptureStream?.()
    );
  }

  async function publishFromVideoElement(
    videoElement: HTMLVideoElement,
    room: Room
  ) {
    cleanupLiveKitTracks(room);
    await ensureVideoReady(videoElement);
    const stream = getCaptureStream(videoElement);
    if (!stream) {
      throw new Error("Your browser doesn't support captureStream.");
    }
    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) {
      throw new Error("No video track found in the selected file.");
    }
    const localVideoTrack = new LocalVideoTrack(videoTrack);
    publishedTracksRef.current.video = localVideoTrack;
    await room.localParticipant.publishTrack(localVideoTrack, {
      source: Track.Source.Camera,
    });

    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      const localAudioTrack = new LocalAudioTrack(audioTrack);
      publishedTracksRef.current.audio = localAudioTrack;
      await room.localParticipant.publishTrack(localAudioTrack, {
        source: Track.Source.Microphone,
      });
    }
  }

  async function connectLiveKit() {
    setLivekitError(null);
    let url = livekitUrl;
    let token = livekitToken;
    if (!url || !token) {
      const details = await fetchSandboxConnectionDetails();
      if (!details) {
        return;
      }
      url = details.serverUrl;
      token = details.participantToken;
      setLivekitUrl(url);
      setLivekitToken(token);
      setRoomName(details.roomName);
      setParticipantName(details.participantName);
    }
    const videoElement = videoRef.current;
    if (!videoElement || !previewUrl) {
      setLivekitStatus("error");
      setLivekitError("Select a video file before streaming.");
      return;
    }
    setLivekitStatus("connecting");

    const room = new Room();
    roomRef.current = room;
    room.on(RoomEvent.Disconnected, () => {
      cleanupLiveKitTracks(room);
      roomRef.current = null;
      setLivekitStatus("disconnected");
    });
    room.on(RoomEvent.TranscriptionReceived, (segments, participant) => {
      const text = Array.isArray(segments)
        ? segments.map((segment) => segment.text).join(" ").trim()
        : "";
      if (!text) return;
      const now = Date.now();
      const last = lastTranscriptRef.current;
      if (last && last.text === text && now - last.time < 2000) {
        return;
      }
      lastTranscriptRef.current = { text, time: now };
      const currentTime = videoRef.current?.currentTime ?? 0;
      const entry: LogEntry = {
        id: crypto.randomUUID(),
        message: text,
        level: "info",
        timestamp: formatVideoTime(currentTime),
        tier: "transcription",
        offsetSec: currentTime,
      };
      setAllEvents((current) => [entry, ...current]);
    });

    try {
      if (!url || !token) {
        throw new Error("LiveKit credentials are unavailable.");
      }
      await room.connect(url, token);
      lastPreviewUrlRef.current = previewUrl;
      await publishFromVideoElement(videoElement, room);
      setLivekitStatus("connected");
    } catch (err) {
      cleanupLiveKitTracks(room);
      room.disconnect();
      roomRef.current = null;
      setLivekitStatus("error");
      setLivekitError(
        err instanceof Error ? err.message : "Failed to connect to LiveKit."
      );
    }
  }

  async function fetchSandboxConnectionDetails() {
    setLivekitError(null);
    try {
      const response = await fetch("/api/livekit-sandbox/connection-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          roomName ? { room_name: roomName } : {}
        ),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(
          body.error || "Unable to fetch LiveKit sandbox credentials."
        );
      }

      const json = (await response.json()) as SandboxConnectionDetails;
      return json;
    } catch (err) {
      setLivekitStatus("error");
      setLivekitError(
        err instanceof Error
          ? err.message
          : "Unable to fetch LiveKit sandbox credentials."
      );
      return null;
    }
  }

  async function startReviewStream() {
    if (!file) {
      setReviewStatus("error");
      setReviewError("Select a video file before starting analysis.");
      return;
    }
    if (reviewStatus === "connecting" || reviewStatus === "streaming") {
      return;
    }
    if (!HAS_OVERSHOOT_KEY) {
      setReviewStatus("error");
      setReviewError("Missing Overshoot API key.");
      return;
    }
    setReviewError(null);
    setReviewStatus("connecting");
    reviewResultSeenRef.current = false;
    const currentVideoTime = videoRef.current?.currentTime ?? 0;
    const videoTimeStr = formatVideoTime(currentVideoTime);
    setAllEvents((current) => [
      {
        id: crypto.randomUUID(),
        message: "Starting Overshoot video analysis...",
        level: "info",
        timestamp: videoTimeStr,
        tier: "action",
        offsetSec: 0, // Status messages show immediately
        sendToLiveKit: false,
      },
      {
        id: crypto.randomUUID(),
        message: `Using Overshoot endpoint: ${OVERSHOOT_API_URL}`,
        level: "info",
        timestamp: videoTimeStr,
        tier: "action",
        offsetSec: 0,
        sendToLiveKit: false,
      },
      {
        id: crypto.randomUUID(),
        message: "Overshoot API key detected.",
        level: "info",
        timestamp: videoTimeStr,
        tier: "action",
        offsetSec: 0,
        sendToLiveKit: false,
      },
      ...current,
    ]);

    try {
      const vision = new RealtimeVision({
        apiUrl: OVERSHOOT_API_URL,
        apiKey: OVERSHOOT_API_KEY,
        // model: "Qwen/Qwen3-VL-8B-Instruct",
        prompt:
          "Prefix each response with one of: [Scene], [Action], [Warning], [Critical]. "
          + "Use [Critical] for alerts (weapon, taser, shots fired, person down, camera blocked). "
          + "Use [Scene] for environment/scene description. "
          + "Use [Action] for observable actions. "
          + "Use [Warning] for uncertainty or obstructions. "
          + "Then describe the visible actions, environment, and notable changes.",
        processing: {
          clip_length_seconds: 5,
          delay_seconds: 5,
          fps: 30,
          sampling_ratio: 0.1,
        },
        source: { type: "video", file },
        onResult: (result: OvershootResult) => {
          reviewResultSeenRef.current = true;
          if (reviewWatchdogRef.current) {
            window.clearTimeout(reviewWatchdogRef.current);
            reviewWatchdogRef.current = null;
          }
          console.log("Overshoot result:", result);
          const segments = parseTieredMessage(result.result);
          if (segments.length === 0) {
            return;
          }
          const currentTime = videoRef.current?.currentTime ?? 0;
          const timestamp = formatVideoTime(currentTime);
          const entries = segments.map((segment) => {
            const level: LogEntry["level"] =
              segment.tier === "warning" ? "warn" : "info";
            return {
              id: crypto.randomUUID(),
              message: segment.text,
              level,
              timestamp,
              tier: segment.tier,
              offsetSec: currentTime,
            };
          });
          setAllEvents((current) => [...entries, ...current]);
        },
      }) as OvershootVision;

      visionRef.current = vision;
      setAllEvents((current) => [
        {
          id: crypto.randomUUID(),
          message: "Overshoot session initialized.",
          level: "info",
          timestamp: formatVideoTime(videoRef.current?.currentTime ?? 0),
          tier: "action",
          offsetSec: 0,
          sendToLiveKit: false,
        },
        ...current,
      ]);
      if (vision.start) {
        await vision.start();
      }
      setReviewStatus("streaming");
      setAllEvents((current) => [
        {
          id: crypto.randomUUID(),
          message: "Overshoot session started. Awaiting first result...",
          level: "info",
          timestamp: formatVideoTime(videoRef.current?.currentTime ?? 0),
          tier: "action",
          offsetSec: 0,
          sendToLiveKit: false,
        },
        ...current,
      ]);
      if (reviewWatchdogRef.current) {
        window.clearTimeout(reviewWatchdogRef.current);
      }
      reviewWatchdogRef.current = window.setTimeout(() => {
        if (reviewResultSeenRef.current) return;
        setAllEvents((current) => [
          {
            id: crypto.randomUUID(),
            message:
              "No Overshoot results yet. Check API key, network, and console.",
            level: "warn",
            timestamp: formatVideoTime(videoRef.current?.currentTime ?? 0),
            tier: "warning",
            offsetSec: 0,
            sendToLiveKit: false,
          },
          ...current,
        ]);
        void startFallbackReviewStream({ isFallback: true });
      }, 7000);
    } catch (err) {
      setReviewStatus("error");
      setReviewError(
        err instanceof Error ? err.message : "Failed to start Overshoot stream."
      );
      void startFallbackReviewStream({ isFallback: true });
    }
  }

  function stopReviewStream(options?: { silent?: boolean }) {
    if (reviewWatchdogRef.current) {
      window.clearTimeout(reviewWatchdogRef.current);
      reviewWatchdogRef.current = null;
    }
    stopFallbackReviewStream({ silent: true });
    const vision = visionRef.current;
    if (vision?.stop) vision.stop();
    if (vision?.close) vision.close();
    if (vision?.destroy) vision.destroy();
    visionRef.current = null;
    if (reviewStatus !== "idle") {
      setReviewStatus("idle");
      if (!options?.silent) {
        setAllEvents((current) => [
          {
            id: crypto.randomUUID(),
            message: "Overshoot video analysis stopped.",
            level: "info",
            timestamp: formatVideoTime(videoRef.current?.currentTime ?? 0),
            tier: "action",
            offsetSec: 0,
              sendToLiveKit: false,
          },
          ...current,
        ]);
      }
    }
  }

  async function sendTextToLiveKit(text: string) {
    const room = roomRef.current;
    if (!room || !text.trim()) return;
    try {
      await room.localParticipant.sendText(text, {
        topic: LIVEKIT_TEXT_TOPIC,
      });
    } catch (err) {
      setAllEvents((current) => [
        {
          id: crypto.randomUUID(),
          message: "Failed to send description to LiveKit.",
          level: "warn",
          timestamp: formatVideoTime(videoRef.current?.currentTime ?? 0),
          tier: "warning",
          offsetSec: 0,
          sendToLiveKit: false,
        },
        ...current,
      ]);
    }
  }

  async function startFallbackReviewStream(options?: { isFallback?: boolean }) {
    if (!file) return;
    if (fallbackActiveRef.current) return;
    fallbackActiveRef.current = true;
    setReviewStatus("connecting");
    const videoTimeStr = formatVideoTime(videoRef.current?.currentTime ?? 0);
    const message = options?.isFallback
      ? "Overshoot unavailable, switching to local server analysis..."
      : "Starting local server analysis (port 8000)...";
    setAllEvents((current) => [
      {
        id: crypto.randomUUID(),
        message,
        level: "info",
        timestamp: videoTimeStr,
        tier: "action",
        offsetSec: 0,
        sendToLiveKit: false,
      },
      ...current,
    ]);
    try {
      const formData = new FormData();
      formData.append("file", file, file.name);
      const response = await fetch(`${REVIEW_FALLBACK_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to start server analysis.");
      }
      const json = (await response.json()) as {
        video_id: string;
        stream_url?: string;
      };
      if (!json.video_id || !json.stream_url) {
        throw new Error("Server did not return a stream URL.");
      }
      const streamUrl = json.stream_url.startsWith("http")
        ? json.stream_url
        : `${REVIEW_FALLBACK_URL}${json.stream_url}`;
      const source = new EventSource(streamUrl);
      fallbackSourceRef.current = source;
      setReviewStatus("streaming");

      source.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as {
            offset_sec?: number;
            text?: string;
            kind?: string;
            timestamp?: string;
          };
          if (!payload.text) return;
          const segments = payloadToEntries(payload);
          if (segments.length === 0) return;
          const offsetSec = payload.offset_sec ?? 0;
          const timestamp = formatVideoTime(offsetSec);
          // Store events immediately - displayedLogs will filter based on video time
          const entries = segments.map((segment) => {
            const level: LogEntry["level"] =
              segment.tier === "warning" ? "warn" : "info";
            return {
              id: crypto.randomUUID(),
              message: segment.text,
              level,
              timestamp,
              tier: segment.tier,
              offsetSec,
              sendToLiveKit: segment.sendToLiveKit,
            };
          });
          setAllEvents((current) => [...entries, ...current]);
        } catch (err) {
          setAllEvents((current) => [
            {
              id: crypto.randomUUID(),
              message: "Failed to parse server stream event.",
              level: "warn",
              timestamp: formatVideoTime(videoRef.current?.currentTime ?? 0),
              tier: "warning",
              offsetSec: videoRef.current?.currentTime ?? 0,
            sendToLiveKit: false,
            },
            ...current,
          ]);
        }
      };

      source.onerror = () => {
        stopFallbackReviewStream({ silent: true });
        setAllEvents((current) => [
          {
            id: crypto.randomUUID(),
            message: `Server analysis stream disconnected (${streamUrl}).`,
            level: "warn",
            timestamp: formatVideoTime(videoRef.current?.currentTime ?? 0),
            tier: "warning",
            offsetSec: 0,
            sendToLiveKit: false,
          },
          ...current,
        ]);
      };
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to start server analysis.";
      setAllEvents((current) => [
        {
          id: crypto.randomUUID(),
          message: `Server analysis error (${REVIEW_FALLBACK_URL}/upload): ${message}`,
          level: "warn",
          timestamp: formatVideoTime(videoRef.current?.currentTime ?? 0),
          tier: "warning",
          offsetSec: 0,
          sendToLiveKit: false,
        },
        ...current,
      ]);
    }
  }

  function stopFallbackReviewStream(options?: { silent?: boolean }) {
    fallbackActiveRef.current = false;
    if (fallbackSourceRef.current) {
      fallbackSourceRef.current.close();
      fallbackSourceRef.current = null;
    }
    if (reviewEventTimersRef.current.length > 0) {
      reviewEventTimersRef.current.forEach((timerId) => {
        window.clearTimeout(timerId);
      });
      reviewEventTimersRef.current = [];
    }
    if (!options?.silent) {
      setAllEvents((current) => [
        {
          id: crypto.randomUUID(),
          message: "Server analysis stopped.",
          level: "info",
          timestamp: formatVideoTime(videoRef.current?.currentTime ?? 0),
          tier: "action",
          offsetSec: 0,
          sendToLiveKit: false,
        },
        ...current,
      ]);
    }
  }

  async function startAudioDetection() {
    if (!file) {
      return;
    }
    if (audioSourceRef.current) {
      return;
    }
    setAllEvents((current) => [
      {
        id: crypto.randomUUID(),
        message: "Starting audio gunshot detection...",
        level: "info",
        timestamp: formatVideoTime(videoRef.current?.currentTime ?? 0),
        tier: "action",
        offsetSec: 0,
        sendToLiveKit: false,
      },
      ...current,
    ]);

    try {
      const formData = new FormData();
      formData.append("file", file, file.name);
      const response = await fetch(`${AUDIO_DETECT_URL}/audio/upload`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to start audio detection.");
      }
      const json = (await response.json()) as {
        video_id: string;
        stream_url?: string;
      };
      if (!json.video_id || !json.stream_url) {
        throw new Error("Audio detection server did not return a stream URL.");
      }

      const streamUrl = json.stream_url.startsWith("http")
        ? json.stream_url
        : `${AUDIO_DETECT_URL}${json.stream_url}`;
      const source = new EventSource(streamUrl);
      audioSourceRef.current = source;

      source.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as {
            offset_sec?: number;
            kind?: string;
            text?: string;
            timestamp?: string;
          };
          const segments = payloadToEntries(payload);
          if (segments.length === 0) return;
          const offsetSec = payload.offset_sec ?? 0;
          const timestamp = formatVideoTime(offsetSec);
          // Store events immediately - displayedLogs will filter based on video time
          const entries = segments.map((segment) => {
            const level: LogEntry["level"] =
              segment.tier === "warning" ? "warn" : "info";
            return {
              id: crypto.randomUUID(),
              message: segment.text,
              level,
              timestamp,
              tier: segment.tier,
              offsetSec,
              sendToLiveKit: segment.sendToLiveKit,
            };
          });
          setAllEvents((current) => [...entries, ...current]);
        } catch (err) {
          setAllEvents((current) => [
            {
              id: crypto.randomUUID(),
              message: "Failed to parse audio detection event.",
              level: "warn",
              timestamp: formatVideoTime(videoRef.current?.currentTime ?? 0),
              tier: "warning",
              offsetSec: videoRef.current?.currentTime ?? 0,
            sendToLiveKit: false,
            },
            ...current,
          ]);
        }
      };

      source.onerror = () => {
        stopAudioDetection({ silent: true });
        setAllEvents((current) => [
          {
            id: crypto.randomUUID(),
            message: `Audio detection stream disconnected (${streamUrl}).`,
            level: "warn",
            timestamp: formatVideoTime(videoRef.current?.currentTime ?? 0),
            offsetSec: videoRef.current?.currentTime ?? 0,
            tier: "warning",
            sendToLiveKit: false,
          },
          ...current,
        ]);
      };
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to start audio detection.";
      setAllEvents((current) => [
        {
          id: crypto.randomUUID(),
          message: `Audio detection error (${AUDIO_DETECT_URL}/audio/upload): ${message}`,
          level: "warn",
          timestamp: formatVideoTime(videoRef.current?.currentTime ?? 0),
          tier: "warning",
          offsetSec: 0,
          sendToLiveKit: false,
        },
        ...current,
      ]);
    }
  }

  function stopAudioDetection(options?: { silent?: boolean }) {
    if (audioSourceRef.current) {
      audioSourceRef.current.close();
      audioSourceRef.current = null;
    }
    if (audioEventTimersRef.current.length > 0) {
      audioEventTimersRef.current.forEach((timerId) => {
        window.clearTimeout(timerId);
      });
      audioEventTimersRef.current = [];
    }
    if (!options?.silent) {
      setAllEvents((current) => [
        {
          id: crypto.randomUUID(),
          message: "Audio gunshot detection stopped.",
          level: "info",
          timestamp: formatVideoTime(videoRef.current?.currentTime ?? 0),
          tier: "action",
          offsetSec: 0,
          sendToLiveKit: false,
        },
        ...current,
      ]);
    }
  }

  async function disconnectLiveKit() {
    const room = roomRef.current;
    if (!room) {
      setLivekitStatus("disconnected");
      return;
    }
    cleanupLiveKitTracks(room);
    room.disconnect();
    roomRef.current = null;
    setLivekitStatus("disconnected");
  }

  function handleLiveKitToggle() {
    if (livekitStatus === "connected" || livekitStatus === "connecting") {
      void disconnectLiveKit();
      stopReviewStream();
      stopFallbackReviewStream();
      stopAudioDetection();
      return;
    }
    // Start analysis based on selected provider
    if (analysisProvider === "local") {
      void startFallbackReviewStream();
    } else {
      void startReviewStream();
    }
    void startAudioDetection();
    void connectLiveKit();
  }

  async function ensureVideoReady(videoElement: HTMLVideoElement) {
    if (videoElement.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      await new Promise<void>((resolve) => {
        const handleReady = () => {
          videoElement.removeEventListener("loadeddata", handleReady);
          videoElement.removeEventListener("canplay", handleReady);
          resolve();
        };
        videoElement.addEventListener("loadeddata", handleReady, { once: true });
        videoElement.addEventListener("canplay", handleReady, { once: true });
      });
    }
    if (videoElement.paused) {
      try {
        await videoElement.play();
      } catch {
        // Ignore autoplay restrictions; user can press play manually.
      }
    }
  }

  async function handlePublish() {
    if (!file) return;
    setStatus("uploading");
    setError(null);

    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
      });

      const response = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blobUrl: blob.url,
          filename: file.name,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Publish failed");
      }

      const json = (await response.json()) as { receiptId: string };
      setStatus("success");
      window.location.href = `/receipt/${json.receiptId}`;
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Publish failed");
    }
  }

  return (
    <div className="relative min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 pb-8 pt-5">
        <header className="flex flex-col gap-4">
          <nav className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 text-lg font-semibold text-slate-100">
                C
              </span>
              <div className="text-sm">
                <p className="font-semibold text-slate-100">Clearance</p>
                <p className="text-xs text-slate-500">
                  Tamper-evident video receipts
                </p>
              </div>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <span className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">
                Simulate
              </span>
              <span className="text-slate-600">Receipt</span>
              <span className="text-slate-600">Verify</span>
            </div>
          </nav>
        </header>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/40">
          <div className="space-y-6">
            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Checklist
              </p>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <li className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-2">
                  <span>Local preview</span>
                  <span className="text-emerald-300">Ready</span>
                </li>
                <li className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-2">
                  <span>SHA-256 digest</span>
                  <span className="text-slate-500">Pending</span>
                </li>
                <li className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-2">
                  <span>IPFS commit</span>
                  <span className="text-slate-500">Pending</span>
                </li>
                <li className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-2">
                  <span>Solana receipt</span>
                  <span className="text-slate-500">Pending</span>
                </li>
                <li className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-2">
                  <span>LiveKit stream</span>
                  <span
                    className={
                      livekitStatus === "connected"
                        ? "text-emerald-300"
                        : livekitStatus === "connecting"
                          ? "text-sky-300"
                          : livekitStatus === "error"
                            ? "text-rose-300"
                            : "text-slate-500"
                    }
                  >
                    {livekitStatus === "connected"
                      ? "Streaming"
                      : livekitStatus === "connecting"
                        ? "Connecting"
                        : livekitStatus === "error"
                          ? "Error"
                          : "Idle"}
                  </span>
                </li>
              </ul>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(320px,1fr)_minmax(340px,1fr)] lg:items-start">
              {/* Left: Video Panel */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="relative cursor-pointer">
                    <span className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-200 transition hover:bg-slate-700">
                      Choose File
                    </span>
                    <input
                      className="absolute inset-0 cursor-pointer opacity-0"
                      type="file"
                      accept="video/*"
                      onChange={(event) => {
                        const selected = event.target.files?.[0] ?? null;
                        setFile(selected);
                      }}
                    />
                  </label>
                  <span className="text-sm text-slate-400">
                    {file ? file.name : "No file selected"}
                  </span>
                  <button
                    className="ml-auto inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                    onClick={handleLiveKitToggle}
                    disabled={
                      !file ||
                      livekitStatus === "connecting" ||
                      reviewStatus === "connecting"
                    }
                  >
                    {livekitStatus === "connected"
                      ? "Stop Stream"
                      : livekitStatus === "connecting"
                        ? "Connecting..."
                        : "Upload & Analyze"}
                  </button>
                </div>

                {/* Analysis Provider Toggle */}
                <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                  <span className="text-xs text-slate-400">Analysis:</span>
                  <button
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      analysisProvider === "local"
                        ? "bg-sky-500 text-slate-950"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                    onClick={() => setAnalysisProvider("local")}
                    disabled={livekitStatus === "connected"}
                  >
                    Local Server (8000)
                  </button>
                  <button
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      analysisProvider === "overshoot"
                        ? "bg-sky-500 text-slate-950"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                    onClick={() => setAnalysisProvider("overshoot")}
                    disabled={livekitStatus === "connected"}
                  >
                    Overshoot API
                  </button>
                </div>

                {livekitError ? (
                  <p className="text-xs text-rose-400">{livekitError}</p>
                ) : null}
                {reviewError ? (
                  <p className="text-xs text-rose-400">{reviewError}</p>
                ) : null}

                {file ? (
                  <div className="text-xs text-slate-500">
                    <p>Filename: {file.name}</p>
                    <p>Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                ) : null}

                <div className="overflow-hidden rounded-xl border border-slate-800 bg-black/80">
                  {previewUrl ? (
                    <video
                      ref={videoRef}
                      className="w-full object-contain"
                      controls
                      loop
                      src={previewUrl}
                      onTimeUpdate={handleVideoTimeUpdate}
                      onSeeked={handleVideoTimeUpdate}
                      onEnded={(event) => {
                        const element = event.currentTarget;
                        element.currentTime = 0;
                        void element.play().catch(() => {});
                        if (livekitStatus === "connected" && roomRef.current) {
                          void publishFromVideoElement(
                            element,
                            roomRef.current
                          ).catch((err) => {
                            setLivekitStatus("error");
                            setLivekitError(
                              err instanceof Error
                                ? err.message
                                : "Failed to publish track."
                            );
                          });
                        }
                      }}
                    />
                  ) : (
                    <div className="flex h-64 items-center justify-center text-sm text-slate-600">
                      Upload an .mp4 to simulate a live body cam.
                    </div>
                  )}
                </div>

                {/* Transcript Section */}
                {displayedTranscripts.length > 0 && (
                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                        <span className="text-xs font-medium text-slate-300">Transcript</span>
                      </div>
                      <span className="text-xs text-slate-500">{displayedTranscripts.length} segments</span>
                    </div>
                    <div className="max-h-32 overflow-y-auto space-y-1.5">
                      {displayedTranscripts.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex gap-2 text-[13px]"
                        >
                          <span className="text-slate-500 shrink-0">{entry.timestamp}</span>
                          <span className="text-emerald-200/90">{entry.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                    onClick={handlePublish}
                    disabled={!file || status === "uploading"}
                  >
                    {status === "uploading" ? "Publishing..." : "Publish"}
                  </button>
                  {status === "error" && error ? (
                    <p className="text-sm text-rose-400">{error}</p>
                  ) : null}
                </div>
              </div>

              {/* Right: Events Panel */}
              <aside className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                {/* Legend Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                      Critical
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      Warning
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                      Audio
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                      Action
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                      Scene
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {displayedLogs.length}/{allEvents.length} events
                  </span>
                </div>

                {/* Events List */}
                <div className="flex flex-col gap-2.5 max-h-[70vh] overflow-y-auto">
                  {displayedLogs.length === 0 ? (
                    <p className="text-sm text-slate-600 py-8 text-center">No events yet. Upload a video and start analysis.</p>
                  ) : (
                    displayedLogs.map((entry) => {
                      const normalized = normalizeEntryTier(entry);
                      const tier = normalized.tier ?? "action";
                      const isNoActivity = tier === "no_activity";
                      const isCritical = tier === "critical";
                      return (
                        <div
                          key={entry.id}
                          className={`rounded-lg border border-slate-800/60 px-3 py-2.5 text-[14px] leading-relaxed ${tierStyles[tier]} ${isCritical ? "animate-[alertPulse_0.8s_ease-in-out_3]" : ""}`}
                        >
                          {isNoActivity ? (
                            <span className="text-slate-400">{normalized.message}</span>
                          ) : (
                            <>
                              <div className="text-xs text-slate-400 mb-1">{entry.timestamp}</div>
                              <div className="text-slate-100">{normalized.message}</div>
                            </>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </aside>
            </div>
        </div>
        </section>
      </div>
    </div>
  );
}

