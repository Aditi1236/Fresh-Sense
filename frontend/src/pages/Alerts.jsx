import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../App";

function Alerts() {
  const navigate = useNavigate();
  const { batches, updateBatch } = useApp();

  // Automatically generate alerts from current batch risk
  const alerts = batches
    .filter((batch) => batch.risk >= 50)
    .map((batch) => ({
      ...batch,
      severity: batch.risk >= 75 ? "CRITICAL" : "WARNING",
      message:
        batch.risk >= 75
          ? "Spoilage risk has reached a critical level. Immediate delivery action is recommended."
          : "Environmental conditions are causing the predicted spoilage risk to increase.",
    }));

  const criticalCount = alerts.filter(
    (alert) => alert.risk >= 75
  ).length;

  const warningCount = alerts.filter(
    (alert) => alert.risk < 75
  ).length;

  const handlePrioritize = (batchId) => {
    updateBatch(batchId, {
      status: "PRIORITIZED",
    });
  };

  return (
    <div className="alerts-page">

      {/* PAGE HEADER */}
      <section className="alerts-header">
        <div>
          <div className="page-eyebrow">
            WORKSPACE / ALERTS
          </div>

          <h1>Smart Alerts</h1>

          <p>
            Actionable warnings generated from monitored batch
            conditions.
          </p>
        </div>

        <div className="alert-system-status">
          <span className="status-pulse"></span>
          AI MONITORING ACTIVE
        </div>
      </section>

      {/* SUMMARY CARDS */}
      <section className="alert-summary-grid">

        <div className="alert-summary-card">
          <div className="summary-icon purple">!</div>

          <div>
            <span>ACTIVE ALERTS</span>
            <strong>{alerts.length}</strong>
            <small>Require attention</small>
          </div>
        </div>

        <div className="alert-summary-card critical-summary">
          <div className="summary-icon red">⚠</div>

          <div>
            <span>CRITICAL</span>
            <strong>{criticalCount}</strong>
            <small>Immediate action</small>
          </div>
        </div>

        <div className="alert-summary-card">
          <div className="summary-icon yellow">◉</div>

          <div>
            <span>WARNING</span>
            <strong>{warningCount}</strong>
            <small>Monitor closely</small>
          </div>
        </div>

        <div className="alert-summary-card">
          <div className="summary-icon green">✓</div>

          <div>
            <span>SYSTEM STATUS</span>
            <strong>LIVE</strong>
            <small>All sensors connected</small>
          </div>
        </div>

      </section>

      {/* MAIN ALERT AREA */}
      <section className="alerts-main-card">

        <div className="alerts-card-header">
          <div>
            <span className="card-label">REAL-TIME FEED</span>
            <h2>Current Risk Alerts</h2>
          </div>

          <span className="live-indicator">
            <i></i>
            LIVE
          </span>
        </div>

        {alerts.length === 0 ? (
          <div className="no-alerts">
            <div className="no-alert-icon">✓</div>
            <h3>No active alerts</h3>
            <p>
              All monitored batches are currently within the
              acceptable risk range.
            </p>
          </div>
        ) : (
          <div className="alerts-list">

            {alerts.map((alert) => (
              <div
                className={`alert-item ${
                  alert.severity === "CRITICAL"
                    ? "critical-alert"
                    : "warning-alert"
                }`}
                key={alert.batchId}
              >

                {/* ALERT ICON */}
                <div className="alert-item-icon">
                  {alert.severity === "CRITICAL"
                    ? "🚨"
                    : "⚠️"}
                </div>

                {/* ALERT CONTENT */}
                <div className="alert-item-content">

                  <div className="alert-title-row">
                    <div>
                      <span
                        className={`severity-tag ${
                          alert.severity === "CRITICAL"
                            ? "critical-tag"
                            : "warning-tag"
                        }`}
                      >
                        {alert.severity}
                      </span>

                      <h3>
                        {alert.product} · Batch {alert.batchId}
                      </h3>
                    </div>

                    <div className="alert-risk">
                      <strong>{alert.risk}%</strong>
                      <span>risk</span>
                    </div>
                  </div>

                  <p className="alert-message">
                    {alert.message}
                  </p>

                  {/* SENSOR VALUES */}
                  <div className="alert-sensors">

                    <div>
                      <span>🌡 Temperature</span>
                      <strong>{alert.temperature}°C</strong>
                    </div>

                    <div>
                      <span>💧 Humidity</span>
                      <strong>{alert.humidity}%</strong>
                    </div>

                    <div>
                      <span>◷ Transit</span>
                      <strong>{alert.transitTime}h</strong>
                    </div>

                  </div>

                </div>

                {/* ACTIONS */}
                <div className="alert-actions">

                  <button
                    className="view-batch-button"
                    onClick={() =>
                      navigate(`/batch/${alert.batchId}`)
                    }
                  >
                    View Batch
                  </button>

                  {alert.risk >= 75 && (
                    <button
                      className="prioritize-alert-button"
                      onClick={() =>
                        handlePrioritize(alert.batchId)
                      }
                    >
                      🚨 Prioritize
                    </button>
                  )}

                </div>

              </div>
            ))}

          </div>
        )}

      </section>

      {/* AI INSIGHT */}
      <section className="ai-alert-insight">

        <div className="ai-insight-icon">✦</div>

        <div>
          <span>FRESHSENSE AI INSIGHT</span>

          <h3>
            {criticalCount > 0
              ? "Immediate intervention recommended"
              : "Cold-chain conditions are stable"}
          </h3>

          <p>
            {criticalCount > 0
              ? `${criticalCount} batch${
                  criticalCount > 1 ? "es are" : " is"
                } currently above the critical risk threshold. Prioritize
                delivery to minimize potential spoilage loss.`
              : "The AI risk engine is continuously evaluating temperature, humidity and transit conditions."}
          </p>
        </div>

        <button
          className="simulation-link-button"
          onClick={() => navigate("/simulation")}
        >
          Open Simulation →
        </button>

      </section>

    </div>
  );
}

export default Alerts;