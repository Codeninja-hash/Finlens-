import React from 'react';

export default function TransparencyGauge({ score = 70, status = 'Moderately Transparent' }) {
  let ringColor = 'text-amber-400';
  let badgeBg = 'bg-amber-950/40 border-amber-800/50 text-amber-300';
  if (score >= 75) {
    ringColor = 'text-emerald-400';
    badgeBg = 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300';
  } else if (score < 45) {
    ringColor = 'text-red-500';
    badgeBg = 'bg-red-950/40 border-red-800/50 text-red-300';
  }

  const strokeDashoffset = 440 - (440 * Math.max(0, Math.min(100, score))) / 100;

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
      <span className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mb-3">
        Transparency Score
      </span>

      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="10"
            className="text-slate-800/70"
            fill="transparent"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="10"
            strokeDasharray={440}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${ringColor} transition-all duration-1000 ease-out`}
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-black text-white tracking-tight">{score}</span>
          <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
        </div>
      </div>

      <div className={`mt-3 px-3 py-1 rounded-full border text-[11px] font-semibold uppercase tracking-wider ${badgeBg}`}>
        {status}
      </div>

      <p className="mt-2 text-[11px] text-slate-400 max-w-xs leading-normal">
        Evaluates framing transparency, unbundled hidden fees, and deceptive marketing urgency.
      </p>
    </div>
  );
}
