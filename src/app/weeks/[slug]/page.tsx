import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { WEEKS, EARLY_WEEKS, type WeekArchive } from '../../../data/weeks';

const BASE = 'https://www.moneyfootball.ai';

interface PageDef {
  slug: string;
  title: string;
  description: string;
  week: WeekArchive | null; // null = weeks 1-4 aggregate page
  kind: 'board' | 'results';
}

function buildDefs(): PageDef[] {
  const defs: PageDef[] = [];
  for (const w of WEEKS) {
    defs.push({
      slug: `week-${w.week}-board`,
      title: `${w.boardTitle} | Tito the Football Quant`,
      description: `The full MoneyFootball Week ${w.week} board as published: ${w.board.length} anytime touchdown targets with Kalshi prices, published TPI fair values and verdicts. ${w.weekLine}`,
      week: w,
      kind: 'board',
    });
    defs.push({
      slug: `week-${w.week}-results`,
      title: `${w.resultsTitle} | Tito the Football Quant`,
      description: `MoneyFootball Week ${w.week} anytime touchdown picks, settled: ${w.weekLine} ${w.seasonLine} Every hit and miss from the Week ${w.week} board, on the record.`,
      week: w,
      kind: 'results',
    });
  }
  defs.push({
    slug: 'weeks-1-4-results',
    title: `${EARLY_WEEKS.title} | Tito the Football Quant`,
    description:
      'MoneyFootball Weeks 1-4 of the 2026 NFL season settled 23-11 across 34 anytime touchdown picks. Per-pick records for those weeks were not kept; the aggregate is the record.',
    week: null,
    kind: 'results',
  });
  return defs;
}

const DEFS = buildDefs();

export function generateStaticParams() {
  return DEFS.map((d) => ({ slug: d.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const def = DEFS.find((d) => d.slug === params.slug);
  if (!def) return {};
  return {
    title: def.title,
    description: def.description,
    alternates: { canonical: `${BASE}/weeks/${def.slug}` },
  };
}

function cents(x: number): string {
  return `${Math.round(x * 100)}¢`;
}

function fvFmt(x: number): string {
  return x.toFixed(3).replace(/^0/, '');
}

function edgeFmt(x: number): string {
  const c = Math.round(x * 1000) / 10;
  return `${c >= 0 ? '+' : ''}${c.toFixed(1)}¢`;
}

function resultClass(result: string): string {
  if (result === 'HIT' || result === 'PASS CORRECT') return 'text-emerald-400 font-bold';
  if (result === 'MISS' || result === 'PASS INCORRECT') return 'text-red-400 font-bold';
  return 'text-slate-400 font-bold';
}

function RecordsBlock({ w }: { w: WeekArchive }) {
  return (
    <div className="border border-slate-800 bg-slate-900/60 rounded px-4 py-3 mb-6 text-sm text-slate-300 space-y-1">
      <p>{w.weekLine}</p>
      <p>{w.seasonLine}</p>
      {w.allTimeLine && <p>{w.allTimeLine}</p>}
      {w.sniperLine && <p>{w.sniperLine}</p>}
    </div>
  );
}

function BoardTable({ w }: { w: WeekArchive }) {
  return (
    <div className="overflow-x-auto border border-slate-800 rounded mb-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-900 text-slate-300 text-left">
            <th className="px-3 py-2">Player</th>
            <th className="px-3 py-2">Matchup</th>
            <th className="px-3 py-2">Verdict</th>
            <th className="px-3 py-2">Tier</th>
            <th className="px-3 py-2">Kalshi Price</th>
            <th className="px-3 py-2">Published Fair Value</th>
            <th className="px-3 py-2">Net Edge</th>
            <th className="px-3 py-2">Team ITT</th>
          </tr>
        </thead>
        <tbody>
          {w.board.map((r) => (
            <tr key={r.player} className="border-t border-slate-800">
              <td className="px-3 py-2 text-white">{r.player}</td>
              <td className="px-3 py-2 text-slate-400">
                {r.team} vs {r.opponent}
              </td>
              <td className="px-3 py-2">{r.verdict ?? 'TARGET'}</td>
              <td className="px-3 py-2 text-slate-400">{r.tier ?? ''}</td>
              <td className="px-3 py-2">{cents(r.ask)}</td>
              <td className="px-3 py-2">{fvFmt(r.fv)}</td>
              <td className="px-3 py-2">{edgeFmt(r.edge)}</td>
              <td className="px-3 py-2 text-slate-400">{r.itt ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ResultsTable({ w }: { w: WeekArchive }) {
  const byPlayer = new Map((w.results ?? []).map((r) => [r.player, r]));
  return (
    <div className="overflow-x-auto border border-slate-800 rounded mb-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-900 text-slate-300 text-left">
            <th className="px-3 py-2">Player</th>
            <th className="px-3 py-2">Verdict</th>
            <th className="px-3 py-2">Board Price</th>
            <th className="px-3 py-2">Published Fair Value</th>
            <th className="px-3 py-2">Result</th>
            <th className="px-3 py-2">Closing Ask</th>
            <th className="px-3 py-2">Settlement Note</th>
          </tr>
        </thead>
        <tbody>
          {w.board.map((b) => {
            const r = byPlayer.get(b.player);
            return (
              <tr key={b.player} className="border-t border-slate-800 align-top">
                <td className="px-3 py-2 text-white">{b.player}</td>
                <td className="px-3 py-2">{b.verdict ?? 'TARGET'}</td>
                <td className="px-3 py-2">{cents(b.ask)}</td>
                <td className="px-3 py-2">{fvFmt(b.fv)}</td>
                <td className={`px-3 py-2 ${resultClass(r?.result ?? 'Not recorded')}`}>
                  {r?.result ?? 'Not recorded'}
                </td>
                <td className="px-3 py-2 text-slate-400">{r?.closing ?? ''}</td>
                <td className="px-3 py-2 text-slate-400">{r?.note ?? ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function WeekArchivePage({ params }: { params: { slug: string } }) {
  const def = DEFS.find((d) => d.slug === params.slug);
  if (!def) notFound();

  if (def.week === null) {
    return (
      <main className="min-h-screen bg-black text-zinc-200 font-mono px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-emerald-400 text-xs tracking-widest mb-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-2" />
            MONEYFOOTBALL.AI // BOARD ARCHIVE
          </p>
          <h1 className="text-3xl font-bold text-white mb-3">{EARLY_WEEKS.title}</h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">{EARLY_WEEKS.intro}</p>
          <div className="border border-slate-800 bg-slate-900/60 rounded px-4 py-3 mb-6 text-sm text-slate-300">
            <p>{EARLY_WEEKS.seasonLine}</p>
          </div>
          <p className="text-sm">
            <a className="text-emerald-400 underline" href="/weeks">
              Back to the archive index
            </a>
          </p>
        </div>
      </main>
    );
  }

  const w = def.week;
  const otherKind = def.kind === 'board' ? 'results' : 'board';
  const otherLabel =
    def.kind === 'board'
      ? `Week ${w.week} results — how these picks settled`
      : `Week ${w.week} board — the picks as published`;

  return (
    <main className="min-h-screen bg-black text-zinc-200 font-mono px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <p className="text-emerald-400 text-xs tracking-widest mb-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-2" />
          MONEYFOOTBALL.AI // BOARD ARCHIVE
        </p>
        <h1 className="text-3xl font-bold text-white mb-3">
          {def.kind === 'board' ? w.boardTitle : w.resultsTitle}
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          {def.kind === 'board' ? w.boardIntro : w.resultsIntro}
        </p>

        <RecordsBlock w={w} />

        {def.kind === 'board' ? <BoardTable w={w} /> : <ResultsTable w={w} />}

        {def.kind === 'results' && w.bandNote && (
          <p className="text-sm text-slate-400 leading-relaxed mb-6">{w.bandNote}</p>
        )}

        <p className="text-sm space-x-6">
          <a className="text-emerald-400 underline" href={`/weeks/week-${w.week}-${otherKind}`}>
            {otherLabel}
          </a>
          <a className="text-emerald-400 underline" href="/weeks">
            Archive index
          </a>
          <a className="text-emerald-400 underline" href="/">
            Live board
          </a>
        </p>
        <p className="text-[11px] text-slate-500 leading-relaxed mt-8">
          MoneyFootball is an independent analytics terminal. Nothing on this site is financial
          advice. Trading on prediction markets involves substantial risk of loss. Past model
          performance does not guarantee future results. Not affiliated with Kalshi or Polymarket.
        </p>
      </div>
    </main>
  );
}
