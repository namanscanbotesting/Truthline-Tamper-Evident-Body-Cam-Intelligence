export type ReceiptMemo = {
  v: 1;
  app: "clearance";
  receiptId: string;
  alg: "sha256";
  sha256: string;
  cid: string;
  bytes: number;
};

export type EventMemo = {
  v: 1;
  app: "clearance";
  type: "event";
  event: string;
  tag: string;
  occurredAt: string;
  room?: string;
  camera?: string;
  transcript?: string;
  source?: string;
};

export function buildReceiptMemo(payload: ReceiptMemo): string {
  return JSON.stringify(payload);
}

export function buildEventMemo(payload: EventMemo): string {
  return JSON.stringify(payload);
}

export function parseReceiptMemo(memo: string): ReceiptMemo | null {
  try {
    const parsed = JSON.parse(memo) as ReceiptMemo;
    if (
      parsed?.v === 1 &&
      parsed?.app === "clearance" &&
      parsed?.alg === "sha256" &&
      typeof parsed.receiptId === "string" &&
      typeof parsed.sha256 === "string" &&
      typeof parsed.cid === "string" &&
      typeof parsed.bytes === "number"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

