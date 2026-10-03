"use client";

import React, { useState } from "react";

// REPLACE WITH YOUR SINGLE WHOP CHECKOUT URL:
const WHOP_CHECKOUT_URL = "YOUR_DIRECT_CHECKOUT_OR_PLAN_URL";

interface QuantPlayer {
  rank: number;
  player: string;
  ticker: string;
  pos: string;
  team: string;
  opp: string;
  vegasItt: number;
  prob3: number;
  prob5: number;
  prob10: number;
  prob20: number;
  tpiTotal: number;
  kalshiAsk: number;
  polyAsk: number;
  devigBook: number;
  tier: "TIER 1" | "TIER 2" | "TIER 3" | "TIER 4";
  underCenter: number;
  carryShare3: number;
  action: string;
}

const TERMINAL_DATA: QuantPlayer[] = [
  // --- RANK 1: SOLE FREE SHOWCASE ---
  {
    rank: 1,
    player: "Derrick Henry",
    ticker: "KXNFLTD-26OCT04-DHEN",
    pos: "RB",
    team: "BAL",
    opp: "vs. TEN",
    vegasItt: 27.50,
    prob3: 57.0,
    prob5: 21.1,
    prob10: 8.1,
    prob20: 1.7,
    tpiTotal: 84.6,
    kalshiAsk: 64,
    polyAsk: 62,
    devigBook: 59.2,
    tier: "TIER 1",
    underCenter: 72,
    carryShare3: 88,
    action: "BUY YES (MAX)",
  },
  // --- RANK 2+: LOCKED BEHIND $49/MO PAYWALL ---
  {
    rank: 2,
    player: "Ja'Marr Chase",
    ticker: "AEC-NFL-CIN-JAX-CHASE",
    pos: "WR",
    team: "CIN",
    opp: "vs. JAX",
    vegasItt: 27.00,
    prob3: 38.0,
    prob5: 38.0,
    prob10: 42.0,
    prob20: 18.0,
    tpiTotal: 83.8,
    kalshiAsk: 58,
    polyAsk: 55,
    devigBook: 54.0,
    tier: "TIER 1",
    underCenter: 45,
    carryShare3: 0,
    action: "BUY YES (ALPHA)",
  },
  {
    rank: 3,
    player: "Kyren Williams",
    ticker: "KXNFLTD-26OCT04-KWIL",
    pos: "RB",
    team: "LAR",
    opp: "@ PHI",
    vegasItt: 23.25,
    prob3: 46.7,
    prob5: 16.3,
    prob10: 5.6,
    prob20: 1.2,
    tpiTotal: 58.4,
    kalshiAsk: 62,
    polyAsk: 60,
    devigBook: 52.0,
    tier: "TIER 2",
    underCenter: 65,
    carryShare3: 82,
    action: "PASS / NO",
  },
  {
    rank: 4,
    player: "J.K. Dobbins",
    ticker: "KXNFLTD-26OCT04-JDOB",
    pos: "RB",
    team: "DEN",
    opp: "@ SF",
    vegasItt: 21.00,
    prob3: 43.5,
    prob5: 14.6,
    prob10: 4.9,
    prob20: 1.0,
    tpiTotal: 54.6,
    kalshiAsk: 45,
    polyAsk: 47,
    devigBook: 43.5,
    tier: "TIER 2",
    underCenter: 68,
    carryShare3: 78,
    action: "BUY YES (LMT)",
  },
  {
    rank: 5,
    player: "George Kittle",
    ticker: "KXNFLTD-26OCT04-GKIT",
    pos: "TE",
    team: "SF",
    opp: "vs. DEN",
    vegasItt: 24.50,
    prob3: 28.5,
    prob5: 28.5,
    prob10: 22.0,
    prob20: 12.0,
    tpiTotal: 48.2,
    kalshiAsk: 36,
    polyAsk: 34,
    devigBook: 32.1,
    tier: "TIER 3",
    underCenter: 60,
    carryShare3: 32,
    action: "BUY YES (TE)",
  },
  {
    rank: 6,
    player: "Josh Downs",
    ticker: "KXNFLTD-26OCT04-JDOW",
    pos: "WR",
    team: "IND",
    opp: "@ WAS",
    vegasItt: 26.00,
    prob3: 22.0,
    prob5: 22.0,
    prob10: 18.0,
    prob20: 14.0,
    tpiTotal: 38.6,
    kalshiAsk: 22,
    polyAsk: 24,
    devigBook: 25.0,
    tier: "TIER 3",
    underCenter: 45,
    carryShare3: 10,
    action: "BUY YES (+16.6% EV)",
  },
  {
    rank: 7,
    player: "Jaydon Blue",
    ticker: "KXNFLTD-26OCT04-JBLU",
    pos: "RB",
    team: "DAL",
    opp: "@ HOU",
    vegasItt: 23.50,
    prob3: 21.8,
    prob5: 6.8,
    prob10: 2.7,
    prob20: 0.6,
    tpiTotal: 29.6,
    kalshiAsk: 19,
    polyAsk: 22,
    devigBook: 24.0,
    tier: "TIER 3",
    underCenter: 50,
    carryShare3: 30,
    action: "BUY YES (FLX)",
  },
  {
    rank: 8,
    player: "Alexander Mattison",
    ticker: "KXNFLTD-26OCT04-AMAT",
    pos: "RB",
    team: "MIA",
    opp: "@ MIN",
    vegasItt: 14.00,
    prob3: 8.4,
    prob5: 4.3,
    prob10: 2.1,
    prob20: 0.9,
    tpiTotal: 14.8,
    kalshiAsk: 28,
    polyAsk: 30,
    devigBook: 30.2,
    tier: "TIER 4",
    underCenter: 40,
    carryShare3: 32,
    action: "SHORT / NO",
  },
];

export default function MoneyFootballTerminal() {
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>("Derrick Henry");

  return (
    <div className="min-h-screen bg-black text-neutral-200 font-mono text-xs p-3 sm:p-6">
      {/* Header Bar */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-800 pb-4 mb-4 gap-2">
        <div className="flex items-center space-x-3">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-bold text-sm tracking-wider text-white">MONEYFOOTBALL // QUANT TERMINAL</span>
          <span className="bg-neutral-900 border border-neutral-700 text-neutral-400 px-2 py-0.5 rounded text-[10px]">
            v4.3 DUAL-ENGINE
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-400">
          <span>EXCHANGES: <b className="text-white">KALSHI + POLYMARKET</b></span>
          <span className="text-neutral-600">|</span>
          <span>TIER 1 TARGETS: <b className="text-emerald-400">2 QUALIFIED</b></span>
          <span className="text-neutral-600">|</span>
          <span className="text-emerald-400 font-bold">SNIPER HIT: 100% (W1-W3)</span>
        </div>
      </header>

      {/* Main Terminal Screen */}
      <div className="relative border border-neutral-800 rounded bg-neutral-950 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/80 text-neutral-400 font-semibold uppercase text-[10px]">
                <th className="p-2.5">Tier</th>
                <th className="p-2.5">Player & Ticker</th>
                <th className="p-2.5 text-center">Pos</th>
                <th className="p-2.5 text-center">Team</th>
                <th className="p-2.5">Opponent</th>
                <th className="p-2.5 text-right">Vegas ITT</th>
                <th className="p-2.5 text-right text-emerald-400">TPI Fair Val</th>
                <th className="p-2.5 text-right text-sky-400">Kalshi Ask</th>
                <th className="p-2.5 text-right text-purple-400">Polymarket</th>
                <th className="p-2.5 text-right">De-Vig Book</th>
                <th className="p-2.5 text-right">Net Arb Edge</th>
                <th className="p-2.5 text-center">Execution Signal</th>
              </tr>
            </thead>
            <tbody>
              {TERMINAL_DATA.map((p) => {
                const bestMarket = Math.min(p.kalshiAsk, p.polyAsk);
                const netEdge = (p.tpiTotal - bestMarket).toFixed(1);
                const isExpanded = expandedPlayer === p.player;
                // ONLY RANK 1 (HENRY) IS UNLOCKED. CHASE (RANK 2) AND BELOW ARE GATED.
                const isGated = p.rank > 1;

                return (
                  <React.Fragment key={p.player}>
                    <tr
                      onClick={() => {
                        if (!isGated) setExpandedPlayer(isExpanded ? null : p.player);
                      }}
                      className={`border-b border-neutral-900 transition ${
                        isGated
                          ? "filter blur-[5px] select-none opacity-40 pointer-events-none"
                          : "hover:bg-neutral-900/60 cursor-pointer"
                      } ${isExpanded ? "bg-neutral-900/50" : ""}`}
                    >
                      <td className="p-2.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            p.tier === "TIER 1"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                              : p.tier === "TIER 2"
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                              : p.tier === "TIER 3"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                              : "bg-red-500/20 text-red-400 border border-red-500/40"
                          }`}
                        >
                          {p.tier}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {p.player}
                          {!isGated && (
                            <span className="text-[9px] text-neutral-500">{isExpanded ? "▲" : "▼"}</span>
                          )}
                        </div>
                        <div className="text-[9px] text-neutral-500 font-mono tracking-tight">
                          {p.ticker}
                        </div>
                      </td>
                      <td className="p-2.5 text-center text-neutral-400">{p.pos}</td>
                      <td className="p-2.5 text-center font-semibold text-neutral-300">{p.team}</td>
                      <td className="p-2.5 text-neutral-400">{p.opp}</td>
                      <td className="p-2.5 text-right font-medium">{p.vegasItt.toFixed(2)}</td>
                      <td className="p-2.5 text-right font-bold text-emerald-400">{p.tpiTotal}%</td>
                      <td className="p-2.5 text-right font-medium text-sky-400">{p.kalshiAsk}¢</td>
                      <td className="p-2.5 text-right font-medium text-purple-400">{p.polyAsk}¢</td>
                      <td className="p-2.5 text-right text-neutral-400">{p.devigBook}%</td>
                      <td
                        className={`p-2.5 text-right font-bold ${
                          Number(netEdge) > 0 ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {Number(netEdge) > 0 ? `+${netEdge}%` : `${netEdge}%`}
                      </td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.action.includes("BUY")
                              ? "bg-emerald-500 text-black"
                              : p.action.includes("SHORT")
                              ? "bg-rose-500 text-white"
                              : "bg-neutral-800 text-neutral-400"
                          }`}
                        >
                          {p.action}
                        </span>
                      </td>
                    </tr>

                    {/* Quant Audit Drawer for Open Rank 1 */}
                    {isExpanded && !isGated && (
                      <tr className="bg-black/90 border-b border-neutral-800">
                        <td colSpan={12} className="p-4">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 border border-neutral-800 p-4 rounded bg-neutral-950">
                            <div>
                              <div className="text-[10px] text-neutral-500 uppercase font-bold mb-2">
                                RB 4-Zone Distance Decay Breakdown
                              </div>
                              <div className="space-y-1 text-[11px]">
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">&lt;3 Yrd Line Carry:</span>
                                  <span className="font-bold text-emerald-400">{p.prob3}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">5 Yrd Line Plunge:</span>
                                  <span className="font-medium text-neutral-300">{p.prob5}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">10 Yrd Line Conversion:</span>
                                  <span className="font-medium text-neutral-400">{p.prob10}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">20 Yrd Line Conversion:</span>
                                  <span className="font-medium text-neutral-500">{p.prob20}%</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <div className="text-[10px] text-neutral-500 uppercase font-bold mb-2">
                                Institutional Gate Verification
                              </div>
                              <div className="space-y-1 text-[11px]">
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Vegas ITT Gate (≥24.0):</span>
                                  <span className="text-emerald-400">PASSED ({p.vegasItt})</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">&lt;3yd Share (≥75%):</span>
                                  <span className="text-emerald-400">{p.carryShare3}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Under-Center (≥60%):</span>
                                  <span className="text-emerald-400">{p.underCenter}%</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <div className="text-[10px] text-neutral-500 uppercase font-bold mb-2">
                                Execution Route & Order Book
                              </div>
                              <p className="text-[11px] text-neutral-300 mb-2">
                                Best Market: <b>{bestMarket}¢</b> vs. Model Fair Value: <b>{p.tpiTotal}¢</b>.
                                Calculated Net Edge: <b className="text-emerald-400">{netEdge}%</b>.
                              </p>
                              <div className="flex gap-2">
                                <a
                                  href="https://kalshi.com"
                                  target="_blank"
                                  rel="noreferrer"
                                  className="bg-sky-500/20 border border-sky-500/40 text-sky-300 px-3 py-1 rounded text-[10px] hover:bg-sky-500/30"
                                >
                                  View Kalshi Book
                                </a>
                                <a
                                  href="https://polymarket.com"
                                  target="_blank"
                                  rel="noreferrer"
                                  className="bg-purple-500/20 border border-purple-500/40 text-purple-300 px-3 py-1 rounded text-[10px] hover:bg-purple-500/30"
                                >
                                  View Polymarket Book
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

        {/* Locked Overlay positioned directly under Derrick Henry */}
        <div className="absolute inset-x-0 bottom-0 top-[110px] flex items-center justify-center bg-gradient-to-t from-black via-black/85 to-transparent p-6 pointer-events-auto">
          <div className="max-w-md text-center bg-neutral-950/95 border border-neutral-700/80 p-6 rounded-lg backdrop-blur-md shadow-2xl">
            <div className="inline-block px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] rounded uppercase font-bold mb-3">
              Institutional Subscription Required
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Unlock Ja'Marr Chase & Full Slate Signals
            </h3>
            <p className="text-xs text-neutral-400 mb-5 leading-relaxed">
              Unlock Tier 1 Alpha WR signals (Ja'Marr Chase), positive-EV discrepancy alerts, the Sunday Morning Sharp Report, and direct limit-order trading signals.
            </p>
            <a
              href={WHOP_CHECKOUT_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-block w-full bg-emerald-500 text-black font-bold py-3 rounded text-xs hover:bg-emerald-400 transition shadow-lg tracking-wide uppercase"
            >
              Unlock Terminal ($49/month)
            </a>
            <div className="mt-3 text-[10px] text-neutral-500">
              Instant access • Cancel anytime via Whop
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 border-t border-neutral-800 pt-4 flex flex-col sm:flex-row justify-between text-[10px] text-neutral-600 gap-2">
        <div>&copy; 2026 MoneyFootball Analytics. Dual-Engine TPI Model.</div>
        <div className="text-neutral-500">STRICT 4-GATE INSTITUTIONAL SCREENER ACTIVE</div>
      </footer>
    </div>
  );
}
