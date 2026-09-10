import React, { useState } from 'react';
import { api } from '../api/client';
import TransparencyGauge from '../components/TransparencyGauge';
import TrueCostReveal from '../components/TrueCostReveal';
import PatternBadge from '../components/PatternBadge';
import { FileText, Settings, Image as ImageIcon, ArrowRight, Loader2, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function Analyzer() {
  const [activeTab, setActiveTab] = useState('text');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Mode A: Text
  const [textContent, setTextContent] = useState('');

  // Mode B: Manual
  const [manualForm, setManualForm] = useState({
    productType: 'Personal Loan',
    principal: 500000,
    advertisedEMI: 0,
    interestRate: 12.5,
    tenureMonths: 60,
    processingFee: 7500,
    documentationFee: 1500,
    insuranceFee: 4000,
    otherCharges: 0,
    downPayment: 0
  });

  // Mode C: OCR
  const [ocrFile, setOcrFile] = useState(null);
  const [extractedOcrText, setExtractedOcrText] = useState('');

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!textContent.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.analyzeText(textContent, 'Promotional Text');
      setResult(data);
    } catch (err) {
      setError(err.message || 'Analysis error');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api.analyzeManual(manualForm);
      setResult({
        transparencyScore: data.transparencyScore,
        statusLabel: data.statusLabel,
        detectedPatterns: data.detectedPatterns,
        commitmentData: data.commitment
      });
    } catch (err) {
      setError('Could not calculate manual terms.');
    } finally {
      setLoading(false);
    }
  };

  const handleOcrSubmit = async (e) => {
    e.preventDefault();
    if (!ocrFile) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.analyzeOCR(ocrFile);
      setExtractedOcrText(data.extractedText);
      setResult(data);
    } catch (err) {
      setError(err.message || 'OCR processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-black text-white tracking-tight">Offer Dark Pattern Analyzer</h2>
        <p className="text-xs text-slate-400 mt-1">
          Detect manipulative framing, verify true APRs, and expose hidden fees from ad copy or contract terms.
        </p>
      </div>

      <div className="flex gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 w-fit mb-6">
        <button
          onClick={() => { setActiveTab('text'); setResult(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${activeTab === 'text' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
        >
          <FileText className="w-3.5 h-3.5" />
          Ad Text Snippet
        </button>
        <button
          onClick={() => { setActiveTab('manual'); setResult(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${activeTab === 'manual' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
        >
          <Settings className="w-3.5 h-3.5" />
          Structured Contract Form
        </button>
        <button
          onClick={() => { setActiveTab('ocr'); setResult(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${activeTab === 'ocr' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          Screenshot OCR
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/70 text-red-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {activeTab === 'text' && (
        <div className="glass-panel p-6 rounded-2xl mb-8">
          <form onSubmit={handleTextSubmit}>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-300">Paste Financial Marketing Copy</label>
              <div className="text-[11px] text-cyan-400 flex gap-2">
                <span>Demo Snippets:</span>
                <button
                  type="button"
                  onClick={() => setTextContent("Instant ₹5,00,000 cash at only ₹9,499/mo! 0% processing fee today only! Hurry, 5 slots left! *T&C apply.")}
                  className="underline hover:text-cyan-300"
                >
                  Loan Trap
                </button>
                •
                <button
                  type="button"
                  onClick={() => setTextContent("Guaranteed returns of 18% p.a.! 100% risk-free double your money plan. Limited seats remaining.")}
                  className="underline hover:text-cyan-300"
                >
                  Ponzi Pitch
                </button>
              </div>
            </div>
            <textarea
              rows={4}
              value={textContent}
              onChange={e => setTextContent(e.target.value)}
              placeholder="e.g., Get ₹3,00,000 loan disbursed in 2 hours with easy ₹5,400 monthly installments..."
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-xs font-mono"
            />
            <button
              type="submit"
              disabled={loading || !textContent.trim()}
              className="mt-3 px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              Inspect Copy
            </button>
          </form>
        </div>
      )}

      {activeTab === 'manual' && (
        <div className="glass-panel p-6 rounded-2xl mb-8">
          <form onSubmit={handleManualSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Principal Borrowed (₹)</label>
              <input
                type="number"
                value={manualForm.principal}
                onChange={e => setManualForm({...manualForm, principal: Number(e.target.value)})}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Tenure (Months)</label>
              <input
                type="number"
                value={manualForm.tenureMonths}
                onChange={e => setManualForm({...manualForm, tenureMonths: Number(e.target.value)})}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Headline Annual Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={manualForm.interestRate}
                onChange={e => setManualForm({...manualForm, interestRate: Number(e.target.value)})}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Processing Fee (₹)</label>
              <input
                type="number"
                value={manualForm.processingFee}
                onChange={e => setManualForm({...manualForm, processingFee: Number(e.target.value)})}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Documentation Charges (₹)</label>
              <input
                type="number"
                value={manualForm.documentationFee}
                onChange={e => setManualForm({...manualForm, documentationFee: Number(e.target.value)})}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Insurance / Protection Fee (₹)</label>
              <input
                type="number"
                value={manualForm.insuranceFee}
                onChange={e => setManualForm({...manualForm, insuranceFee: Number(e.target.value)})}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>

            <div className="col-span-full pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                Calculate Unmasked Liabilities
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'ocr' && (
        <div className="glass-panel p-6 rounded-2xl mb-8">
          <form onSubmit={handleOcrSubmit}>
            <div className="border border-dashed border-slate-800 hover:border-cyan-500/40 rounded-xl p-6 text-center">
              <ImageIcon className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-xs text-slate-300">Upload promotional ad banner or screenshot</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Supports PNG, JPG, or WebP</p>
              <input
                type="file"
                accept="image/*"
                onChange={e => setOcrFile(e.target.files[0])}
                className="mt-3 text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-cyan-950 file:text-cyan-300 hover:file:bg-cyan-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !ocrFile}
              className="mt-4 px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              Run Optical Extraction
            </button>
          </form>

          {extractedOcrText && (
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-400 font-bold block mb-1 uppercase text-[10px]">Extracted Text</span>
              <p className="text-slate-300 font-mono whitespace-pre-wrap">{extractedOcrText}</p>
            </div>
          )}
        </div>
      )}

      {/* Results Output */}
      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TransparencyGauge
              score={result.transparencyScore}
              status={result.statusLabel}
            />

            <div className="md:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <ShieldAlert className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Analysis Summary</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{result.statusLabel}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  FinLens detected <span className="font-bold text-white">{result.detectedPatterns?.length || 0} dark patterns</span>. 
                  Inspect the warnings below to understand how the advertised terms differ from true contractual liabilities.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 mt-4">
                <strong>Borrower Tip:</strong> Always require the lender's standardized KFS (Key Fact Statement) detailing full APR before authorizing credit pulls.
              </div>
            </div>
          </div>

          {result.commitmentData && (
            <TrueCostReveal
              advertised={result.extractedParams?.emi ? `₹${result.extractedParams.emi.toLocaleString()}/mo` : null}
              breakdown={result.commitmentData}
            />
          )}

          <div>
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span>Flagged Patterns & Heuristics</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {result.detectedPatterns?.length || 0}
              </span>
            </h3>

            {(!result.detectedPatterns || result.detectedPatterns.length === 0) ? (
              <div className="p-6 rounded-xl glass-panel text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                No prominent deceptive framing patterns detected in this content.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.detectedPatterns.map((pat, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white">{pat.name}</span>
                        <PatternBadge severity={pat.severity} />
                      </div>
                      <p className="text-xs text-slate-300 mb-2">{pat.description}</p>
                      
                      <div className="p-2 rounded bg-slate-900 border border-slate-800/80 mb-3">
                        <span className="text-[10px] text-slate-500 uppercase block font-mono">Evidence</span>
                        <code className="text-xs text-cyan-300 font-mono">"{pat.evidence}"</code>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                      <strong className="text-slate-300 block mb-0.5">Recommended Countermeasure:</strong>
                      {pat.action}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
