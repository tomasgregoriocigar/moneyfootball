'use client';

import React, { useState } from 'react';

interface PlayerTarget {
  tier: string;
  name: string;
  ticker: string;
  pos: string;
  team: string;
  opponent: string;
  vegasITT: string;
  tpiFairVal: string;
  kalshiAsk: string;
  polyAsk: string;
  deVigBook: string;
  netEdge: string;
  signal: string;
  kalshiUrl: string;
  polyUrl: string;
  decaySub3: string;
  decay5Yrd: string;
  decay10Yrd: string;
  decay20Yrd: string;
  gateITT: string;
  gateSub3: string;
  gateUnderCenter: string;
  bestMarket: string;
}

const TARGETS: PlayerTarget[] = [
  {
    tier: 'TIER 1',
    name: 'Derrick Henry',
    ticker: 'KXNFLTD-26OCT04-DHEN',
    pos: 'RB',
    team: 'BAL',
    opponent: 'VS. TEN',
    vegasITT: '27.50',
    tpiFairVal: '84.6%',
    kalshiAsk: '64¢',
    polyAsk: '62¢',
    deVigBook: '59.2%',
    netEdge: '+22.6%',
    signal: 'BUY YES (MAX)',
    kalshiUrl: 'https://kalshi.com/markets/kxnfltd/ten-titans-vs-bal-ravens-touchdowns/KXNFLTD-26OCT04TENBAL?utm_source=kalshiapp_eventdetails',
    polyUrl: 'https://polymarket.com',
    decaySub3: '57%',
    decay5Yrd: '21.1%',
    decay10Yrd: '8.1%',
    decay20Yrd: '1.7%',
    gateITT: 'PASSED (27.5)',
    gateSub3: '88%',
    gateUnderCenter: '72%',
    bestMarket: '62¢ vs. Model Fair Value: 84.6¢'
  },
  {
    tier: 'TIER 1',
    name: "Ja'Marr Chase",
    ticker: 'KXNFLTD-26OCT04-JCHA',
    pos: 'WR',
    team: 'CIN',
    opponent: 'VS. JAX',
    vegasITT: '26.25',
    tpiFairVal: '68.4%',
    kalshiAsk: '51¢',
    polyAsk: '50¢',
    deVigBook: '48.5%',
    netEdge: '+18.4%',
    signal: 'BUY YES',
    kalshiUrl: 'https://kalshi.com/markets/kxnfltd/pro-football-touchdowns/KXNFLTD-26OCT04JACCIN',
    polyUrl: 'https://polymarket.com',
    decaySub3: '14%',
    decay5Yrd: '29.0%',
    decay10Yrd: '38.5%',
    decay20Yrd: '18.5%',
    gateITT: 'PASSED (26.25)',
    gateSub3: '34% Red-Zone Share',
    gateUnderCenter: 'Pass-Heavy Script',
    bestMarket: '50¢ vs. Model Fair Value: 68.4¢'
  },
  {
    tier: 'TIER 2',
    name: 'Kyren Williams',
    ticker: 'KXNFLTD-26OCT04-KWIL',
    pos: 'RB',
    team: 'LAR',
    opponent: '@ PHI',
    vegasITT: '23.00',
    tpiFairVal: '59.1%',
    kalshiAsk: '48¢',
    polyAsk: '49¢',
    deVigBook: '46.2%',
    netEdge: '+10.1%',
    signal: 'BUY YES',
    kalshiUrl: 'https://kalshi.com',
    polyUrl: 'https://polymarket.com',
    decaySub3: '49%',
    decay5Yrd: '24.0%',
    decay10Yrd: '18.0%',
    decay20Yrd: '9.0%',
    gateITT: 'BORDERLINE (23.0)',
    gateSub3: '81%',
    gateUnderCenter: '65%',
    bestMarket: '48¢ vs. Model Fair Value: 59.1¢'
  },
  {
    tier: 'TIER 2',
    name: 'J.K. Dobbins',
    ticker: 'KXNFLTD-26OCT04-JDOB',
    pos: 'RB',
    team: 'LAC',
    opponent: '@ SEA',
    vegasITT: '21.50',
    tpiFairVal: '44.2%',
    kalshiAsk: '36¢',
    polyAsk: '35¢',
    deVigBook: '34.0%',
    netEdge: '+8.2%',
    signal: 'BUY YES',
    kalshiUrl: 'https://kalshi.com',
    polyUrl: 'https://polymarket.com',
    decaySub3: '42%',
    decay5Yrd: '28.0%',
    decay10Yrd: '19.0%',
    decay20Yrd: '11.0%',
    gateITT: 'MARGINAL (21.5)',
    gateSub3: '74%',
    gateUnderCenter: '58%',
    bestMarket: '35¢ vs. Model Fair Value: 44.2¢'
  },
  {
    tier: 'TIER 2',
    name: 'Jordan Addison',
    ticker: 'KXNFLTD-26OCT04-JADD',
    pos: 'WR',
    team: 'MIN',
    opponent: 'VS. MIA',
    vegasITT: '22.00',
    tpiFairVal: '48.6%',
    kalshiAsk: '38¢',
    polyAsk: '39¢',
    deVigBook: '36.5%',
    netEdge: '+10.6%',
    signal: 'BUY YES',
    kalshiUrl: 'https://kalshi.com',
    polyUrl: 'https://polymarket.com',
    decaySub3: '10%',
    decay5Yrd: '25.0%',
    decay10Yrd: '40.0%',
    decay20Yrd: '25.0%',
    gateITT: 'PASSED (Jefferson OUT)',
    gateSub3: '29% Target Share',
    gateUnderCenter: 'Slot Primary',
    bestMarket: '38¢ vs. Model Fair Value: 48.6¢'
  }
];

export default function Home() {
  const [expanded, setExpanded] = useState<string | null>('KXNFLTD-26OCT04-DHEN');

  const toggleExpand = (ticker: string) => {
    setExpanded(prev => (prev === ticker ? null : ticker));
  };

  return (
    <main className="min-h-screen bg-black text-zinc-100 font-sans p-3 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Terminal Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase">
              MONEYFOOTBALL // QUANT TERMINAL
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-zinc-900 border border-emerald-500/40 text-emerald-400 font-bold">
              v4.3 DUAL-ENGINE
            </span>
            <span className="text-zinc-500 hidden sm:inline">|</span>
            <span className="text-zinc-400">EXCHANGES: <strong className="text-zinc-200">KALSHI + POLYMARKET</strong></span>
            <span className="text-zinc-500 hidden sm:inline">|</span>
            <span className="text-zinc-400">WEEK 4 TARGETS: <strong className="text-emerald-400">5 UNLOCKED</strong></span>
            <span className="text-zinc-500 hidden sm:inline">|</span>
            <span className="text-emerald-400">SNIPER HIT: <strong>83.3% (W1-W3)</strong></span>
          </div>
        </header>

        {/* Free Slate Active Notification */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3">
            <span className="text-emerald-400 text-lg">🔓</span>
            <p className="text-xs sm:text-sm font-mono text-zinc-300">
              <strong className="text-emerald-400">FREE INSTITUTIONAL ACCESS SLATE ACTIVE:</strong> All 5 Week 4 high-value touchdown discrepancy targets and quantitative audit drawers are unlocked for evaluation.
            </p>
          </div>
          <a
            href="https://whop.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-emerald-950 border border-emerald-500/60 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider hover:bg-emerald-900 transition text-center whitespace-nowrap"
          >
            WEEK 5 PAYWALL ($49/MO)
          </a>
        </div>

        {/* ========================================================= */}
        {/* 1. DESKTOP VIEW: FULL QUANT TABLE (≥ 768px)               */}
        {/* ========================================================= */}
        <div className="hidden md:block overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-500 font-mono bg-zinc-900/50">
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4">Player & Ticker</th>
                <th className="py-3 px-2 text-center">Pos</th>
                <th className="py-3 px-2 text-center">Team</th>
                <th className="py-3 px-3 text-center">Opponent</th>
                <th className="py-3 px-3 text-right">Vegas ITT</th>
                <th className="py-3 px-3 text-right text-emerald-400 font-bold">TPI Fair Val</th>
                <th className="py-3 px-3 text-right text-cyan-400 font-bold">Kalshi Ask</th>
                <th className="py-3 px-3 text-right text-purple-400 font-bold">Polymarket</th>
                <th className="py-3 px-3 text-right">De-Vig Book</th>
                <th className="py-3 px-3 text-right text-emerald-400 font-bold">Net Arb Edge</th>
                <th className="py-3 px-4 text-center">Execution Signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850 font-mono">
              {TARGETS.map((t) => {
                const isExp = expanded === t.ticker;
                return (
                  <React.Fragment key={t.ticker}>
                    <tr
                      onClick={() => toggleExpand(t.ticker)}
                      className={`cursor-pointer transition-colors ${
                        isExp ? 'bg-zinc-900/80' : 'hover:bg-zinc-900/40'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.tier === 'TIER 1' ? 'bg-emerald-950 border border-emerald-600/60 text-emerald-400' : 'bg-cyan-950 border border-cyan-600/60 text-cyan-400'
                        }`}>
                          {t.tier}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <div className="font-bold text-white flex items-center space-x-1.5">
                          <span>{t.name}</span>
                          <span className="text-[10px] text-zinc-500">{isExp ? '▲' : '▼'}</span>
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500">{t.ticker}</div>
                      </td>
                      <td className="py-3 px-2 text-center text-zinc-400">{t.pos}</td>
                      <td className="py-3 px-2 text-center font-bold text-white">{t.team}</td>
                      <td className="py-3 px-3 text-center text-zinc-400">{t.opponent}</td>
                      <td className="py-3 px-3 text-right text-zinc-300 font-bold">{t.vegasITT}</td>
                      <td className="py-3 px-3 text-right text-emerald-400 font-bold">{t.tpiFairVal}</td>
                      <td className="py-3 px-3 text-right text-cyan-300 font-bold">{t.kalshiAsk}</td>
                      <td className="py-3 px-3 text-right text-purple-300 font-bold">{t.polyAsk}</td>
                      <td className="py-3 px-3 text-right text-zinc-400">{t.deVigBook}</td>
                      <td className="py-3 px-3 text-right text-emerald-400 font-bold">{t.netEdge}</td>
                      <td className="py-3 px-4 text-center font-sans">
                        <span className="px-3 py-1 rounded bg-emerald-950 border border-emerald-500/60 text-emerald-400 text-xs font-bold">
                          {t.signal}
                        </span>
                      </td>
                    </tr>

                    {/* Expandable Audit Drawer */}
                    {isExp && (
                      <tr className="bg-zinc-950/90 border-y border-zinc-800">
                        <td colSpan={12} className="p-5">
                          <div className="grid grid-cols-3 gap-6 font-mono text-xs">
                            <div className="space-y-2">
                              <div className="text-zinc-500 font-bold uppercase text-[10px]">
                                {t.pos} 4-ZONE DISTANCE DECAY BREAKDOWN
                              </div>
                              <div className="flex justify-between py-1 border-b border-zinc-900">
                                <span className="text-zinc-400">Under 3 Yrd Line Carry:</span>
                                <span className="text-emerald-400 font-bold">{t.decaySub3}</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-zinc-900">
                                <span className="text-zinc-400">5 Yrd Line Plunge:</span>
                                <span className="text-zinc-300">{t.decay5Yrd}</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-zinc-900">
                                <span className="text-zinc-400">10 Yrd Line Conversion:</span>
                                <span className="text-zinc-300">{t.decay10Yrd}</span>
                              </div>
                              <div className="flex justify-between py-1">
                                <span className="text-zinc-400">20 Yrd Line Conversion:</span>
                                <span className="text-zinc-300">{t.decay20Yrd}</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="text-zinc-500 font-bold uppercase text-[10px]">
                                INSTITUTIONAL GATE VERIFICATION
                              </div>
                              <div className="flex justify-between py-1 border-b border-zinc-900">
                                <span className="text-zinc-400">Vegas ITT Gate (&ge;24.0):</span>
                                <span className="text-emerald-400 font-bold">{t.gateITT}</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-zinc-900">
                                <span className="text-zinc-400">Goal-to-Go Share (&ge;75%):</span>
                                <span className="text-emerald-400 font-bold">{t.gateSub3}</span>
                              </div>
                              <div className="flex justify-between py-1">
                                <span className="text-zinc-400">Personnel Alignment:</span>
                                <span className="text-emerald-400 font-bold">{t.gateUnderCenter}</span>
                              </div>
                            </div>

                            <div className="space-y-3 flex flex-col justify-between">
                              <div>
                                <div className="text-zinc-500 font-bold uppercase text-[10px]">
                                  EXECUTION ROUTE &amp; ORDER BOOK
                                </div>
                                <p className="text-zinc-400 mt-1">
                                  {t.bestMarket} | Calculated Net Edge: <span className="text-emerald-400 font-bold">{t.netEdge}</span>
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <a
                                  href={t.kalshiUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 text-center py-2 px-3 rounded bg-cyan-950 border border-cyan-600/60 text-cyan-300 font-bold hover:bg-cyan-900 transition"
                                >
                                  View Kalshi Book &rarr;
                                </a>
                                <a
                                  href={t.polyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 text-center py-2 px-3 rounded bg-purple-950 border border-purple-600/60 text-purple-300 font-bold hover:bg-purple-900 transition"
                                >
                                  View Polymarket Book &rarr;
                                </a>
                              </div>
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

        {/* ========================================================= */}
        {/* 2. MOBILE VIEW: RESPONSIVE CARDS FEED (< 768px)          */}
        {/* ========================================================= */}
        <div className="block md:hidden space-y-4">
          {TARGETS.map((t) => {
            const isExp = expanded === t.ticker;
            return (
              <div 
                key={t.ticker} 
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-lg"
              >
                {/* Mobile Card Header */}
                <div 
                  onClick={() => toggleExpand(t.ticker)}
                  className="flex items-center justify-between pb-3 border-b border-zinc-850 cursor-pointer"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-base">{t.name}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                        {t.pos} &bull; {t.team}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500 font-mono mt-0.5">
                      {t.opponent} &bull; ITT: <span className="text-zinc-200 font-bold">{t.vegasITT}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                      t.tier === 'TIER 1' ? 'border-emerald-600/60 bg-emerald-950 text-emerald-400' : 'border-cyan-600/60 bg-cyan-950 text-cyan-400'
                    }`}>
                      {t.tier}
                    </span>
                    <span className="text-zinc-500 text-xs">{isExp ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Primary Metric Grid (3-Col) */}
                <div className="grid grid-cols-3 gap-2 my-3 text-center font-mono">
                  <div className="bg-zinc-900 rounded-lg p-2 border border-zinc-800">
                    <div className="text-[10px] uppercase text-zinc-500">TPI FAIR</div>
                    <div className="text-sm font-bold text-emerald-400">{t.tpiFairVal}</div>
                  </div>
                  <div className="bg-zinc-900 rounded-lg p-2 border border-zinc-800">
                    <div className="text-[10px] uppercase text-zinc-500">BEST ASK</div>
                    <div className="text-sm font-bold text-zinc-200">{t.kalshiAsk}</div>
                  </div>
                  <div className="bg-emerald-950/40 rounded-lg p-2 border border-emerald-800/40">
                    <div className="text-[10px] uppercase text-emerald-500">NET EDGE</div>
                    <div className="text-sm font-bold text-emerald-400">{t.netEdge}</div>
                  </div>
                </div>

                {/* Mobile Drawer Details (Expandable) */}
                {isExp && (
                  <div className="bg-zinc-900/60 rounded-lg p-3 my-3 text-xs font-mono space-y-2 border border-zinc-850">
                    <div className="flex justify-between border-b border-zinc-800 pb-1">
                      <span className="text-zinc-400">Under 3yd Carry Share:</span>
                      <span className="text-emerald-400 font-bold">{t.decaySub3}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800 pb-1">
                      <span className="text-zinc-400">Vegas ITT Gate:</span>
                      <span className="text-emerald-400 font-bold">{t.gateITT}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Personnel Alignment:</span>
                      <span className="text-zinc-200">{t.gateUnderCenter}</span>
                    </div>
                  </div>
                )}

                {/* Execution Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-850 font-mono text-xs">
                  <a
                    href={t.kalshiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center py-2 px-2 rounded-lg bg-cyan-950/80 border border-cyan-600/60 text-cyan-300 font-bold hover:bg-cyan-900 transition"
                  >
                    Kalshi ({t.kalshiAsk}) &rarr;
                  </a>
                  <a
                    href={t.polyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center py-2 px-2 rounded-lg bg-purple-950/80 border border-purple-600/60 text-purple-300 font-bold hover:bg-purple-900 transition"
                  >
                    Polymarket ({t.polyAsk}) &rarr;
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="text-center pt-8 pb-4 text-xs font-mono text-zinc-600 border-t border-zinc-900">
          MONEYFOOTBALL QUANT ENGINE &bull; DUAL-MARKET ARBITRAGE TERMINAL &bull; PRODUCTION STABLE
        </footer>

      </div>
    </main>
  );
}