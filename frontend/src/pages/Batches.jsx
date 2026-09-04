import React, { useEffect, useState } from "react";
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

const icon = {
  Apple: "🍎",
  Strawberry: "🍓",
  Milk: "🥛",
  Tomato: "🍅",
  Mango: "🥭",
};

function riskClass(level) {
  if (level === "SAFE") return "safe";
  if (level === "MEDIUM") return "medium";
  return "high";
}

export default function Batches() {
  const navigate = useNavigate();
  const [batches, setBatches] = useState(demoBatches);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getBatches()
      .then((res) => {
        const data = res?.data;

        const apiData = Array.isArray(data)
          ? data
          : Array.isArray(data?.batches)
          ? data.batches
          : [];

        if (apiData.length) {
          setBatches(apiData);
        }
      })
      .catch(() => {
        // Demo batches remain visible
      });
  }, []);

  const filtered = batches.filter((batch) =>
    `${batch.batchId} ${batch.product} ${batch.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="freshsense-app">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <main className="main-content" style={{ marginLeft: 0 }}>
        <div className="dashboard-content">

          {/* HEADER */}
          <section className="welcome-section">
            <div>
              <div className="eyebrow">
                <span className="status-pulse" />
                INVENTORY MONITORING
              </div>

              <h2>
                Cold-Chain <span>Batches</span>
              </h2>

              <p>
                Monitor temperature, humidity and AI-powered spoilage risk.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() => navigate("/simulation")}
            >
              ＋ Monitor New Batch
            </button>
          </section>

          {/* STATS */}
          <section className="stats-grid">

            <div className="stat-card blue">
              <div className="stat-label">TOTAL BATCHES</div>
              <div className="stat-value">{batches.length}</div>
              <div className="stat-bottom">
                <span>Currently monitored</span>
              </div>
            </div>

            <div className="stat-card green">
              <div className="stat-label">SAFE</div>
              <div className="stat-value">
                {batches.filter(b => b.riskLevel === "SAFE").length}
              </div>
              <div className="stat-bottom">
                <span>Stable conditions</span>
              </div>
            </div>

            <div className="stat-card orange">
              <div className="stat-label">MEDIUM RISK</div>
              <div className="stat-value">
                {batches.filter(b => b.riskLevel === "MEDIUM").length}
              </div>
              <div className="stat-bottom">
                <span>Needs attention</span>
              </div>
            </div>

            <div className="stat-card red">
              <div className="stat-label">HIGH RISK</div>
              <div className="stat-value">
                {batches.filter(
                  b => b.riskLevel === "HIGH" || b.riskLevel === "CRITICAL"
                ).length}
              </div>
              <div className="stat-bottom">
                <span>Action required</span>
              </div>
            </div>

          </section>

          {/* TABLE PANEL */}
          <section className="panel batches-panel">

            <div className="panel-header">
              <div>
                <div className="panel-kicker">
                  LIVE INVENTORY
                </div>

                <h3>All Active Batches</h3>

                <p>
                  Real-time cold-chain monitoring overview
                </p>
              </div>

              <div className="search-box">
                🔍
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search batches..."
                />
              </div>
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
                    <th>TRANSIT</th>
                    <th>AI RISK</th>
                    <th>STATUS</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>

                  {filtered.map((batch) => (

                    <tr
                      key={batch.batchId}
                      onClick={() =>
                        navigate(`/batch/${batch.batchId}`)
                      }
                      style={{ cursor: "pointer" }}
                    >

                      <td>
                        <strong className="batch-id">
                          {batch.batchId}
                        </strong>
                      </td>

                      <td>
                        <span className="product-name">
                          {icon[batch.product] || "📦"}{" "}
                          {batch.product}
                        </span>
                      </td>

                      <td>
                        {batch.location}
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
                        {batch.transitTime}h
                      </td>

                      <td>

                        <div className="risk-number">

                          <strong>
                            {batch.riskScore}%
                          </strong>

                          <div className="risk-bar">
                            <span
                              className={riskClass(batch.riskLevel)}
                              style={{
                                width: `${batch.riskScore}%`,
                              }}
                            />
                          </div>

                        </div>

                      </td>

                      <td>

                        <span
                          className={`status-pill ${riskClass(
                            batch.riskLevel
                          )}`}
                        >
                          <span />
                          {batch.riskLevel}
                        </span>

                      </td>

                      <td>
                        <button
                          className="view-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/batch/${batch.batchId}`);
                          }}
                        >
                          View →
                        </button>
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