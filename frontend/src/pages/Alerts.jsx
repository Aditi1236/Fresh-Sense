import React, { useEffect, useState } from "react";
import { getAlerts } from "../services/api";

const demoAlerts = [
  {
    id: "A001",
    batchId: "B002",
    level: "HIGH",
    title: "High Spoilage Risk Detected",
    message:
      "Strawberry batch B002 has crossed the safe temperature range.",
    riskScore: 78,
    temperature: 8.4,
    humidity: 91,
    timestamp: new Date().toISOString(),
  },
  {
    id: "A002",
    batchId: "B005",
    level: "HIGH",
    title: "Elevated Risk Detected",
    message:
      "Mango batch B005 requires urgent attention to prevent further spoilage risk.",
    riskScore: 68,
    temperature: 7.9,
    humidity: 89,
    timestamp: new Date().toISOString(),
  },
  {
    id: "A003",
    batchId: "B004",
    level: "MEDIUM",
    title: "Temperature Fluctuation",
    message:
      "Temperature fluctuation detected in Tomato batch B004.",
    riskScore: 56,
    temperature: 6.7,
    humidity: 86,
    timestamp: new Date().toISOString(),
  },
];

function Alerts() {
  const [alerts, setAlerts] = useState(demoAlerts);

  useEffect(() => {
    getAlerts()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAlerts(data);
        }
      })
      .catch(() => {
        // Keep demo alerts if API is unavailable
        setAlerts(demoAlerts);
      });
  }, []);

  const getAlertClass = (level) => {
    if (level === "HIGH") return "alert-card high";
    if (level === "MEDIUM") return "alert-card medium";
    return "alert-card";
  };

  const getIcon = (level) => {
    if (level === "HIGH") return "🔴";
    if (level === "MEDIUM") return "🟠";
    return "🟢";
  };

  return (
    <div className="alerts-page">
      <div className="alerts-container">

        {/* Header */}
        <div className="alerts-header">
          <div>
            <div className="page-eyebrow">LIVE MONITORING</div>

            <h1>🚨 System Alerts</h1>

            <p>
              Real-time warnings from FreshSense cold-chain monitoring
            </p>
          </div>

          <div className="active-alert-count">
            <span>{alerts.length}</span>
            <small>Active Alerts</small>
          </div>
        </div>

        {/* Alert Summary */}
        <div className="alert-summary">

          <div className="alert-summary-card">
            <span className="summary-icon">🚨</span>
            <div>
              <strong>
                {alerts.filter((a) => a.level === "HIGH").length}
              </strong>
              <span>High Risk</span>
            </div>
          </div>

          <div className="alert-summary-card">
            <span className="summary-icon">⚠️</span>
            <div>
              <strong>
                {alerts.filter((a) => a.level === "MEDIUM").length}
              </strong>
              <span>Medium Risk</span>
            </div>
          </div>

          <div className="alert-summary-card">
            <span className="summary-icon">📦</span>
            <div>
              <strong>
                {new Set(alerts.map((a) => a.batchId)).size}
              </strong>
              <span>Affected Batches</span>
            </div>
          </div>

        </div>

        {/* Alerts */}
        <div className="alerts-section">

          <div className="section-title">
            <div>
              <h2>Active Alerts</h2>
              <p>Immediate attention may be required</p>
            </div>

            <span className="live-indicator">
              <span></span> LIVE
            </span>
          </div>

          <div className="alerts-list">

            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={getAlertClass(alert.level)}
              >

                <div className="alert-icon">
                  {getIcon(alert.level)}
                </div>

                <div className="alert-content">

                  <div className="alert-top">
                    <div>
                      <span className="alert-level">
                        {alert.level} RISK
                      </span>

                      <h3>{alert.title}</h3>
                    </div>

                    <span className="alert-batch">
                      {alert.batchId}
                    </span>
                  </div>

                  <p className="alert-message">
                    {alert.message}
                  </p>

                  <div className="alert-metrics">

                    <div>
                      <span>Risk Score</span>
                      <strong>{alert.riskScore}%</strong>
                    </div>

                    <div>
                      <span>Temperature</span>
                      <strong>{alert.temperature}°C</strong>
                    </div>

                    <div>
                      <span>Humidity</span>
                      <strong>{alert.humidity}%</strong>
                    </div>

                    <div>
                      <span>Detected</span>
                      <strong>
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </strong>
                    </div>

                  </div>

                  <button
                    className="alert-action"
                    onClick={() =>
                      (window.location.href = `/batch/${alert.batchId}`)
                    }
                  >
                    View Batch →
                  </button>

                </div>

              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}

export default Alerts;