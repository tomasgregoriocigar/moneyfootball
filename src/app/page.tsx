export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-xl w-full text-center space-y-6 bg-neutral-900/60 border border-neutral-800 p-8 sm:p-10 rounded-2xl shadow-2xl backdrop-blur">
        
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Model Recalibration In Progress
        </div>

        {/* Title & Scope */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Money Football Quant Lab
          </h1>
          <p className="text-sm text-neutral-400">
            The Touchdown Projection Index (TPI) is undergoing proprietary backtest tuning for Week 4 slate deployment.
          </p>
        </div>

        {/* Engineering Specs Card */}
        <div className="text-left bg-neutral-950/80 border border-neutral-800 rounded-xl p-4 font-mono text-xs space-y-2 text-neutral-300">
          <div className="flex justify-between border-b border-neutral-800/80 pb-2">
            <span className="text-neutral-500">ENGINE:</span>
            <span className="text-emerald-400 font-bold">TPI-v4.1 Pure 6-PT</span>
          </div>
          <div className="flex justify-between border-b border-neutral-800/80 pb-2">
            <span className="text-neutral-500">OBJECTIVE:</span>
            <span className="text-white">Tier 1 Target Accuracy &ge; 85%</span>
          </div>
          <div className="flex justify-between border-b border-neutral-800/80 pb-2">
            <span className="text-neutral-500">CURRENT FOCUS:</span>
            <span className="text-neutral-300">Inside-the-3 RZ Carries & ITT Isolation</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">STATUS:</span>
            <span className="text-amber-400">Public Feed Paused</span>
          </div>
        </div>

        <p className="text-xs text-neutral-500 font-mono">
          Private terminal access active. Public slate release scheduled post-calibration.
        </p>
      </div>
    </main>
  );
}
