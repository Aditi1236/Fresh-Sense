import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBatches } from "../services/api";

const demoBatches = [
  {
    batchId: "B001",
    product: "Apple",
    temperature: 4.2,
    humidity: 82,
    transitTime: 12,
    location: "Punjab",
    riskScore: 18,
    riskLevel: "SAFE",
  },
  {
    batchId: "B002",
    product: "Strawberry",
    temperature: 8.4,
    humidity: 91,
    transitTime: 18,
    location: "Chandigarh",
    riskScore: 78,
    riskLevel: "HIGH",
  },
  {
    batchId: "B003",
    product: "Milk",
    temperature: 3.8,
    humidity: 75,
    transitTime: 8,
    location: "Ludhiana",
    riskScore: 24,
    riskLevel: "SAFE",
  },
  {
    batchId: "B004",
    product: "Tomato",
    temperature: 6.7,
    humidity: 86,
    transitTime: 15,
    location: "Amritsar",
    riskScore: 56,
    riskLevel: "MEDIUM",
  },
  {
    batchId: "B005",
    product: "Mango",
    temperature: 7.9,
    humidity: 89,
    transitTime: 20,
    location: "Delhi",
    riskScore: 68,
    riskLevel: "HIGH",
  },
];

function getStatusClass(level) {
  if (level === "SAFE") return "safe";
  if (level === "MEDIUM") return "medium";
  return "high";
}

function getProductIcon(product) {
  const icons = {
    Strawberry: "🍓",
    Apple: "🍎",
    Milk: "🥛",
    Tomato: "🍅",
    Mango: "🥭",
  };

  return icons[product] || "📦";
}

function MiniSparkline({ type = "blue" }) {
  return (
    <svg className={`mini-sparkline ${type}`} viewBox="0 0 130 45">
      <polyline
        points="0,34 15,27 28,31 42,16 55,22 68,11 82,20 96,8 110,16 130,5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function RiskGauge({ value }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (value / 100) * circumference;

  return (
    <div className="risk-gauge">
      <svg viewBox="0 0 180 180">
        <circle
          cx="90"
          cy="90"
          r={radius}
          className="gauge-bg"
        />

        <circle
          cx="90"
          cy="90"
          r={radius}
          className="gauge-progress"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
        />
      </svg>

      <div className="gauge-content">
        <strong>{value}%</strong>
        <span>Risk Score</span>
      </div>
    </div>
  );
}

function TemperatureChart({ batch }) {
  const points = batch?.tempHistory?.length
    ? batch.tempHistory
    : [4.5, 4.8, 5.1, 5.7, 6.2, 7.1, 8.4];

  const max = Math.max(...points, 10);
  const min = Math.min(...points, 0);

  const chartPoints = points
    .map((temp, index) => {
      const x = (index / (points.length - 1 || 1)) * 620;
      const y = 210 - ((temp - min) / (max - min || 1)) * 160;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg className="temperature-chart" viewBox="0 0 650 250">
      <defs>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>
      </defs>

      <line x1="0" y1="210" x2="620" y2="210" className="chart-grid" />
      <line x1="0" y1="130" x2="620" y2="130" className="chart-grid" />
      <line x1="0" y1="50" x2="620" y2="50" className="chart-grid" />

      <polyline
        points={`0,210 ${chartPoints} 620,210`}
        fill="url(#areaGradient)"
        stroke="none"
      />

      <polyline
        points={chartPoints}
        fill="none"
        stroke="#22d3ee"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {points.map((temp, index) => {
        const x = (index / (points.length - 1 || 1)) * 620;
        const y = 210 - ((temp - min) / (max - min || 1)) * 160;

        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r="4"
            className="chart-dot"
          />
        );
      })}
    </svg>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [batches, setBatches] = useState(demoBatches);
  const [activeNav, setActiveNav] = useState("dashboard");

  useEffect(() => {
    getBatches()
      .then((res) => {
        const data = res?.data;

        const apiBatches = Array.isArray(data)
          ? data
          : Array.isArray(data?.batches)
          ? data.batches
          : [];

        if (apiBatches.length > 0) {
          setBatches(apiBatches);
        }
      })
      .catch(() => {
        // Demo data remains visible if API is unavailable.
      });
  }, []);

  const stats = useMemo(() => {
    const safe = batches.filter(
      (b) => b.riskLevel === "SAFE"
    ).length;

    const medium = batches.filter(
      (b) => b.riskLevel === "MEDIUM"
    ).length;

    const critical = batches.filter(
      (b) =>
        b.riskLevel === "HIGH" ||
        b.riskLevel === "CRITICAL"
    ).length;

    return {
      total: batches.length,
      safe,
      medium,
      critical,
    };
  }, [batches]);

  const highestRiskBatch = [...batches].sort(
    (a, b) => (b.riskScore || 0) - (a.riskScore || 0)
  )[0];

  const b002 =
    batches.find((b) => b.batchId === "B002") ||
    highestRiskBatch ||
    demoBatches[1];

  const alerts = [
    {
      id: 1,
      type: "critical",
      icon: "🚨",
      title: "High Spoilage Risk",
      batch: "B002",
      text: "Temperature has exceeded the recommended monitoring range.",
      risk: 78,
    },
    {
      id: 2,
      type: "warning",
      icon: "⚠",
      title: "Elevated Risk Detected",
      batch: "B005",
      text: "Environmental conditions indicate increasing spoilage risk.",
      risk: 68,
    },
    {
      id: 3,
      type: "info",
      icon: "🌡",
      title: "Temperature Fluctuation",
      batch: "B004",
      text: "Temperature is above the preferred storage condition.",
      risk: 56,
    },
  ];

  const handleNavigation = (page) => {
    setActiveNav(page);

    if (page === "alerts") {
      navigate("/alerts");
    } else if (page === "batches") {
      navigate("/batches");
    } else if (page === "analytics") {
      navigate("/analytics");
    }
  };

  return (
    <div className="freshsense-app">

      {/* Ambient background */}
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-logo">🌿</div>

          <div>
            <h1>
              Fresh<span>Sense</span>
            </h1>

            <p>Smart Cold-Chain</p>
          </div>
        </div>

        <div className="sidebar-label">
          WORKSPACE
        </div>

        <nav className="sidebar-nav">

          <button
            className={`nav-item ${
              activeNav === "dashboard" ? "active" : ""
            }`}
            onClick={() => setActiveNav("dashboard")}
          >
            <span className="nav-icon">▦</span>
            Dashboard
          </button>

          <button
            className={`nav-item ${
              activeNav === "batches" ? "active" : ""
            }`}
            onClick={() => handleNavigation("batches")}
          >
            <span className="nav-icon">◈</span>
            Batches
          </button>

          <button
            className={`nav-item ${
              activeNav === "alerts" ? "active" : ""
            }`}
            onClick={() => handleNavigation("alerts")}
          >
            <span className="nav-icon">♢</span>
            Alerts
            <span className="nav-count">3</span>
          </button>

          <button
            className={`nav-item ${
              activeNav === "analytics" ? "active" : ""
            }`}
            onClick={() => handleNavigation("analytics")}
          >
            <span className="nav-icon">⌁</span>
            Analytics
          </button>

        </nav>

        <div className="sidebar-label">
          SYSTEM
        </div>

        <nav className="sidebar-nav">

          <button className="nav-item">
            <span className="nav-icon">⌁</span>
            Live Monitoring
            <span className="live-dot" />
          </button>

          <button className="nav-item">
            <span className="nav-icon">⚙</span>
            Settings
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="upgrade-card">

            <div className="upgrade-orb">
              ✦
            </div>

            <h3>Predict smarter</h3>

            <p>
              AI-powered insights for every batch.
            </p>

            <button>
              Explore Insights →
            </button>

          </div>

          <div className="user-card">

            <div className="avatar">
              FS
            </div>

            <div className="user-info">
              <strong>FreshSense Admin</strong>
              <span>Monitoring System</span>
            </div>

            <span className="more">•••</span>

          </div>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="main-content">

        {/* TOP BAR */}

        <header className="topbar">

          <div className="search-box">
            <span>⌕</span>
            <input
              placeholder="Search batches, products, locations..."
            />
            <kbd>⌘ K</kbd>
          </div>

          <div className="top-actions">

            <button className="top-icon">
              ⌁
            </button>

            <button
              className="notification"
              onClick={() => navigate("/alerts")}
            >
              ♢
              <span>3</span>
            </button>

            <div className="profile">
              <div className="profile-avatar">
                FS
              </div>

              <div>
                <strong>FreshSense</strong>
                <span>Admin</span>
              </div>

              <span>⌄</span>
            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}

        <div className="dashboard-content">

          {/* WELCOME */}

          <section className="welcome-section">

            <div>
              <div className="eyebrow">
                <span className="status-pulse" />
                SYSTEM OPERATIONAL
              </div>

              <h2>
                Good afternoon,
                <span> FreshSense.</span>
              </h2>

              <p>
                Here's what's happening across your cold-chain network today.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() => navigate("/batches")}
            >
              <span>＋</span>
              Monitor New Batch
            </button>

          </section>

          {/* ================= KPI CARDS ================= */}

          <section className="stats-grid">

            <div className="stat-card blue">

              <div className="stat-top">
                <div className="stat-icon">◈</div>
                <MiniSparkline type="blue" />
              </div>

              <div className="stat-label">
                TOTAL BATCHES
              </div>

              <div className="stat-value">
                {stats.total || 24}
              </div>

              <div className="stat-bottom">
                <span className="trend positive">
                  ↗ 12.5%
                </span>
                <span>this month</span>
              </div>

            </div>

            <div className="stat-card green">

              <div className="stat-top">
                <div className="stat-icon">✓</div>
                <MiniSparkline type="green" />
              </div>

              <div className="stat-label">
                SAFE BATCHES
              </div>

              <div className="stat-value">
                {stats.safe || 14}
              </div>

              <div className="stat-bottom">
                <span className="trend positive">
                  ↗ 8.2%
                </span>
                <span>stable conditions</span>
              </div>

            </div>

            <div className="stat-card orange">

              <div className="stat-top">
                <div className="stat-icon">△</div>
                <MiniSparkline type="orange" />
              </div>

              <div className="stat-label">
                AT RISK
              </div>

              <div className="stat-value">
                {stats.medium || 7}
              </div>

              <div className="stat-bottom">
                <span className="trend warning">
                  ↗ 4.1%
                </span>
                <span>needs attention</span>
              </div>

            </div>

            <div className="stat-card red">

              <div className="stat-top">
                <div className="stat-icon">!</div>
                <MiniSparkline type="red" />
              </div>

              <div className="stat-label">
                CRITICAL RISK
              </div>

              <div className="stat-value">
                {stats.critical || 3}
              </div>

              <div className="stat-bottom">
                <span className="trend negative">
                  ↗ 2.4%
                </span>
                <span>action required</span>
              </div>

            </div>

          </section>

          {/* ================= ANALYTICS ROW ================= */}

          <section className="analytics-grid">

            {/* TEMPERATURE CHART */}

            <div className="panel temperature-panel">

              <div className="panel-header">

                <div>
                  <div className="panel-kicker">
                    REAL-TIME MONITORING
                  </div>

                  <h3>
                    Temperature Overview
                  </h3>

                  <p>
                    Cold-chain temperature movement
                  </p>
                </div>

                <div className="panel-actions">

                  <button className="period active">
                    24H
                  </button>

                  <button className="period">
                    7D
                  </button>

                  <button className="expand">
                    ⤢
                  </button>

                </div>

              </div>

              <div className="temperature-summary">

                <strong>
                  {Number(b002.temperature || 8.4).toFixed(1)}°C
                </strong>

                <span className="warning-text">
                  ↗ Current temperature
                </span>

              </div>

              <div className="chart-wrapper">

                <div className="chart-y-axis">
                  <span>10°C</span>
                  <span>7.5°C</span>
                  <span>5°C</span>
                  <span>2.5°C</span>
                  <span>0°C</span>
                </div>

                <TemperatureChart batch={b002} />

              </div>

              <div className="chart-x-axis">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>NOW</span>
              </div>

              <div className="chart-footer">

                <div>
                  <span className="legend-dot cyan" />
                  Temperature
                </div>

                <div>
                  <span className="legend-dot red" />
                  Alert threshold
                </div>

                <span className="last-update">
                  ● Updated just now
                </span>

              </div>

            </div>

            {/* RISK INDEX */}

            <div className="panel risk-panel">

              <div className="panel-header">

                <div>
                  <div className="panel-kicker">
                    AI PREDICTION
                  </div>

                  <h3>
                    Spoilage Risk Index
                  </h3>

                  <p>
                    Current highest-risk batch
                  </p>
                </div>

                <span className="live-badge">
                  LIVE
                </span>

              </div>

              <div className="risk-center">

                <RiskGauge
                  value={b002.riskScore || 78}
                />

                <div className="risk-status">
                  <span className="risk-status-dot" />
                  {b002.riskLevel || "HIGH"} RISK
                </div>

                <strong>
                  Batch {b002.batchId || "B002"}
                </strong>

                <span>
                  {getProductIcon(b002.product)}{" "}
                  {b002.product || "Strawberry"}
                </span>

              </div>

              <div className="risk-metrics">

                <div>
                  <span>Temperature</span>
                  <strong>
                    {b002.temperature || 8.4}°C
                  </strong>
                </div>

                <div>
                  <span>Humidity</span>
                  <strong>
                    {b002.humidity || 91}%
                  </strong>
                </div>

                <div>
                  <span>Transit</span>
                  <strong>
                    {b002.transitTime || 18}h
                  </strong>
                </div>

              </div>

              <button
                className="risk-action"
                onClick={() =>
                  navigate(`/batches/${b002.batchId || "B002"}`)
                }
              >
                View Risk Analysis
                <span>→</span>
              </button>

            </div>

          </section>

          {/* ================= BOTTOM GRID ================= */}

          <section className="bottom-grid">

            {/* ALERTS */}

            <div className="panel alerts-panel">

              <div className="panel-header">

                <div>
                  <div className="panel-kicker">
                    ATTENTION REQUIRED
                  </div>

                  <h3>
                    Live Alerts
                  </h3>
                </div>

                <button
                  className="view-all"
                  onClick={() => navigate("/alerts")}
                >
                  View all →
                </button>

              </div>

              <div className="alerts-list">

                {alerts.map((alert) => (

                  <div
                    className={`alert-row ${alert.type}`}
                    key={alert.id}
                  >

                    <div className="alert-icon">
                      {alert.icon}
                    </div>

                    <div className="alert-info">

                      <strong>
                        {alert.title}
                      </strong>

                      <span>
                        Batch {alert.batch} · {alert.text}
                      </span>

                    </div>

                    <div className="alert-risk">
                      <strong>
                        {alert.risk}%
                      </strong>

                      <span>
                        risk
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/batches/${alert.batch}`)
                      }
                    >
                      →
                    </button>

                  </div>

                ))}

              </div>

            </div>

            {/* COLD CHAIN JOURNEY */}

            <div className="panel journey-panel">

              <div className="panel-header">

                <div>
                  <div className="panel-kicker">
                    SUPPLY CHAIN
                  </div>

                  <h3>
                    Cold-Chain Journey
                  </h3>
                </div>

                <span className="live-badge">
                  LIVE
                </span>

              </div>

              <div className="journey">

                <div className="journey-line">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="journey-step completed">
                  <div>🌾</div>
                  <strong>Farm</strong>
                  <span>Origin</span>
                </div>

                <div className="journey-step completed">
                  <div>❄</div>
                  <strong>Storage</strong>
                  <span>Controlled</span>
                </div>

                <div className="journey-step current">
                  <div>🚚</div>
                  <strong>Transport</strong>
                  <span>Monitoring</span>
                </div>

                <div className="journey-step">
                  <div>🏪</div>
                  <strong>Market</strong>
                  <span>Destination</span>
                </div>

              </div>

              <div className="journey-info">

                <div>
                  <span>ACTIVE BATCH</span>
                  <strong>
                    B002 · Strawberry
                  </strong>
                </div>

                <div>
                  <span>LOCATION</span>
                  <strong>
                    Chandigarh
                  </strong>
                </div>

                <div>
                  <span>STATUS</span>
                  <strong className="danger-text">
                    Attention Required
                  </strong>
                </div>

              </div>

            </div>

          </section>

          {/* ================= BATCH TABLE ================= */}

          <section className="panel batches-panel">

            <div className="panel-header">

              <div>
                <div className="panel-kicker">
                  INVENTORY MONITORING
                </div>

                <h3>
                  Active Batches
                </h3>
              </div>

              <button
                className="view-all"
                onClick={() => navigate("/batches")}
              >
                Manage batches →
              </button>

            </div>

            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>BATCH</th>
                    <th>PRODUCT</th>
                    <th>LOCATION</th>
                    <th>TEMPERATURE</th>
                    <th>HUMIDITY</th>
                    <th>RISK</th>
                    <th>STATUS</th>
                  </tr>
                </thead>

                <tbody>

                  {batches.slice(0, 5).map((batch) => (

                    <tr
                      key={batch.batchId}
                      onClick={() =>
                        navigate(`/batches/${batch.batchId}`)
                      }
                    >

                      <td>
                        <strong className="batch-id">
                          {batch.batchId}
                        </strong>
                      </td>

                      <td>
                        <span className="product-name">
                          {getProductIcon(batch.product)}
                          {batch.product}
                        </span>
                      </td>

                      <td>
                        {batch.location || "—"}
                      </td>

                      <td>
                        <strong>
                          {batch.temperature}°C
                        </strong>
                      </td>

                      <td>
                        {batch.humidity}%
                      </td>

                      <td>
                        <div className="risk-number">
                          <strong>
                            {batch.riskScore}%
                          </strong>

                          <div className="risk-bar">
                            <span
                              className={getStatusClass(
                                batch.riskLevel
                              )}
                              style={{
                                width: `${batch.riskScore}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`status-pill ${getStatusClass(
                            batch.riskLevel
                          )}`}
                        >
                          <span />
                          {batch.riskLevel}
                        </span>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </section>

          <footer className="dashboard-footer">
            <span>FreshSense AI Monitoring System</span>
            <span>Monitor · Predict · Save</span>
            <span>v1.0 Demo</span>
          </footer>

        </div>

      </main>

    </div>
  );
}
