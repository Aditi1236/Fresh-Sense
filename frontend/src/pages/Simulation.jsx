import React, { useEffect, useState } from "react";
import { simulate } from "../services/api";
import RiskBadge from "../components/RiskBadge";

function Simulation() {
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRisk, setLastRisk] = useState(null);

  useEffect(() => {
    const initHistory = [
      { timestamp: "10:00", risk: 18, status: "SAFE" },
      { timestamp: "11:00", risk: 35, status: "MEDIUM" },
      { timestamp: "12:00", risk: 52, status: "HIGH" },
      { timestamp: "13:00", risk: 78, status: "HIGH" },
      { timestamp: "14:00", risk: 84, status: "HIGH" },
      { timestamp: "15:00", risk: 91, status: "CRITICAL" },
    ];

    setHistory(initHistory);
  }, []);

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      simulate().catch(() => {});
    }
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleNext = () => {
    if (currentStep < history.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setLastRisk(history[nextStep].risk);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setLastRisk(history[prevStep].risk);
    }
  };

  const getRiskClass = (risk) => {
    if (risk <= 30) return "simulation-safe";
    if (risk <= 60) return "simulation-medium";
    if (risk <= 80) return "simulation-high";
    return "simulation-critical";
  };

  return (
    <div className="simulation-page">
      <div className="simulation-container">

        {/* Header */}
        <div className="simulation-header">
          <div>
            <p className="simulation-eyebrow">PREDICTIVE ENGINE</p>
            <h1>📈 Live Simulation</h1>
            <p className="simulation-subtitle">
              Observe how changing conditions can affect predicted spoilage risk.
            </p>
          </div>

          <div className={`simulation-status ${isRunning ? "running" : ""}`}>
            <span className="status-dot"></span>
            {isRunning ? "SIMULATION RUNNING" : "READY"}
          </div>
        </div>

        {/* Controls */}
        <div className="simulation-controls">
          <button
            onClick={handleStart}
            disabled={isRunning}
            className="simulation-btn simulation-start"
          >
            ▶ START SIMULATION
          </button>

          <button
            onClick={handleStop}
            disabled={!isRunning}
            className="simulation-btn simulation-stop"
          >
            ⏹ STOP
          </button>
        </div>

        {/* Current Risk */}
        <div className="simulation-current-card">
          <div>
            <span className="simulation-label">CURRENT PREDICTED RISK</span>

            <div className="simulation-risk-number">
              {history[currentStep]?.risk ?? 0}%
            </div>

            <div className="simulation-risk-status">
              <RiskBadge level={history[currentStep]?.status} />
            </div>
          </div>

          <div className="simulation-step">
            <span>TIME</span>
            <strong>{history[currentStep]?.timestamp}</strong>
            <small>
              Step {currentStep + 1} / {history.length}
            </small>
          </div>
        </div>

        {/* Timeline */}
        <div className="simulation-card">
          <div className="simulation-card-header">
            <div>
              <span className="simulation-eyebrow">RISK TIMELINE</span>
              <h2>Temperature & Risk Over Time</h2>
            </div>

            <span className="simulation-live">
              ● LIVE MODEL
            </span>
          </div>

          <div className="simulation-timeline">
            {history.map((entry, idx) => (
              <div
                key={idx}
                className={`simulation-entry ${
                  idx === currentStep ? "active" : ""
                }`}
                onClick={() => {
                  setCurrentStep(idx);
                  setLastRisk(entry.risk);
                }}
              >
                <div className="simulation-time">
                  {entry.timestamp}
                </div>

                <div className="simulation-line">
                  <div className={`simulation-dot ${getRiskClass(entry.risk)}`}>
                    {idx + 1}
                  </div>

                  {idx < history.length - 1 && (
                    <div className="simulation-connector"></div>
                  )}
                </div>

                <div className="simulation-info">
                  <div className="simulation-risk-row">
                    <strong>Risk: {entry.risk}%</strong>
                    <RiskBadge level={entry.status} />
                  </div>

                  <div className="simulation-bar">
                    <div
                      className={`simulation-bar-fill ${getRiskClass(
                        entry.risk
                      )}`}
                      style={{ width: `${entry.risk}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="simulation-navigation">
          <button
            onClick={handlePrevious}
            disabled={currentStep <= 0}
            className="simulation-nav-btn"
          >
            ← Previous
          </button>

          <div className="simulation-progress">
            <span>
              Step <strong>{currentStep + 1}</strong> of{" "}
              <strong>{history.length}</strong>
            </span>

            <div className="simulation-progress-track">
              <div
                className="simulation-progress-fill"
                style={{
                  width: `${
                    ((currentStep + 1) / history.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={currentStep >= history.length - 1}
            className="simulation-nav-btn simulation-next"
          >
            Next →
          </button>
        </div>

        {/* Last Risk */}
        {lastRisk !== null && (
          <div className="simulation-last-risk">
            <span>LAST RECORDED RISK</span>
            <strong>{lastRisk}%</strong>
          </div>
        )}

        {/* Disclaimer */}
        <div className="simulation-note">
          <span>ⓘ</span>
          <p>
            Simulation values are illustrative demo data used to demonstrate
            how FreshSense can visualize changing spoilage-risk conditions.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Simulation;