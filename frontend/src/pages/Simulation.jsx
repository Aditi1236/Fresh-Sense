import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../App";

const steps = [
  { time: "10:00", risk: 18, temp: 4.2, humidity: 82 },
  { time: "11:00", risk: 35, temp: 5.1, humidity: 83 },
  { time: "12:00", risk: 52, temp: 6.3, humidity: 84 },
  { time: "13:00", risk: 67, temp: 7.2, humidity: 85 },
  { time: "14:00", risk: 78, temp: 8.1, humidity: 86 },
  { time: "15:00", risk: 84, temp: 8.7, humidity: 88 },
];

function Simulation() {
  const navigate = useNavigate();
  const { updateBatch } = useApp();

  const [currentStep, setCurrentStep] = useState(0);
  const [running, setRunning] = useState(false);

  const current = steps[currentStep];

  useEffect(() => {
    if (!running) return;

    if (currentStep >= steps.length - 1) {
      setRunning(false);

      updateBatch("B002", {
        temperature: 8.7,
        humidity: 88,
        transitTime: 36,
        risk: 84,
        status: "HIGH",
      });

      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);

      const next = steps[currentStep + 1];

      updateBatch("B002", {
        temperature: next.temp,
        humidity: next.humidity,
        transitTime: 31 + currentStep + 1,
        risk: next.risk,
        status:
          next.risk >= 75
            ? "HIGH"
            : next.risk >= 50
            ? "MEDIUM"
            : "SAFE",
      });
    }, 1800);

    return () => clearTimeout(timer);
  }, [running, currentStep, updateBatch]);

  const startSimulation = () => {
    setCurrentStep(0);
    setRunning(true);

    updateBatch("B002", {
      temperature: 4.2,
      humidity: 82,
      transitTime: 10,
      risk: 18,
      status: "SAFE",
    });
  };

  const resetSimulation = () => {
    setRunning(false);
    setCurrentStep(0);

    updateBatch("B002", {
      temperature: 4.2,
      humidity: 82,
      transitTime: 10,
      risk: 18,
      status: "SAFE",
    });
  };

  const riskStatus =
    current.risk >= 75
      ? "HIGH RISK"
      : current.risk >= 50
      ? "MEDIUM RISK"
      : "SAFE";

  return (
    <div className="simulation-page">

      {/* HEADER */}
      <section className="simulation-header">
        <div>
          <div className="page-eyebrow">
            PREDICTIVE ENGINE / LIVE SIMULATION
          </div>

          <h1>Live Risk Simulation</h1>

          <p>
            Demonstrate how a cold-chain deviation turns sensor
            readings into an early warning.
          </p>
        </div>

        <div className="demo-ready">
          <span></span>
          READY FOR DEMO
        </div>
      </section>

      {/* DEMO SCENARIO */}
      <section className="scenario-card">
        <div className="scenario-icon">⚡</div>

        <div>
          <h3>Judge Demo Scenario</h3>
          <p>
            Strawberry Batch B002 starts safe. A refrigeration
            deviation gradually increases temperature and humidity;
            FreshSense raises the predicted spoilage risk and
            recommends action.
          </p>
        </div>
      </section>

      {/* MAIN GRID */}
      <section className="simulation-grid">

        {/* LEFT - BATCH */}
        <div className="simulation-card batch-card">

          <div className="batch-top">
            <div>
              <span className="batch-label">BATCH B002</span>

              <h2>
                <span className="strawberry-icon">🍓</span>
                Strawberry
              </h2>
            </div>

            <div
              className={`risk-badge ${
                current.risk >= 75
                  ? "high"
                  : current.risk >= 50
                  ? "medium"
                  : "safe"
              }`}
            >
              {riskStatus}
            </div>
          </div>

          {/* RISK */}
          <div className="risk-section">
            <div className="risk-number">
              <span>{current.risk}%</span>
              <small>Predicted spoilage risk</small>
            </div>

            <div className="risk-bar">
              <div
                className="risk-fill"
                style={{ width: `${current.risk}%` }}
              ></div>
            </div>

            <p className="risk-message">
              {current.risk >= 75
                ? "⚠ Conditions are outside the monitored safe range."
                : current.risk >= 50
                ? "⚠ Risk is increasing. Monitor the shipment closely."
                : "✓ Conditions currently within monitored range."}
            </p>
          </div>

          {/* SENSOR GRID */}
          <div className="sensor-grid">

            <div className="sensor-box">
              <span className="sensor-icon">🌡</span>
              <div>
                <small>Temperature</small>
                <strong>{current.temp}°C</strong>
                <em>Cold-chain sensor</em>
              </div>
            </div>

            <div className="sensor-box">
              <span className="sensor-icon">💧</span>
              <div>
                <small>Humidity</small>
                <strong>{current.humidity}%</strong>
                <em>Environment sensor</em>
              </div>
            </div>

            <div className="sensor-box">
              <span className="sensor-icon">◷</span>
              <div>
                <small>Transit Time</small>
                <strong>{31 + currentStep}h</strong>
                <em>Shipment duration</em>
              </div>
            </div>

          </div>

          {/* BUTTONS */}
          <div className="simulation-actions">

            <button
              className="primary-sim-button"
              onClick={startSimulation}
              disabled={running}
            >
              <span>{running ? "● Running..." : "▶ Start Simulation"}</span>
            </button>

            <button
              className="secondary-sim-button"
              onClick={resetSimulation}
            >
              ↻ Reset
            </button>

          </div>
        </div>

        {/* RIGHT - LIVE MONITOR */}
        <div className="simulation-card monitor-card">

          <div className="card-heading">
            <div>
              <span className="card-label">LIVE MONITOR</span>
              <h2>Sensor Conditions</h2>
            </div>

            <div className="live-dot">
              <span></span> LIVE
            </div>
          </div>

          <div className="monitor-value">
            <div className="big-temperature">
              {current.temp}°
              <span>C</span>
            </div>

            <div className="temperature-label">
              Current temperature
            </div>
          </div>

          <div className="mini-chart">
            {steps.map((step, index) => (
              <div className="chart-column" key={step.time}>
                <div
                  className={`chart-bar ${
                    index <= currentStep ? "active" : ""
                  }`}
                  style={{
                    height: `${Math.max(step.risk * 1.6, 30)}px`,
                  }}
                ></div>

                <span>{step.time}</span>
              </div>
            ))}
          </div>

          <div className="monitor-footer">
            <div>
              <span>Humidity</span>
              <strong>{current.humidity}%</strong>
            </div>

            <div>
              <span>Transit</span>
              <strong>{31 + currentStep}h</strong>
            </div>

            <div>
              <span>Risk</span>
              <strong>{current.risk}%</strong>
            </div>
          </div>

        </div>

      </section>

      {/* RISK TIMELINE */}
      <section className="timeline-card">

        <div className="timeline-header">
          <div>
            <span className="card-label">RISK TIMELINE</span>
            <h2>Risk Escalation</h2>
          </div>

          <span className="steps-count">
            {currentStep + 1} / {steps.length} STEPS
          </span>
        </div>

        <div className="timeline">

          {steps.map((step, index) => (
            <div
              key={step.time}
              className={`timeline-step ${
                index <= currentStep ? "completed" : ""
              } ${index === currentStep ? "current" : ""}`}
            >
              <div className="timeline-dot">
                {index <= currentStep ? "✓" : index + 1}
              </div>

              <div className="timeline-info">
                <strong>{step.time}</strong>
                <span>{step.risk}% risk</span>
              </div>
            </div>
          ))}

        </div>

      </section>

      {/* FINAL ACTION */}
      <section
        className={`action-alert ${
          current.risk >= 75 ? "critical" : ""
        }`}
      >

        <div className="alert-icon">
          {current.risk >= 75 ? "🚨" : "⚠"}
        </div>

        <div className="alert-content">
          <span>AI RECOMMENDATION</span>

          <h3>
            {current.risk >= 75
              ? "Prioritize delivery immediately"
              : "Continue monitoring the shipment"}
          </h3>

          <p>
            {current.risk >= 75
              ? "FreshSense detected a critical spoilage-risk escalation in Batch B002."
              : "The AI engine is continuously monitoring environmental conditions."}
          </p>
        </div>

        {current.risk >= 75 && (
          <button
            className="prioritize-button"
            onClick={() => navigate("/alerts")}
          >
            🚨 Prioritize Delivery →
          </button>
        )}

      </section>

    </div>
  );
}

export default Simulation;