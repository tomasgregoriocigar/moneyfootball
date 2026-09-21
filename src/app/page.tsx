import React from 'react';

// Referral Tracking Constants
const REF_ID = process.env.NEXT_PUBLIC_KALSHI_REF_ID || '346071dd-bafa-4eca-93c2-13b1e0886a1a';
const KALSHI_SIGNUP_URL = `https://kalshi.com/sign-up/?referral=${REF_ID}&utm_source=moneyfootball`;

interface ContractData {
  rank: number;
  player: string;
  positionTeam: string;
  vegasItt: number;
  glc: number;
  rzSnap: number;
  kalshiAsk: number;
  tpiFair: number;
  edge: number;
  ticker: string;
}

const CONTRACTS: ContractData[] = [
  {
    rank: 1,
    player: 'Devin Singletary',
    positionTeam: 'RB • NYG (vs LAR)',
    vegasItt: 24.5,
    glc: 72,
    rzSnap: 78,
    kalshiAsk: 0.17,
    tpiFair: 0.28,
    edge: 11.0,
    ticker: 'KXNFLTD-26SEP21NYGLAR-NYGDSINGLETARY26-1',
  },
  {
    rank: 2,
    player: 'Kyren Williams',
    positionTeam: 'RB • LAR (@ NYG)',
    vegasItt: 27.5,
    glc: 82,
    rzSnap: 86,
    kalshiAsk: 0.59,
    tpiFair: 0.68,
    edge: 9.0,
    ticker: 'KXNFLTD-26SEP21NYGLAR-LARKWILLIAMS23-1',
  },
  {
    rank: 3,
    player: 'Puka Nacua',
    positionTeam: 'WR • LAR (@ NYG)',
    vegasItt: 27.5,
    glc: 32,
    rzSnap: 84,
    kalshiAsk: 0.47,
    tpiFair: 0.55,
    edge: 8.0,
    ticker: 'KXNFLTD-26SEP21NYGLAR-LARPNACUA17-1',
  },
  {
    rank: 4,
    player: 'Cam Skattebo',
    positionTeam: 'RB • NYG (vs LAR)',
    vegasItt: 24.5,
    glc: 45,
    rzSnap: 54,
    kalshiAsk: 0.42,
    tpiFair: 0.50,
    edge: 8.0,
    ticker: 'KXNFLTD-26SEP21NYGLAR-NYGCSKATTEBO44-1',
  },
  {
    rank: 5,
    player: 'Davante Adams',
    positionTeam: 'WR • LAR (@ NYG)',
    vegasItt: 27.5,
    glc: 28,
    rzSnap: 82,
    kalshiAsk: 0.42,
    tpiFair: 0.49,
    edge: 7.0,
    ticker: 'KXNFLTD-26SEP21NYGLAR-LARDADAMS17-1',
  },
  {
    rank: 6,
    player: 'Theo Johnson',
    positionTeam: 'TE • NYG (vs LAR)',
    vegasItt: 24.5,
    glc: 24,
    rzSnap: 65,
    kalshiAsk: 0.11,
    tpiFair: 0.17,
    edge: 6.0,
    ticker: 'KXNFLTD-26SEP21NYGLAR-NYGTJOHNSON87-1',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-neutral-200 font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-400">
      {/* Referral Sign-Up Header Banner */}
      <div className="w-full bg-neutral-900 border-b border-neutral-800 px-4 py-2.5 text-center text-xs font-mono text-neutral-300 flex items-center justify-center gap-2">
        <span>⚡ Exploit live NFL touchdown mispricings on Kalshi.</span>
        <a
          href={KALSHI_SIGNUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 font-bold underline hover:text-emerald-300 transition-colors inline-flex items-center gap-1"
        >
          Claim up to $25 bonus on sign-up ↗
        </a>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-6 font-mono text-xs">
          <div className="flex items-center gap-2 font-bold tracking-wider text-neutral-100 uppercase">
            <span>Top Touchdown Contracts to Trade</span>
          </div>
          <span className="text-neutral-500 font-medium">6 Active Lines</span>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border border-neutral-800 rounded-lg bg-neutral-950/60 shadow-2xl">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-500 text-[11px] uppercase tracking-wider bg-neutral-900/40">
                <th className="py-3 px-4">Rank / Player</th>
                <th className="py-3 px-3 text-center">Vegas ITT</th>
                <th className="py-3 px-3 text-center">GLC%</th>
                <th className="py-3 px-3 text-center">RZ Snap%</th>
                <th className="py-3 px-3 text-center">Kalshi Ask</th>
                <th className="py-3 px-3 text-center text-emerald-400">TPI Fair</th>
                <th className="py-3 px-3 text-center text-emerald-400">Edge (Δ)</th>
                <th className="py-3 px-3 text-center">Analyze</th>
                <th className="py-3 px-4 text-center">Execution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {CONTRACTS.map((item) => (
                <tr key={item.ticker} className="hover:bg-neutral-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-sans">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500 font-mono text-xs font-semibold">#{item.rank}</span>
                      <span className="font-bold text-neutral-100 text-sm">{item.player}</span>
                      <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-[10px] px-1.5 py-0.5 rounded font-mono font-medium tracking-wide">
                        TOUCHDOWN
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-0.5 font-medium">{item.positionTeam}</div>
                  </td>

                  <td className="py-3.5 px-3 text-center font-mono text-neutral-300">{item.vegasItt.toFixed(1)}</td>
                  <td className="py-3.5 px-3 text-center font-mono font-bold text-neutral-100">{item.glc}%</td>
                  <td className="py-3.5 px-3 text-center font-mono text-neutral-300">{item.rzSnap}%</td>
                  <td className="py-3.5 px-3 text-center font-mono text-neutral-300">${item.kalshiAsk.toFixed(2)}</td>
                  <td className="py-3.5 px-3 text-center font-mono font-bold text-emerald-400">${item.tpiFair.toFixed(2)}</td>
                  <td className="py-3.5 px-3 text-center font-mono font-bold text-emerald-400">+{item.edge.toFixed(1)}¢</td>

                  <td className="py-3.5 px-3 text-center">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 text-[11px] font-mono transition"
                    >
                      Compare 📊
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <a
                      href={`https://kalshi.com/markets/kxnfltd/pro-football-touchdowns/kxnfltd-26sep21nyglar?op_market_ticker=${item.ticker}&op_order_side=yes&op_order_type=dollars`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-3 py-1.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-mono font-semibold transition"
                    >
                      Trade ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Regulatory Disclaimer */}
        <footer className="mt-12 border-t border-neutral-900 pt-6 text-[11px] text-neutral-500 leading-relaxed font-sans">
          <div className="font-mono text-neutral-400 text-xs uppercase tracking-wider mb-2 font-semibold">
            Statutory Publisher & Regulatory Disclaimer
          </div>
          <p>
            Moneyfootball.ai is an independent statistical data utility and quantitative media publisher. Moneyfootball is not
            a registered Commodity Trading Advisor (CTA), broker-dealer, or designated exchange, and does not accept or custody user funds.
            All outputs, Touchdown Projection Index (TPI) metrics, and edge estimates are published strictly for educational and analytical purposes.
            Event contracts traded on CFTC-regulated exchanges (e.g., Kalshi) involve financial risk of capital loss.
          </p>
        </footer>
      </div>
    </main>
  );
}
