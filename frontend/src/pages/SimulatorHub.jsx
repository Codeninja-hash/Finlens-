import React, { useState } from 'react';
import { api } from '../api/client';
import { formatINR } from '../utils/formatters';
import { CreditCard, ShoppingBag, Layers, TrendingUp, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function SimulatorHub() {
  const [activeTool, setActiveTool] = useState('credit-card');

  // Tool 1: Credit Card Trap
  const [ccBalance, setCcBalance] = useState(50000);
  const [ccRate, setCcRate] = useState(42);
  const [ccMinPct, setCcMinPct] = useState(5);
  const [ccResult, setCcResult] = useState(null);

  // Tool 2: BNPL Evaluator
  const [bnplOrder, setBnplOrder] = useState(4500);
  const [bnplFee, setBnplFee] = useState(120);
  const [bnplLateFee, setBnplLateFee] = useState(350);
  const [bnplResult, setBnplResult] = useState(null);

  // Tool 3: Subscriptions
  const [subs, setSubs] = useState([
    { title: 'Video Streaming', cost: 499, interval: 'monthly' },
    { title: 'Cloud Storage', cost: 130, interval: 'monthly' },
    { title: 'Gym / Fitness Membership', cost: 1800, interval: 'monthly' },
    { title: 'Annual Software License', cost: 3600, interval: 'yearly' }
  ]);
  const [subsResult, setSubsResult] = useState(null);

  // Tool 4: Opportunity Cost
  const [dailyHabit, setDailyHabit] = useState(250);
  const [oppResult, setOppResult] = useState(null);

  const runCCSim = async () => {
    const data = await api.simulateCreditCard({ balance: ccBalance, rate: ccRate, minPct: ccMinPct });
    setCcResult(data);
  };

  const runBNPLSim = async () => {
    const data = await api.simulateBNPL({ orderAmount: bnplOrder, installments: 3, platformFee: bnplFee, lateFee: bnplLateFee });
    setBnplResult(data);
  };

  const runSubsCalc = async () => {
    const data = await api.calculateSubscriptions(subs);
    setSubsResult(data);
  };

  const runOppCalc = async () => {
    const data = await api.calculateOpportunity(dailyHabit, 11);
    setOppResult(data);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-black text-white tracking-tight">Financial Decision Labs</h2>
        <p className="text-xs text-slate-400 mt-1">
          Interactive computational modules simulating compounding debt traps, lifestyle inflation, and retail financing models.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTool('credit-card')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${activeTool === 'credit-card' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          Credit Card Minimum-Pay Trap
        </button>
        <button
          onClick={() => setActiveTool('bnpl')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${activeTool === 'bnpl' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          BNPL Penalty Checker
        </button>
        <button
          onClick={() => setActiveTool('subs')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${activeTool === 'subs' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
        >
          <Layers className="w-3.5 h-3.5" />
          Subscription Leakage
        </button>
        <button
          onClick={() => setActiveTool('opp-cost')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${activeTool === 'opp-cost' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Opportunity Cost
        </button>
      </div>

      {/* TOOL 1: Credit Card Trap */}
      {activeTool === 'credit-card' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-panel p-5 rounded-2xl">
            <h3 className="text-sm font-bold text-white mb-4">Revolving Balance Setup</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Revolving Balance (₹)</label>
                <input
                  type="number"
                  value={ccBalance}
                  onChange={e => setCcBalance(Number(e.target.value))}
                  className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Card APR Rate (%)</label>
                <input
                  type="number"
                  value={ccRate}
                  onChange={e => setCcRate(Number(e.target.value))}
                  className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                />
                <span className="text-[10px] text-slate-500">Includes 18% GST on interest charges.</span>
              </div>
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Minimum Payment Pct (%)</label>
                <input
                  type="number"
                  value={ccMinPct}
                  onChange={e => setCcMinPct(Number(e.target.value))}
                  className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <button
                onClick={runCCSim}
                className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
              >
                Run Minimum-Payment Simulation
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 glass-panel p-5 rounded-2xl">
            {ccResult ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-white">Compound Debt Trajectory</h4>
                  <span className="text-xs font-bold text-amber-400 font-mono">Payoff: {ccResult.monthsToPayOff}</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Total Interest</span>
                    <span className="text-sm font-bold text-red-400">{formatINR(ccResult.totalInterestPaid)}</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">GST on Finance</span>
                    <span className="text-sm font-bold text-amber-400">{formatINR(ccResult.totalGSTPaid)}</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Total Cash Out</span>
                    <span className="text-sm font-bold text-white">{formatINR(ccResult.totalPaidOverall)}</span>
                  </div>
                </div>

                <div className="h-48 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ccResult.schedule}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#182238" />
                      <XAxis dataKey="month" stroke="#64748B" />
                      <YAxis stroke="#64748B" />
                      <Tooltip contentStyle={{ backgroundColor: '#0B101D', borderColor: '#182238', fontSize: '11px' }} />
                      <Line type="monotone" dataKey="remainingBalance" stroke="#EF4444" name="Remaining Balance (₹)" strokeWidth={2} />
                      <Line type="monotone" dataKey="interestToDate" stroke="#F59E0B" name="Total Interest (₹)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 text-xs">
                Run simulation to compute revolving interest timeline.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOOL 2: BNPL */}
      {activeTool === 'bnpl' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-white mb-2">BNPL Offer Parameters</h3>
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">Item Purchase Amount (₹)</label>
              <input
                type="number"
                value={bnplOrder}
                onChange={e => setBnplOrder(Number(e.target.value))}
                className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">Platform / Convenience Fee (₹)</label>
              <input
                type="number"
                value={bnplFee}
                onChange={e => setBnplFee(Number(e.target.value))}
                className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">Missed Payment Late Fee (₹)</label>
              <input
                type="number"
                value={bnplLateFee}
                onChange={e => setBnplLateFee(Number(e.target.value))}
                className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
            <button
              onClick={runBNPLSim}
              className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
            >
              Analyze BNPL Penalty Mechanics
            </button>
          </div>

          <div className="glass-panel p-5 rounded-2xl flex flex-col justify-center">
            {bnplResult ? (
              <div className="space-y-3 text-xs">
                <h4 className="text-sm font-bold text-white">BNPL True Cost Disclosure</h4>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">3 Installments of:</span>
                    <span className="font-bold text-white">{formatINR(bnplResult.installmentAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Base Total with Platform Charge:</span>
                    <span className="font-bold text-amber-400">{formatINR(bnplResult.baseTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total with 1 Missed Payment:</span>
                    <span className="font-bold text-red-400">{formatINR(bnplResult.totalWithOneLateFee)}</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-red-950/30 border border-red-800/50 text-red-300">
                  <strong>Effective Penalty APR:</strong> {bnplResult.annualizedPenaltyRate}%
                  <p className="mt-1 text-[11px] text-slate-300">{bnplResult.insight}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 text-xs py-10">
                Enter details to evaluate retail BNPL late charge risk.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOOL 3: Subscriptions */}
      {activeTool === 'subs' && (
        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white">Recurring Micro-Leak Auditor</h3>
            <button
              onClick={runSubsCalc}
              className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              Audit Leakage
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {subs.map((s, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{s.title}</span>
                  <span className="text-[10px] text-slate-400 uppercase">{s.interval}</span>
                </div>
                <span className="font-bold text-cyan-400">{formatINR(s.cost)}</span>
              </div>
            ))}
          </div>

          {subsResult && (
            <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-950 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Monthly Bleed</span>
                <span className="text-base font-bold text-amber-400">{formatINR(subsResult.monthlyTotal)}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Annual Bleed</span>
                <span className="text-base font-bold text-red-400">{formatINR(subsResult.yearlyTotal)}</span>
              </div>
              <div className="p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-xl">
                <span className="text-[10px] text-cyan-300 block">5-Yr SIP Wealth Lost</span>
                <span className="text-base font-black text-cyan-400">{formatINR(subsResult.fiveYearInvestedAt11Pct)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 4: Opportunity Cost */}
      {activeTool === 'opp-cost' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-panel p-5 rounded-2xl">
            <h3 className="text-sm font-bold text-white mb-3">Daily Discretionary Spend</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Daily Habit Cost (₹)</label>
                <input
                  type="number"
                  value={dailyHabit}
                  onChange={e => setDailyHabit(Number(e.target.value))}
                  className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                />
                <span className="text-[10px] text-slate-500">e.g. ₹250 online food delivery surcharge or coffee.</span>
              </div>
              <button
                onClick={runOppCalc}
                className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
              >
                Project Wealth Forfeited
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 glass-panel p-5 rounded-2xl flex flex-col justify-center">
            {oppResult ? (
              <div className="space-y-3 text-xs">
                <h4 className="text-sm font-bold text-white">Cumulative Compound Opportunity Cost</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">1-Year Direct Spend</span>
                    <span className="text-sm font-bold text-amber-400">{formatINR(oppResult.oneYearCost)}</span>
                  </div>
                  <div className="p-3 bg-cyan-950/40 rounded-xl border border-cyan-800/40">
                    <span className="text-[10px] text-cyan-300 block">5-Year SIP Value (11%)</span>
                    <span className="text-sm font-bold text-cyan-400">{formatINR(oppResult.hypotheticalInvested5Yr)}</span>
                  </div>
                  <div className="p-3 bg-cyan-950/40 rounded-xl border border-cyan-800/40">
                    <span className="text-[10px] text-cyan-300 block">10-Year SIP Value (11%)</span>
                    <span className="text-sm font-bold text-cyan-300">{formatINR(oppResult.hypotheticalInvested10Yr)}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">{oppResult.disclaimer}</p>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500 text-xs">
                Enter habit amount to calculate long-term investment opportunity cost.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
