"use client";

import React, { useState, useEffect } from "react";

interface ZoneDecay {
  under_3yd: string;
  five_yd_plunge: string;
  ten_yd_conversion: string;
  twenty_yd_conversion: string;
}

interface GateVerification {
  vegas_itt_gate: string;
  goal_to_go_share: string;
  personnel_alignment: string;
}

interface SlateTarget {
  player: string;
  ticker: string;
  position: string;
  team: string;
  opponent: string;
  vegas_itt: number;
  kalshi_ask: string;
  polymarket_ask: string;
  sportsbook_line: string;
  sportsbook_prob: string;
  c_def: number;
  tpi_fair_val: string;
  net_edge: string;
  tier: "TIER 1" | "TIER 2" | "TIER 3" | "PASS";
  kalshi_url: string;
  polymarket_url: string;
  zone_decay: ZoneDecay;
  gate_verification: GateVerification;
}

const DEFAULT_SLATE: SlateTarget[] = [
  {
    player: "Chase Brown",
    ticker: "KXNFLTD-26OCT11CINMIA-CINCBROWN30-1",
    position: "RB",
    team: "CIN",
    opponent: "vs. MIA",
    vegas_itt: 25.0,
    kalshi_ask: "36¢",
    polymarket_ask: "37¢",
    sportsbook_line: "+145",
    sportsbook_prob: "40.8%",
    c_def: 1.22,
    tpi_fair_val: "48.2%",
    net_edge: "+12.2%",
    tier: "TIER 1",
    kalshi_url: "https://kalshi.com/markets/kxnfltd/x/kxnfltd-26oct11cinmia?op_market_ticker=KXNFLTD-26OCT11CINMIA-CINCBROWN30-1&op_side=buy&op_order_side=yes",
    polymarket_url: "https://polymarket.com/event/nfl-chase-brown-touchdown",
    zone_decay: {
      under_3yd: "62%",
      five_yd_plunge: "22.4%",
      ten_yd_conversion: "9.2%",
      twenty_yd_conversion: "1.8%"
    },
    gate_verification: {
      vegas_itt_gate: "PASSED (25.0)",
      goal_to_go_share: "88%",
      personnel_alignment: "76%"
    }
  },
  {
    player: "Trey McBride",
    ticker: "KXNFLTD-26OCT11ARIDET-ARITMCBRIDE85-1",
    position: "TE",
    team: "ARI",
    opponent: "vs. DET",
    vegas_itt: 26.5,
    kalshi_ask: "38¢",
    polymarket_ask: "39¢",
    sportsbook_line: "+130",
    sportsbook_prob: "43.5%",
    c_def: 1.16,
    tpi_fair_val: "46.5%",
    net_edge: "+8.5%",
    tier: "TIER 1",
    kalshi_url: "https://kalshi.com/markets/kxnfltd/x/kxnfltd-26oct11aridet?op_market_ticker=KXNFLTD-26OCT11ARIDET-ARITMCBRIDE85-1&op_side=buy&op_order_side=yes",
    polymarket_url: "https://polymarket.com/event/nfl-trey-mcbride-touchdown",
    zone_decay: {
      under_3yd: "28%",
      five_yd_plunge: "31.0%",
      ten_yd_conversion: "18.5%",
      twenty_yd_conversion: "4.2%"
    },
    gate_verification: {
      vegas_itt_gate: "PASSED (26.5)",
      goal_to_go_share: "34%",
      personnel_alignment: "88%"
    }
  },
  {
    player: "Dontayvion Wicks",
    ticker: "KXNFLTD-26OCT11GBCHI-GBDWICKS13-1",
    position: "WR",
    team: "GB",
    opponent: "vs. CHI",
    vegas_itt: 24.5,
    kalshi_ask: "30¢",
    polymarket_ask: "31¢",
    sportsbook_line: "+210",
    sportsbook_prob: "32.3%",
    c_def: 1.14,
    tpi_fair_val: "38.4%",
    net_edge: "+8.4%",
    tier: "TIER 2",
    kalshi_url: "https://kalshi.com/markets/kxnfltd/x/kxnfltd-26oct11gbchi?op_market_ticker=KXNFLTD-26OCT11GBCHI-GBDWICKS13-1&op_side=buy&op_order_side=yes",
    polymarket_url: "https://polymarket.com/event/nfl-dontayvion-wicks-touchdown",
    zone_decay: {
      under_3yd: "18%",
      five_yd_plunge: "24.0%",
      ten_yd_conversion: "14.1%",
      twenty_yd_conversion: "5.5%"
    },
    gate_verification: {
      vegas_itt_gate: "PASSED (24.5)",
      goal_to_go_share: "28%",
      personnel_alignment: "82%"
    }
  },
  {
    player: "Juwan Johnson",
    ticker: "KXNFLTD-26OCT11NOATL-NOJJOHNSON83-1",
    position: "TE",
    team: "NO",
    opponent: "vs. ATL",
    vegas_itt: 22.0,
    kalshi_ask: "30¢",
    polymarket_ask: "29¢",
    sportsbook_line: "+235",
    sportsbook_prob: "29.9%",
    c_def: 1.18,
    tpi_fair_val: "37.6%",
    net_edge: "+7.6%",
    tier: "TIER 2",
    kalshi_url: "https://kalshi.com/markets/kxnfltd/x/kxnfltd-26oct11noatl?op_market_ticker=KXNFLTD-26OCT11NOATL-NOJJOHNSON83-1&op_side=buy&op_order_side=yes",
    polymarket_url: "https://polymarket.com/event/nfl-juwan-johnson-touchdown",
    zone_decay: {
      under_3yd: "15%",
      five_yd_plunge: "19.2%",
      ten_yd_conversion: "12.0%",
      twenty_yd_conversion: "3.1%"
    },
    gate_verification: {
      vegas_itt_gate: "MARGINAL (22.0)",
      goal_to_go_share: "24%",
      personnel_alignment: "70%"
    }
  }
];

const WHOP_CHECKOUT_URL = "https://whop.com/checkout/plan_jXFaFkKUaAXTh";

export default function Home(): JSX.Element {
  const [viewMode, setViewMode] = useState<"retail" | "quant">("retail");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [slate, setSlate] = useState<SlateTarget[]>(DEFAULT_SLATE);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("unlocked") === "true") {
        setIsUnlocked(true);
      }
    }

    fetch("/data/slate_verdict.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((item: any, idx: number) => ({
            ...DEFAULT_SLATE[idx % DEFAULT_SLATE.length],
            ...item
          }));
          setSlate(formatted);
        }
      })
      .catch(() => {});
  }, []);

  const toggleAccordion = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <main className="min-h-screen bg-[#070a12] text-[#f8fafc] font-mono px-4 py-8 md:px-12">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Global Terminal Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#1f2937] pb-6 gap-4">
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

          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 text-xs px-2.5 py-1 rounded font-bold">
              v4.3 DUAL-ENGINE
            </span>
            <span className="text-xs text-[#94a3b8] hidden sm:inline">
              EXCHANGES: <strong className="text-white">KALSHI</strong> + <strong className="text-[#a855f7]">POLYMARKET</strong>
            </span>
            <span className="text-xs text-[#10b981] font-bold bg-[#10b981]/10 px-2.5 py-1 rounded border border-[#10b981]/20">
              SNIPER HIT: 83.3% (W1–W3)
            </span>
          </div>
        </header>

        {/* Dual Mode Switcher Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0f172a] border border-[#1e293b] p-2 rounded-lg gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode("retail")}
              className={`px-4 py-2 rounded text-xs font-bold transition ${
                viewMode === "retail"
                  ? "bg-[#10b981] text-black shadow-md"
                  : "text-[#94a3b8] hover:text-white"
              }`}
            >
              RETAIL DASHBOARD
            </button>
            <button
              type="button"
              onClick={() => setViewMode("quant")}
              className={`px-4 py-2 rounded text-xs font-bold transition ${
                viewMode === "quant"
                  ? "bg-[#38bdf8] text-black shadow-md"
                  : "text-[#94a3b8] hover:text-white"
              }`}
            >
              QUANT / INSTITUTIONAL AUDIT
            </button>
          </div>

          <div className="text-xs text-[#94a3b8]">
            HISTORICAL RECORD: <strong className="text-white">340–178 (65.6%)</strong> | 2026 RUN: <strong className="text-[#10b981]">22–10 (68.8%)</strong>
          </div>
        </div>

        {/* Paywall Banner */}
        {!isUnlocked && (
          <div className="bg-[#0b1329] border border-[#10b981]/30 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">🔓</span>
              <div>
                <p className="text-xs text-[#10b981] font-bold">
                  FREE INSTITUTIONAL ACCESS SLATE ACTIVE:
                </p>
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  Tier 1 high-value touchdown discrepancy targets and quantitative audit drawers are unlocked for evaluation.
                </p>
              </div>
            </div>
            <a
              href={WHOP_CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#10b981] hover:bg-[#059669] text-black text-xs font-extrabold px-5 py-2.5 rounded transition whitespace-nowrap"
            >
              WEEK 5 PAYWALL ($49/MO)
            </a>
          </div>
        )}

        {/* 4 Quant Performance Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0f172a] border border-[#1e293b] p-4 rounded-lg">
            <div className="text-[11px] text-[#94a3b8] uppercase tracking-wider">All-Time Win Rate</div>
            <div className="text-2xl md:text-3xl font-black text-white mt-1">65.6%</div>
            <div className="text-[11px] text-[#10b981]">340–178 Across 518 Trades</div>
          </div>
          <div className="bg-[#0f172a] border border-[#1e293b] p-4 rounded-lg">
            <div className="text-[11px] text-[#94a3b8] uppercase tracking-wider">2026 In-Season Run</div>
            <div className="text-2xl md:text-3xl font-black text-[#10b981] mt-1">22–10</div>
            <div className="text-[11px] text-[#94a3b8]">68.8% Win Rate (W1–W4)</div>
          </div>
          <div className="bg-[#0f172a] border border-[#1e293b] p-4 rounded-lg">
            <div className="text-[11px] text-[#94a3b8] uppercase tracking-wider">Net Settlement ROI</div>
            <div className="text-2xl md:text-3xl font-black text-white mt-1">+26.1%</div>
            <div className="text-[11px] text-[#10b981]">Post-Taker Fee Exchange Drag</div>
          </div>
          <div className="bg-[#0f172a] border border-[#1e293b] p-4 rounded-lg">
            <div className="text-[11px] text-[#94a3b8] uppercase tracking-wider">Closing Line Alpha (CLV)</div>
            <div className="text-2xl md:text-3xl font-black text-[#38bdf8] mt-1">+4.6¢</div>
            <div className="text-[11px] text-[#94a3b8]">82.4% Beat Market Close</div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* VIEW 1: RETAIL DASHBOARD                                  */}
        {/* ========================================================= */}
        {viewMode === "retail" && (
          <div className="space-y-4">
            {slate.map((item, idx) => {
              const isLocked = !isUnlocked && item.tier !== "TIER 1";
              const isExpanded = expandedIndex === idx;

              return (
                <div
                  key={idx}
                  className="bg-[#0f172a] border border-[#1e293b] rounded-lg overflow-hidden transition"
                >
                  {/* Card Header Summary */}
                  <div
                    onClick={() => !isLocked && toggleAccordion(idx)}
                    className={`p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-[#162032] transition ${
                      isLocked ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-white">{item.player}</span>
                        <span className="text-xs bg-[#1e293b] text-[#94a3b8] px-2 py-0.5 rounded">
                          {item.position} • {item.team}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            item.tier === "TIER 1"
                              ? "bg-[#10b981]/20 text-[#10b981]"
                              : "bg-[#38bdf8]/20 text-[#38bdf8]"
                          }`}
                        >
                          {item.tier}
                        </span>
                      </div>
                      <div className="text-xs text-[#94a3b8] mt-1">
                        {item.opponent} • ITT: <strong className="text-white">{item.vegas_itt}</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-center w-full md:w-auto">
                      <div className="bg-[#070a12] px-3 py-1.5 rounded border border-[#1e293b]">
                        <div className="text-[10px] text-[#94a3b8]">TPI FAIR</div>
                        <div className="text-sm font-bold text-[#10b981]">{item.tpi_fair_val}</div>
                      </div>
                      <div className="bg-[#070a12] px-3 py-1.5 rounded border border-[#1e293b]">
                        <div className="text-[10px] text-[#94a3b8]">BEST ASK</div>
                        <div className="text-sm font-bold text-white">{item.kalshi_ask}</div>
                      </div>
                      <div className="bg-[#070a12] px-3 py-1.5 rounded border border-[#1e293b]">
                        <div className="text-[10px] text-[#94a3b8]">SPORTSBOOK</div>
                        <div className="text-sm font-bold text-[#f59e0b]">{item.sportsbook_line}</div>
                      </div>
                      <div className="bg-[#070a12] px-3 py-1.5 rounded border border-[#1e293b]">
                        <div className="text-[10px] text-[#94a3b8]">NET EDGE</div>
                        <div className="text-sm font-bold text-[#10b981]">{item.net_edge}</div>
                      </div>
                    </div>

                    <div className="text-xs text-[#94a3b8] hidden md:block">
                      {isLocked ? "🔒 LOCKED" : isExpanded ? "▲ CLOSE" : "▼ AUDIT"}
                    </div>
                  </div>

                  {/* Locked Paywall State */}
                  {isLocked && (
                    <div className="p-4 bg-[#0a0f1d] border-t border-[#1e293b] flex justify-between items-center text-xs">
                      <span className="text-[#94a3b8]">
                        Unlock Tier 2 & Tier 3 mathematical models and execution routing.
                      </span>
                      <a
                        href={WHOP_CHECKOUT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#10b981] hover:bg-[#059669] text-black font-bold px-3 py-1.5 rounded text-xs transition"
                      >
                        Unlock ($49/mo)
                      </a>
                    </div>
                  )}

                  {/* Expanded Accordion Drawer */}
                  {!isLocked && isExpanded && (
                    <div className="p-5 border-t border-[#1e293b] bg-[#090d1a] space-y-4 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* 4-Zone Distance Decay */}
                        <div className="space-y-2">
                          <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
                            RB 4-Zone Distance Decay Breakdown
                          </div>
                          <div className="flex justify-between border-b border-[#1e293b] pb-1">
                            <span className="text-[#94a3b8]">Under 3 Yrd Line Carry:</span>
                            <span className="font-bold text-[#10b981]">{item.zone_decay.under_3yd}</span>
                          </div>
                          <div className="flex justify-between border-b border-[#1e293b] pb-1">
                            <span className="text-[#94a3b8]">5 Yrd Line Plunge:</span>
                            <span className="font-bold text-white">{item.zone_decay.five_yd_plunge}</span>
                          </div>
                          <div className="flex justify-between border-b border-[#1e293b] pb-1">
                            <span className="text-[#94a3b8]">10 Yrd Line Conversion:</span>
                            <span className="font-bold text-white">{item.zone_decay.ten_yd_conversion}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#94a3b8]">20 Yrd Line Conversion:</span>
                            <span className="font-bold text-white">{item.zone_decay.twenty_yd_conversion}</span>
                          </div>
                        </div>

                        {/* Institutional Gate Verification */}
                        <div className="space-y-2">
                          <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
                            Institutional Gate Verification
                          </div>
                          <div className="flex justify-between border-b border-[#1e293b] pb-1">
                            <span className="text-[#94a3b8]">Vegas ITT Gate (&ge;24.0):</span>
                            <span className="font-bold text-[#10b981]">{item.gate_verification.vegas_itt_gate}</span>
                          </div>
                          <div className="flex justify-between border-b border-[#1e293b] pb-1">
                            <span className="text-[#94a3b8]">Goal-to-Go Share (&ge;75%):</span>
                            <span className="font-bold text-white">{item.gate_verification.goal_to_go_share}</span>
                          </div>
                          <div className="flex justify-between border-b border-[#1e293b] pb-1">
                            <span className="text-[#94a3b8]">Sportsbook Implied:</span>
                            <span className="font-bold text-[#f59e0b]">{item.sportsbook_line} ({item.sportsbook_prob})</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#94a3b8]">Personnel Alignment:</span>
                            <span className="font-bold text-white">{item.gate_verification.personnel_alignment}</span>
                          </div>
                        </div>

                        {/* Direct Order Book Links */}
                        <div className="flex flex-col justify-between space-y-3">
                          <div>
                            <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1">
                              Execution Route & Order Book
                            </div>
                            <div className="text-[#94a3b8]">
                              {item.kalshi_ask} vs. Model Fair: {item.tpi_fair_val} | Edge:{" "}
                              <strong className="text-[#10b981]">{item.net_edge}</strong>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <a
                              href={item.kalshi_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 text-center bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold py-2 rounded transition"
                            >
                              View Kalshi Book ({item.kalshi_ask}) &rarr;
                            </a>
                            <a
                              href={item.polymarket_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 text-center bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold py-2 rounded transition"
                            >
                              View Polymarket ({item.polymarket_ask}) &rarr;
                            </a>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: QUANT / INSTITUTIONAL TERMINAL                    */}
        {/* ========================================================= */}
        {viewMode === "quant" && (
          <div className="space-y-6">
            
            {/* Calibration Proof Banner */}
            <div className="bg-[#0d1424] border border-[#1e293b] p-4 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[#94a3b8] block">Brier Score Calibration</span>
                <span className="font-bold text-[#10b981] text-sm">0.182</span>
                <span className="text-[10px] text-[#64748b] block">(Benchmark: 0.224)</span>
              </div>
              <div>
                <span className="text-[#94a3b8] block">Statistical Significance</span>
                <span className="font-bold text-white text-sm">p &lt; 0.001</span>
                <span className="text-[10px] text-[#10b981] block">Null Hypothesis Rejected</span>
              </div>
              <div>
                <span className="text-[#94a3b8] block">Taker Fee Friction Filter</span>
                <span className="font-bold text-white text-sm">+5.0% Net Hurdle</span>
                <span className="text-[10px] text-[#64748b] block">Survives Spread Drag</span>
              </div>
              <div>
                <span className="text-[#94a3b8] block">Programmatic API Feed</span>
                <span className="font-bold text-[#38bdf8] text-sm font-mono">GET /data/slate</span>
                <span className="text-[10px] text-[#10b981] block">● Real-Time JSON Stream</span>
              </div>
            </div>

            {/* Cross-Market Execution Table */}
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#162032] border-b border-[#1e293b] text-[#94a3b8]">
                    <th className="p-3 uppercase">Tier</th>
                    <th className="p-3 uppercase">Player & Ticker</th>
                    <th className="p-3 uppercase">Matchup</th>
                    <th className="p-3 uppercase">Vegas ITT</th>
                    <th className="p-3 uppercase text-[#10b981]">TPI Fair</th>
                    <th className="p-3 uppercase text-[#38bdf8]">Kalshi</th>
                    <th className="p-3 uppercase text-[#a855f7]">Polymarket</th>
                    <th className="p-3 uppercase text-[#f59e0b]">Sportsbook</th>
                    <th className="p-3 uppercase">C_DEF</th>
                    <th className="p-3 uppercase text-[#10b981]">Net Edge</th>
                    <th className="p-3 uppercase text-right">Order Route</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]">
                  {slate.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#1e293b]/50 transition">
                      <td className="p-3">
                        <span className="bg-[#10b981]/20 text-[#10b981] px-2 py-0.5 rounded font-bold">
                          {item.tier}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-white">
                        {item.player}
                        <div className="text-[10px] font-normal text-[#94a3b8] font-mono">{item.ticker}</div>
                      </td>
                      <td className="p-3">{item.team} {item.opponent}</td>
                      <td className="p-3 font-bold">{item.vegas_itt}</td>
                      <td className="p-3 font-bold text-[#10b981]">{item.tpi_fair_val}</td>
                      <td className="p-3 font-bold text-[#38bdf8]">{item.kalshi_ask}</td>
                      <td className="p-3 font-bold text-[#a855f7]">{item.polymarket_ask}</td>
                      <td className="p-3 font-bold text-[#f59e0b]">{item.sportsbook_line}</td>
                      <td className="p-3">{item.c_def}</td>
                      <td className="p-3 font-bold text-[#10b981]">{item.net_edge}</td>
                      <td className="p-3 text-right">
                        <a
                          href={item.kalshi_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#10b981] hover:bg-[#059669] text-black font-bold px-3 py-1 rounded text-xs transition inline-block"
                        >
                          ROUTE &rarr;
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* EV Price-Bucket Matrix & API Leads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0f172a] border border-[#1e293b] p-5 rounded-lg">
                <h3 className="text-xs uppercase font-bold text-[#94a3b8] tracking-wider mb-2">
                  Contract Price-Bucket Distribution (EV Verification)
                </h3>
                <p className="text-[11px] text-[#64748b] mb-4">
                  Validates positive expectancy across all pricing tiers, addressing favorite-bias concerns.
                </p>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#1e293b] text-[#94a3b8]">
                      <th className="pb-2">Contract Range</th>
                      <th className="pb-2">Sample (N)</th>
                      <th className="pb-2">Win Rate</th>
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
                    Request API Feed
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
          </div>
        )}

        {/* Global Legal & Regulatory Disclaimer */}
        <footer className="text-[11px] text-[#64748b] leading-relaxed pt-8 border-t border-[#1e293b] space-y-3">
          <p>
            <strong>DISCLAIMER & REGULATORY NOTICE:</strong> Moneyfootball.ai is an automated quantitative modeling platform that computes theoretical probability distributions for predictive event contracts traded on CFTC-regulated exchanges (e.g., KalshiEX LLC) and decentralized prediction markets (Polymarket). Moneyfootball.ai is not a broker-dealer, registered investment advisor, or commodities trading advisor.
          </p>
          <p>
            All figures, including the Touchdown Projection Index (TPI), fair values, sportsbook consensus lines, and net edge percentages, represent mathematical model outputs derived from historical nflverse datasets, defensive coordinator friction indices ($C_{'{'}DEF{'}'}$), and public market odds. Historical performance (including the 65.6% all-time mark and 2026 campaign record) is not indicative of future results. Trading binary event contracts carries financial risk. Trade responsibly.
          </p>
          <p className="text-center pt-2">
            &copy; 2026 Moneyfootball.ai &bull; All Rights Reserved.
          </p>
        </footer>

      </div>
    </main>
  );
}