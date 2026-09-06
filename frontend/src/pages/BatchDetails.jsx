import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../App";

function BatchDetails() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const { batches } = useApp();

  const batch = batches.find((item) => item.batchId === batchId);

  if (!batch) {
    return (
      <div className="batch-not-found">
        <div className="not-found-icon">!</div>
        <h1>Batch not found</h1>
        <p>The requested shipment could not be found.</p>

        <button
          className="back-batches-button"
          onClick={() => navigate("/batches")}
        >
          ← Back to Batches
        </button>
      </div>
    );
  }

  const risk = Number(batch.risk) || 0;

  const riskLevel =
    risk >= 75 ? "CRITICAL" : risk >= 50 ? "MEDIUM" : "SAFE";

  const riskClass =
    risk >= 75 ? "critical" : risk >= 50 ? "medium" : "safe";

  const riskMessage =
    risk >= 75
      ? "Immediate delivery action is recommended. FreshSense has detected a critical spoilage-risk escalation."
      : risk >= 50
      ? "Environmental conditions require attention. Continue monitoring this shipment closely."
      : "Conditions are currently within the monitored safe operating range.";

  return (
    <div className="batch-details-page">

      {/* TOP HEADER */}
      <section className="batch-details-header">

        <div>
          <button
            className="back-button"
            onClick={() => navigate("/alerts")}
          >
            ← Back to Alerts
          </button>

          <div className="details-eyebrow">
            SHIPMENT / BATCH DETAILS
          </div>

          <h1>
            <span className="product-emoji">🍓</span>
            {batch.product}
            <span className="batch-separator">•</span>
            {batch.batchId}
          </h1>

          <p>
            Live condition analysis for this cold-chain shipment.
          </p>
        </div>

        <div className={`details-status ${riskClass}`}>
          <span></span>
          {riskLevel}
        </div>

      </section>

      {/* OVERVIEW GRID */}
      <section className="batch-overview-grid">

        {/* RISK CARD */}
        <div className="details-card risk-overview-card">

          <div className="details-card-label">
            AI SPOILAGE PREDICTION
          </div>

          <div className="risk-display">

            <div className={`risk-circle ${riskClass}`}>
              <strong>{risk}%</strong>
              <span>RISK</span>
            </div>

            <div className="risk-display-info">
              <h2>
                {riskLevel === "CRITICAL"
                  ? "Critical spoilage risk"
                  : riskLevel === "MEDIUM"
                  ? "Elevated spoilage risk"
                  : "Low spoilage risk"}
              </h2>

              <p>
                Current estimated spoilage risk based on
                monitored conditions.
              </p>
            </div>

          </div>

          <div className="large-risk-bar">
            <div
              className={`large-risk-fill ${riskClass}`}
              style={{ width: `${risk}%` }}
            ></div>
          </div>

        </div>

        {/* STATUS CARD */}
        <div className={`details-card condition-card ${riskClass}`}>

          <div className="condition-icon">
            {risk >= 75 ? "🚨" : risk >= 50 ? "⚠️" : "✓"}
          </div>

          <div>
            <span>AI STATUS</span>

            <h3>{riskMessage}</h3>

            <p>
              Last evaluated from live sensor readings.
            </p>
          </div>

        </div>

      </section>

      {/* SENSOR READINGS */}
      <section className="details-card sensor-readings-card">

        <div className="section-heading">

          <div>
            <div className="details-card-label">
              SENSOR READINGS
            </div>

            <h2>Current Conditions</h2>
          </div>

          <div className="live-badge">
            <span></span>
            LIVE
          </div>

        </div>

        <div className="details-sensor-grid">

          <div className="details-sensor">
            <div className="details-sensor-icon temperature">
              🌡
            </div>

            <div>
              <span>Temperature</span>
              <strong>{batch.temperature}°C</strong>
              <small>Current reading</small>
            </div>
          </div>

          <div className="details-sensor">
            <div className="details-sensor-icon humidity">
              💧
            </div>

            <div>
              <span>Humidity</span>
              <strong>{batch.humidity}%</strong>
              <small>Current reading</small>
            </div>
          </div>

          <div className="details-sensor">
            <div className="details-sensor-icon transit">
              ◷
            </div>

            <div>
              <span>Transit Time</span>
              <strong>{batch.transitTime}h</strong>
              <small>Since dispatch</small>
            </div>
          </div>

          <div className="details-sensor">
            <div className="details-sensor-icon location">
              📍
            </div>

            <div>
              <span>Location</span>
              <strong>In Transit</strong>
              <small>Last known location</small>
            </div>
          </div>

        </div>

      </section>

      {/* JOURNEY TIMELINE */}
      <section className="details-card journey-card">

        <div className="section-heading">

          <div>
            <div className="details-card-label">
              SUPPLY CHAIN TRACE
            </div>

            <h2>Journey Timeline</h2>
          </div>

          <span className="journey-live">
            ● Tracking active
          </span>

        </div>

        <div className="journey-timeline">

          <div className="journey-line"></div>

          <div className="journey-step completed">
            <div className="journey-dot">
              🌱
            </div>

            <div className="journey-content">
              <span>08:00 AM</span>
              <h3>Farm Origin</h3>
              <p>Shipment confirmed</p>
            </div>
          </div>

          <div className="journey-step completed">
            <div className="journey-dot">
              ❄️
            </div>

            <div className="journey-content">
              <span>09:30 AM</span>
              <h3>Cold Storage</h3>
              <p>Conditions monitored</p>
            </div>
          </div>

          <div className="journey-step completed">
            <div className="journey-dot">
              🚚
            </div>

            <div className="journey-content">
              <span>10:00 AM</span>
              <h3>Transport</h3>
              <p>Shipment in transit</p>
            </div>
          </div>

          <div className="journey-step current">
            <div className="journey-dot">
              📦
            </div>

            <div className="journey-content">
              <span>NOW</span>
              <h3>Market</h3>
              <p>Awaiting arrival</p>
            </div>
          </div>

        </div>

      </section>

      {/* ACTION AREA */}
      <section className="batch-action-panel">

        <div className="batch-action-text">

          <div className="action-spark">✦</div>

          <div>
            <span>FRESHSENSE AI RECOMMENDATION</span>

            <h2>
              {risk >= 75
                ? "Prioritize this shipment"
                : risk >= 50
                ? "Monitor this shipment closely"
                : "Shipment is currently stable"}
            </h2>

            <p>
              {risk >= 75
                ? "Critical risk detected. Accelerate delivery to reduce potential spoilage loss."
                : risk >= 50
                ? "Risk is elevated. Keep monitoring environmental conditions."
                : "No immediate intervention is required."}
            </p>
          </div>

        </div>

        <div className="batch-action-buttons">

          <button
            className="simulation-button"
            onClick={() => navigate("/simulation")}
          >
            ◉ Live Simulation
          </button>

          {risk >= 75 && (
            <button
              className="delivery-button"
              onClick={() => navigate("/alerts")}
            >
              🚨 Prioritize Delivery
            </button>
          )}

        </div>

      </section>

    </div>
  );
}

export default BatchDetails;