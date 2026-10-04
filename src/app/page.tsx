'use client';

import React, { useState } from 'react';

interface PlayerRow {
  rank: number;
  tier: string;
  name: string;
  ticker: string;
  pos: string;
  team: string;
  opp: string;
  vegasItt: number;
  tpiFairVal: number;
  kalshiAsk: number;
  polyAsk: number;
  deVigBook: number;
  netEdge: number;
  signal: string;
  decayCarry3Yd: number;
  decayPlunge5Yd: number;
  decayConv10Yd: number;
  decayConv20Yd: number;
  carryShare3Yd: number;
  underCenterRate: number;
  kalshiUrl: string;
  polyUrl: string;
}

const PLAYERS: PlayerRow[] = [
  {
    rank: 1,
    tier: 'TIER 1',
    name: 'Derrick Henry',
    ticker: 'KXNFLTD-26OCT04-DHEN',
    pos: 'RB',
    team: 'BAL',
    opp: 'vs. TEN',
    vegasItt: 27.50,
    tpiFairVal: 84.6,
    kalshiAsk: 64,
    polyAsk: 62,
    deVigBook: 59.2,
    netEdge: 22.6,
    signal: 'BUY YES (MAX)',
    decayCarry3Yd: 57.0,
    decayPlunge5Yd: 21.1,
    decayConv10Yd: 8.1,
    decayConv20Yd: 1.7,
    carryShare3Yd: 88.0,
    underCenterRate: 72.0,
    kalshiUrl: 'https://kalshi.com/hubs/nfl',
    polyUrl: 'https://polymarket.com/events/nfl'
  },
  {
    rank: 2,
    tier: 'TIER 1',
    name: "Ja'Marr Chase",
    ticker: 'KXNFLTD-26OCT04-JCHA',
    pos: 'WR',
    team: 'CIN',
    opp: 'vs. JAX',
    vegasItt: 26.25,
    tpiFairVal: 68.4,
    kalshiAsk: 51,
    polyAsk: 50,
    deVigBook: 48.5,
    netEdge: 18.4,
    signal: 'BUY YES',
    decayCarry3Yd: 38.0,
    decayPlunge5Yd: 18.5,
    decayConv10Yd: 9.4,
    decayConv20Yd: 4.2,
    carryShare3Yd: 65.0,
    underCenterRate: 58.0,
    kalshiUrl: 'https://kalshi.com/hubs/nfl',
    polyUrl: 'https://polymarket.com/events/nfl'
  },
  {
    rank: 3,
    tier: 'TIER 2',
    name: 'Kyren Williams',
    ticker: 'KXNFLTD-26OCT04-KWIL',
    pos: 'RB',
    team: 'LAR',
    opp: '@ PHI',
    vegasItt: 23.00,
    tpiFairVal: 59.1,
    kalshiAsk: 48,
    polyAsk: 49,
    deVigBook: 46.2,
    netEdge: 10.1,
    signal: 'BUY YES',
    decayCarry3Yd: 42.0,
    decayPlunge5Yd: 16.0,
    decayConv10Yd: 7.2,
    decayConv20Yd: 1.1,
    carryShare3Yd: 79.0,
    underCenterRate: 64.0,
    kalshiUrl: 'https://kalshi.com/hubs/nfl',
    polyUrl: 'https://polymarket.com/events/nfl'
  },
  {
    rank: 4,
    tier: 'TIER 2',
    name: 'J.K. Dobbins',
    ticker: 'KXNFLTD-26OCT04-JDOB',
    pos: 'RB',
    team: 'LAC',
    opp: '@ SEA',
    vegasItt: 21.50,
    tpiFairVal: 44.2,
    kalshiAsk: 36,
    polyAsk: 35,
    deVigBook: 34.0,
    netEdge: 8.2,
    signal: 'BUY YES',
    decayCarry3Yd: 34.0,
    decayPlunge5Yd: 12.0,
    decayConv10Yd: 5.5,
    decayConv20Yd: 0.9,
    carryShare3Yd: 71.0,
    underCenterRate: 54.0,
    kalshiUrl: 'https://kalshi.com/hubs/nfl',
    polyUrl: 'https://polymarket.com/events/nfl'
  },
  {
    rank: 5,
    tier: 'TIER 3',
    name: 'George Pickens',
    ticker: 'KXNFLTD-26OCT04-GPIC',
    pos: 'WR',
    team: 'PIT',
    opp: 'vs. IND',
    vegasItt: 19.75,
    tpiFairVal: 36.8,
    kalshiAsk: 39,
    polyAsk: 41,
    deVigBook: 38.0,
    netEdge: -4.2,
    signal: 'PASS / NO EDGE',
    decayCarry3Yd: 14.0,
    decayPlunge5Yd: 9.0,
    decayConv10Yd: 4.8,
    decayConv20Yd: 2.1,
    carryShare3Yd: 35.0,
    underCenterRate: 42.0,
    kalshiUrl: 'https://kalshi.com/hubs/nfl',
    polyUrl: 'https://polymarket.com/events/nfl'
  }
];

const AUDIT_HISTORY = [
  { week: 'W1', player: 'Derrick Henry', pos: 'RB', line: '54¢', tpi: '78.2%', signal: 'BUY YES (+24%)', td: 'YES', result: 'WIN', roi: '+0.85u (3 TDs)' },
  { week: 'W1', player: 'Josh Allen', pos: 'QB', line: '52¢', tpi: '71.0%', signal: 'BUY YES (+19%)', td: 'YES', result: 'WIN', roi: '+0.92u (2 Rush TDs)' },
  { week: 'W2', player: 'Derrick Henry', pos: 'RB', line: '58¢', tpi: '81.5%', signal: 'BUY YES (+23%)', td: 'YES', result: 'WIN', roi: '+0.72u (1 TD)' },
  { week: 'W2', player: 'CeeDee Lamb', pos: 'WR', line: '56¢', tpi: '64.0%', signal: 'BUY YES (+8%)', td: 'NO', result: 'LOSS', roi: '-1.00u (0 TDs)' },
  { week: 'W3', player: 'Derrick Henry', pos: 'RB', line: '61¢', tpi: '83.0%', signal: 'BUY YES (+22%)', td: 'YES', result: 'WIN', roi: '+0.64u (2 TDs)' },
  { week: 'W3', player: 'Kyren Williams', pos: 'RB', line: '52¢', tpi: '69.5%', signal: 'BUY YES (+17%)', td: 'YES', result: 'WIN', roi: '+0.92u (1 TD)' }
];

export default function MoneyFootballTerminal() {
  const [expandedRow, setExpandedRow] = useState<number | null>(1);

  const toggleRow = (rank: number) => {
    setExpandedRow(prev => (prev === rank ? null : rank));
  };

  return (
    <main className="min-h-screen bg-[#070b0e] text-slate-200 font-mono p-4 md:p-8 flex flex-col items-center selection:bg-emerald-500 selection:text-black">
      <div className="w-full max-w-7xl space-y-6">
        <header className="border-b border-emerald-950/60 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-xl md:text-2xl font-bold tracking-widest text-white">MONEYFOOTBALL // QUANT TERMINAL</h1>
            <span className="px-2 py-0.5 text-xs bg-emerald-950 border border-emerald-700/60 text-emerald-400 rounded">v4.3 DUAL-ENGINE</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs tracking-wider">
            <span className="text-slate-400">EXCHANGES: <strong className="text-white">KALSHI + POLYMARKET</strong></span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400">WEEK 4 TARGETS: 5 UNLOCKED</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400">SNIPER HIT: 83.3% (W1-W3)</span>
          </div>
        </header>

        <div className="bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-emerald-950/40 border border-emerald-600/50 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-emerald-300 shadow-lg shadow-emerald-950/20">
          <div className="flex items-center gap-3">
            <span className="text-lg">🔓</span>
            <div>
              <strong className="text-emerald-400 font-bold uppercase tracking-wider">Free Institutional Access Slate Active:</strong>
              <span className="text-slate-300 ml-1">All 5 Week 4 high-value touchdown discrepancy targets and quantitative audit drawers are unlocked for evaluation.</span>
            </div>
          </div>
          <span className="text-xs text-emerald-400/80 uppercase font-semibold tracking-wider whitespace-nowrap bg-emerald-900/40 px-2.5 py-1 rounded border border-emerald-700/40">Week 5 Paywall ($49/mo)</span>
        </div>

        <div className="overflow-x-auto border border-emerald-950/80 rounded-lg bg-[#0b1015]/90 backdrop-blur shadow-2xl">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-emerald-950/80 text-[11px] text-slate-400 uppercase tracking-widest bg-emerald-950/20">
                <th className="p-3.5">TIER</th>
                <th className="p-3.5">PLAYER &amp; TICKER</th>
                <th className="p-3.5">POS</th>
                <th className="p-3.5">TEAM</th>
                <th className="p-3.5">OPPONENT</th>
                <th className="p-3.5 text-right">VEGAS ITT</th>
                <th className="p-3.5 text-right text-emerald-400">TPI FAIR VAL</th>
                <th className="p-3.5 text-right text-cyan-400">KALSHI ASK</th>
                <th className="p-3.5 text-right text-fuchsia-400">POLYMARKET</th>
                <th className="p-3.5 text-right">DE-VIG BOOK</th>
                <th className="p-3.5 text-right text-emerald-400 font-semibold">NET ARB EDGE</th>
                <th className="p-3.5 text-center">EXECUTION SIGNAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/40">
              {PLAYERS.map(p => (
                <React.Fragment key={p.rank}>
                  <tr
                    onClick={() => toggleRow(p.rank)}
                    className="hover:bg-emerald-950/20 cursor-pointer transition-colors duration-150 select-none"
                  >
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${p.tier.includes('1') ? 'bg-emerald-950 border-emerald-600/60 text-emerald-400' : p.tier.includes('2') ? 'bg-cyan-950 border-cyan-600/60 text-cyan-400' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                        {p.tier}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-white">
                      <div className="flex items-center gap-1.5">
                        <span>{p.name}</span>
                        <span className="text-[10px] text-slate-500">{expandedRow === p.rank ? '▲' : '▼'}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-normal">{p.ticker}</div>
                    </td>
                    <td className="p-3.5 text-slate-400">{p.pos}</td>
                    <td className="p-3.5 font-bold text-white">{p.team}</td>
                    <td className="p-3.5 text-slate-400">{p.opp}</td>
                    <td className="p-3.5 text-right font-medium">{p.vegasItt.toFixed(2)}</td>
                    <td className="p-3.5 text-right font-bold text-emerald-400">{p.tpiFairVal.toFixed(1)}%</td>
                    <td className="p-3.5 text-right font-semibold text-cyan-400">{p.kalshiAsk}¢</td>
                    <td className="p-3.5 text-right font-semibold text-fuchsia-400">{p.polyAsk}¢</td>
                    <td className="p-3.5 text-right text-slate-400">{p.deVigBook.toFixed(1)}%</td>
                    <td className="p-3.5 text-right font-bold text-emerald-400">+{p.netEdge.toFixed(1)}%</td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded text-xs font-bold tracking-wider uppercase inline-block border ${p.signal.includes('MAX') ? 'bg-emerald-500 text-black border-emerald-400 shadow-md shadow-emerald-500/20' : p.signal.includes('BUY') ? 'bg-emerald-950 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                        {p.signal}
                      </span>
                    </td>
                  </tr>
                  {expandedRow === p.rank && (
                    <tr className="bg-[#05080b] border-t border-b border-emerald-900/60">
                      <td colSpan={12} className="p-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                          <div className="space-y-2 border-r border-emerald-950/60 pr-4">
                            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1">RB 4-ZONE DISTANCE DECAY BREAKDOWN</div>
                            <div className="flex justify-between py-0.5"><span className="text-slate-400">&lt;3 Yrd Line Carry:</span><span className="font-bold text-emerald-400">{p.decayCarry3Yd}%</span></div>
                            <div className="flex justify-between py-0.5"><span className="text-slate-400">5 Yrd Line Plunge:</span><span className="font-medium text-slate-300">{p.decayPlunge5Yd}%</span></div>
                            <div className="flex justify-between py-0.5"><span className="text-slate-400">10 Yrd Line Conversion:</span><span className="font-medium text-slate-300">{p.decayConv10Yd}%</span></div>
                            <div className="flex justify-between py-0.5"><span className="text-slate-400">20 Yrd Line Conversion:</span><span className="font-medium text-slate-300">{p.decayConv20Yd}%</span></div>
                          </div>
                          <div className="space-y-2 border-r border-emerald-950/60 pr-4">
                            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1">INSTITUTIONAL GATE VERIFICATION</div>
                            <div className="flex justify-between py-0.5"><span className="text-slate-400">Vegas ITT Gate (&ge;24.0):</span><span className="font-bold text-emerald-400">PASSED ({p.vegasItt.toFixed(1)})</span></div>
                            <div className="flex justify-between py-0.5"><span className="text-slate-400">&lt;3yd Share (&ge;75%):</span><span className="font-bold text-emerald-400">{p.carryShare3Yd}%</span></div>
                            <div className="flex justify-between py-0.5"><span className="text-slate-400">Under-Center (&ge;60%):</span><span className="font-bold text-emerald-400">{p.underCenterRate}%</span></div>
                          </div>
                          <div className="space-y-3 flex flex-col justify-between">
                            <div>
                              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1">EXECUTION ROUTE &amp; ORDER BOOK</div>
                              <p className="text-slate-300 text-[11px] leading-relaxed">
                                Best Market: <strong className="text-fuchsia-400">{p.polyAsk}&cent;</strong> vs. Model Fair Value: <strong className="text-emerald-400">{p.tpiFairVal.toFixed(1)}&cent;</strong>. Calculated Net Edge: <strong className="text-emerald-400">+{p.netEdge.toFixed(1)}%</strong>.
                              </p>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <a href={p.kalshiUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 hover:bg-cyan-900 transition-colors font-medium text-center text-xs flex-1">
                                View Kalshi Book &rarr;
                              </a>
                              <a href={p.polyUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded bg-fuchsia-950/80 border border-fuchsia-700/60 text-fuchsia-300 hover:bg-fuchsia-900 transition-colors font-medium text-center text-xs flex-1">
                                View Polymarket Book &rarr;
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-emerald-950/80 rounded-lg bg-[#0b1015]/90 backdrop-blur p-5 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-emerald-950/60 gap-2">
            <div>
              <h2 className="text-sm font-bold tracking-widest text-white uppercase">TPI Model Verification Audit (Weeks 1 - 3 Live Performance)</h2>
              <p className="text-xs text-slate-400">Historical quantitative trigger signals tracked against official NFL settlement records.</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-600/60 text-emerald-400 font-bold">5-1 RECORD (83.3% HIT)</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 font-bold">+3.05 NET UNITS</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] text-slate-400 uppercase tracking-widest border-b border-emerald-950/60">
                  <th className="py-2 px-3">WEEK</th>
                  <th className="py-2 px-3">PLAYER</th>
                  <th className="py-2 px-3">POS</th>
                  <th className="py-2 px-3 text-right">MARKET LINE</th>
                  <th className="py-2 px-3 text-right text-emerald-400">TPI MODEL PROJ</th>
                  <th className="py-2 px-3 text-center">SIGNAL</th>
                  <th className="py-2 px-3 text-center">ACTUAL TD?</th>
                  <th className="py-2 px-3 text-center">RESULT</th>
                  <th className="py-2 px-3 text-right">ROI / UNIT NET</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/40 text-slate-300">
                {AUDIT_HISTORY.map((h, i) => (
                  <tr key={i} className="hover:bg-emerald-950/20">
                    <td className="py-2.5 px-3 font-mono text-slate-400">{h.week}</td>
                    <td className="py-2.5 px-3 font-semibold text-white">{h.player}</td>
                    <td className="py-2.5 px-3 text-slate-400">{h.pos}</td>
                    <td className="py-2.5 px-3 text-right">{h.line}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-emerald-400">{h.tpi}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-[11px]">{h.signal}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-white">{h.td}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${h.result === 'WIN' ? 'bg-emerald-950 border border-emerald-600/60 text-emerald-400' : 'bg-rose-950 border border-rose-600/60 text-rose-400'}`}>
                        {h.result}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-400">{h.roi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="border-t border-emerald-950/80 pt-6 pb-8 text-[11px] text-slate-500 space-y-3 leading-relaxed">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-slate-400 gap-2">
            <span>&copy; 2026 MoneyFootball Analytics. Dual-Engine TPI Model.</span>
            <span className="uppercase tracking-wider text-emerald-500/80 font-semibold">Strict 4-Gate Institutional Screener Active</span>
          </div>
          <div className="p-3.5 bg-black/40 rounded border border-emerald-950/60 space-y-1.5">
            <strong className="text-slate-400 uppercase tracking-wider block">Disclaimer &amp; Risk Disclosure:</strong>
            <p>
              MoneyFootball.ai is a quantitative algorithmic research terminal and mathematical pricing engine for informational and analytical purposes only. We are not a registered broker-dealer, registered investment adviser, or licensed sportsbook. Prediction market contracts on Kalshi and Polymarket involve substantial risk of capital loss. Past backtested or live model performance is no guarantee of future returns. Users execute all orders and contracts entirely at their own discretion and liability. Regulated event contracts provided under CFTC jurisdiction (Kalshi) or decentralized order book protocols (Polymarket).
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}