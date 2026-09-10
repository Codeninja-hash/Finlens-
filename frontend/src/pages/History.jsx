import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { formatINR, formatDate } from '../utils/formatters';
import { Trash2, History as HistoryIcon, AlertCircle } from 'lucide-react';

export default function History({ onSelectView }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      const data = await api.getHistory();
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (id) => {
    await api.deleteHistoryItem(id);
    setRecords(records.filter(r => r.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <HistoryIcon className="w-7 h-7 text-cyan-400" />
          Audit Log History
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Historical records of promotional copy scans and financial audits.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 text-xs">Loading audit records...</div>
      ) : records.length === 0 ? (
        <div className="glass-panel p-8 rounded-2xl text-center text-slate-400 text-xs">
          <AlertCircle className="w-6 h-6 text-slate-600 mx-auto mb-2" />
          No audits found. Analyze an offer to populate your audit log.
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((rec) => (
            <div key={rec.id} className="glass-panel p-4 rounded-xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{rec.product_type}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rec.transparency_score < 45 ? 'bg-red-950 text-red-300' : 'bg-amber-950 text-amber-300'}`}>
                    Score: {rec.transparency_score}/100
                  </span>
                  <span className="text-[10px] text-slate-500">{formatDate(rec.created_at)}</span>
                </div>
                <p className="text-xs text-slate-300 font-mono line-clamp-1 max-w-xl">
                  {rec.raw_text}
                </p>
                <div className="text-[11px] text-slate-400">
                  True Commitment: <strong className="text-white">{rec.true_total_commitment ? formatINR(rec.true_total_commitment) : 'N/A'}</strong>
                </div>
              </div>

              <button
                onClick={() => handleDelete(rec.id)}
                className="p-2 rounded-lg bg-slate-900 text-slate-500 hover:text-red-400 hover:bg-slate-800 transition"
                title="Delete entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
