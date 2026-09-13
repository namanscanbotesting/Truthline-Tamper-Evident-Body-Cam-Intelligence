import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data: receipt, error } = await supabase
    .from("receipts")
    .select(
      "id, sha256_hex, ipfs_cid, solana_tx_sig, bytes, filename, created_at"
    )
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!receipt) {
    return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
  }

  return NextResponse.json({
    receiptId: receipt.id,
    sha256Hex: receipt.sha256_hex,
    ipfsCid: receipt.ipfs_cid,
    solanaTxSig: receipt.solana_tx_sig,
    bytes: receipt.bytes,
    filename: receipt.filename,
    createdAt: new Date(receipt.created_at).toISOString(),
  });
}

