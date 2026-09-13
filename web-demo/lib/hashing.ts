import { createHash } from "crypto";

export function sha256HexFromBuffer(buffer: ArrayBuffer | Buffer): string {
  const nodeBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  return createHash("sha256").update(nodeBuffer).digest("hex");
}

