import React from 'react';
import { Eye, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function HeroLens({ onTriggerAnalyze, onTriggerCompare }) {
  return (
    <div className="relative w-full max-w-6xl mx-auto my-8 p-6 sm:p-10 rounded-3xl glass-panel-glow overflow-hidden">
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/50 text-cyan-300 text-xs font-semibold tracking-wide mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Financial Intelligence & Transparency Engine
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            See the <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">real math</span> behind deceptive offers.
          </h1>

          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            FinLens audits promotional loan ads, "No-Cost" EMI illusions, and hidden fees using deterministic financial algorithms and pattern-recognition heuristics.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              onClick={onTriggerAnalyze}
              className="px-6 py-3 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 text-sm"
            >
              Analyze an Offer
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onTriggerCompare}
              className="px-5 py-3 rounded-xl font-semibold border border-slate-700 bg-slate-900/80 text-gray-200 hover:bg-slate-800 transition text-sm"
            >
              Compare Two Loans
            </button>
          </div>
        </div>

        {/* Live Scanner Visual Simulation */}
        <div className="lg:col-span-5">
          <div className="relative h-72 rounded-2xl bg-slate-950 border border-slate-800 p-5 flex flex-col justify-between overflow-hidden shadow-2xl">
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan shadow-[0_0_15px_#00e5ff]" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Heuristic Lens Active</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">Rule-Based OCR / Regex</span>
            </div>

            <div className="space-y-3 my-auto">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Promotional Claim</span>
                <p className="text-sm font-semibold text-white mt-0.5">
                  "₹5,00,000 Loan at <span className="text-emerald-400">only ₹9,499/month</span>! 0% Processing fee today only."
                </p>
              </div>

              <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Unmasked Reality</span>
                  <span className="text-[10px] font-bold text-red-400">Score: 38/100 (Low)</span>
                </div>
                <p className="text-base font-extrabold text-white mt-0.5">
                  ₹6,83,940 <span className="text-[10px] font-normal text-slate-400">(60 mo. tenure + ₹14,000 hidden charges)</span>
                </p>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-800/80 pt-2">
              <span>Automatic dark pattern detection</span>
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
