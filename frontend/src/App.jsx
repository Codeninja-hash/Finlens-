import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroLens from './components/HeroLens';
import Analyzer from './pages/Analyzer';
import CompareOffers from './pages/CompareOffers';
import SimulatorHub from './pages/SimulatorHub';
import MoneyTrapGame from './pages/MoneyTrapGame';
import ScamOrLegit from './pages/ScamOrLegit';
import LearningCenter from './pages/LearningCenter';
import History from './pages/History';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');

  return (
    <div className="min-h-screen flex flex-col bg-[#05070E] text-slate-100 font-sans">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      <main className="flex-1">
        {currentView === 'landing' && (
          <div>
            <HeroLens
              onTriggerAnalyze={() => setCurrentView('analyzer')}
              onTriggerCompare={() => setCurrentView('compare')}
            />
            <div className="max-w-6xl mx-auto px-4">
              <Analyzer />
            </div>
          </div>
        )}

        {currentView === 'analyzer' && <Analyzer />}
        {currentView === 'compare' && <CompareOffers />}
        {currentView === 'simulators' && <SimulatorHub />}
        {currentView === 'money-trap' && <MoneyTrapGame />}
        {currentView === 'scam-quiz' && <ScamOrLegit />}
        {currentView === 'learning' && <LearningCenter />}
        {currentView === 'history' && <History onSelectView={setCurrentView} />}
      </main>

      <Footer />
    </div>
  );
}
