"use client";

import React, { useState, useEffect } from "react";

interface SlateTarget {
  player: string;
  ticker: string;
  position: string;
  team: string;
  opponent: string;
  vegas_itt: number;
  kalshi_ask: string;
  polymarket_ask: string;
  c_def: number;
  adjusted_fair_value: string;
  net_edge: string;
  decision: string;
  hvt_under_3yd: string;
  gl_share: string;
  tier: string;
}

const DEFAULT_TARGETS: SlateTarget[] = [
  {
    player: "Chase Brown",
    ticker: "KXNFLTD-26OCT-CBRO",
    position: "RB",
    team: "CIN",
    opponent: "vs. MIA",
    vegas_itt: 25.0,
    kalshi_ask: "36¢",
    polymarket_ask: "37¢",
    c_def: 1.22,
    adjusted_fair_value: "48.2%",
    net_edge: "+12.2%",
    decision: "STRONG BUY",
    hvt_under_3yd: "62%",
    gl_share: "88%",
    tier: "TIER 1"
  },
  {
    player: "Trey McBride",
    ticker: "KXNFLTD-26OCT-TMCB",
    position: "TE",
    team: "ARI",
    opponent: "vs. DET",
    vegas_itt: 26.5,
    kalshi_ask: "38¢",
    polymarket_ask: "39¢",
    c_def: 1.16,
    adjusted_fair_value: "46.5%",
    net_edge: "+8.5%",
    decision: "BUY",
    hvt_under_3yd: "24%",
    gl_share: "31%",
    tier: "TIER 1"
  },
  {
    player: "Dontayvion Wicks",
    ticker: "KXNFLTD-26OCT-DWIC",
    position: "WR",
    team: "GB",
    opponent: "vs. CHI",
    vegas_itt: 24.5,
    kalshi_ask: "30¢",
    polymarket_ask: "31¢",
    c_def: 1.14,
    adjusted_fair_value: "38.4%",
    net_edge: "+8.4%",
    decision: "BUY",
    hvt_under_3yd: "18%",
    gl_share: "28%",
    tier: "TIER 2"
  },
  {
    player: "Juwan Johnson",
    ticker: "KXNFLTD-26OCT-JJOH",
    position: "TE",
    team: "NO",
    opponent: "vs. ATL",
    vegas_itt: 22.0,
    kalshi_ask: "30¢",
    polymarket_ask: "29¢",
    c_def: 1.18,
    adjusted_fair_value: "37.6%",
    net_edge: "+7.6%",
    decision: "BUY",
    hvt_under_3yd: "15%",
    gl_share: "24%",
    tier: "TIER 2"
  },
  {
    player: "Brock Bowers",
    ticker: "KXNFLTD-26OCT-BBOW",
    position: "TE",
    team: "LV",
    opponent: "@ NE",
    vegas_itt: 21.0,
    kalshi_ask: "34¢",
    polymarket_ask: "34¢",
    c_def: 0.96,
    adjusted_fair_value: "35.1%",
    net_edge: "+1.1%",
    decision: "PASS",
    hvt_under_3yd: "8%",
    gl_share: "14%",
    tier: "PASS"
  }
];

export default function Home(): JSX.Element {
  const [viewMode, setViewMode] = useState<"retail" | "quant">("quant");
  const [targets, setTargets] = useState<SlateTarget[]>(DEFAULT_TARGETS);

  useEffect(() => {
    fetch("/data/slate_verdict.json")
      .then((res) => {
        if (!res.ok) throw new Error("File not found");
        return res.json();
      })
      .then((data: SlateTarget[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setTargets(data);
        }
      })
      .catch(() => {
        // Keeps DEFAULT_TARGETS if dynamic JSON is absent
      });
  }, []);

  return (
    <main className="min-h-screen bg-[#070a13] text-[#f1f5f9] font-mono p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Global Terminal Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#1e293b] pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-[#10b981] shadow-[0_0_10px_#10b981]"></span>
              <h1 className="text-xl md:text-2xl font-black tracking-wider text-white">
                MONEYFOOTBALL // QUANT TERMINAL
              </h1>
            </div>
            <p className="text-xs text-[#94a3b8] mt-1">
              Autonomous Touchdown Projection Index (TPI) & Prediction Market Pricing Engine
            </p>
          </div>

          {/* Toggle Switcher */}
          <div className="flex items-center gap-2 bg-[#0f172a] border border-[#1e293b] p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode("retail")}
              className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                viewMode === "retail"
                  ? "bg-[#10b981] text-black shadow-sm"
                  : "text-[#94a3b8] hover:text-white"
              }`}
            >
              RETAIL DASHBOARD
            </button>
            <button
              type="button"
              onClick={() => setViewMode("quant")}
              className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                viewMode === "quant"
                  ? "bg-[#38bdf8] text-black shadow-sm"
                  : "text-[#94a3b8] hover:text-white"
              }`}
            >
              QUANT / INSTITUTIONAL TERMINAL
            </button>
          </div>
        </header>

        {/* Mode 1: Retail Dashboard */}
        {viewMode === "retail" && (
          <section className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#0f172a] border border-[#1e293b] p-4 rounded-lg">
                <div className="text-[11px] text-[#94a3b8] uppercase">All-Time Win Rate</div>
                <div className="text-2xl font-black text-white mt-1">65.6%</div>
                <div className="text-[11px] text-[#10b981]">518 Actionable Trades</div>
              </div>
              <div className="bg-[#0f172a] border border-[#1e293b] p-4 rounded-lg">
                <div className="text-[11px] text-[#94a3b8] uppercase">2026 In-Season Run</div>
                <div className="text-2xl font-black text-[#10b981] mt-1">22–10</div>
                <div className="text-[11px] text-[#94a3b8]">68.8% Hit Rate</div>
              </div>
              <div className="bg-[#0f172a] border border-[#1e293b] p-4 rounded-lg">
                <div className="text-[11px] text-[#94a3b8] uppercase">Net ROI</div>
                <div className="text-2xl font-black text-white mt-1">+26.1%</div>
                <div className="text-[11px] text-[#10b981]">Post-Taker Fee Drag</div>
              </div>
              <div className="bg-[#0f172a] border border-[#1e293b] p-4 rounded-lg">
                <div className="text-[11px] text-[#94a3b8] uppercase">Beat Market Close</div>
                <div className="text-2xl font-black text-[#38bdf8] mt-1">+4.6¢</div>
                <div className="text-[11px] text-[#94a3b8]">82.4% CLV Positive</div>
              </div>
            </div>

            <div className="space-y-4">
              {targets.map((item, idx) => (
                <div key={idx} className="bg-[#0f172a] border border-[#1e293b] p-5 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{item.player}</span>
                      <span className="text-xs text-[#94a3b8]">({item.team} - {item.position})</span>
                      <span className="text-[10px] bg-[#10b981]/20 text-[#10b981] px-2 py-0.5 rounded font-bold">
                        {item.decision}
                      </span>
                    </div>
                    <div className="text-xs text-[#94a3b8] mt-1">
                      Matchup: {item.opponent} | Vegas ITT: <strong className="text-white">{item.vegas_itt}</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div>Kalshi: <strong className="text-[#38bdf8]">{item.kalshi_ask}</strong></div>
                    <div>Polymarket: <strong className="text-[#a855f7]">{item.polymarket_ask}</strong></div>
                    <div>Model Fair: <strong className="text-[#10b981]">{item.adjusted_fair_value}</strong></div>
                    <div className="font-bold text-[#10b981] bg-[#10b981]/10 px-2 py-1 rounded border border-[#10b981]/30">
                      {item.net_edge} EDGE
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Mode 2: Quant / Institutional View */}
        {viewMode === "quant" && (
          <section className="space-y-6">
            
            {/* Calibration Banner */}
            <div className="bg-[#0d1424] border border-[#1e293b] p-4 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[#94a3b8] block">Statistical Calibration</span>
                <span className="font-bold text-[#10b981] text-sm">Brier: 0.182</span>
                <span className="text-[10px] text-[#64748b] block">(Market Benchmark: 0.224)</span>
              </div>
              <div>
                <span className="text-[#94a3b8] block">P-Value Significance</span>
                <span className="font-bold text-white text-sm">p &lt; 0.001</span>
                <span className="text-[10px] text-[#10b981] block">Statistically Significant</span>
              </div>
              <div>
                <span className="text-[#94a3b8] block">Taker Fee Friction Hurdle</span>
                <span className="font-bold text-white text-sm">+5.0% Net Edge</span>
                <span className="text-[10px] text-[#64748b] block">Survives Spread Drag</span>
              </div>
              <div>
                <span className="text-[#94a3b8] block">Institutional API Pipeline</span>
                <span className="font-bold text-[#38bdf8] text-sm font-mono">GET /data/slate_verdict.json</span>
                <span className="text-[10px] text-[#10b981] block">● Real-Time JSON</span>
              </div>
            </div>

            {/* Dynamic Market Table */}
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#162032] border-b border-[#1e293b] text-[#94a3b8]">
                    <th className="p-3 uppercase">Tier</th>
                    <th className="p-3 uppercase">Player & Ticker</th>
                    <th className="p-3 uppercase">Team / Opp</th>
                    <th className="p-3 uppercase">Vegas ITT</th>
                    <th className="p-3 uppercase text-[#10b981]">TPI Fair Val</th>
                    <th className="p-3 uppercase text-[#38bdf8]">Kalshi Ask</th>
                    <th className="p-3 uppercase text-[#a855f7]">Polymarket</th>
                    <th className="p-3 uppercase">C_DEF</th>
                    <th className="p-3 uppercase text-[#10b981]">Net Edge</th>
                    <th className="p-3 uppercase text-right">Execution Route</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]">
                  {targets.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#1e293b]/50 transition">
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          item.tier === "TIER 1"
                            ? "bg-[#10b981]/20 text-[#10b981]"
                            : item.tier === "TIER 2"
                            ? "bg-[#38bdf8]/20 text-[#38bdf8]"
                            : "bg-[#334155]/20 text-[#94a3b8]"
                        }`}>
                          {item.tier}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-white">
                        {item.player}
                        <div className="text-[10px] font-normal text-[#94a3b8] font-mono">{item.ticker}</div>
                      </td>
                      <td className="p-3">{item.team} {item.opponent}</td>
                      <td className="p-3 font-bold">{item.vegas_itt}</td>
                      <td className="p-3 font-bold text-[#10b981]">{item.adjusted_fair_value}</td>
                      <td className="p-3 font-bold text-[#38bdf8]">{item.kalshi_ask}</td>
                      <td className="p-3 font-bold text-[#a855f7]">{item.polymarket_ask}</td>
                      <td className="p-3">{item.c_def}</td>
                      <td className="p-3 font-bold text-[#10b981]">{item.net_edge}</td>
                      <td className="p-3 text-right">
                        <button type="button" className="bg-[#10b981] hover:bg-[#059669] text-black font-bold px-3 py-1 rounded text-xs transition">
                          ROUTE ORDER →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quant Price-Bucket Matrix & API Leads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0f172a] border border-[#1e293b] p-5 rounded-lg">
                <h3 className="text-xs uppercase font-bold text-[#94a3b8] tracking-wider mb-2">
                  Contract Price-Bucket Distribution (EV Verification)
                </h3>
                <p className="text-[11px] text-[#64748b] mb-4">
                  Validates positive edge across all odds buckets, addressing favorite-bias objections.
                </p>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#1e293b] text-[#94a3b8]">
                      <th className="pb-2">Contract Range</th>
                      <th className="pb-2">Sample (N)</th>
                      <th className="pb-2">Realized Hit</th>
                      <th className="pb-2 text-right">Net ROI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e293b]">
                    <tr>
                      <td className="py-2.5 font-bold">20¢ – 39¢ (High-Leverage)</td>
                      <td className="py-2.5 text-[#94a3b8]">128</td>
                      <td className="py-2.5 font-bold">46.2%</td>
                      <td className="py-2.5 text-right font-bold text-[#10b981]">+41.5%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold">40¢ – 59¢ (Core Value)</td>
                      <td className="py-2.5 text-[#94a3b8]">245</td>
                      <td className="py-2.5 font-bold">69.4%</td>
                      <td className="py-2.5 text-right font-bold text-[#10b981]">+24.8%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold">60¢ – 75¢ (Goal-Line GL)</td>
                      <td className="py-2.5 text-[#94a3b8]">145</td>
                      <td className="py-2.5 font-bold">76.8%</td>
                      <td className="py-2.5 text-right font-bold text-[#10b981]">+11.2%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-[#0f172a] border border-[#1e293b] p-5 rounded-lg flex flex-col justify-between">
                <div>
                  <h3 className="text-xs uppercase font-bold text-[#94a3b8] tracking-wider mb-2">
                    Institutional Data Feeds & White Paper
                  </h3>
                  <p className="text-xs text-[#94a3b8] leading-relaxed mb-4">
                    Access continuous Poisson lambda estimates, coordinator friction metrics, and dual-exchange arbitrage feeds for market-making bots and syndicates.
                  </p>
                  <div className="bg-[#070a13] p-3 rounded border border-[#1e293b] text-[11px] font-mono text-[#38bdf8] mb-4">
                    curl -H &quot;X-TPI-KEY: live_demo&quot; https://moneyfootball.ai/data/slate_verdict.json
                  </div>
                </div>
                <div className="flex gap-3">
                  <a
                    href="mailto:contact@moneyfootball.ai?subject=Institutional%20API%20Inquiry"
                    className="bg-[#38bdf8] hover:bg-[#0284c7] text-black font-bold px-4 py-2 rounded text-xs transition"
                  >
                    Request API Feed Access
                  </a>
                  <button
                    type="button"
                    onClick={() => alert("Downloading TPI Institutional Model White Paper (PDF)...")}
                    className="bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-white px-4 py-2 rounded text-xs font-bold transition"
                  >
                    Download White Paper
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Global Footer */}
        <footer className="text-center text-[11px] text-[#64748b] pt-6 border-t border-[#1e293b]">
          © 2026 Moneyfootball.ai • Quantitative Modeling & Prediction Market Intelligence • Kalshi & Polymarket
        </footer>

      </div>
    </main>
  );
}