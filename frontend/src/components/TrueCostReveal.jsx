import React from 'react';
import { formatINR, formatPct } from '../utils/formatters';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export default function TrueCostReveal({ advertised, breakdown }) {
  if (!breakdown) return null;

  const {
    monthlyPayment,
    tenureMonths,
    totalEMIPayments,
    ancillaryFeesTotal,
    downPayment,
    totalCommitment,
    totalInterestCost,
    effectiveAPR
  } = breakdown;

  return (
    <div className="w-full my-6 p-6 rounded-2xl glass-panel border border-cyan-500/25 shadow-2xl">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">The Unmasked Financial Commitment</h3>
          <p className="text-xs text-slate-400">Side-by-side reconciliation of the pitch versus total contractual outflow.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 text-center flex flex-col justify-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Advertised Headline</span>
          <div className="text-3xl font-extrabold text-emerald-400 my-1">
            {advertised || `${formatINR(monthlyPayment)}/mo`}
          </div>
          <span className="text-xs text-slate-500">Promotional installment anchor</span>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-950/40 to-blue-950/30 border border-cyan-500/40 text-center flex flex-col justify-center">
          <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">True Aggregate Outflow</span>
          <div className="text-3xl font-black text-white my-1">
            {formatINR(totalCommitment)}
          </div>
          <span className="text-xs text-cyan-400 font-mono">
            Exact Estimated APR: {formatPct(effectiveAPR)}
          </span>
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60">
          <span className="text-[10px] text-slate-400 block uppercase">Duration</span>
          <span className="text-sm font-semibold text-gray-200">{tenureMonths} Months</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60">
          <span className="text-[10px] text-slate-400 block uppercase">Cumulative Interest</span>
          <span className="text-sm font-semibold text-amber-400">{formatINR(totalInterestCost)}</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60">
          <span className="text-[10px] text-slate-400 block uppercase">Ancillary Fees</span>
          <span className="text-sm font-semibold text-red-400">{formatINR(ancillaryFeesTotal)}</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60">
          <span className="text-[10px] text-slate-400 block uppercase">Down Payment</span>
          <span className="text-sm font-semibold text-gray-200">{formatINR(downPayment)}</span>
        </div>
      </div>
    </div>
  );
}
