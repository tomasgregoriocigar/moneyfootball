"use client";

import React, { useEffect, useState, useMemo } from "react";

interface PlayerRow {
  rank: number;
  player: string;
  pos: string;
  team: string;
  opponent: string;
  vegas_itt: number;
  rz_share: string;
  inside_5: string;
  tpi_score: number;
  tier: string;
}

export default function Home() {
  const [data, setData] = useState<PlayerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPos, setSelectedPos] = useState("ALL");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/data/tpi_touchdown_board_full_slate.csv");
        const text = await res.text();
        const lines = text.trim().split("\n");
        if (lines.length <= 1) return;

        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
        
        const playerIdx = headers.findIndex((h) => h.includes("player") || h.includes("name"));
        const posIdx = headers.findIndex((h) => h === "pos" || h.includes("position"));
        const teamIdx = headers.findIndex((h) => h === "team" || h.includes("club"));
        const oppIdx = headers.findIndex((h) => h.includes("opp") || h.includes("matchup"));
        const ittIdx = headers.findIndex((h) => h.includes("itt") || h.includes("vegas") || h.includes("total"));
        const rzIdx = headers.findIndex((h) => h.includes("rz") || h.includes("red_zone"));
        const in5Idx = headers.findIndex((h) => h.includes("5") || h.includes("gl") || h.includes("goal"));
        const tpiIdx = headers.findIndex((h) => h.includes("tpi") || h.includes("score") || h.includes("proj"));

        const parsedRows: PlayerRow[] = lines.slice(1).map((line, idx) => {
          const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
          const tpi = tpiIdx !== -1 && !isNaN(parseFloat(cols[tpiIdx])) ? parseFloat(cols[tpiIdx]) : 0;
          const itt = ittIdx !== -1 && !isNaN(parseFloat(cols[ittIdx])) ? parseFloat(cols[ittIdx]) : 20.0;

          let tier = "DEPTH";
          if (tpi >= 0.50) tier = "ELITE T1";
          else if (tpi >= 0.35) tier = "START T2";
          else if (tpi >= 0.22) tier = "FLEX T3";

          return {
            rank: idx + 1,
            player: playerIdx !== -1 ? cols[playerIdx] : "Unknown",
            pos: posIdx !== -1 ? cols[posIdx].toUpperCase() : "FLEX",
            team: teamIdx !== -1 ? cols[teamIdx].toUpperCase() : "NFL",
            opponent: oppIdx !== -1 ? cols[oppIdx] : "-",
            vegas_itt: itt,
            rz_share: rzIdx !== -1 ? cols[rzIdx] : "N/A",
            inside_5: in5Idx !== -1 ? cols[in5Idx] : "N/A",
            tpi_score: tpi,
            tier,
          };
        });

        parsedRows.sort((a, b) => b.tpi_score - a.tpi_score);
        setData(parsedRows.map((r, i) => ({ ...r, rank: i + 1 })));
      } catch (err) {
        console.error("Failed to load quant table:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const matchesPos = selectedPos === "ALL" || row.pos === selectedPos;
      const matchesSearch =
        row.player.toLowerCase().includes(search.toLowerCase()) ||
        row.team.toLowerCase().includes(search.toLowerCase());
      return matchesPos && matchesSearch;
    });
  }, [data, selectedPos, search]);

  const posBadgeColor = (pos: string) => {
    switch (pos) {
      case "RB":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "WR":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "TE":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "QB":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      default:
        return "bg-neutral-800 text-neutral-300 border-neutral-700";
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header / Brand */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase font-mono tracking-widest text-emerald-400">
                Live Quant Feed Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
              Money Football Quant Lab
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Touchdown Projection Index (TPI) | Pure 6-Point TD Probability Modeling
            </p>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs text-neutral-400 bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 self-start sm:self-auto">
            <span>Model: <strong className="text-emerald-400">TPI-v4.1</strong></span>
            <span className="text-neutral-600">|</span>
            <span>Vegas ITT wt: <strong className="text-neutral-200">40%</strong></span>
            <span className="text-neutral-600">|</span>
            <span>Inside-5 wt: <strong className="text-neutral-200">35%</strong></span>
          </div>
        </header>

        {/* Filters & Search */}
        <section className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["ALL", "RB", "WR", "TE", "QB"].map((pos) => (
              <button
                key={pos}
                onClick={() => setSelectedPos(pos)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wider transition ${
                  selectedPos === pos
                    ? "bg-emerald-500 text-neutral-950 font-bold shadow-md shadow-emerald-500/20"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                {pos}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search player or NFL team..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </section>

        {/* Quant Table */}
        <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900/60 shadow-2xl backdrop-blur">
          {loading ? (
            <div className="p-12 text-center text-neutral-400 text-sm">
              <span className="inline-block w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mr-2" />
              Ingesting live TPI slate data...
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-12 text-center text-neutral-500 text-sm">
              No players found matching your criteria.
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-900 text-neutral-400 font-mono uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3 w-12 text-center">Rank</th>
                  <th className="py-3 px-4">Player</th>
                  <th className="py-3 px-3 text-center">Pos</th>
                  <th className="py-3 px-3 text-center">Team</th>
                  <th className="py-3 px-3">Opponent</th>
                  <th className="py-3 px-3 text-right">Vegas ITT</th>
                  <th className="py-3 px-3 text-center">Inside-5 Share</th>
                  <th className="py-3 px-4 text-center">TPI Score</th>
                  <th className="py-3 px-3 text-center">Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-sans">
                {filteredData.map((row) => (
                  <tr
                    key={`${row.player}-${row.team}`}
                    className="hover:bg-neutral-800/40 transition-colors"
                  >
                    <td className="py-2.5 px-3 text-center font-mono text-neutral-500 font-semibold">
                      {row.rank}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-white whitespace-nowrap">
                      {row.player}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${posBadgeColor(
                          row.pos
                        )}`}
                      >
                        {row.pos}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-neutral-300">
                      {row.team}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-400 font-mono text-[11px]">
                      {row.opponent}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-400">
                      {row.vegas_itt > 0 ? row.vegas_itt.toFixed(2) : "-"}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-neutral-300">
                      {row.inside_5}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-400 h-1.5 rounded-full"
                            style={{ width: `${Math.min(100, Math.max(0, row.tpi_score * 120))}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-white w-9 text-right">
                          {row.tpi_score.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-tight ${
                          row.tier === "ELITE T1"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : row.tier === "START T2"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-neutral-800 text-neutral-400"
                        }`}
                      >
                        {row.tier}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center text-xs font-mono text-neutral-600 pt-4 pb-8">
          Money Football Quant Lab • Automated daily pipeline • No external telemetry
        </footer>
      </div>
    </main>
  );
}
