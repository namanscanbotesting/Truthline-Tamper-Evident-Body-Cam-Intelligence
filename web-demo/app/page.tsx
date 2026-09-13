export default function Home() {
  return (
    <div className="relative">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-16 px-6 pb-16 pt-14">
        <header className="flex flex-col gap-8">
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
            <a
              className="rounded-full border border-slate-800 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300 transition hover:border-slate-500 hover:text-white"
              href="/upload"
            >
              Simulate body cam
            </a>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                Clearance
              </p>
              <h1 className="text-4xl font-semibold text-white md:text-6xl">
                Publish, prove, and verify video authenticity.
              </h1>
              <p className="max-w-xl text-base text-slate-400">
                Clearance anchors video fingerprints on-chain and makes receipts
                shareable in seconds. Simulate once, verify everywhere.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
                  href="/upload"
                >
                  Simulate a live body cam
                </a>
                <a
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                  href="/events"
                >
                  View events
                </a>
                <a
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                  href="#verify"
                >
                  Verify a receipt
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/40">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Live network
              </p>
              <p className="mt-3 text-lg font-semibold text-white">
                Receipts anchored on Solana.
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Every simulation generates an IPFS CID and a chain transaction
                for a permanent audit trail.
              </p>
              <div className="mt-6 space-y-3 text-xs text-slate-400">
                <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">
                  <span>Simulate</span>
                  <span className="text-emerald-300">Live body cam</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">
                  <span>Receipt</span>
                  <span className="text-sky-300">On-chain proof</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">
                  <span>Verify</span>
                  <span className="text-slate-400">Match hashes</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Simulate",
              description:
                "Upload an .mp4 to simulate a live body cam feed.",
            },
            {
              title: "Receipt",
              description:
                "Share a public proof with IPFS CID and Solana transaction.",
            },
            {
              title: "Verify",
              description:
                "Recompute hashes to confirm the receipt matches the file.",
            },
          ].map((item) => (
            <div
              key={item.title}
              id={item.title === "Verify" ? "verify" : undefined}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                {item.title}
              </p>
              <p className="mt-3 text-base font-semibold text-white">
                {item.description}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                {item.title === "Simulate"
                  ? "Launch the full-screen simulator to begin."
                  : "Receipts are generated automatically after simulation."}
              </p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
