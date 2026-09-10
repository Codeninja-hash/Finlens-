import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function DisclaimerNotice() {
  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] leading-relaxed text-slate-400">
      <div className="flex items-center gap-2 text-slate-300 font-semibold mb-1">
        <ShieldCheck className="w-4 h-4 text-cyan-400" />
        <span>Academic & Regulatory Compliance Notice</span>
      </div>
      FinLens is an educational consumer decision-support tool. It computes mathematical approximations of loan liabilities, APRs, and behavioral marketing tropes based on published formulas and regex patterns. FinLens does not constitute certified legal, credit, tax, or investment advice. Always inspect the regulated **Key Fact Statement (KFS)** before finalizing financial agreements.
    </div>
  );
}
