import React from 'react';
import { BookOpen, ShieldAlert, CheckCircle, Scale, FileText } from 'lucide-react';

const DARK_PATTERNS = [
  {
    title: "Monthly Payment Framing",
    summary: "Displaying 'Just ₹1,999/mo' to anchor attention on recurring cashflows rather than total repayment of ₹1,40,000+."
  },
  {
    title: "Drip Ancillary Fees",
    summary: "Adding processing fees, stamp duty, credit assessment fees, and mandatory insurance after the borrower applies."
  },
  {
    title: "The Zero-Cost EMI Subvention Trick",
    summary: "Claiming 0% interest while stripping cash discounts or charging platform convenience fees and GST on interest components."
  },
  {
    title: "Pre-checked Insurance Opt-Ins",
    summary: "Automatically adding personal accident or credit protection cover to loan disbursement checkouts."
  },
  {
    title: "Artificial Urgency & Scarcity",
    summary: "Displaying ticking countdown clocks to rush borrowers past the loan terms and disclosure clauses."
  }
];

export default function LearningCenter() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-cyan-400" />
          Consumer Protection Handbook
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Essential guidelines on regulatory loan disclosures, dark pattern tactics, and borrower rights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-3">
            <FileText className="w-4 h-4" />
            <span>The Mandatory Key Fact Statement (KFS)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Regulatory mandates require all licensed digital and retail lenders to provide a standardized, single-page Key Fact Statement before contract signing.
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside font-mono">
            <li>Must state the all-inclusive Annual Percentage Rate (APR).</li>
            <li>Must itemize every fee: processing, documentation, verification.</li>
            <li>Must outline late payment fees and pre-payment penalties.</li>
            <li>Must declare designated grievance redressal officer details.</li>
          </ul>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
            <CheckCircle className="w-4 h-4" />
            <span>The 4-Step Borrower Protection Checklist</span>
          </div>
          <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside">
            <li><strong>Demand the APR:</strong> Never accept flat interest rates without seeing the annualized reducing APR.</li>
            <li><strong>Inspect Checkboxes:</strong> Verify that optional loan insurance or riders are not pre-selected.</li>
            <li><strong>Verify Lender Licensing:</strong> Confirm that the entity operates under an approved NBFC or scheduled bank license.</li>
            <li><strong>Wait 24 Hours:</strong> Step away from urgent promotional countdowns before signing digital notes.</li>
          </ol>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          Recognized Financial Dark Patterns Taxonomy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DARK_PATTERNS.map((dp, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-xs font-bold text-white block mb-1">{dp.title}</span>
              <p className="text-xs text-slate-400 leading-relaxed">{dp.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
