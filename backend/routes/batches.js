import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const batches = [
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

const icon = {
  Apple: "🍎",
  Strawberry: "🍓",
  Milk: "🥛",
  Tomato: "🍅",
  Mango: "🥭",
};

export default function Batches() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filtered = useMemo(() => {
    return batches.filter((b) => {
      const matchesSearch =
        b.batchId.toLowerCase().includes(search.toLowerCase()) ||
        b.product.toLowerCase().includes(search.toLowerCase()) ||
        b.location.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "ALL" || b.riskLevel === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <div className="freshsense-app">

      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">🌿</div>
          <div>
            <h1>Fresh<span>Sense</span></h1>
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

          <button className="nav-item active">
            <span className="nav-icon">◈</span>
            Batches
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/alerts")}
          >
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
            <input
              placeholder="Search batches, products, locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="top-actions">
            <button
              className="notification"
              onClick={() => navigate("/alerts")}
            >
              ♢ <span>3</span>
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
                INVENTORY MONITORING
              </div>

              <h2>
                Cold-Chain <span>Batches.</span>
              </h2>

              <p>
                Monitor every batch and identify spoilage risk in real time.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() => navigate("/dashboard")}
            >
              ← Dashboard
            </button>
          </section>

          {/* SUMMARY */}

          <section className="stats-grid">

            <div className="stat-card blue">
              <div className="stat-label">TOTAL BATCHES</div>
              <div className="stat-value">05</div>
              <div className="stat-bottom">
                <span>All monitored batches</span>
              </div>
            </div>

            <div className="stat-card green">
              <div className="stat-label">SAFE</div>
              <div className="stat-value">02</div>
              <div className="stat-bottom">
                <span>Stable conditions</span>
              </div>
            </div>

            <div className="stat-card orange">
              <div className="stat-label">MEDIUM RISK</div>
              <div className="stat-value">01</div>
              <div className="stat-bottom">
                <span>Needs attention</span>
              </div>
            </div>

            <div className="stat-card red">
              <div className="stat-label">HIGH RISK</div>
              <div className="stat-value">02</div>
              <div className="stat-bottom">
                <span>Action required</span>
              </div>
            </div>

          </section>

          {/* FILTER */}

          <section className="panel batches-panel">

            <div className="panel-header">

              <div>
                <div className="panel-kicker">
                  BATCH MANAGEMENT
                </div>

                <h3>All Active Batches</h3>

                <p>
                  {filtered.length} batches currently being monitored
                </p>
              </div>

              <div className="panel-actions">

                {["ALL", "SAFE", "MEDIUM", "HIGH"].map((item) => (
                  <button
                    key={item}
                    className={`period ${
                      filter === item ? "active" : ""
                    }`}
                    onClick={() => setFilter(item)}
                  >
                    {item}
                  </button>
                ))}

              </div>

            </div>

            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>BATCH</th>
                    <th>PRODUCT</th>
                    <th>LOCATION</th>
                    <th>TEMP</th>
                    <th>HUMIDITY</th>
                    <th>TRANSIT</th>
                    <th>RISK</th>
                    <th>STATUS</th>
                  </tr>
                </thead>

                <tbody>

                  {filtered.map((batch) => (

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
                          {icon[batch.product]}
                          {batch.product}
                        </span>
                      </td>

                      <td>{batch.location}</td>

                      <td>
                        <strong>{batch.temperature}°C</strong>
                      </td>

                      <td>{batch.humidity}%</td>

                      <td>{batch.transitTime}h</td>

                      <td>
                        <div className="risk-number">
                          <strong>{batch.riskScore}%</strong>

                          <div className="risk-bar">
                            <span
                              className={
                                batch.riskLevel === "SAFE"
                                  ? "safe"
                                  : batch.riskLevel === "MEDIUM"
                                  ? "medium"
                                  : "high"
                              }
                              style={{
                                width: `${batch.riskScore}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`status-pill ${
                            batch.riskLevel === "SAFE"
                              ? "safe"
                              : batch.riskLevel === "MEDIUM"
                              ? "medium"
                              : "high"
                          }`}
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

        </div>

      </main>
    </div>
  );
}
