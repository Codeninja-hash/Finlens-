import React, { useState } from 'react';
import { formatINR } from '../utils/formatters';
import { Gamepad2, Trophy, RotateCcw } from 'lucide-react';

const SCENARIOS = [
  {
    title: "The Zero-Cost Festive Electronic Deal",
    situation: "During Diwali sale, you find a ₹40,000 laptop advertised at '0% EMI for 6 months'. At checkout, you notice a ₹1,200 convenience fee and forfeit a 10% instant UPI discount.",
    choices: [
      { text: "Accept 0% EMI with ₹1,200 fee", cashDelta: -1200, debtDelta: 40000, resilienceDelta: -20, explanation: "You paid ₹1,200 fee and forfeited a ₹4,000 cash discount, making the loan effectively cost 26% APR." },
      { text: "Pay upfront using savings with 10% UPI discount", cashDelta: -36000, debtDelta: 0, resilienceDelta: +20, explanation: "You secured a genuine net saving of ₹4,000 and avoided credit bureau reporting." },
      { text: "Postpone purchase by 6 months", cashDelta: 0, debtDelta: 0, resilienceDelta: +15, explanation: "Practiced delayed gratification and conserved cash reserve." }
    ]
  },
  {
    title: "The Flash Pre-Approved Credit Line",
    situation: "A notification flashes: 'Pre-approved loan of ₹1,50,000 ready for instant withdrawal! Offer expires in 12 minutes!'",
    choices: [
      { text: "Withdraw full ₹1,50,000 immediately into checking account", cashDelta: 144000, debtDelta: 150000, resilienceDelta: -30, explanation: "Fell for artificial urgency; incurred immediate ₹6,000 processing deduction." },
      { text: "Ignore notification and turn off promotional push permissions", cashDelta: 0, debtDelta: 0, resilienceDelta: +25, explanation: "Eliminated impulsive credit trigger." }
    ]
  },
  {
    title: "Credit Card Statement Shock",
    situation: "Your credit card bill arrives with total balance ₹60,000. The statement highlights 'Minimum Amount Due: ₹3,000'.",
    choices: [
      { text: "Pay only Minimum Amount Due (₹3,000)", cashDelta: -3000, debtDelta: 57000, resilienceDelta: -25, explanation: "Triggered 42% APR + 18% GST interest trap on remaining balance." },
      { text: "Pay full ₹60,000 statement balance", cashDelta: -60000, debtDelta: 0, resilienceDelta: +25, explanation: "Avoided all finance charges and maintained pristine credit rating." }
    ]
  }
];

export default function MoneyTrapGame() {
  const [index, setIndex] = useState(0);
  const [cash, setCash] = useState(75000);
  const [debt, setDebt] = useState(0);
  const [resilience, setResilience] = useState(70);
  const [log, setLog] = useState([]);
  const [finished, setFinished] = useState(false);

  const makeChoice = (c) => {
    const nextCash = cash + c.cashDelta;
    const nextDebt = debt + c.debtDelta;
    const nextRes = Math.max(0, Math.min(100, resilience + c.resilienceDelta));

    setCash(nextCash);
    setDebt(nextDebt);
    setResilience(nextRes);
    setLog([...log, { title: SCENARIOS[index].title, choice: c.text, explanation: c.explanation }]);

    if (index + 1 < SCENARIOS.length) {
      setIndex(index + 1);
    } else {
      setFinished(true);
    }
  };

  const restart = () => {
    setIndex(0);
    setCash(75000);
    setDebt(0);
    setResilience(70);
    setLog([]);
    setFinished(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Gamepad2 className="w-7 h-7 text-cyan-400" />
            Money Trap Simulator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Experience realistic deceptive credit choices and test your consumer financial resilience.
          </p>
        </div>
        <button
          onClick={restart}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass-panel p-4 rounded-xl text-center">
          <span className="text-[10px] uppercase text-slate-400 font-bold block">Cash Cushion</span>
          <span className="text-lg font-black text-emerald-400">{formatINR(cash)}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl text-center">
          <span className="text-[10px] uppercase text-slate-400 font-bold block">Unsettled Debt</span>
          <span className={`text-lg font-black ${debt > 25000 ? 'text-red-400' : 'text-amber-400'}`}>
            {formatINR(debt)}
          </span>
        </div>
        <div className="glass-panel p-4 rounded-xl text-center">
          <span className="text-[10px] uppercase text-slate-400 font-bold block">Resilience Rating</span>
          <span className="text-lg font-black text-cyan-400">{resilience}/100</span>
        </div>
      </div>

      {!finished ? (
        <div className="glass-panel p-6 rounded-2xl">
          <span className="text-[10px] font-mono text-cyan-400 block mb-1 uppercase">
            Challenge {index + 1} of {SCENARIOS.length}
          </span>
          <h3 className="text-xl font-bold text-white mb-2">{SCENARIOS[index].title}</h3>
          <p className="text-xs text-slate-300 mb-5 leading-relaxed">{SCENARIOS[index].situation}</p>

          <div className="space-y-3">
            {SCENARIOS[index].choices.map((c, i) => (
              <button
                key={i}
                onClick={() => makeChoice(c)}
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-left text-xs font-semibold text-white transition flex items-center justify-between group"
              >
                <span>{c.text}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-panel p-8 rounded-2xl text-center">
          <Trophy className="w-10 h-10 text-cyan-400 mx-auto mb-2" />
          <h3 className="text-xl font-black text-white mb-1">Audit Completed</h3>
          <p className="text-xs text-slate-300 mb-6">
            Your final financial resilience index is <strong>{resilience}/100</strong>.
          </p>

          <div className="text-left space-y-3 mb-6">
            {log.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <span className="font-bold text-white block">{item.title}</span>
                <span className="text-cyan-400 block my-0.5">Decision: {item.choice}</span>
                <span className="text-slate-400 text-[11px] block">{item.explanation}</span>
              </div>
            ))}
          </div>

          <button
            onClick={restart}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
