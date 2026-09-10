import React from 'react';
import { ShieldCheck } from 'lucide-react';
import DisclaimerNotice from './DisclaimerNotice';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-white text-sm">FinLens Transparency & Consumer Decision Engine</span>
          </div>
          <span className="text-slate-500 text-xs font-mono">BSc IT Academic Innovation Platform</span>
        </div>

        <DisclaimerNotice />

        <div className="text-center text-slate-600 text-xs">
          © 2025–2026 FinLens. Deterministic mathematics for consumer empowerment. All product comparisons are educational simulations.
        </div>
      </div>
    </footer>
  );
}
