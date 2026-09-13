"use client";

import { use, useState } from "react";

type ReceiptResponse = {
  receiptId: string;
  sha256Hex: string;
  ipfsCid: string;
  solanaTxSig: string;
  bytes: number;
  filename?: string | null;
  createdAt: string;
};

type VerifyResponse = {
  dbMatchesChain: boolean;
  expected: {
    receiptId: string;
    sha256Hex: string;
    ipfsCid: string;
    bytes: number;
  };
  chain: {
    receiptId: string;
    sha256Hex: string;
    ipfsCid: string;
    bytes: number;
  } | null;
};

function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

export default function VerifyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [file, setFile] = useState<File | null>(null);
  const [clientHash, setClientHash] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ReceiptResponse | null>(null);
  const [serverVerify, setServerVerify] = useState<VerifyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleVerify() {
    if (!file) return;
    setIsLoading(true);
    setError(null);
    setClientHash(null);
    setReceipt(null);
    setServerVerify(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const digest = await crypto.subtle.digest("SHA-256", arrayBuffer);
      const hashHex = bufferToHex(digest);
      setClientHash(hashHex);

      const receiptResponse = await fetch(`/api/receipt/${id}`);
      if (!receiptResponse.ok) {
        const body = await receiptResponse.json().catch(() => ({}));
        throw new Error(body.error || "Receipt lookup failed");
      }
      const receiptJson = (await receiptResponse.json()) as ReceiptResponse;
      setReceipt(receiptJson);

      const verifyResponse = await fetch(`/api/verify/${id}`);
      if (!verifyResponse.ok) {
        const body = await verifyResponse.json().catch(() => ({}));
        throw new Error(body.error || "Server verification failed");
      }
      const verifyJson = (await verifyResponse.json()) as VerifyResponse;
      setServerVerify(verifyJson);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsLoading(false);
    }
  }

  const matchesReceipt =
    clientHash && receipt ? clientHash === receipt.sha256Hex : null;

  return (
    <div className="px-6 pb-16 pt-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="space-y-6">
          <nav className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 text-lg font-semibold text-slate-100">
                C
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
              <a
                className="text-slate-500 hover:text-slate-200"
                href={`/receipt/${id}`}
              >
                Receipt
              </a>
              <span className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">
                Verify
              </span>
            </div>
          </nav>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                Verify
              </p>
              <h1 className="text-4xl font-semibold text-white">
                Validate a published receipt.
              </h1>
              <p className="max-w-xl text-base text-slate-400">
                Upload the original .mp4 to compare hashes and confirm the
                receipt anchored on-chain.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-sm text-slate-300">Receipt ID</p>
              <p className="mt-2 break-all text-sm text-white">{id}</p>
              <p className="mt-2 text-xs text-slate-500">
                Verification runs locally and against the chain.
              </p>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/40">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <label className="text-sm font-medium text-slate-300">
                  Upload the original .mp4 to verify
                </label>
                <input
                  className="cursor-pointer text-sm text-slate-400 file:mr-4 file:rounded-full file:border-0 file:bg-slate-800 file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.3em] file:text-slate-200 hover:file:bg-slate-700"
                  type="file"
                  onChange={(event) => {
                    setFile(event.target.files?.[0] ?? null);
                  }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                  onClick={handleVerify}
                  disabled={!file || isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </button>

                {error ? <p className="text-sm text-rose-400">{error}</p> : null}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Checks
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span>Client hash</span>
                  <span className="text-slate-500">
                    {clientHash ? "Ready" : "Waiting"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Receipt hash</span>
                  <span className="text-slate-500">
                    {receipt ? "Loaded" : "Waiting"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Chain check</span>
                  <span className="text-slate-500">
                    {serverVerify ? "Checked" : "Waiting"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/40">
          <h2 className="text-lg font-semibold text-white">Results</h2>
          <div className="mt-6 grid gap-6 text-sm text-slate-300 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Client hash
              </p>
              <p className="mt-2 break-all text-slate-200">
                {clientHash ?? "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Receipt hash
              </p>
              <p className="mt-2 break-all text-slate-200">
                {receipt?.sha256Hex ?? "—"}
              </p>
              {matchesReceipt !== null ? (
                <p
                  className={`mt-2 text-xs font-semibold uppercase tracking-[0.3em] ${
                    matchesReceipt ? "text-emerald-300" : "text-rose-400"
                  }`}
                >
                  {matchesReceipt ? "Match" : "Mismatch"}
                </p>
              ) : null}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Server chain check
              </p>
              <p className="mt-2 text-slate-200">
                {serverVerify
                  ? serverVerify.dbMatchesChain
                    ? "Receipt matches Solana memo"
                    : "Receipt does not match Solana memo"
                  : "—"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

