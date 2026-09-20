'use client';

import React, { useState } from 'react';

interface EdgeItem {
  ticker: string;
  player: string;
  pos: string;
  team: string;
  opp: string;
  itt: number;
  glc: number;
  ask: number;
  fair: number;
  edge: string;
  action: 'BUY YES' | 'BUY NO' | 'NEUTRAL';
  url: string;
}

const LEAGUEWIDE_EDGES: EdgeItem[] = [
  // High-Volume Goal-Line Workhorses
  {
    ticker: 'KXNFLTD-26SEP21NYGLAR-NYGDSINGLETARY26-1',
    player: 'Devin Singletary',
    pos: 'RB',
    team: 'NYG',
    opp: 'vs LAR',
    itt: 24.5,
    glc: 72,
    ask: 0.17,
    fair: 0.28,
    edge: '+11.0¢',
    action: 'BUY YES',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21nyglar?op_market_ticker=KXNFLTD-26SEP21NYGLAR-NYGDSINGLETARY26-1&op_order_side=yes&op_order_type=dollars'
  },
  {
    ticker: 'KXNFLTD-26SEP21ATLPHI-ATLBROBINSON-1',
    player: 'Bijan Robinson',
    pos: 'RB',
    team: 'ATL',
    opp: '@ PHI',
    itt: 25.5,
    glc: 68,
    ask: 0.36,
    fair: 0.44,
    edge: '+8.0¢',
    action: 'BUY YES',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21atlphi?op_order_side=yes&op_order_type=dollars'
  },
  {
    ticker: 'KXNFLTD-26SEP21CHITEN-CHIRJOHNSON-1',
    player: 'Roschon Johnson',
    pos: 'RB',
    team: 'CHI',
    opp: 'vs TEN',
    itt: 23.2,
    glc: 65,
    ask: 0.19,
    fair: 0.27,
    edge: '+8.2¢',
    action: 'BUY YES',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21chiten?op_order_side=yes&op_order_type=dollars'
  },
  {
    ticker: 'KXNFLTD-26SEP21SFOLAR-SFOIGUERENDO-1',
    player: 'Isaac Guerendo',
    pos: 'RB',
    team: 'SFO',
    opp: '@ LAR',
    itt: 27.8,
    glc: 48,
    ask: 0.22,
    fair: 0.29,
    edge: '+7.5¢',
    action: 'BUY YES',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21sfolar?op_order_side=yes&op_order_type=dollars'
  },
  {
    ticker: 'KXNFLTD-26SEP21KCCLAC-KCCCSTEELE-1',
    player: 'Carson Steele',
    pos: 'RB',
    team: 'KCC',
    opp: '@ LAC',
    itt: 26.4,
    glc: 52,
    ask: 0.16,
    fair: 0.23,
    edge: '+7.0¢',
    action: 'BUY YES',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21kcclac?op_order_side=yes&op_order_type=dollars'
  },
  {
    ticker: 'KXNFLTD-26SEP21DETARI-DETDMONTGOMERY-1',
    player: 'David Montgomery',
    pos: 'RB',
    team: 'DET',
    opp: '@ ARI',
    itt: 28.5,
    glc: 74,
    ask: 0.44,
    fair: 0.52,
    edge: '+8.0¢',
    action: 'BUY YES',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21detari?op_order_side=yes&op_order_type=dollars'
  },

  // Elite Red-Zone Target Monopolizers
  {
    ticker: 'KXNFLTD-26SEP21SFOLAR-SFOGKITTLE-1',
    player: 'George Kittle',
    pos: 'TE',
    team: 'SFO',
    opp: '@ LAR',
    itt: 27.8,
    glc: 32,
    ask: 0.28,
    fair: 0.35,
    edge: '+7.0¢',
    action: 'BUY YES',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21sfolar?op_order_side=yes&op_order_type=dollars'
  },
  {
    ticker: 'KXNFLTD-26SEP21MINHOU-MINJJEFFERSON-1',
    player: 'Justin Jefferson',
    pos: 'WR',
    team: 'MIN',
    opp: 'vs HOU',
    itt: 24.0,
    glc: 28,
    ask: 0.33,
    fair: 0.40,
    edge: '+7.0¢',
    action: 'BUY YES',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21minhou?op_order_side=yes&op_order_type=dollars'
  },
  {
    ticker: 'KXNFLTD-26SEP21CINWAS-CINTMCBRIDE-1',
    player: 'Tee Higgins',
    pos: 'WR',
    team: 'CIN',
    opp: 'vs WAS',
    itt: 26.5,
    glc: 24,
    ask: 0.25,
    fair: 0.31,
    edge: '+6.0¢',
    action: 'BUY YES',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21cinwas?op_order_side=yes&op_order_type=dollars'
  },

  // Mispriced or Overvalued Lines (Neutral / Fade Candidates)
  {
    ticker: 'KXNFLTD-26SEP21INDCHI-INDJDOWNS-1',
    player: 'Josh Downs',
    pos: 'WR',
    team: 'IND',
    opp: 'vs CHI',
    itt: 20.8,
    glc: 12,
    ask: 0.27,
    fair: 0.22,
    edge: '-5.0¢',
    action: 'NEUTRAL',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21indchi?op_order_side=yes&op_order_type=dollars'
  },
  {
    ticker: 'KXNFLTD-26SEP21DENNYG-DENBNIX-1',
    player: 'Bo Nix',
    pos: 'QB',
    team: 'DEN',
    opp: '@ NYG',
    itt: 21.0,
    glc: 22,
    ask: 0.22,
    fair: 0.18,
    edge: '-4.0¢',
    action: 'NEUTRAL',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21dennyg?op_order_side=yes&op_order_type=dollars'
  }
];

export default function Home() {
  const [filterPos, setFilterPos] = useState<'ALL' | 'RB' | 'WR' | 'TE'>('ALL');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const displayedEdges = filterPos === 'ALL' 
    ? LEAGUEWIDE_EDGES 
    : LEAGUEWIDE_EDGES.filter((item) => item.pos === filterPos);

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-mono p-4 md:p-8 selection:bg-emerald-500 selection:text-black">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="border-b border-zinc-800 pb-4 flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-2xl font-black tracking-tight text-white">
                MONEYFOOTBALL<span className="text-emerald-500">.AI</span>
              </h1>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Quantitative NFL Leaguewide Touchdown Derivatives & Arbitrage Matrix
            </p>
          </div>
          <div className="text-xs bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded text-zinc-400">
            MODEL: <span className="text-emerald-400 font-bold">TPI v2.4</span> | FEED: <span className="text-white">KALSHI CFTC</span>
          </div>
        </header>

        {/* Live Banner */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded text-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <span className="text-emerald-400 font-bold uppercase">Leaguewide Discrepancy: </span>
            <span className="text-zinc-300">
              Retail order books systematically underprice secondary goal-line rushers (GLC &gt; 45%) and high-ITT tight ends.
            </span>
          </div>
          <span className="bg-zinc-900 border border-zinc-700 px-2.5 py-1 rounded text-zinc-400">
            100% Cash Collateralized
          </span>
        </div>

        {/* The Matrix Table & Filters */}
        <div className="border border-zinc-800 rounded bg-zinc-950 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/50 flex flex-wrap justify-between items-center gap-2 text-xs">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-white uppercase tracking-wider">Touchdown Contract Spreads</span>
              <span className="text-zinc-500">({displayedEdges.length} Active Lines)</span>
            </div>
            {/* Position Filter Tabs */}
            <div className="flex bg-zinc-900 rounded border border-zinc-800 p-0.5 text-[11px]">
              {(['ALL', 'RB', 'WR', 'TE'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setFilterPos(pos)}
                  className={`px-2.5 py-0.5 rounded font-bold transition-colors ${
                    filterPos === pos
                      ? 'bg-emerald-500 text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900 text-zinc-400 uppercase border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-3">Player / Matchup</th>
                  <th className="px-4 py-3">Vegas ITT</th>
                  <th className="px-4 py-3">GLC Share</th>
                  <th className="px-4 py-3">Kalshi Ask</th>
                  <th className="px-4 py-3 text-emerald-400">TPI Fair</th>
                  <th className="px-4 py-3 text-right">Edge (Δ)</th>
                  <th className="px-4 py-3 text-center">Execution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {displayedEdges.map((row) => {
                  const isPositive = row.edge.startsWith('+');
                  return (
                    <tr key={row.ticker} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-white">{row.player}</div>
                        <div className="text-[10px] text-zinc-500">{row.pos} • {row.team} {row.opp}</div>
                      </td>
                      <td className="px-4 py-3 text-zinc-300">{row.itt}</td>
                      <td className="px-4 py-3 text-zinc-300">{row.glc}%</td>
                      <td className="px-4 py-3 text-zinc-300">${row.ask.toFixed(2)}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-400">${row.fair.toFixed(2)}</td>
                      <td className={`px-4 py-3 text-right font-bold ${isPositive ? 'text-emerald-400' : 'text-zinc-500'}`}>
                        {row.edge}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <a
                          href={row.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded text-[11px] transition-colors"
                        >
                          Trade ↗
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Capture */}
        <div className="border border-zinc-800 bg-zinc-950 p-6 rounded text-center max-w-lg mx-auto space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">Sunday 11:30 AM Kickoff Alerts</h3>
          <p className="text-xs text-zinc-400">
            Get leaguewide goal-line carry discrepancies delivered the moment inactives post before 1:00 PM kickoff.
          </p>
          {submitted ? (
            <div className="text-xs text-emerald-400 font-bold py-2">✓ Locked in. You are on the Sunday dispatch list.</div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setSubmitted(true);
              }}
              className="flex gap-2 max-w-sm mx-auto pt-2"
            >
              <input
                type="email"
                placeholder="trader@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-900 border border-zinc-700 text-xs px-3 py-2 rounded flex-1 focus:outline-none focus:border-emerald-500 text-white"
              />
              <button
                type="submit"
                className="bg-zinc-100 hover:bg-white text-black font-bold text-xs px-4 py-2 rounded transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        {/* Regulatory Disclaimer */}
        <footer className="border-t border-zinc-900 pt-6 text-[10px] text-zinc-600 space-y-2 leading-relaxed">
          <div className="font-semibold uppercase tracking-wider text-zinc-500">
            Statutory Publisher & Regulatory Disclaimer
          </div>
          <p>
            Moneyfootball.ai is an independent statistical data utility and quantitative media publisher. Moneyfootball is not a registered Commodity Trading Advisor (CTA), broker-dealer, or designated exchange, and does not accept or custody user funds. All outputs, Touchdown Projection Index (TPI) metrics, and edge estimates are published strictly for educational and analytical purposes. Event contracts traded on CFTC-regulated exchanges (e.g., Kalshi) involve financial risk of capital loss.
          </p>
        </footer>

      </div>
    </div>
  );
}
