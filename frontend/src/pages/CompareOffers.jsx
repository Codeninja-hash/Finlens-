import React, { useState } from 'react';
import { api } from '../api/client';
import { formatINR } from '../utils/formatters';
import { Scale, Check, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function CompareOffers() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [offerA, setOfferA] = useState({
    principal: 400000,
    tenureMonths: 36,
    interestRate: 11.5,
    processingFee: 6000,
    documentationFee: 1000,
    insuranceFee: 3000
  });

  const [offerB, setOfferB] = useState({
    principal: 400000,
    tenureMonths: 60,
    interestRate: 13.0,
    processingFee: 1500,
    documentationFee: 500,
    insuranceFee: 0
  });

  const handleCompare = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.compareOffers(offerA, offerB, 'Comparative Loan Audit');
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <Scale className="w-7 h-7 text-cyan-400" />
          Side-by-Side Offer Auditor
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Unmask whether an offer with lower upfront fees or a lower monthly installment actually costs you more over the loan lifetime.
        </p>
      </div>

      <form onSubmit={handleCompare} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Offer A */}
        <div className="glass-panel p-5 rounded-2xl border-t-2 border-t-cyan-500">
          <h3 className="text-sm font-bold text-white mb-3">Offer A (Short Tenure / Higher Rate)</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">Principal (₹)</label>
              <input
                type="number"
                value={offerA.principal}
                onChange={e => setOfferA({...offerA, principal: Number(e.target.value)})}
                className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Tenure (Mo)</label>
                <input
                  type="number"
                  value={offerA.tenureMonths}
                  onChange={e => setOfferA({...offerA, tenureMonths: Number(e.target.value)})}
                  className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={offerA.interestRate}
                  onChange={e => setOfferA({...offerA, interestRate: Number(e.target.value)})}
                  className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">Processing + Doc Fees (₹)</label>
              <input
                type="number"
                value={offerA.processingFee + offerA.documentationFee}
                onChange={e => setOfferA({...offerA, processingFee: Number(e.target.value), documentationFee: 0})}
                className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Offer B */}
        <div className="glass-panel p-5 rounded-2xl border-t-2 border-t-indigo-500">
          <h3 className="text-sm font-bold text-white mb-3">Offer B (Extended Tenure / Lower Fees)</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">Principal (₹)</label>
              <input
                type="number"
                value={offerB.principal}
                onChange={e => setOfferB({...offerB, principal: Number(e.target.value)})}
                className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Tenure (Mo)</label>
                <input
                  type="number"
                  value={offerB.tenureMonths}
                  onChange={e => setOfferB({...offerB, tenureMonths: Number(e.target.value)})}
                  className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={offerB.interestRate}
                  onChange={e => setOfferB({...offerB, interestRate: Number(e.target.value)})}
                  className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">Processing + Doc Fees (₹)</label>
              <input
                type="number"
                value={offerB.processingFee + offerB.documentationFee}
                onChange={e => setOfferB({...offerB, processingFee: Number(e.target.value), documentationFee: 0})}
                className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>
        </div>

        <div className="col-span-full">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            Execute True Comparison
          </button>
        </div>
      </form>

      {/* Comparison Results */}
      {result && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs">
            <h4 className="text-sm font-bold text-white mb-1">Algorithmic Verdict:</h4>
            <p className="text-slate-300 leading-relaxed">{result.summary.verdict}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-5 rounded-2xl glass-panel ${result.summary.winner === 'A' ? 'border-2 border-emerald-500/60' : ''}`}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-white">Offer A Breakdown</span>
                {result.summary.winner === 'A' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-700/50 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Recommended Choice
                  </span>
                )}
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Monthly EMI</span>
                  <span className="font-bold text-white">{formatINR(result.offerA.monthlyPayment)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Cumulative Interest</span>
                  <span className="text-amber-400 font-semibold">{formatINR(result.offerA.totalInterestCost)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Upfront Charges</span>
                  <span className="text-red-400">{formatINR(result.offerA.ancillaryFeesTotal)}</span>
                </div>
                <div className="flex justify-between py-1 pt-2 font-bold text-sm">
                  <span className="text-slate-200">Total Net Cost</span>
                  <span className="text-white">{formatINR(result.offerA.totalCommitment)}</span>
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-2xl glass-panel ${result.summary.winner === 'B' ? 'border-2 border-emerald-500/60' : ''}`}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-white">Offer B Breakdown</span>
                {result.summary.winner === 'B' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-700/50 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Recommended Choice
                  </span>
                )}
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Monthly EMI</span>
                  <span className="font-bold text-white">{formatINR(result.offerB.monthlyPayment)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Cumulative Interest</span>
                  <span className="text-amber-400 font-semibold">{formatINR(result.offerB.totalInterestCost)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Upfront Charges</span>
                  <span className="text-red-400">{formatINR(result.offerB.ancillaryFeesTotal)}</span>
                </div>
                <div className="flex justify-between py-1 pt-2 font-bold text-sm">
                  <span className="text-slate-200">Total Net Cost</span>
                  <span className="text-white">{formatINR(result.offerB.totalCommitment)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
