import { supabase } from "@/lib/supabase";
import { Hash, Link2, ExternalLink, FileText, CheckCircle2 } from "lucide-react";

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: receipt, error } = await supabase
    .from("receipts")
    .select("id, sha256_hex, ipfs_cid, solana_tx_sig, bytes, filename, created_at")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  const cluster = process.env.NEXT_PUBLIC_SOLANA_CLUSTER ?? "devnet";

  if (!receipt) {
    return (
      <div className="px-6 pb-16 pt-12">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-700/50 bg-[#162032] p-8">
          <h1 className="text-3xl font-semibold text-white">
            Receipt not found
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            The receipt ID does not exist or has been removed.
          </p>
          <a
            className="mt-6 inline-flex w-fit items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300 transition hover:border-slate-500 hover:text-white"
            href="/upload"
          >
            Back to simulation
          </a>
        </div>
      </div>
    );
  }

  const solanaLink = `https://explorer.solana.com/tx/${receipt.solana_tx_sig}?cluster=${cluster}`;
  const ipfsLink = `https://ipfs.io/ipfs/${receipt.ipfs_cid}`;

  return (
    <div className="px-6 pb-16 pt-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="space-y-6">
          <nav className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 bg-[#0c1424] text-lg font-semibold text-slate-100">
                T
              </span>
              <div className="text-sm">
                <p className="font-semibold text-slate-100">Truthline</p>
                <p className="text-xs text-slate-500">
                  Tamper-evident video receipts
                </p>
              </div>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <a className="text-slate-500 hover:text-slate-200" href="/upload">
                Simulate
              </a>
              <span className="rounded-full border border-slate-800 bg-[#0c1424] px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">
                Receipt
              </span>
              <a
                className="text-slate-500 hover:text-slate-200"
                href={`/verify/${receipt.id}`}
              >
                Verify
              </a>
            </div>
          </nav>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                Receipt
              </p>
              <h1 className="text-4xl font-semibold text-white">
                Publication confirmed.
              </h1>
              <p className="max-w-xl text-base text-slate-400">
                Share this page to prove the video and metadata were anchored on
                Solana.
              </p>
            </div>
            <div className="receipt-terminal rounded-2xl p-5">
              <p className="text-sm text-slate-300">Receipt ID</p>
              <p className="mt-2 break-all text-sm text-white font-mono">{receipt.id}</p>
              <p className="mt-2 text-xs text-slate-500">
                Generated {new Date(receipt.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </header>

        {/* Receipt details - Terminal treatment */}
        <section className="rounded-3xl border border-slate-700/50 bg-[#162032] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Receipt Details
            </p>
          </div>
          
          <dl className="grid gap-4 text-sm text-slate-300 md:grid-cols-2">
            <div className="receipt-terminal rounded-2xl p-4">
              <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                <Hash className="w-3 h-3" />
                SHA-256
              </dt>
              <dd className="mt-2 break-all text-slate-200 hash-value">
                {receipt.sha256_hex}
              </dd>
            </div>
            
            <div className="receipt-terminal rounded-2xl p-4">
              <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                <Link2 className="w-3 h-3" />
                IPFS CID
              </dt>
              <dd className="mt-2 break-all">
                <a
                  className="text-sky-400 hover:text-sky-300 font-mono text-xs"
                  href={ipfsLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  {receipt.ipfs_cid}
                </a>
              </dd>
            </div>
            
            <div className="receipt-terminal rounded-2xl p-4">
              <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                <ExternalLink className="w-3 h-3" />
                Solana Tx
              </dt>
              <dd className="mt-2 break-all">
                <a
                  className="text-sky-400 hover:text-sky-300 font-mono text-xs"
                  href={solanaLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  {receipt.solana_tx_sig}
                </a>
              </dd>
            </div>
            
            <div className="receipt-terminal rounded-2xl p-4">
              <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                <FileText className="w-3 h-3" />
                Asset
              </dt>
              <dd className="mt-2 space-y-1 text-slate-200 text-xs font-mono">
                <p>Bytes: {receipt.bytes.toLocaleString()}</p>
                <p>Filename: {receipt.filename ?? "\u2014"}</p>
              </dd>
            </div>
          </dl>
        </section>

        <div className="flex flex-wrap gap-3">
          <a
            className="inline-flex w-fit items-center justify-center rounded-full bg-sky-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-950 transition hover:bg-sky-400"
            href={`/verify/${receipt.id}`}
          >
            Verify this receipt
          </a>
          <a
            className="inline-flex w-fit items-center justify-center rounded-full border border-slate-700 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300 transition hover:border-slate-500 hover:text-white"
            href="/upload"
          >
            New simulation
          </a>
        </div>
      </div>
    </div>
  );
}
