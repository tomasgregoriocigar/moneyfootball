export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Maintenance Mode
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          REMFL Quant Lab
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed">
          The models and slate pipelines are updating. Live boards and waiver feeds will be back online before kickoff.
        </p>
      </div>
    </main>
  );
}
