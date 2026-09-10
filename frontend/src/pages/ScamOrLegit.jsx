import React, { useState } from 'react';
import { api } from '../api/client';
import { HelpCircle, CheckCircle2, XCircle, Award } from 'lucide-react';

const QUESTIONS = [
  {
    pitch: "Nova Wealth Fund guarantees 24% annual returns, fully risk-free with capital guarantee certificates signed on WhatsApp. Minimum investment ₹25,000.",
    verdict: "SCAM",
    rationale: "No legitimate equity or debt instrument can legally guarantee 24% risk-free returns. SEBI rules prohibit guaranteed returns in market-linked vehicles."
  },
  {
    pitch: "Standard Bank Pre-Approved Loan: ₹2,00,000 at 11.5% reducing APR for 36 months. Processing fee of 1.5% explicitly stated in Key Fact Statement.",
    verdict: "LEGIT",
    rationale: "Legitimate institutional offer with transparent reducing balance APR and disclosure of upfront charges via standard regulatory documentation."
  },
  {
    pitch: "SpeedPay Instant Loan: Download our APK from third-party site. Grant contacts & photo permissions to get ₹8,000 disbursed in 60 seconds with 7-day tenure.",
    verdict: "SCAM",
    rationale: "Classic illegal digital lending app trap. Demanding gallery and contact book access violates RBI digital lending guidelines and leads to extortion."
  }
];

export default function ScamOrLegit() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);

  const answer = async (ans) => {
    setSelected(ans);
    const correct = ans === QUESTIONS[current].verdict;
    const newScore = correct ? score + 1 : score;

    if (correct) setScore(newScore);

    setTimeout(async () => {
      setSelected(null);
      if (current + 1 < QUESTIONS.length) {
        setCurrent(current + 1);
      } else {
        setFinished(true);
        await api.saveQuizScore({ quizType: 'SCAM_VS_LEGIT', score: newScore, maxScore: QUESTIONS.length });
      }
    }, 1800);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <HelpCircle className="w-7 h-7 text-cyan-400" />
          Scam vs. Legit Quiz
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Train your instincts to distinguish regulated products from predatory illegal financial schemes.
        </p>
      </div>

      {!finished ? (
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex justify-between text-xs font-mono text-cyan-400 mb-2">
            <span>Case {current + 1} of {QUESTIONS.length}</span>
            <span>Current Score: {score}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm font-medium text-slate-200 mb-6 leading-relaxed">
            "{QUESTIONS[current].pitch}"
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => answer('SCAM')}
              disabled={selected !== null}
              className="p-3 rounded-xl bg-red-950/60 border border-red-800/70 hover:bg-red-900/60 font-bold text-xs text-red-200 transition"
            >
              Flag as Scam / Predatory
            </button>
            <button
              onClick={() => answer('LEGIT')}
              disabled={selected !== null}
              className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/70 hover:bg-emerald-900/60 font-bold text-xs text-emerald-200 transition"
            >
              Verify as Legitimate
            </button>
          </div>

          {selected && (
            <div className={`mt-4 p-3 rounded-xl text-xs ${selected === QUESTIONS[current].verdict ? 'bg-emerald-950/50 text-emerald-300' : 'bg-red-950/50 text-red-300'}`}>
              <strong>{selected === QUESTIONS[current].verdict ? 'Correct!' : 'Incorrect.'}</strong> {QUESTIONS[current].rationale}
            </div>
          )}
        </div>
      ) : (
        <div className="glass-panel p-8 rounded-2xl text-center">
          <Award className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
          <h3 className="text-2xl font-black text-white mb-1">Quiz Completed</h3>
          <p className="text-xs text-slate-300 mb-4">
            You scored <strong>{score} out of {QUESTIONS.length}</strong>.
          </p>
          <button
            onClick={() => { setCurrent(0); setScore(0); setFinished(false); }}
            className="px-6 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Retake Quiz
          </button>
        </div>
      )}
    </div>
  );
}
