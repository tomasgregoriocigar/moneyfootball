import type { Metadata } from 'next';
import { WEEKS } from '../../data/weeks';

export const metadata: Metadata = {
  title: 'MoneyFootball Archive — NFL Anytime Touchdown Picks & Results by Week | Tito the Football Quant',
  description:
    'Every MoneyFootball board and settlement, on the record: weekly anytime touchdown picks with the prices and fair values as published, and the settled results — wins and losses — for Weeks 1-9 of the 2026 NFL season.',
  alternates: { canonical: 'https://www.moneyfootball.ai/weeks' },
};

export default function WeeksIndexPage() {
  const weeks = [...WEEKS].sort((a, b) => b.week - a.week);
  return (
    <main className="min-h-screen bg-black text-zinc-200 font-mono px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <p className="text-emerald-400 text-xs tracking-widest mb-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-2" />
          MONEYFOOTBALL.AI // BOARD ARCHIVE
        </p>
        <h1 className="text-3xl font-bold text-white mb-3">
          Anytime Touchdown Picks &amp; Results — The Full Archive
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-4">
          Every board Tito the Football Quant published during the 2026 NFL season, and every
          settlement that followed it. Prices and fair values are shown exactly as published;
          results are settled from the box scores. Losses are posted with the wins — that is
          the whole point of an archive.
        </p>
        <p className="text-sm text-slate-300 border border-slate-800 bg-slate-900/60 rounded px-4 py-3 mb-8">
          HISTORICAL RECORD: <span className="text-white font-bold">356-206 (63.3%)</span> | 2026
          RUN: <span className="text-white font-bold">43-43 (50.0%)</span> | SNIPER HIGH (W1-W9):{' '}
          <span className="text-white font-bold">43.6%</span>
        </p>

        <div className="space-y-4">
          {weeks.map((w) => (
            <section key={w.week} className="border border-slate-800 bg-slate-900/60 rounded p-4">
              <h2 className="text-xl font-bold text-white mb-1">NFL Week {w.week}</h2>
              <p className="text-sm text-slate-400 mb-1">{w.weekLine}</p>
              <p className="text-sm text-slate-400 mb-3">{w.seasonLine}</p>
              <p className="text-sm">
                <a className="text-emerald-400 underline mr-6" href={`/weeks/week-${w.week}-board`}>
                  Week {w.week} board — the picks as published
                </a>
                <a className="text-emerald-400 underline" href={`/weeks/week-${w.week}-results`}>
                  Week {w.week} results — the settlement
                </a>
              </p>
            </section>
          ))}

          <section className="border border-slate-800 bg-slate-900/60 rounded p-4">
            <h2 className="text-xl font-bold text-white mb-1">NFL Weeks 1-4</h2>
            <p className="text-sm text-slate-400 mb-3">
              Season record after Week 4: 23-11 (34 settled picks). Per-pick boards for Weeks 1-4
              were never committed to this site&apos;s records — only the aggregate survives, and
              the archive says so rather than reconstructing them.
            </p>
            <p className="text-sm">
              <a className="text-emerald-400 underline" href="/weeks/weeks-1-4-results">
                Weeks 1-4 results — the aggregate record
              </a>
            </p>
          </section>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed mt-8">
          MoneyFootball is an independent analytics terminal. Nothing on this site is financial
          advice. Trading on prediction markets involves substantial risk of loss. Past model
          performance does not guarantee future results. Not affiliated with Kalshi or Polymarket.
        </p>
        <p className="text-sm mt-4">
          <a className="text-emerald-400 underline" href="/">
            Back to the live board
          </a>
        </p>
      </div>
    </main>
  );
}
