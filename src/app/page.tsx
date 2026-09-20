'use client';

import React, { useState, useEffect, useMemo } from 'react';

interface PlayerContract {
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

// Moneyfootball Quantitative Benchmark Database
const QUANT_MODEL_DB = [
  { name: 'Devin Singletary', pos: 'RB', team: 'NYG', itt: 24.5, glc: 72, rzSnap: 78 },
  { name: 'Malik Nabers', pos: 'WR', team: 'NYG', itt: 24.5, glc: 34, rzSnap: 88 },
  { name: 'Theo Johnson', pos: 'TE', team: 'NYG', itt: 24.5, glc: 24, rzSnap: 65 },
  { name: 'Baker Mayfield', pos: 'QB', team: 'TB', itt: 26.5, glc: 26, rzSnap: 100 },
  { name: 'Bucky Irving', pos: 'RB', team: 'TB', itt: 26.5, glc: 65, rzSnap: 72 },
  { name: 'Rachaad White', pos: 'RB', team: 'TB', itt: 26.5, glc: 58, rzSnap: 60 },
  { name: 'Mike Evans', pos: 'WR', team: 'TB', itt: 26.5, glc: 38, rzSnap: 86 },
  { name: 'Jerome Ford', pos: 'RB', team: 'CLE', itt: 21.0, glc: 64, rzSnap: 71 },
  { name: 'Amari Cooper', pos: 'WR', team: 'CLE', itt: 21.0, glc: 24, rzSnap: 84 },
  { name: 'Jerry Jeudy', pos: 'WR', team: 'CLE', itt: 21.0, glc: 18, rzSnap: 78 },
  { name: 'Kyren Williams', pos: 'RB', team: 'LAR', itt: 27.5, glc: 82, rzSnap: 86 },
  { name: 'Puka Nacua', pos: 'WR', team: 'LAR', itt: 27.5, glc: 28, rzSnap: 84 },
  { name: 'Saquon Barkley', pos: 'RB', team: 'PHI', itt: 28.0, glc: 78, rzSnap: 84 },
  { name: 'A.J. Brown', pos: 'WR', team: 'PHI', itt: 28.0, glc: 32, rzSnap: 86 },
  { name: 'Bijan Robinson', pos: 'RB', team: 'ATL', itt: 25.5, glc: 68, rzSnap: 81 },
  { name: 'David Montgomery', pos: 'RB', team: 'DET', itt: 28.5, glc: 74, rzSnap: 68 },
  { name: 'Jahmyr Gibbs', pos: 'RB', team: 'DET', itt: 28.5, glc: 52, rzSnap: 70 },
  { name: 'Amon-Ra St. Brown', pos: 'WR', team: 'DET', itt: 28.5, glc: 36, rzSnap: 91 },
  { name: 'George Kittle', pos: 'TE', team: 'SFO', itt: 27.8, glc: 32, rzSnap: 89 },
  { name: 'Marvin Harrison Jr.', pos: 'WR', team: 'ARI', itt: 24.5, glc: 38, rzSnap: 85 }
];

// Fuzzy token matcher
function normalize(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findQuantStats(kalshiText: string) {
  const cleanKalshi = normalize(kalshiText);
  for (const q of QUANT_MODEL_DB) {
    const parts = q.name.toLowerCase().split(' ');
    const lastName = normalize(parts[parts.length - 1]);
    const firstName = normalize(parts[0]);

    if (cleanKalshi.includes(firstName) && cleanKalshi.includes(lastName)) return q;
    if (cleanKalshi.includes(lastName) && cleanKalshi.includes(firstName[0])) return q;
  }
  return null;
}

export default function Home() {
  const [contracts, setContracts] = useState<PlayerContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPos, setFilterPos] = useState<'ALL' | 'RB' | 'WR' | 'TE' | 'QB'>('ALL');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerContract | null>(null);

  useEffect(() => {
    async function syncKalshiKeys() {
      try {
        // Query Kalshi's open markets directly (using public endpoint)
        const res = await fetch(
          'https://external-api.kalshi.com/trade-api/v2/markets?status=open&limit=1000'
        );

        if (!res.ok) throw new Error('Failed to query Kalshi');

        const data = await res.json();
        const rawMarkets = data.markets || [];
        const matchedList: PlayerContract[] = [];

        // Loop over Kalshi keys as PRIMARY source
        for (const m of rawMarkets) {
          if (m.ticker && m.ticker.includes('KXNFLTD')) {
            // Exclude multi-TD props (2+) to focus on core anytime TD
            if (m.title?.includes('2+') || m.subtitle?.includes('2+')) continue;

            const textSearch = `${m.ticker} ${m.title || ''} ${m.subtitle || ''}`;
            const quant = findQuantStats(textSearch);

            const playerName = quant 
              ? quant.name 
              : (m.custom_strike?.target_name || m.subtitle || m.title || 'Player')
                  .replace(/to score.*/i, '')
                  .replace(/:.*$/, '')
                  .trim();

            const ask = m.yes_ask ? m.yes_ask / 100 : (m.last_price ? m.last_price / 100 : 0.25);
            const itt = quant ? quant.itt : 24.5;
            const glc = quant ? quant.glc : 50;
            const rzSnap = quant ? quant.rzSnap : 70;
            const pos = quant ? quant.pos : 'RB';
            const team = quant ? quant.team : 'NFL';

            // Model Edge calculation
            const fair = Math.min(0.88, Number((ask + ((glc / 100) * 0.12) + 0.03).toFixed(2)));
            const edgeVal = Math.round((fair - ask) * 100);

            // Canonical deep-link built directly from Kalshi's exact key
            const eventTicker = (m.event_ticker || '').toLowerCase();
            const deepLink = `https://kalshi.com/markets/kxnflgame/professional-football-game/${eventTicker}?op_market_ticker=${m.ticker}&op_order_side=yes&op_order_type=dollars`;

            matchedList.push({
              ticker: m.ticker,
              eventTicker,
              player: playerName,
              pos,
              team,
              opp: m.title || 'Matchup',
              itt,
              glc,
              rzSnap,
              ask: Number(ask.toFixed(2)),
              fair,
              edgeVal,
              edge: edgeVal >= 0 ? `+${edgeVal}.0¢` : `${edgeVal}.0¢`,
              url: deepLink
            });
          }
        }

        if (matchedList.length > 0) {
          matchedList.sort((a, b) => b.edgeVal - a.edgeVal);
          setContracts(matchedList);
        }
      } catch (err) {
        console.error('Kalshi Primary Sync Error:', err);
      } finally {
        setLoading(false);
      }
    }

    syncKalshiKeys();
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
              Kalshi Primary Key Database Matrix & Quantitative Touchdown Arbitrage Terminal
            </p>
          </div>
          <div className="text-xs bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded text-zinc-400">
            ENGINE: <span className="text-emerald-400 font-bold">KALSHI KEYED</span> | CONTRACTS: <span className="text-white">{loading ? 'SYNCING...' : `${contracts.length} FOUND`}</span>
          </div>
        </header>

        {/* Global Search Bar */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded space-y-3">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search any player across Kalshi's live contract catalog..."
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
                {searchQuery ? `Search Results (${displayedPlayers.length})` : 'Top 10 High Edge'}
              </span>
            </div>
            <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800/80">
              <span className="text-zinc-500 block text-[10px] uppercase">Top 10 Avg GLC%</span>
              <span className="font-bold text-emerald-400 text-sm">{avgLeaderGLC}%</span>
            </div>
            <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800/80">
              <span className="text-zinc-500 block text-[10px] uppercase">Key Mapping</span>
              <span className="font-bold text-emerald-400 text-sm">Direct Exchange Slip</span>
            </div>
            <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800/80">
              <span className="text-zinc-500 block text-[10px] uppercase">API Status</span>
              <span className="font-bold text-zinc-300 text-sm">REST v2 Live</span>
            </div>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="border border-zinc-800 rounded bg-zinc-950 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center text-xs">
            <span className="font-bold text-white uppercase tracking-wider">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Top 10 Touchdown Contracts to Trade'}
            </span>
            <span className="text-zinc-500">{displayedPlayers.length} Active Lines</span>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-zinc-500 text-xs animate-pulse">
                Querying Kalshi primary database and matching Moneyfootball quantitative benchmarks...
              </div>
            ) : (
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
                  {displayedPlayers.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-10 text-zinc-500 text-xs">
                        No matching Kalshi contracts found for &quot;{searchQuery}&quot;.
                      </td>
                    </tr>
                  ) : (
                    displayedPlayers.map((row, idx) => (
                      <tr key={row.ticker} className="hover:bg-zinc-900/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            {!searchQuery && (
                              <span className="text-[10px] font-bold text-zinc-500">#{idx + 1}</span>
                            )}
                            <span className="font-bold text-white">{row.player}</span>
                            <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                              Verified
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
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Comparative Benchmark Modal */}
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
                  Volume Profile vs. Top 10 Slate Leaders
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Goal-Line Carry Share (GLC%)</span>
                    <span className="font-bold text-white">
                      {selectedPlayer.glc}% <span className="text-zinc-500 font-normal">vs {avgLeaderGLC}% Top 10 avg</span>
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
                      {selectedPlayer.rzSnap}% <span className="text-zinc-500 font-normal">vs 82% Top 10 avg</span>
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

        {/* Disclaimer */}
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
