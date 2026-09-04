import React, { useEffect, useState } from 'react';
import { simulate } from '../services/api';
import RiskBadge from '../components/RiskBadge';

function Simulation() {
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRisk, setLastRisk] = useState(null);

  useEffect(() => {
    // Initialize with sample data
    const initHistory = [
      { timestamp: '10:00', risk: 18, status: 'SAFE' },
      { timestamp: '11:00', risk: 35, status: 'MEDIUM' },
      { timestamp: '12:00', risk: 52, status: 'HIGH' },
      { timestamp: '13:00', risk: 78, status: 'HIGH' },
      { timestamp: '14:00', risk: 84, status: 'HIGH' },
      { timestamp: '15:00', risk: 91, status: 'CRITICAL' },
    ];
    setHistory(initHistory);
  }, []);

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      simulate();
    }
  };

  const handleStop = () => {
    if (isRunning) {
      setIsRunning(false);
    }
  };

  const handleNext = () => {
    if (isRunning && currentStep < history.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (isRunning && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold text-white mb-6">📈 Live Simulation</h1>
      
      {/* Controls */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={handleStart}
          disabled={isRunning}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
        >
          ▶ START SIMULATION
        </button>
        <button
          onClick={handleStop}
          disabled={!isRunning}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
        >
          ⏹ STOP
        </button>
      </div>

      {/* History Chart */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Temperature & Risk Over Time</h2>
        <div className="space-y-3">
          {history.map((entry, idx) => (
            <div key={idx} className="flex items-center gap-4 py-3">
              <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                {entry.timestamp.split(' ')[0]}
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400">{entry.timestamp}</p>
                <p className="text-sm font-mono text-white">Risk: {entry.risk}%</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <RiskBadge level={entry.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Indicator */}
      {isRunning && currentStep > 0 && (
        <div className="flex items-center gap-4 mb-6">
          <span className="text-2xl font-bold text-white">Step {currentStep + 1} of {history.length}</span>
          <span className="text-slate-400">/ {history.length}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handlePrevious}
          disabled={currentStep <= 0}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep >= history.length - 1}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Last Risk Value */}
      {lastRisk !== null && (
        <div className="mt-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/30">
          <p className="text-xs text-slate-400">Last recorded risk:</p>
          <p className="text-2xl font-bold text-white">{lastRisk}%</p>
        </div>
      )}
    </div>
  );
}

export default Simulation;