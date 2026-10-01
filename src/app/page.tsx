'use client';

import React, { useEffect, useState } from 'react';

interface PlayerRecommendation {
  player: string;
  pos: string;
  team: string;
  target_share?: number | string;
  rz_opportunities?: number | string;
  tpi_score?: number | string;
  notes?: string;
}

interface WaiverData {
  generated_at?: string;
  week?: number | string;
  waiver_targets?: PlayerRecommendation[];
  [key: string]: any;
}

export default function Home() {
  const [data, setData] = useState<WaiverData | null>(null);
  const [loading, setLoading] = useState(true);
  const [posFilter, setPosFilter] = useState('ALL');

  useEffect(() => {
    fetch('/data/remfl_waiver_board.json')
      .then((res) => {
        if (!res.ok) throw new Error('Data file not available');
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching quant board:', err);
        setLoading(false);
      });
  }, []);

  // Standardize player list based on schema
  const players: PlayerRecommendation[] = Array.isArray(data?.waiver_targets)
    ? data.waiver_targets
    : Array.isArray(data)
    ? data
    : [];

  const filteredPlayers = posFilter === 'ALL' 
    ? players 
    : players.filter((p) => p.pos?.toUpperCase() === posFilter);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span className="text-emerald-500">REMFL</span> Quantitative Slate
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Touchdown Projection Index (TPI) &amp; Automated Waiver Wire Intelligence
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/data/tpi_touchdown_board_full_slate.csv"
              download
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition"
            >
              Download Full Slate (.CSV)
            </a>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Feed
            </span>
          </div>
        </div>

        {/* Position Filter Bar */}
        <div className="flex gap-2">
          {['ALL', 'WR', 'RB', 'TE', 'QB'].map((pos) => (
            <button
              key={pos}
              onClick={() => setPosFilter(pos)}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wider transition ${
                posFilter === pos
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>

        {/* Main Data Board */}
        {loading ? (
          <div className="p-12 text-center text-neutral-500 text-sm">
            Loading quantitative data boards...
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="p-12 text-center border border-neutral-800 rounded-xl bg-neutral-900/50 text-neutral-400 text-sm">
            No targets matched the current filter.
          </div>
        ) : (
          <div className="overflow-x-auto border border-neutral-800 rounded-xl bg-neutral-900/40 backdrop-blur">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-900 text-neutral-400 uppercase text-xs tracking-wider border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Player</th>
                  <th className="px-4 py-4 font-semibold">Pos</th>
                  <th className="px-4 py-4 font-semibold">Team</th>
                  <th className="px-4 py-4 font-semibold text-right">TPI Score</th>
                  <th className="px-6 py-4 font-semibold">Strategic Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filteredPlayers.map((row, idx) => (
                  <tr key={idx} className="hover:bg-neutral-800/40 transition">
                    <td className="px-6 py-4 font-medium text-white">{row.player}</td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-neutral-800 text-neutral-300">
                        {row.pos}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-neutral-400">{row.team}</td>
                    <td className="px-4 py-4 text-right font-mono text-emerald-400 font-semibold">
                      {row.tpi_score ?? '—'}
                    </td>
                    <td className="px-6 py-4 text-neutral-400 text-xs max-w-md">
                      {row.notes ?? 'Top-tier probability profile for upcoming matchup.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </main>
  );
}
