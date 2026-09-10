import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

export default function PatternBadge({ severity = 'medium', label }) {
  if (severity === 'high') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-950/60 border border-red-800/60 text-red-300">
        <AlertTriangle className="w-3 h-3 text-red-400" />
        {label || 'High Severity'}
      </span>
    );
  }
  if (severity === 'medium') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/60 border border-amber-800/60 text-amber-300">
        <AlertCircle className="w-3 h-3 text-amber-400" />
        {label || 'Medium Severity'}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300">
      <Info className="w-3 h-3 text-slate-400" />
      {label || 'Notice'}
    </span>
  );
}
