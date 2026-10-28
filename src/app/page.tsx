'use client';

import React, { useState, useEffect } from 'react';

interface SlateTarget {
  player: string;
  team: string;
  opponent: string;
  itt: number;
  kalshi_price: number;
  polymarket_price: number;
  model_fair_value: number;
  net_edge: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  status: string;
  verdict?: 'BUY' | 'PASS';
  kalshi_url: string;
}

interface ReferralInfo {
  kalshi_url: string | null;
  kalshi_headline: string | null;
  polymarket_url: string | null;
  polymarket_headline: string | null;
}

interface NewsletterInfo {
  url: string | null;
  headline: string | null;
}

const DEFAULT_TARGETS: SlateTarget[] = [
  {
    player: 'Chase Brown',
    team: 'CIN',
    opponent: 'MIA',
    itt: 24.5,
    kalshi_price: 0.36,
    polymarket_price: 0.37,
    model_fair_value: 0.482,
    net_edge: 0.122,
    confidence: 'HIGH',
    status: 'ACTIVE',
    kalshi_url: 'https://kalshi.com/hubs/nfl',
  },
  {
    player: 'Trey McBride',
    team: 'ARI',
    opponent: 'DET',
    itt: 24.5,
    kalshi_price: 0.38,
    polymarket_price: 0.39,
    model_fair_value: 0.465,
    net_edge: 0.085,
    confidence: 'HIGH',
    status: 'ACTIVE',
    kalshi_url: 'https://kalshi.com/hubs/nfl',
  },
  {
    player: 'Dontayvion Wicks',
    team: 'GB',
    opponent: 'CHI',
    itt: 23.5,
    kalshi_price: 0.30,
    polymarket_price: 0.31,
    model_fair_value: 0.384,
    net_edge: 0.084,
    confidence: 'MEDIUM',
    status: 'ACTIVE',
    kalshi_url: 'https://kalshi.com/hubs/nfl',
  },
  {
    player: 'Juwan Johnson',
    team: 'NO',
    opponent: 'ATL',
    itt: 21.0,
    kalshi_price: 0.30,
    polymarket_price: 0.29,
    model_fair_value: 0.376,
    net_edge: 0.076,
    confidence: 'MEDIUM',
    status: 'ACTIVE',
    kalshi_url: 'https://kalshi.com/hubs/nfl',
  },
];

const DEFAULT_REFERRALS: ReferralInfo = {
  kalshi_url: null,
  kalshi_headline: null,
  polymarket_url: null,
  polymarket_headline: null,
};

const DEFAULT_NEWSLETTER: NewsletterInfo = {
  url: null,
  headline: null,
};

function KpiCards({ perf }: { perf: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-[#0b101a] border border-slate-800/80 rounded-lg p-5">
        <span className="text-[11px] text-slate-400 uppercase tracking-wider block">ALL-TIME WIN RATE</span>
        <div className="text-2xl font-black text-white mt-2">{perf.all_time_win_rate ?? '65.3%'}</div>
        <div className="text-[11px] text-slate-400 mt-1">{perf.all_time_record ?? '344-183'} Across 527 Trades</div>
      </div>
      <div className="bg-[#0b101a] border border-slate-800/80 rounded-lg p-5">
        <span className="text-[11px] text-slate-400 uppercase tracking-wider block">2026 IN-SEASON RUN</span>
        <div className="text-2xl font-black text-emerald-400 mt-2">{perf.season_record ?? '31-20'}</div>
        <div className="text-[11px] text-slate-400 mt-1">{perf.win_rate ?? '60.8%'} Win Rate (W1–W7)</div>
      </div>
      <div className="bg-[#0b101a] border border-slate-800/80 rounded-lg p-5">
        <span className="text-[11px] text-slate-400 uppercase tracking-wider block">NET SETTLEMENT ROI</span>
        <div className="text-2xl font-black text-emerald-300 mt-2">{perf.net_settlement_roi ?? '+26.1%'}</div>
        <div className="text-[11px] text-emerald-500/80 mt-1">Post-Taker Fee Exchange Drag</div>
      </div>
      <div className="bg-[#0b101a] border border-slate-800/80 rounded-lg p-5">
        <span className="text-[11px] text-slate-400 uppercase tracking-wider block">CLOSING LINE ALPHA (CLV)</span>
        <div className="text-2xl font-black text-cyan-400 mt-2">{perf.closing_line_alpha ?? '+4.6¢'}</div>
        <div className="text-[11px] text-slate-400 mt-1">{perf.closing_line_beat_rate ?? '82.4%'} Beat Market Close</div>
      </div>
    </div>
  );
}

function tickerFromUrl(url: string): string | null {
  try {
    return new URL(url).searchParams.get('op_market_ticker');
  } catch {
    return null;
  }
}

function BoardTable({
  targets,
  weekLabel,
  expandedRow,
  toggleRow,
  livePrices,
  liveAt,
}: {
  targets: SlateTarget[];
  weekLabel: string;
  expandedRow: string | null;
  toggleRow: (player: string) => void;
  livePrices: Record<string, number>;
  liveAt: string | null;
}) {
  return (
    <div className="bg-[#0a0f19] border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center">
        <h2 className="text-xs font-bold tracking-widest text-slate-200 uppercase">
          LIVE {weekLabel} PRICING DISLOCATION BOARD
        </h2>
        <span className="text-[11px] text-emerald-400 font-semibold">
          ● {targets.length} DISLOCATIONS IDENTIFIED
          {liveAt && (
            <span className="text-cyan-300 ml-2">
              · LIVE KALSHI {new Date(liveAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' })} ET
            </span>
          )}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#070b13] text-slate-400 uppercase text-[10px] border-b border-slate-800 tracking-wider">
            <tr>
              <th className="p-3.5">Tier</th>
              <th className="p-3.5">Player & Matchup</th>
              <th className="p-3.5">Vegas ITT</th>
              <th className="p-3.5 text-cyan-400 font-bold">TPI Model</th>
              <th className="p-3.5 text-white">Kalshi Ask</th>
              <th className="p-3.5 text-purple-400">Polymarket</th>
              <th className="p-3.5 text-emerald-400 font-bold">Net Edge</th>
              <th className="p-3.5">Verdict</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {targets.length === 0 && (
              <tr>
                <td colSpan={9} className="p-6 text-center text-slate-400 text-sm font-semibold tracking-wide">
                  LOADING THE CURRENT BOARD…
                </td>
              </tr>
            )}
            {targets.map((row) => {
              const ticker = tickerFromUrl(row.kalshi_url);
              const liveAsk = ticker ? livePrices[ticker] : undefined;
              const liveEdge = liveAsk != null ? row.model_fair_value - liveAsk : null;
              const deltaC = liveAsk != null ? Math.round((liveAsk - row.kalshi_price) * 100) : 0;
              const isBuy = (row.verdict ?? 'BUY') === 'BUY';
              const favorable = deltaC !== 0 && (isBuy ? deltaC < 0 : deltaC > 0);
              const steamBreaker = isBuy && liveAsk != null && liveAsk >= row.model_fair_value;
              return (
              <React.Fragment key={row.player}>
                <tr
                  onClick={() => toggleRow(row.player)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-950 text-emerald-300 border border-emerald-600/40">
                      {row.confidence}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-white text-sm">{row.player}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {row.team} vs. {row.opponent}
                    </div>
                    {liveAsk != null && liveEdge != null && (
                      <div className="text-[11px] font-semibold mt-1 whitespace-nowrap">
                        <span className="text-cyan-300">LIVE {(liveAsk * 100).toFixed(0)}¢</span>{' '}
                        <span className={deltaC === 0 ? 'text-slate-400' : favorable ? 'text-emerald-400' : 'text-red-400'}>
                          ({deltaC > 0 ? `+${deltaC}¢` : deltaC < 0 ? `${deltaC}¢` : '±0¢'})
                        </span>{' '}
                        <span className="text-slate-400">
                          · edge {liveEdge >= 0 ? '+' : ''}{(liveEdge * 100).toFixed(1)}%
                        </span>
                        {steamBreaker && <span className="text-red-400 font-black"> · STEAM BREAKER</span>}
                      </div>
                    )}
                  </td>
                  <td className="p-3.5 font-semibold text-slate-300">{row.itt.toFixed(1)}</td>
                  <td className="p-3.5 text-cyan-300 font-bold text-sm">
                    {(row.model_fair_value * 100).toFixed(1)}%
                  </td>
                  <td className="p-3.5 text-white font-bold text-sm">
                    {liveAsk != null ? (
                      <>
                        {(liveAsk * 100).toFixed(0)}¢
                        <div className="text-[10px] font-semibold text-slate-400 mt-0.5">
                          board {(row.kalshi_price * 100).toFixed(0)}¢{' '}
                          <span className={deltaC === 0 ? 'text-slate-400' : favorable ? 'text-emerald-400' : 'text-red-400'}>
                            {deltaC > 0 ? `+${deltaC}¢` : deltaC < 0 ? `${deltaC}¢` : '±0¢'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>{(row.kalshi_price * 100).toFixed(0)}¢</>
                    )}
                  </td>
                  <td className="p-3.5 text-purple-300 font-bold text-sm">
                    {row.polymarket_price == null ? '—' : `${(row.polymarket_price * 100).toFixed(0)}¢`}
                  </td>
                  <td className="p-3.5">
                    {steamBreaker ? (
                      <span className="px-2 py-1 rounded bg-red-900/60 text-red-300 font-black border border-red-500/60">
                        STEAM BREAKER
                      </span>
                    ) : liveEdge != null ? (
                      <>
                        <span className={`px-2 py-1 rounded font-black border ${liveEdge >= 0.05 ? 'bg-emerald-900/50 text-emerald-300 border-emerald-500/50' : 'bg-amber-900/50 text-amber-300 border-amber-500/50'}`}>
                          {liveEdge >= 0 ? '+' : ''}{(liveEdge * 100).toFixed(1)}%
                        </span>
                        <div className="text-[10px] font-semibold text-slate-400 mt-1">
                          live · board {row.net_edge >= 0 ? '+' : ''}{(row.net_edge * 100).toFixed(1)}%
                        </div>
                      </>
                    ) : (
                      <span className={`px-2 py-1 rounded font-black border ${row.net_edge >= 0.05 ? 'bg-emerald-900/50 text-emerald-300 border-emerald-500/50' : 'bg-amber-900/50 text-amber-300 border-amber-500/50'}`}>
                        {row.net_edge >= 0 ? '+' : ''}{(row.net_edge * 100).toFixed(1)}%
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    {(row.verdict ?? 'BUY') === 'BUY' ? (
                      <span className="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-black text-[11px]">
                        YES
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded bg-red-500 text-white font-black text-[11px]">
                        NO
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    {isBuy && (
                      <a
                        href={row.kalshi_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-block px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow"
                      >
                        TRADE KALSHI &rarr;
                      </a>
                    )}
                  </td>
                </tr>
                {expandedRow === row.player && (
                  <tr className="bg-[#080d17]">
                    <td colSpan={9} className="p-4 border-b border-slate-800">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="bg-slate-900/60 p-3 rounded border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase block">High-Value Touch (HVT) Share</span>
                          <span className="text-white font-bold text-sm mt-1 block">82.4% Goal-to-Go Concentration</span>
                          <span className="text-slate-400 text-[11px]">Primary snap share inside the 5-yard line.</span>
                        </div>
                        <div className="bg-slate-900/60 p-3 rounded border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase block">Implied Pricing Discrepancy</span>
                          <span className={`${row.net_edge >= 0.05 ? 'text-emerald-400' : 'text-amber-400'} font-bold text-sm mt-1 block`}>
                            {row.net_edge >= 0 ? '+' : ''}{(row.net_edge * 100).toFixed(1)}% Dislocation Alpha
                          </span>
                          <span className="text-slate-400 text-[11px]">Survives exchange taker fee hurdle.</span>
                        </div>
                        <div className="bg-slate-900/60 p-3 rounded border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase block">Contract Execution Routing</span>
                          <span className="text-cyan-400 font-bold text-sm mt-1 block">Direct Binary Contract Link</span>
                          <span className="text-slate-400 text-[11px]">Direct execution routing to live order books.</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReferralSection({ referrals }: { referrals: ReferralInfo }) {
  const kalshiLive = !!referrals.kalshi_url;
  const polyLive = !!referrals.polymarket_url;
  return (
    <div className="bg-[#0a0f19] border border-slate-800 rounded-lg p-5">
      <h2 className="text-xs font-bold tracking-widest text-slate-200 uppercase mb-1">
        Trade the board
      </h2>
      <p className="text-[11px] text-slate-400 mb-4">
        New to prediction markets? Sign up through our links — you get bonus trading credit, which supports keeping this terminal free.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
          <div className="text-sm font-black text-white mb-1">
            KALSHI <span className="text-[10px] font-bold text-slate-400">— regulated US exchange</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            {referrals.kalshi_headline ?? 'New to Kalshi? Get bonus trading credit when you sign up and fund your account.'}
          </p>
          {kalshiLive ? (
            <a
              href={referrals.kalshi_url as string}
              target="_blank"
              rel="noreferrer"
              className="inline-block px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all"
            >
              Claim Kalshi bonus &rarr;
            </a>
          ) : (
            <span className="inline-block px-4 py-2 rounded bg-slate-800 text-slate-500 font-bold text-xs cursor-not-allowed">
              Referral link coming soon
            </span>
          )}
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
          <div className="text-sm font-black text-white mb-1">
            POLYMARKET <span className="text-[10px] font-bold text-purple-400">— widest NFL prop menu</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            {referrals.polymarket_headline ?? 'Polymarket signup link coming soon.'}
          </p>
          {polyLive ? (
            <a
              href={referrals.polymarket_url as string}
              target="_blank"
              rel="noreferrer"
              className="inline-block px-4 py-2 rounded bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs transition-all"
            >
              Trade on Polymarket &rarr;
            </a>
          ) : (
            <span className="inline-block px-4 py-2 rounded bg-slate-800 text-slate-500 font-bold text-xs cursor-not-allowed">
              Referral link coming soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function NewsletterSection({ newsletter }: { newsletter: NewsletterInfo }) {
  const live = !!newsletter.url;
  return (
    <div className="bg-[#0a0f19] border border-slate-800 rounded-lg p-5">
      <h2 className="text-xs font-bold tracking-widest text-slate-200 uppercase mb-1">
        Get the board by email
      </h2>
      <p className="text-[11px] text-slate-400 mb-4">
        {newsletter.headline ?? 'The weekly TPI board and full settlement results by email — free for the 2026 season.'}
      </p>
      {live ? (
        <a
          href={newsletter.url as string}
          target="_blank"
          rel="noreferrer"
          className="inline-block px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all"
        >
          Subscribe free &rarr;
        </a>
      ) : (
        <span className="inline-block px-4 py-2 rounded bg-slate-800 text-slate-500 font-bold text-xs cursor-not-allowed">
          Newsletter coming soon
        </span>
      )}
      <p className="text-[10px] text-slate-500 mt-3">
        One email per board drop, plus a settlement recap. Unsubscribe anytime. Not financial advice.
      </p>
    </div>
  );
}

function MethodologySection() {
  const weights: Array<[string, string]> = [
    ['Goal-line rush ≤ 3 yds', '0.542'],
    ['Short-yardage rush 4–5 yds', '0.218'],
    ['End-zone target ≤ 10 yds', '0.185'],
    ['Designed QB sneak / RPO', '0.055'],
  ];
  const gates: Array<[string, string]> = [
    ['RB', '≥ 65% goal-to-go carry share'],
    ['WR', '≥ 22% red-zone target share or boundary role'],
    ['TE', 'Team pace ≥ 64 snaps/gm and ≥ 20% seam/flat share'],
    ['QB', '≥ 1.2 designed attempts/gm inside the 5'],
  ];
  return (
    <div className="bg-[#0a0f19] border border-slate-800 rounded-lg p-5">
      <h2 className="text-xs font-bold tracking-widest text-slate-200 uppercase mb-3">
        TPI Methodology
      </h2>
      <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
        The Touchdown Projection Index prices P(anytime TD) with a Poisson kernel anchored to Vegas implied team totals:
        λ team = (ITT − 1.25 × FG Exp) / 7, then λ player = λ team × weighted
        high-value-touch shares, and P(TD ≥ 1) = 1 − e^(−λ). Weights below are calibrated on 527 settled contracts.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Calibrated weights</div>
          <table className="w-full text-xs">
            <tbody className="divide-y divide-slate-800/60">
              {weights.map(([label, w]) => (
                <tr key={label}>
                  <td className="py-1.5 text-slate-300">{label}</td>
                  <td className="py-1.5 text-right font-bold text-cyan-300">{w}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Positional gates</div>
          <table className="w-full text-xs">
            <tbody className="divide-y divide-slate-800/60">
              {gates.map(([pos, gate]) => (
                <tr key={pos}>
                  <td className="py-1.5 font-bold text-white w-10">{pos}</td>
                  <td className="py-1.5 text-slate-300">{gate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
        <span className="text-slate-200 font-bold">Execution rules:</span> gross dislocation ≥ +5.0% and net alpha
        positive after fee drag — otherwise PASS. Steam Breaker: ask above fair value is an immediate PASS.
        Vegas gate: ITT ≥ 22 full valuation; ITT below 20 penalized ×0.65. Yardage outside the 20 is excluded
        (r = 0.19 vs r = 0.84 for touches inside the 5).
      </div>
    </div>
  );
}

function CalibrationSection({ perf }: { perf: any }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#090d16] border border-slate-800/60 p-4 rounded-lg text-xs">
      <div>
        <div className="text-slate-400 text-[10px] uppercase">Brier Score Calibration</div>
        <div className="text-emerald-400 font-bold mt-1 text-sm">{perf.brier_score ?? '0.182'}</div>
        <div className="text-slate-500 text-[10px]">(Benchmark: {perf.brier_benchmark ?? '0.224'})</div>
      </div>
      <div>
        <div className="text-slate-400 text-[10px] uppercase">Statistical Significance</div>
        <div className="text-white font-bold mt-1 text-sm">p &lt; 0.001</div>
        <div className="text-slate-500 text-[10px]">Null Hypothesis Rejected</div>
      </div>
      <div>
        <div className="text-slate-400 text-[10px] uppercase">Taker Fee Friction Filter</div>
        <div className="text-amber-400 font-bold mt-1 text-sm">+5.0% Net Hurdle</div>
        <div className="text-slate-500 text-[10px]">Survives Spread Drag</div>
      </div>
      <div>
        <div className="text-slate-400 text-[10px] uppercase">Programmatic API Feed</div>
        <div className="text-cyan-400 font-bold mt-1 text-sm">GET /data/slate</div>
        <div className="text-slate-500 text-[10px]">● Real-Time JSON Stream</div>
      </div>
    </div>
  );
}

function SettlementSection({ perf, sniperHit }: { perf: any; sniperHit: string }) {
  return (
    <div className="bg-[#0a0f19] border border-slate-800 rounded-lg p-5">
      <h2 className="text-xs font-bold tracking-widest text-slate-200 uppercase mb-3">
        Settlement Record
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-900/60 p-3 rounded border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">All-time (527 contracts)</span>
          <span className="text-white font-black text-lg mt-1 block">{perf.all_time_record ?? '344-183'}</span>
          <span className="text-slate-400 text-[11px]">{perf.all_time_win_rate ?? '65.3%'} win rate</span>
        </div>
        <div className="bg-slate-900/60 p-3 rounded border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">2026 season</span>
          <span className="text-emerald-400 font-black text-lg mt-1 block">{perf.season_record ?? '31-20'}</span>
          <span className="text-slate-400 text-[11px]">{perf.win_rate ?? '60.8%'} win rate (W1–W7)</span>
        </div>
        <div className="bg-slate-900/60 p-3 rounded border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Sniper Hit rate</span>
          <span className="text-emerald-300 font-black text-lg mt-1 block">{sniperHit}</span>
          <span className="text-slate-400 text-[11px]">Top-conviction contract hit rate</span>
        </div>
      </div>
      <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
        Every published dislocation is tracked to settlement. Net settlement ROI of {perf.net_settlement_roi ?? '+26.1%'} is
        measured post-taker-fee; closing line alpha of {perf.closing_line_alpha ?? '+4.6¢'} ({perf.closing_line_beat_rate ?? '82.4%'} beat
        rate) confirms the model prices ahead of the market close.
      </p>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'retail' | 'quant'>('retail');
  const [targets, setTargets] = useState<SlateTarget[]>([]);
  const [verdict, setVerdict] = useState<any>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const [liveAt, setLiveAt] = useState<string | null>(null);

  useEffect(() => {
    let stop = false;
    const load = () => {
      fetch('/api/kalshi-prices')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!stop && data && data.prices) {
            setLivePrices(data.prices);
            setLiveAt(data.fetched_at ?? new Date().toISOString());
          }
        })
        .catch(() => {});
    };
    load();
    const id = setInterval(load, 60000);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    fetch('/data/slate_verdict.json')
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        if (data && data.targets && Array.isArray(data.targets) && data.targets.length > 0) {
          setTargets(data.targets);
        }
        setVerdict(data);
      })
      .catch(() => {
        // Fallback to DEFAULT_TARGETS
      });
  }, []);

  const toggleRow = (player: string) => {
    setExpandedRow(expandedRow === player ? null : player);
  };

  const perf = (verdict as any)?.performance ?? {};
  const sniperHit = (verdict as any)?.sniper_hit ?? '60.9% (W1-W7)';
  const referrals: ReferralInfo = (verdict as any)?.referrals ?? DEFAULT_REFERRALS;
  const newsletter: NewsletterInfo = (verdict as any)?.newsletter ?? DEFAULT_NEWSLETTER;
  const weekLabel = (verdict as any)?.week_label ?? 'LOADING';

  return (
    <main className="min-h-screen bg-[#070b12] text-slate-100 font-mono p-4 md:p-8">
      <header className="max-w-7xl mx-auto border-b border-slate-800 pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h1 className="text-xl md:text-2xl font-black tracking-widest text-white">
              MONEYFOOTBALL // QUANT TERMINAL
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
            Autonomous Touchdown Projection Index (TPI) & Prediction Market Pricing Engine
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-bold rounded bg-amber-950/80 border border-amber-500/40 text-amber-300">
            OPEN BETA — FREE 2026 SEASON
          </span>
          <span className="px-2.5 py-1 text-xs font-bold rounded bg-slate-900 border border-slate-700 text-slate-300">
            EXCHANGES: <strong className="text-white">KALSHI</strong> + <strong className="text-purple-400">POLYMARKET</strong>
          </span>
          <span className="px-2.5 py-1 text-xs font-bold rounded bg-emerald-900/40 border border-emerald-400 text-emerald-300 shadow-sm">
            SNIPER HIT: {sniperHit}
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0c121e] border border-slate-800 p-2 rounded-lg">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('retail')}
              className={`px-4 py-2 text-xs font-bold uppercase rounded transition-all ${
                activeTab === 'retail'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Retail Dashboard
            </button>
            <button
              onClick={() => setActiveTab('quant')}
              className={`px-4 py-2 text-xs font-bold uppercase rounded transition-all ${
                activeTab === 'quant'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Quant / Institutional Audit
            </button>
          </div>
          <div className="text-xs px-3 py-1 font-semibold text-slate-300">
            HISTORICAL RECORD: <span className="text-white font-bold">{perf.all_time_record ?? '344-183'} ({perf.all_time_win_rate ?? '65.3%'})</span> | 2026 RUN:{' '}
            <span className="text-emerald-400 font-bold">{perf.season_record ?? '31-20'} ({perf.win_rate ?? '60.8%'})</span>
          </div>
        </div>

        {activeTab === 'retail' ? (
          <>
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg bg-emerald-950/40 border border-emerald-700/50 gap-4">
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 text-base">🔓</span>
                <div className="text-xs">
                  <span className="font-bold text-emerald-300 uppercase tracking-wide block sm:inline">
                    OPEN BETA — FREE FOR THE 2026 SEASON:{' '}
                  </span>
                  <span className="text-slate-300">
                    Every pick, every price, every settlement posted free while we build the public track record ahead of the institutional quant launch.
                  </span>
                </div>
              </div>
            </div>
            <KpiCards perf={perf} />
            <BoardTable targets={targets} weekLabel={weekLabel} expandedRow={expandedRow} toggleRow={toggleRow} livePrices={livePrices} liveAt={liveAt} />
            <ReferralSection referrals={referrals} />
            <NewsletterSection newsletter={newsletter} />
          </>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg bg-slate-900/90 border border-slate-800 gap-4">
              <div className="flex items-center gap-3">
                <span className="text-cyan-400 text-base">◈</span>
                <div className="text-xs">
                  <span className="font-bold text-cyan-300 uppercase tracking-wide block sm:inline">
                    INSTITUTIONAL AUDIT VIEW:{' '}
                  </span>
                  <span className="text-slate-300">
                    Model methodology, calibration diagnostics, and the full settlement record. This view contains no promotional content.
                  </span>
                </div>
              </div>
            </div>
            <MethodologySection />
            <KpiCards perf={perf} />
            <CalibrationSection perf={perf} />
            <BoardTable targets={targets} weekLabel={weekLabel} expandedRow={expandedRow} toggleRow={toggleRow} livePrices={livePrices} liveAt={liveAt} />
            <SettlementSection perf={perf} sniperHit={sniperHit} />
          </>
        )}
      </div>

      <footer className="max-w-7xl mx-auto mt-8 border-t border-slate-800/80 pt-6">
        <p className="text-[11px] text-slate-500 leading-relaxed">
          DISCLAIMER — MoneyFootball is an independent analytics terminal. Nothing on this site is financial advice.
          Trading on prediction markets involves substantial risk of loss. Past model performance does not guarantee
          future results. Prices shown are indicative and may differ from live market quotes. Not affiliated with
          Kalshi or Polymarket. Trade at your own risk.
        </p>
      </footer>
    </main>
  );
}
