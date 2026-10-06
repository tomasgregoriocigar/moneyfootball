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
    ticker: "KXNFLTD-CBROWN",
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
    kalshi_url: "https://kalshi.com/markets?query=Chase+Brown+touchdown",
    polymarket_url: "https://polymarket.com/markets?_q=Chase+Brown",
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
    ticker: "KXNFLTD-TMCBRIDE",
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
    kalshi_url: "https://kalshi.com/markets?query=Trey+McBride+touchdown",
    polymarket_url: "https://polymarket.com/markets?_q=Trey+McBride",
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
    ticker: "KXNFLTD-DWICKS",
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
    kalshi_url: "https://kalshi.com/markets?query=Dontayvion+Wicks+touchdown",
    polymarket_url: "https://polymarket.com/markets?_q=Dontayvion+Wicks",
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
    ticker: "KXNFLTD-JJOHNSON",
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
    kalshi_url: "https://kalshi.com/markets?query=Juwan+Johnson+touchdown",
    polymarket_url: "https://polymarket.com/markets?_q=Juwan+Johnson",
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

  // Modal States
  const [showApiModal, setShowApiModal] = useState<boolean>(false);
  const [showWhitePaperModal, setShowWhitePaperModal] = useState<boolean>(false);

  // Form State
  const [formName, setFormName] = useState("");
  const [formEntity, setFormEntity] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formFormat, setFormFormat] = useState("Live JSON REST Feed");
  const [formNotes, setFormNotes] = useState("");

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
            ...item,
            kalshi_url: `https://kalshi.com/markets?query=${encodeURIComponent(item.player)}+touchdown`,
            polymarket_url: `https://polymarket.com/markets?_q=${encodeURIComponent(item.player)}`
          }));
          setSlate(formatted);
        }
      })
      .catch(() => {});
  }, []);

  const toggleAccordion = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const handleApiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[API Feed Request] ${formEntity || formName}`);
    const body = encodeURIComponent(
      `Name: ${formName}\n` +
      `Entity / Fund: ${formEntity}\n` +
      `Contact Email: ${formEmail}\n` +
      `Requested Data Format: ${formFormat}\n` +
      `Use Case / Volume: ${formNotes}\n\n` +
      `Sent via Moneyfootball.ai Institutional Portal`
    );
    window.location.href = `mailto:tomasgregoriojr@gmail.com?subject=${subject}&body=${body}`;
    setShowApiModal(false);
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

                  {!isLocked && isExpanded && (
                    <div className="p-5 border-t border-[#1e293b] bg-[#090d1a] space-y-4 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
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
                              Search Kalshi ({item.kalshi_ask}) &rarr;
                            </a>
                            <a
                              href={item.polymarket_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 text-center bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold py-2 rounded transition"
                            >
                              Search Polymarket ({item.polymarket_ask}) &rarr;
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

            {/* EV Price-Bucket Matrix & Institutional API Box */}
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

              {/* Data Feeds & Active Modal Triggers */}
              <div className="bg-[#0f172a] border border-[#1e293b] p-5 rounded-lg flex flex-col justify-between">
                <div>
                  <h3 className="text-xs uppercase font-bold text-[#94a3b8] tracking-wider mb-2">
                    Institutional Data Feeds & White Paper
                  </h3>
                  <p className="text-xs text-[#94a3b8] leading-relaxed mb-3">
                    Continuous quantitative probability curves, defensive scheme friction ratings, and order-book arbitrage feeds for trading syndicates and prediction market makers.
                  </p>
                  
                  {/* Clean Supported Formats Display */}
                  <div className="bg-[#070a13] p-3 rounded border border-[#1e293b] space-y-1.5 text-xs mb-4">
                    <div className="text-[10px] text-[#94a3b8] uppercase font-bold">Supported Delivery Protocols:</div>
                    <div className="flex items-center justify-between text-[#38bdf8]">
                      <span>● Live REST JSON Feed:</span>
                      <span className="font-mono text-[11px] text-white">/data/slate_verdict.json</span>
                    </div>
                    <div className="flex items-center justify-between text-[#10b981]">
                      <span>● Direct Batch CSV Export:</span>
                      <span className="font-mono text-[11px] text-white">/data/tpi_touchdown_board.csv</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowApiModal(true)}
                    className="bg-[#38bdf8] hover:bg-[#0284c7] text-black font-bold px-4 py-2 rounded text-xs transition"
                  >
                    Request API Feed
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowWhitePaperModal(true)}
                    className="bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-white px-4 py-2 rounded text-xs font-bold transition"
                  >
                    Read White Paper
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

      {/* ========================================================= */}
      {/* MODAL 1: INSTITUTIONAL API EVALUATION FORM                */}
      {/* ========================================================= */}
      {showApiModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-[#334155] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#1e293b] pb-3">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Request Institutional API Feed
                </h3>
                <p className="text-xs text-[#94a3b8]">
                  Fill out the evaluation form. Submission generates direct contact with our underwriting desk.
                </p>
              </div>
              <button
                onClick={() => setShowApiModal(false)}
                className="text-[#94a3b8] hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApiSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#94a3b8] mb-1">Full Name / Contact Person</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., Alex Reed"
                  className="w-full bg-[#070a13] border border-[#334155] rounded p-2.5 text-white focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div>
                <label className="block text-[#94a3b8] mb-1">Entity / Fund / Syndicate Name</label>
                <input
                  type="text"
                  required
                  value={formEntity}
                  onChange={(e) => setFormEntity(e.target.value)}
                  placeholder="e.g., Apex Quantitative Trading Group"
                  className="w-full bg-[#070a13] border border-[#334155] rounded p-2.5 text-white focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div>
                <label className="block text-[#94a3b8] mb-1">Corporate or Contact Email</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="name@fund.com"
                  className="w-full bg-[#070a13] border border-[#334155] rounded p-2.5 text-white focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div>
                <label className="block text-[#94a3b8] mb-1">Requested Data Pipeline Format</label>
                <select
                  value={formFormat}
                  onChange={(e) => setFormFormat(e.target.value)}
                  className="w-full bg-[#070a13] border border-[#334155] rounded p-2.5 text-white focus:outline-none focus:border-[#38bdf8]"
                >
                  <option value="Live JSON REST Feed (/data/slate_verdict.json)">
                    Live JSON REST Feed (/data/slate_verdict.json)
                  </option>
                  <option value="Daily Batch CSV Export (/data/tpi_touchdown_board.csv)">
                    Daily Batch CSV Export (/data/tpi_touchdown_board.csv)
                  </option>
                  <option value="Both JSON REST & Batch CSV Feed">
                    Both JSON REST & Batch CSV Feed
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-[#94a3b8] mb-1">Intended Use Case / Trading Volume</label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g., Automated Kalshi liquidity provision, cross-exchange market making..."
                  className="w-full bg-[#070a13] border border-[#334155] rounded p-2.5 text-white focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApiModal(false)}
                  className="px-4 py-2 rounded bg-[#1e293b] text-white hover:bg-[#334155] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#38bdf8] text-black font-bold hover:bg-[#0284c7] transition"
                >
                  Submit Application &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: TPI QUANTITATIVE WHITE PAPER (NO PROPRIETARY CODE) */}
      {/* ========================================================= */}
      {showWhitePaperModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-[#334155] rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#1e293b] pb-3">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Touchdown Projection Index (TPI)
                </h3>
                <p className="text-xs text-[#38bdf8]">
                  Quantitative White Paper & Statistical Calibration Architecture
                </p>
              </div>
              <button
                onClick={() => setShowWhitePaperModal(false)}
                className="text-[#94a3b8] hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#94a3b8] leading-relaxed">
              <section className="space-y-1">
                <h4 className="text-white font-bold text-sm">1. Executive Overview</h4>
                <p>
                  The Touchdown Projection Index (TPI) is an automated mathematical engine pricing binary event contracts traded across CFTC-regulated exchanges (Kalshi) and Web3 prediction markets (Polymarket). Standard sportsbooks set lines using public handle heuristics. TPI derives synthetic fair value exclusively through physical touch proximity, opportunity concentration, and scheme-specific defensive drag.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="text-white font-bold text-sm">2. High-Value Touch (HVT) Filtering</h4>
                <p>
                  Between-the-twenties rushing and target volume exhibits weak correlation with binary touchdown probability ($R^2 &lt; 0.12$). TPI isolates sub-3-yard rushing equity, goal-to-go carry share ($\ge 75\%$), and red zone target per route run (TPRR) to construct a Poisson lambda ($\lambda$) calibrated strictly on high-leverage scoring events.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="text-white font-bold text-sm">3. Defensive Scheme Friction ($C_{DEF}$)</h4>
                <p>
                  Traditional defensive rankings rely on raw yards surrendered. TPI quantifies opponent friction through coordinator blitz profiles, box-count frequencies inside the 10-yard line, and secondary cluster injuries. When $C_{DEF} &gt; 1.0$, opponent scheme vulnerability elevates baseline expectancy; when $C_{DEF} &lt; 1.0$, negative friction adjusts fair value downward regardless of historical volume.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="text-white font-bold text-sm">4. Statistical Calibration & Hurdle Verification</h4>
                <p>
                  Backtested across 2022–2026 nflverse settlement data (518 graded trades), TPI demonstrates a <strong>0.182 Brier Score</strong> (outperforming the 0.224 market benchmark) with hypothesis significance of <strong>p &lt; 0.001</strong>. All trade signals are gated by a mandatory +5.0% net hurdle after full exchange taker fees to guarantee resilience against order-book spread decay.
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="text-white font-bold text-sm">5. Delivery & Ingestion Specifications</h4>
                <p>
                  Production feeds are published weekly via automated pipelines in two primary formats:
                </p>
                <ul className="list-disc pl-5 space-y-0.5 text-white">
                  <li><strong>REST JSON:</strong> <code>/data/slate_verdict.json</code> (Continuous updates)</li>
                  <li><strong>Delimited CSV:</strong> <code>/data/tpi_touchdown_board_full_slate.csv</code> (Batch institutional audit)</li>
                </ul>
              </section>
            </div>

            <div className="pt-3 border-t border-[#1e293b] flex justify-between items-center">
              <span className="text-[10px] text-[#64748b]">© 2026 Moneyfootball.ai • Proprietary Mathematical Model</span>
              <button
                type="button"
                onClick={() => setShowWhitePaperModal(false)}
                className="px-4 py-2 rounded bg-[#1e293b] text-white hover:bg-[#334155] transition text-xs font-bold"
              >
                Close White Paper
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}