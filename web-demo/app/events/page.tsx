import { supabase } from "@/lib/supabase";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

type EventRow = {
  id: string;
  event: string;
  tag: string;
  occurred_at: string;
  room: string | null;
  camera: string | null;
  transcript: string | null;
  source: string | null;
  solana_tx_sig: string;
  created_at: string;
};

export default async function EventsPage() {
  noStore();
  const { data: events, error } = await supabase
    .from("events")
    .select(
      "id, event, tag, occurred_at, room, camera, transcript, source, solana_tx_sig, created_at"
    )
    .order("occurred_at", { ascending: false })
    .limit(50);
  if (error) {
    throw new Error(error.message);
  }

  const cluster = process.env.NEXT_PUBLIC_SOLANA_CLUSTER ?? "devnet";

  return (
    <div className="px-6 pb-16 pt-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
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
              <span className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">
                Events
              </span>
              <a className="text-slate-500 hover:text-slate-200" href="/">
                Home
              </a>
            </div>
          </nav>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                Events
              </p>
              <h1 className="text-4xl font-semibold text-white">
                Real-time alerts with on-chain proof.
              </h1>
              <p className="max-w-xl text-base text-slate-400">
                Every event is sealed into a Solana memo with the event tag,
                timestamp, and context. Use the transaction link to verify the
                memo payload on-chain.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-sm text-slate-300">How to verify</p>
              <ol className="mt-3 space-y-2 text-xs text-slate-500">
                <li>Open the Solana transaction for an event.</li>
                <li>Find the Memo program instruction/log.</li>
                <li>Compare the JSON memo fields with the event details.</li>
              </ol>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-200">
              Latest events
            </p>
            <p className="text-xs text-slate-500">
              Showing {events?.length ?? 0} records
            </p>
          </div>

          {events && events.length > 0 ? (
            <div className="mt-6 grid gap-4">
              {events.map((event) => {
                const solanaLink = `https://explorer.solana.com/tx/${event.solana_tx_sig}?cluster=${cluster}`;
                return (
                  <article
                    key={event.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                          {event.event}
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">
                          {event.tag}
                        </p>
                      </div>
                      <div className="text-right text-xs text-slate-500">
                        <p>Occurred</p>
                        <p className="text-slate-300">
                          {new Date(event.occurred_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <dl className="mt-4 grid gap-3 text-xs text-slate-400 md:grid-cols-2">
                      <div>
                        <dt className="text-[10px] uppercase tracking-[0.3em] text-slate-600">
                          Room
                        </dt>
                        <dd className="mt-1 text-slate-300">
                          {event.room ?? "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-[0.3em] text-slate-600">
                          Camera
                        </dt>
                        <dd className="mt-1 text-slate-300">
                          {event.camera ?? "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-[0.3em] text-slate-600">
                          Source
                        </dt>
                        <dd className="mt-1 text-slate-300">
                          {event.source ?? "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-[0.3em] text-slate-600">
                          Solana
                        </dt>
                        <dd className="mt-1 break-all">
                          <a
                            className="text-sky-400 hover:text-sky-300"
                            href={solanaLink}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {event.solana_tx_sig}
                          </a>
                        </dd>
                      </div>
                    </dl>

                    {event.transcript ? (
                      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-xs text-slate-300">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-600">
                          Transcript
                        </p>
                        <p className="mt-2">{event.transcript}</p>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 text-sm text-slate-400">
              No events have been recorded yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

