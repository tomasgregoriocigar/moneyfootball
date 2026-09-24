import React from 'react';

export default function Home() {
  const WHOP_FILE_URL = "https://whop.com/moneyfootball-ai/nfl-week-3-touchdown-projection-index-tpi-full-slate-csv/";
  const WHOP_DISCORD_URL = "https://whop.com/moneyfootball-ai/quant-tier-full-terminal-access/";

  return (
    <main className="min-h-screen bg-[#0a0d14] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Header / Nav */}
      <header className="border-b border-slate-800/80 bg-[#0d111a]/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <span className="text-xl font-black tracking-tight text-white">MONEYFOOTBALL<span className="text-cyan-400">.AI</span></span>
          <span className="hidden sm:inline text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">LIVE: WEEK 3</span>
        </div>
        <div className="flex items-center space-x-4">
          <a href="#teasers" className="text-xs font-mono text-slate-400 hover:text-white transition">EDGE TEASERS</a>
          <a href="#pricing" className="text-xs font-mono text-slate-400 hover:text-white transition">DATA FEED</a>
          <a href={WHOP_DISCORD_URL} className="text-xs font-mono bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 px-3 py-1.5 rounded transition">VIP TERMINAL</a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Kalshi KXNFLTD Pricing Discrepancy Engine
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Systematic Touchdown Pricing Derived from <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Trench & Goal-to-Go</span> Math.
        </h1>
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
          We isolate goal-to-go carry concentration, red-zone target shares, and surface-adjusted line deltas to model true Poisson distribution odds against retail market consensus.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a href={WHOP_FILE_URL} className="px-6 py-3.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm transition shadow-lg shadow-cyan-500/20">
            Download Week 3 CSV Slate ($19.99)
          </a>
          <a href={WHOP_DISCORD_URL} className="px-6 py-3.5 rounded-lg bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-white font-semibold text-sm transition">
            Join VIP Quant Feed ($39.99/mo)
          </a>
        </div>
      </section>

      {/* Last Week's Backtested Performance */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-[#101622] border border-slate-800 rounded-xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-6 mb-6">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-emerald-400">Model Verification</p>
              <h2 className="text-xl font-bold text-white mt-1">Week 2 Model Performance & Edge Calibration</h2>
            </div>
            <div className="flex gap-6 font-mono text-xs">
              <div>
                <span className="text-slate-500 block">STRONG OVER HIT RATE</span>
                <span className="text-emerald-400 text-lg font-bold">71.4% (5/7)</span>
              </div>
              <div>
                <span className="text-slate-500 block">CLOSING LINE VALUE (CLV)</span>
                <span className="text-cyan-400 text-lg font-bold">+4.3% AVG</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            In Week 2, our Poisson conversion matrix identified heavy retail mispricings across goal-line carry monopolies. High-conviction (+5.0% edge or higher) recommendations produced positive EV over market close across both sportsbooks and Kalshi binary markets.
          </p>
        </div>
      </section>

      {/* 3 Live Week 3 Teasers */}
      <section id="teasers" className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-cyan-400">Live Calibration</p>
            <h2 className="text-2xl font-bold text-white">Week 3 High-Conviction Teaser Board</h2>
          </div>
          <span className="text-xs font-mono text-slate-500">Updated: Sep 24, 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Teaser 1: Kyren Williams */}
          <div className="bg-[#101622] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white">Kyren Williams</h3>
                  <p className="text-xs font-mono text-slate-400">RB · LAR vs SF</p>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">+9.5% EDGE</span>
              </div>
              <div className="mt-5 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Goal-to-Go Share:</span>
                  <span className="text-white font-semibold">82.0%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Kalshi Implied:</span>
                  <span className="text-slate-300">54.0%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>TPI True Probability:</span>
                  <span className="text-cyan-400 font-semibold">63.5%</span>
                </div>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800">
              <span className="text-[11px] font-mono text-emerald-400 font-bold tracking-wide">SIGNAL: OVER (STRONG)</span>
            </div>
          </div>

          {/* Teaser 2: Derrick Henry */}
          <div className="bg-[#101622] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white">Derrick Henry</h3>
                  <p className="text-xs font-mono text-slate-400">RB · BAL @ DAL</p>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">+7.7% EDGE</span>
              </div>
              <div className="mt-5 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Goal-to-Go Share:</span>
                  <span className="text-white font-semibold">78.0%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Kalshi Implied:</span>
                  <span className="text-slate-300">53.5%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>TPI True Probability:</span>
                  <span className="text-cyan-400 font-semibold">61.2%</span>
                </div>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800">
              <span className="text-[11px] font-mono text-emerald-400 font-bold tracking-wide">SIGNAL: OVER (STRONG)</span>
            </div>
          </div>

          {/* Teaser 3: Breece Hall */}
          <div className="bg-[#101622] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white">Breece Hall</h3>
                  <p className="text-xs font-mono text-slate-400">RB · NYJ vs NE</p>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">+5.2% EDGE</span>
              </div>
              <div className="mt-5 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Goal-to-Go Share:</span>
                  <span className="text-white font-semibold">69.0%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Kalshi Implied:</span>
                  <span className="text-slate-300">49.0%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>TPI True Probability:</span>
                  <span className="text-cyan-400 font-semibold">54.2%</span>
                </div>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800">
              <span className="text-[11px] font-mono text-cyan-400 font-bold tracking-wide">SIGNAL: OVER</span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-lg bg-slate-900/60 border border-dashed border-slate-800 text-center font-mono text-xs text-slate-400">
          🔒 67 additional Week 3 skill player projections, Poisson matrices, and negative-EV under signals locked in full export.
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-center text-2xl font-bold text-white mb-8">Access the Live Model Datasets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* One-Time Download */}
          <div className="bg-[#101622] border border-slate-800 rounded-xl p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-baseline">
                <h3 className="text-xl font-bold text-white">Full Slate CSV</h3>
                <span className="text-2xl font-bold font-mono text-white">$19.99</span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1">One-time direct file download</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-300 font-mono">
                <li className="flex items-center gap-2">✓ Full 16-game slate CSV export (.csv)</li>
                <li className="flex items-center gap-2">✓ Complete 70+ player Poisson conversions</li>
                <li className="flex items-center gap-2">✓ Live Kalshi bid/ask midpoint comparisons</li>
                <li className="flex items-center gap-2">✓ Instant delivery post-checkout</li>
              </ul>
            </div>
            <a
              href={WHOP_FILE_URL}
              className="mt-8 block text-center py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition border border-slate-700"
            >
              Download Week 3 Dataset
            </a>
          </div>

          {/* Monthly Subscription */}
          <div className="bg-[#101622] border-2 border-cyan-500/60 rounded-xl p-8 flex flex-col justify-between relative shadow-lg shadow-cyan-950/40">
            <span className="absolute -top-3 right-6 text-[10px] font-mono tracking-widest bg-cyan-500 text-black px-2.5 py-0.5 rounded font-bold uppercase">
              Most Popular
            </span>
            <div>
              <div className="flex justify-between items-baseline">
                <h3 className="text-xl font-bold text-white">VIP Quant Terminal</h3>
                <span className="text-2xl font-bold font-mono text-white">$39.99<span className="text-xs text-slate-400 font-normal">/mo</span></span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1">Automated season-long access</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-300 font-mono">
                <li className="flex items-center gap-2 text-cyan-200">✓ Automated daily 8:00 AM data drops</li>
                <li className="flex items-center gap-2 text-cyan-200">✓ Dedicated #institutional-csv channel access</li>
                <li className="flex items-center gap-2 text-cyan-200">✓ Real-time injury & line delta alerts</li>
                <li className="flex items-center gap-2 text-cyan-200">✓ Weekly recurring data updates</li>
              </ul>
            </div>
            <a
              href={WHOP_DISCORD_URL}
              className="mt-8 block text-center py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm transition"
            >
              Unlock VIP Terminal
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-xs font-mono text-slate-500">
        MoneyFootball.ai · Quantitative Edge Systems · {new Date().getFullYear()}
      </footer>
    </main>
  );
}
