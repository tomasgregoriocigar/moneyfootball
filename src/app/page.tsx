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
    ticker: "KXNFLTD-26OCT-CBRO",
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
    kalshi_url: "https://kalshi.com/markets/kxnfltd?search=Chase+Brown",
    polymarket_url: "https://polymarket.com/search?q=Chase+Brown+touchdown",
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
    ticker: "KXNFLTD-26OCT-TMCB",
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
    kalshi_url: "https://kalshi.com/markets/kxnfltd?search=Trey+McBride",
    polymarket_url: "https://polymarket.com/search?q=Trey+McBride+touchdown",
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
    ticker: "KXNFLTD-26OCT-DWIC",
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
    kalshi_url: "https://kalshi.com/markets/kxnfltd?search=Dontayvion+Wicks",
    polymarket_url: "https://polymarket.com/search?q=Dontayvion+Wicks+touchdown",
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
    ticker: "KXNFLTD-26OCT-JJOH",
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
    kalshi_url: "https://kalshi.com/markets/kxnfltd?search=Juwan+Johnson",
    polymarket_url: "https://polymarket.com/search?q=Juwan+Johnson+touchdown",
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
        {/* VIEW 1: RETAIL DASHBOARD (Interactive Drawer Cards)       */}
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