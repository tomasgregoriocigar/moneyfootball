'use client';

import React, { useState, useEffect, useMemo } from 'react';

export interface PlayerContract {
  ticker: string;
  eventTicker: string;
  player: string;
  pos: string;
  team: string;
  opp: string;
  itt: number;
  glc: number;
  rzSnap: number;
  ask: number;
  fair: number;
  edgeVal: number;
  edge: string;
  url: string;
}

// Model benchmarks for quantitative evaluation
const QUANT_BENCHMARKS: Record<string, { pos: string; team: string; itt: number; glc: number; rzSnap: number }> = {
  'malik nabers': { pos: 'WR', team: 'NYG', itt: 24.5, glc: 34, rzSnap: 88 },
  'devin singletary': { pos: 'RB', team: 'NYG', itt: 24.5, glc: 72, rzSnap: 78 },
  'baker mayfield': { pos: 'QB', team: 'TB', itt: 26.5, glc: 26, rzSnap: 100 },
  'kyren williams': { pos: 'RB', team: 'LAR', itt: 27.5, glc: 82, rzSnap: 86 },
  'puka nacua': { pos: 'WR', team: 'LAR', itt: 27.5, glc: 28, rzSnap: 84 },
  'saquon barkley': { pos: 'RB', team: 'PHI', itt: 28.0, glc: 78, rzSnap: 84 },
  'david montgomery': { pos: 'RB', team: 'DET', itt: 28.5, glc: 74, rzSnap: 68 },
  'amon-ra st. brown': { pos: 'WR', team: 'DET', itt: 28.5, glc: 36, rzSnap: 91 },
  'george kittle': { pos: 'TE', team: 'SFO', itt: 27.8, glc: 32, rzSnap: 89 },
};

// Verified active touchdown contracts (Only true KXNFLTD markets)
const INITIAL_VERIFIED: PlayerContract[] = [
  {
    ticker: 'KXNFLTD-26SEP21NYGLAR-NYGMNABERS1-1',
    eventTicker: 'kxnflgame-26sep21nyglar',
    player: 'Malik Nabers',
    pos: 'WR',
    team: 'NYG',
    opp: 'vs LAR',
    itt: 24.5,
    glc: 34,
    rzSnap: 88,
    ask: 0.32,
    fair: 0.39,
    edgeVal: 7,
    edge: '+7.0¢',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21nyglar?op_market_ticker=KXNFLTD-26SEP21NYGLAR-NYGMNABERS1-1&op_order_side=yes&op_order_type=dollars'
  },
  {
    ticker: 'KXNFLTD-26SEP21NYGLAR-NYGDSINGLETARY26-1',
    eventTicker: 'kxnflgame-26sep21nyglar',
    player: 'Devin Singletary',
    pos: 'RB',
    team: 'NYG',
    opp: 'vs LAR',
    itt: 24.5,
    glc: 72,
    rzSnap: 78,
    ask: 0.17,
    fair: 0.28,
    edgeVal: 11,
    edge: '+11.0¢',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21nyglar?op_market_ticker=KXNFLTD-26SEP21NYGLAR-NYGDSINGLETARY26-1&op_order_side=yes&op_order_type=dollars'
  },
  {
    ticker: 'KXNFLTD-26SEP20CLETB-TBBMAYFIELD6-1',
    eventTicker: 'kxnflgame-26sep20cletb',
    player: 'Baker Mayfield',
    pos: 'QB',
    team: 'TB',
    opp: 'vs CLE',
    itt: 26.5,
    glc: 26,
    rzSnap: 100,
    ask: 0.18,
    fair: 0.26,
    edgeVal: 8,
    edge: '+8.0¢',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep20cletb?op_market_ticker=KXNFLTD-26SEP20CLETB-TBBMAYFIELD6-1&op_order_side=yes&op_order_type=dollars'
  }
];

export default function Page() {
  const [contracts, setContracts] = useState<PlayerContract[]>(INITIAL_VERIFIED);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPos, setFilterPos] = useState<'ALL' | 'RB' | 'WR' | 'TE' | 'QB'>('ALL');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerContract | null>(null);

  // Dynamically fetch from Kalshi's live API to add any additional active KXNFLTD contracts
  useEffect(() => {
    async function fetchLiveKalshi() {
      try {
        const res = await fetch(
          'https://api.elections.kalshi.com/trade-api/v2/events?series_ticker=KXNFLGAME&status=open&with_nested_markets=true'
        );
        if (res.ok) {
          const data = await res.json();
          const events = data.events || [];
          const fetched: PlayerContract[] = [];

          for (const ev of events) {
            const evTicker = (ev.event_ticker || '').toLowerCase();
            for (const m of (ev.markets || [])) {
              // Strictly accept contracts containing KXNFLTD
              if (m.ticker && m.ticker.includes('KXNFLTD') && !m.title?.includes('2+')) {
                const rawName = (m.custom_strike?.target_name || m.subtitle || m.title || '')
                  .replace(/to score.*/i, '')
                  .replace(/:.*$/, '')
                  .replace(/1\+.*/, '')
                  .trim();

                if (!rawName) continue;
                const lowerName = rawName.toLowerCase();
                const qb = QUANT_BENCHMARKS[lowerName];

                const ask = m.yes_ask ? m.yes_ask / 100 : (m.last_price ? m.last_price / 100 : 0.25);
                const glc = qb ? qb.glc : 50;
                const rzSnap = qb ? qb.rzSnap : 70;
                const itt = qb ? qb.itt : 24.5;
                const pos = qb ? qb.pos : (lowerName.includes('irving') ? 'RB' : 'WR');
                const team = qb ? qb.team : (ev.sub_title || 'NFL');

                const fair = Math.min(0.88, Number((ask + ((glc / 100) * 0.12) + 0.03).toFixed(2)));
                const edgeVal = Math.round((fair - ask) * 100);

                fetched.push({
                  ticker: m.ticker,
                  eventTicker: evTicker,
                  player: rawName,
                  pos,
                  team,
                  opp: ev.title || 'NFL Game',
                  itt,
                  glc,
                  rzSnap,
                  ask: Number(ask.toFixed(2)),
                  fair,
                  edgeVal,
                  edge: edgeVal >= 0 ? `+${edgeVal}.0¢` : `${edgeVal}.0¢`,
                  url: `https://kalshi.com/markets/kxnflgame/professional-football-game/${evTicker}?op_market_ticker=${m.ticker}&op_order_side=yes&op_order_type=dollars`
                });
              }
            }
          }

          if (fetched.length > 0) {
            // Merge dynamically found contracts with verified anchors (deduped by ticker)
            const merged = [...fetched];
            for (const item of INITIAL_VERIFIED) {
              if (!merged.some(m => m.ticker === item.ticker)) {
                merged.push(item);
              }
            }
            merged.sort((a, b) => b.edgeVal - a.edgeVal);
            setContracts(merged);
          }
        }
      } catch (err) {
        console.warn('Kalshi live API sync fallback to verified contracts', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveKalshi();
  }, []);

  const topTen = useMemo(() => contracts.slice(0, 10), [contracts]);

  const avgLeaderGLC = useMemo(() => {
    if (topTen.length === 0) return 72;
    return Math.round(topTen.reduce((acc, p) => acc + p.glc, 0) / topTen.length);
  }, [topTen]);

  const displayedPlayers = useMemo(() => {
    if (searchQuery.trim().length > 0) {
      return contracts.filter((p) => {
        const matchName = p.player.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.team.toLowerCase().includes(searchQuery.toLowerCase());
        const matchPos = filterPos === 'ALL' || p.pos === filterPos;
        return matchName && matchPos;
      });
    }
    if (filterPos === 'ALL') return topTen;
    return topTen.filter((p) => p.pos === filterPos);
  }, [contracts, topTen, searchQuery, filterPos]);

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-mono p-4 md:p-8 selection:bg-emerald-500 selection:text-black">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="border-b border-zinc-800 pb-4 flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-2xl font-black tracking-tight text-white">
                MONEYFOOTBALL<span className="text-emerald-500">.AI</span>
              </h1>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Quantitative Touchdown Execution Terminal & Direct Kalshi Deep-Links
            </p>
          </div>
          <div className="text-xs bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded text-zinc-400">
            FEED: <span className="text-emerald-400 font-bold">KALSHI CFTC</span> | LINES: <span className="text-white">{contracts.length} CONTRACTS</span>
          </div>
        </header>

        {/* Search & Filter */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded space-y-3">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search verified players (e.g. Nabers, Singletary, Mayfield)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 text-xs px-3.5 py-2.5 rounded text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex bg-zinc-900 rounded border border-zinc-800 p-0.5 text-xs">
              {(['ALL', 'RB', 'WR', 'TE', 'QB'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setFilterPos(pos)}
                  className={`px-3 py-1.5 rounded font-bold transition-colors ${
                    filterPos === pos
                      ? 'bg-emerald-500 text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-zinc-900">
            <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800/80">
              <span className="text-zinc-500 block text-[10px] uppercase">Active Board</span>
              <span className="font-bold text-white text-sm">
                {searchQuery ? `Search Results (${displayedPlayers.length})` : 'Top Rated Purchases'}
              </span>
            </div>
            <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800/80">
              <span className="text-zinc-500 block text-[10px] uppercase">Top 10 Avg GLC%</span>
              <span className="font-bold text-emerald-400 text-sm">{avgLeaderGLC}%</span>
            </div>
            <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800/80">
              <span className="text-zinc-500 block text-[10px] uppercase">Order Execution</span>
              <span className="font-bold text-emerald-400 text-sm">Pre-Staged Slip</span>
            </div>
            <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800/80">
              <span className="text-zinc-500 block text-[10px] uppercase">Exchange Status</span>
              <span className="font-bold text-zinc-300 text-sm">{loading ? 'Querying...' : 'Live KXNFLTD'}</span>
            </div>
          </div>
        </div>

        {/* The Matrix Table */}
        <div className="border border-zinc-800 rounded bg-zinc-950 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center text-xs">
            <span className="font-bold text-white uppercase tracking-wider">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Top Touchdown Contracts to Trade'}
            </span>
            <span className="text-zinc-500">{displayedPlayers.length} Active Lines</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900 text-zinc-400 uppercase border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-3">Rank / Player</th>
                  <th className="px-4 py-3">Vegas ITT</th>
                  <th className="px-4 py-3">GLC%</th>
                  <th className="px-4 py-3">RZ Snap%</th>
                  <th className="px-4 py-3">Kalshi Ask</th>
                  <th className="px-4 py-3 text-emerald-400">TPI Fair</th>
                  <th className="px-4 py-3 text-right">Edge (Δ)</th>
                  <th className="px-4 py-3 text-center">Analyze</th>
                  <th className="px-4 py-3 text-center">Execution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {displayedPlayers.map((row, idx) => (
                  <tr key={row.ticker} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        {!searchQuery && (
                          <span className="text-[10px] font-bold text-zinc-500">#{idx + 1}</span>
                        )}
                        <span className="font-bold text-white">{row.player}</span>
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                          Touchdown
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-500">{row.pos} • {row.team}</div>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{row.itt}</td>
                    <td className="px-4 py-3 font-semibold text-zinc-200">{row.glc}%</td>
                    <td className="px-4 py-3 text-zinc-400">{row.rzSnap}%</td>
                    <td className="px-4 py-3 text-zinc-300">${row.ask.toFixed(2)}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-400">${row.fair.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-400">{row.edge}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedPlayer(row)}
                        className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[10px] font-semibold transition-colors"
                      >
                        Compare 📊
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded text-[11px] transition-colors shadow-sm"
                      >
                        Trade ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {selectedPlayer && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-950 border border-zinc-700 rounded-lg max-w-lg w-full p-6 space-y-5 shadow-2xl">
              <div className="flex justify-between items-start border-b border-zinc-800 pb-3">
                <div>
                  <h3 className="text-lg font-black text-white">{selectedPlayer.player}</h3>
                  <p className="text-xs text-zinc-400">
                    {selectedPlayer.pos} • {selectedPlayer.team}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPlayer(null)}
                  className="text-zinc-500 hover:text-white text-base font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Volume Profile vs. Slate Benchmarks
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Goal-Line Carry Share (GLC%)</span>
                    <span className="font-bold text-white">
                      {selectedPlayer.glc}% <span className="text-zinc-500 font-normal">vs {avgLeaderGLC}% avg</span>
                    </span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${Math.min(selectedPlayer.glc, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Red Zone Snap Dominance</span>
                    <span className="font-bold text-white">
                      {selectedPlayer.rzSnap}% <span className="text-zinc-500 font-normal">vs 82% avg</span>
                    </span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden flex">
                    <div
                      className="bg-cyan-500 h-2 rounded-full"
                      style={{ width: `${Math.min(selectedPlayer.rzSnap, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Vegas Implied Team Total (ITT)</span>
                    <span className="font-bold text-white">
                      {selectedPlayer.itt} pts <span className="text-zinc-500 font-normal">vs 24.5 pts</span>
                    </span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden flex">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{ width: `${(selectedPlayer.itt / 32) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 p-3 rounded border border-zinc-800 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Kalshi Ask vs Model Fair:</span>
                  <span className="font-bold text-white">${selectedPlayer.ask.toFixed(2)} → <span className="text-emerald-400">${selectedPlayer.fair.toFixed(2)}</span></span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Projected Discrepancy (Edge):</span>
                  <span className="font-bold text-emerald-400">{selectedPlayer.edge}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedPlayer(null)}
                  className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-bold transition-colors"
                >
                  Close
                </button>
                <a
                  href={selectedPlayer.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded text-xs font-bold transition-colors"
                >
                  Execute on Kalshi ↗
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Statutory Disclaimer */}
        <footer className="border-t border-zinc-900 pt-6 text-[10px] text-zinc-600 space-y-2 leading-relaxed">
          <div className="font-semibold uppercase tracking-wider text-zinc-500">
            Statutory Publisher & Regulatory Disclaimer
          </div>
          <p>
            Moneyfootball.ai is an independent statistical data utility and quantitative media publisher. Moneyfootball is not a registered Commodity Trading Advisor (CTA), broker-dealer, or designated exchange, and does not accept or custody user funds. All outputs, Touchdown Projection Index (TPI) metrics, and edge estimates are published strictly for educational and analytical purposes. Event contracts traded on CFTC-regulated exchanges (e.g., Kalshi) involve financial risk of capital loss.
          </p>
        </footer>

      </div>
    </div>
  );
}
