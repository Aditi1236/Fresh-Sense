import React from "react";
import { useNavigate } from "react-router-dom";

const alerts = [
  {
    id: 1,
    type: "critical",
    icon: "🚨",
    title: "High Spoilage Risk",
    batch: "B002",
    product: "Strawberry",
    location: "Chandigarh",
    risk: 78,
    message:
      "Temperature has exceeded the recommended monitoring range.",
    action: "Prioritize delivery immediately.",
  },
  {
    id: 2,
    type: "critical",
    icon: "🔥",
    title: "Critical Temperature",
    batch: "B005",
    product: "Mango",
    location: "Delhi",
    risk: 68,
    message:
      "Temperature and humidity conditions are increasing spoilage risk.",
    action: "Inspect transport conditions.",
  },
  {
    id: 3,
    type: "warning",
    icon: "⚠️",
    title: "Elevated Risk Detected",
    batch: "B004",
    product: "Tomato",
    location: "Amritsar",
    risk: 56,
    message:
      "Environmental conditions are above the preferred range.",
    action: "Continue close monitoring.",
  },
];

export default function Alerts() {
  const navigate = useNavigate();

  return (
    <div className="freshsense-app">

      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

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

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="sidebar-nav">

          <button
            className="nav-item"
            onClick={() => navigate("/dashboard")}
          >
            <span className="nav-icon">▦</span>
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/batches")}
          >
            <span className="nav-icon">◈</span>
            Batches
          </button>

          <button className="nav-item active">
            <span className="nav-icon">♢</span>
            Alerts
            <span className="nav-count">3</span>
          </button>

          <button className="nav-item">
            <span className="nav-icon">⌁</span>
            Analytics
          </button>

        </nav>

        <div className="sidebar-label">SYSTEM</div>

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
            <div className="upgrade-orb">✦</div>
            <h3>Predict smarter</h3>
            <p>AI-powered insights for every batch.</p>
            <button>Explore Insights →</button>
          </div>

          <div className="user-card">
            <div className="avatar">FS</div>

            <div className="user-info">
              <strong>FreshSense Admin</strong>
              <span>Monitoring System</span>
            </div>
          </div>

        </div>

      </aside>

      <main className="main-content">

        <header className="topbar">

          <div className="search-box">
            <span>⌕</span>
            <input placeholder="Search alerts, batches..." />
          </div>

          <div className="top-actions">

            <button
              className="notification"
              onClick={() => navigate("/alerts")}
            >
              ♢
              <span>3</span>
            </button>

            <div className="profile">
              <div className="profile-avatar">FS</div>

              <div>
                <strong>FreshSense</strong>
                <span>Admin</span>
              </div>
            </div>

          </div>

        </header>

        <div className="dashboard-content">

          <section className="welcome-section">

            <div>

              <div className="eyebrow">
                <span className="status-pulse" />
                LIVE ALERT CENTER
              </div>

              <h2>
                System <span>Alerts.</span>
              </h2>

              <p>
                Real-time warnings generated from cold-chain conditions.
              </p>

            </div>

            <button
              className="primary-button"
              onClick={() => navigate("/dashboard")}
            >
              ← Dashboard
            </button>

          </section>

          {/* ALERT SUMMARY */}

          <section className="stats-grid">

            <div className="stat-card red">
              <div className="stat-label">CRITICAL</div>
              <div className="stat-value">02</div>
              <div className="stat-bottom">
                <span>Immediate action</span>
              </div>
            </div>

            <div className="stat-card orange">
              <div className="stat-label">WARNING</div>
              <div className="stat-value">01</div>
              <div className="stat-bottom">
                <span>Needs attention</span>
              </div>
            </div>

            <div className="stat-card blue">
              <div className="stat-label">TOTAL ALERTS</div>
              <div className="stat-value">03</div>
              <div className="stat-bottom">
                <span>Active alerts</span>
              </div>
            </div>

            <div className="stat-card green">
              <div className="stat-label">SYSTEM</div>
              <div className="stat-value">LIVE</div>
              <div className="stat-bottom">
                <span>Monitoring active</span>
              </div>
            </div>

          </section>

          {/* ALERT LIST */}

          <section className="panel alerts-panel">

            <div className="panel-header">

              <div>
                <div className="panel-kicker">
                  ATTENTION REQUIRED
                </div>

                <h3>Active Alerts</h3>

                <p>
                  AI-generated risk notifications
                </p>
              </div>

              <span className="live-badge">
                ● LIVE
              </span>

            </div>

            <div className="alerts-list">

              {alerts.map((alert) => (

                <div
                  key={alert.id}
                  className={`alert-row ${alert.type}`}
                >

                  <div className="alert-icon">
                    {alert.icon}
                  </div>

                  <div className="alert-info">

                    <strong>
                      {alert.title}
                    </strong>

                    <span>
                      Batch {alert.batch} · {alert.product}
                    </span>

                    <span>
                      {alert.message}
                    </span>

                    <small>
                      📍 {alert.location} · Recommended: {alert.action}
                    </small>

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

          </section>

          {/* SMART ACTION */}

          <section className="panel">

            <div className="panel-header">

              <div>
                <div className="panel-kicker">
                  AI RECOMMENDATION
                </div>

                <h3>Recommended Action</h3>

                <p>
                  Protect high-risk inventory before spoilage occurs.
                </p>
              </div>

            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              marginTop: "20px"
            }}>

              <div className="risk-metric-card">
                🚨
                <strong>B002</strong>
                <span>Prioritize delivery</span>
              </div>

              <div className="risk-metric-card">
                🌡️
                <strong>8.4°C</strong>
                <span>Temperature check</span>
              </div>

              <div className="risk-metric-card">
                🤖
                <strong>78%</strong>
                <span>AI risk score</span>
              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}