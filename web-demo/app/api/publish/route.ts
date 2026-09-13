import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sha256HexFromBuffer } from "@/lib/hashing";
import { pinFileToIPFS } from "@/lib/pinata";
import { anchorMemo, assertSolanaReady } from "@/lib/solana";
import { buildReceiptMemo } from "@/lib/memo";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let file: File | null = null;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const formFile = formData.get("file");
    if (formFile instanceof File) {
      file = formFile;
    }
  } else {
    const body = (await request.json().catch(() => null)) as
      | { blobUrl?: string; filename?: string }
      | null;
    const blobUrl = body?.blobUrl;
    if (blobUrl) {
      const response = await fetch(blobUrl);
      if (!response.ok) {
        const errorBody = await response.text();
        return NextResponse.json(
          { error: `Blob fetch failed: ${response.status} ${errorBody}` },
          { status: 400 }
        );
      }
      const blob = await response.blob();
      const filename =
        typeof body?.filename === "string" && body.filename.trim().length > 0
          ? body.filename
          : "upload.bin";
      file = new File([blob], filename, {
        type: blob.type || "application/octet-stream",
      });
    }
  }

  if (!file) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const sha256Hex = sha256HexFromBuffer(arrayBuffer);
    const bytes = file.size;
    const filename = file.name || null;

    const { connection, keypair } = await assertSolanaReady();

    const ipfsCid = await pinFileToIPFS(file);

    const receiptId = crypto.randomUUID();
    const memoPayload = buildReceiptMemo({
      v: 1,
      app: "truthline",
      receiptId,
      alg: "sha256",
      sha256: sha256Hex,
      cid: ipfsCid,
      bytes,
    });

    const solanaTxSig = await anchorMemo(memoPayload, { connection, keypair });

    const { data: receipt, error } = await supabase
      .from("receipts")
      .insert({
        id: receiptId,
        sha256_hex: sha256Hex,
        ipfs_cid: ipfsCid,
        solana_tx_sig: solanaTxSig,
        bytes,
        filename,
      })
      .select(
        "id, sha256_hex, ipfs_cid, solana_tx_sig, bytes, filename, created_at"
      )
      .single();

    if (error || !receipt) {
      throw new Error(error?.message || "Failed to save receipt");
    }

    return NextResponse.json({
      receiptId: receipt.id,
      sha256Hex: receipt.sha256_hex,
      ipfsCid: receipt.ipfs_cid,
      solanaTxSig: receipt.solana_tx_sig,
      bytes: receipt.bytes,
      createdAt: new Date(receipt.created_at).toISOString(),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

