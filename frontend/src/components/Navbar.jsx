import React from 'react';
import { Eye, Shield, Scale, Gamepad2, Compass, BookOpen, History } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView }) {
  const links = [
    { id: 'landing', label: 'Home', icon: Shield },
    { id: 'analyzer', label: 'Offer Analyzer', icon: Eye },
    { id: 'compare', label: 'Compare Offers', icon: Scale },
    { id: 'simulators', label: 'Decision Labs', icon: Compass },
    { id: 'money-trap', label: 'Money Trap Game', icon: Gamepad2 },
    { id: 'scam-quiz', label: 'Scam vs Legit', icon: BookOpen },
    { id: 'learning', label: 'Handbook', icon: BookOpen },
    { id: 'history', label: 'Audits', icon: History }
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Eye className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <span className="text-lg font-black tracking-tight text-white">
            Fin<span className="text-cyan-400">Lens</span>
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  active 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('analyzer')}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-md shadow-cyan-500/10"
          >
            Audit an Ad
          </button>
        </div>
      </div>
    </header>
  );
}
