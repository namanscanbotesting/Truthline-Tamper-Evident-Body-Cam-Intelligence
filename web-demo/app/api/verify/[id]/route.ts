import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { fetchMemoForTransaction } from "@/lib/solana";
import { parseReceiptMemo } from "@/lib/memo";

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

  try {
    console.log("verify: receipt", {
      id: receipt.id,
      sha256Hex: receipt.sha256_hex,
      ipfsCid: receipt.ipfs_cid,
      bytes: receipt.bytes,
      solanaTxSig: receipt.solana_tx_sig,
    });
    const memo = await fetchMemoForTransaction(receipt.solana_tx_sig);
    console.log("verify: memo raw", memo ?? "null");
    const parsed = memo ? parseReceiptMemo(memo) : null;
    console.log("verify: memo parsed", parsed ?? "null");

    const dbMatchesChain =
      !!parsed &&
      parsed.receiptId === receipt.id &&
      parsed.sha256 === receipt.sha256_hex &&
      parsed.cid === receipt.ipfs_cid &&
      parsed.bytes === receipt.bytes;

    return NextResponse.json({
      dbMatchesChain,
      expected: {
        receiptId: receipt.id,
        sha256Hex: receipt.sha256_hex,
        ipfsCid: receipt.ipfs_cid,
        bytes: receipt.bytes,
      },
      chain: parsed
        ? {
            receiptId: parsed.receiptId,
            sha256Hex: parsed.sha256,
            ipfsCid: parsed.cid,
            bytes: parsed.bytes,
          }
        : null,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

