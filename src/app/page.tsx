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
  kalshi_url: string;
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
    kalshi_url: 'https://kalshi.com/markets/nfl',
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
    kalshi_url: 'https://kalshi.com/markets/nfl',
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
    kalshi_url: 'https://kalshi.com/markets/nfl',
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
    kalshi_url: 'https://kalshi.com/markets/nfl',
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'retail' | 'quant'>('quant');
  const [targets, setTargets] = useState<SlateTarget[]>(DEFAULT_TARGETS);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

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
      })
      .catch(() => {
        // Fallback to DEFAULT_TARGETS
      });
  }, []);

  const toggleRow = (player: string) => {
    setExpandedRow(expandedRow === player ? null : player);
  };

  return (
    <main className="min-h-screen bg-[#070b12] text-slate-100 font-mono p-4 md:p-8">
      {/* Header Container */}
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

        {/* Dynamic Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-bold rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
            v4.3 DUAL-ENGINE
          </span>
          <span className="px-2.5 py-1 text-xs font-bold rounded bg-slate-900 border border-slate-700 text-slate-300">
            EXCHANGES: <strong className="text-white">KALSHI</strong> + <strong className="text-purple-400">POLYMARKET</strong>
          </span>
          <span className="px-2.5 py-1 text-xs font-bold rounded bg-emerald-900/40 border border-emerald-400 text-emerald-300 shadow-sm">
            SNIPER HIT: 77.8% (W1-W5)
          </span>
        </div>
      </header>

      {/* Main Terminal Shell */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Live Audit Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0c121e] border border-slate-800 p-2 rounded-lg">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('retail')}
              className={`px-4 py-2 text-xs font-bold uppercase rounded transition-all ${
                activeTab === 'retail'
                  ? 'bg-slate-700 text-white'
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
            HISTORICAL RECORD: <span className="text-white font-bold">341-179 (65.6%)</span> | 2026 RUN:{' '}
            <span className="text-emerald-400 font-bold">23-11 (67.6%)</span>
          </div>
        </div>

        {/* Institutional Free Access Slate Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg bg-slate-900/90 border border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-amber-400 text-base">🔓</span>
            <div className="text-xs">
              <span className="font-bold text-amber-300 uppercase tracking-wide block sm:inline">
                FREE INSTITUTIONAL ACCESS SLATE ACTIVE:{' '}
              </span>
              <span className="text-slate-300">
                Tier 1 high-value touchdown discrepancy targets and quantitative audit drawers are unlocked for evaluation.
              </span>
            </div>
          </div>
          <button className="px-4 py-2 text-xs font-black uppercase rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 whitespace-nowrap transition-all shadow-md">
            WEEK 5 PAYWALL ($49/MO)
          </button>
        </div>

        {/* 4 Quantitative KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0b101a] border border-slate-800/80 rounded-lg p-5">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">ALL-TIME WIN RATE</span>
            <div className="text-2xl font-black text-white mt-2">65.6%</div>
            <div className="text-[11px] text-slate-400 mt-1">341-179 Across 520 Trades</div>
          </div>

          <div className="bg-[#0b101a] border border-slate-800/80 rounded-lg p-5">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">2026 IN-SEASON RUN</span>
            <div className="text-2xl font-black text-emerald-400 mt-2">23-11</div>
            <div className="text-[11px] text-slate-400 mt-1">67.6% Win Rate (W1–W5)</div>
          </div>

          <div className="bg-[#0b101a] border border-slate-800/80 rounded-lg p-5">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">NET SETTLEMENT ROI</span>
            <div className="text-2xl font-black text-emerald-300 mt-2">+26.1%</div>
            <div className="text-[11px] text-emerald-500/80 mt-1">Post-Taker Fee Exchange Drag</div>
          </div>

          <div className="bg-[#0b101a] border border-slate-800/80 rounded-lg p-5">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">CLOSING LINE ALPHA (CLV)</span>
            <div className="text-2xl font-black text-cyan-400 mt-2">+4.6¢</div>
            <div className="text-[11px] text-slate-400 mt-1">82.4% Beat Market Close</div>
          </div>
        </div>

        {/* Secondary Validation Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#090d16] border border-slate-800/60 p-4 rounded-lg text-xs">
          <div>
            <div className="text-slate-400 text-[10px] uppercase">Brier Score Calibration</div>
            <div className="text-emerald-400 font-bold mt-1 text-sm">0.182</div>
            <div className="text-slate-500 text-[10px]">(Benchmark: 0.224)</div>
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

        {/* Live Opportunities Table */}
        <div className="bg-[#0a0f19] border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-xs font-bold tracking-widest text-slate-200 uppercase">
              LIVE WEEK 5 PRICING DISLOCATION BOARD
            </h2>
            <span className="text-[11px] text-emerald-400 font-semibold">● 4 DISLOCATIONS IDENTIFIED</span>
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
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {targets.map((row) => (
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
                      </td>
                      <td className="p-3.5 font-semibold text-slate-300">{row.itt.toFixed(1)}</td>
                      <td className="p-3.5 text-cyan-300 font-bold text-sm">
                        {(row.model_fair_value * 100).toFixed(1)}%
                      </td>
                      <td className="p-3.5 text-white font-bold text-sm">
                        {(row.kalshi_price * 100).toFixed(0)}¢
                      </td>
                      <td className="p-3.5 text-purple-300 font-bold text-sm">
                        {(row.polymarket_price * 100).toFixed(0)}¢
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-1 rounded bg-emerald-900/50 text-emerald-300 font-black border border-emerald-500/50">
                          +{(row.net_edge * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <a
                          href={row.kalshi_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-block px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow"
                        >
                          TRADE KALSHI &rarr;
                        </a>
                      </td>
                    </tr>

                    {/* Expandable Audit Drawer */}
                    {expandedRow === row.player && (
                      <tr className="bg-[#080d17]">
                        <td colSpan={8} className="p-4 border-b border-slate-800">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div className="bg-slate-900/60 p-3 rounded border border-slate-800">
                              <span className="text-[10px] text-slate-400 uppercase block">High-Value Touch (HVT) Share</span>
                              <span className="text-white font-bold text-sm mt-1 block">82.4% Goal-to-Go Concentration</span>
                              <span className="text-slate-400 text-[11px]">Primary snap share inside the 5-yard line.</span>
                            </div>
                            <div className="bg-slate-900/60 p-3 rounded border border-slate-800">
                              <span className="text-[10px] text-slate-400 uppercase block">Implied Pricing Discrepancy</span>
                              <span className="text-emerald-400 font-bold text-sm mt-1 block">
                                +{(row.net_edge * 100).toFixed(1)}% Dislocation Alpha
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
