import { useNavigate } from "react-router-dom";
import { useApp } from "../App";

function Dashboard() {

  const navigate = useNavigate();

  const { batches } = useApp();


  const highRisk = batches.filter(
    (batch) => batch.risk >= 70
  ).length;


  const mediumRisk = batches.filter(
    (batch) =>
      batch.risk >= 40 &&
      batch.risk < 70
  ).length;


  const safeBatches = batches.filter(
    (batch) => batch.risk < 40
  ).length;


  const averageRisk = Math.round(
    batches.reduce(
      (sum, batch) => sum + batch.risk,
      0
    ) / batches.length
  );


  return (

    <main className="dashboard-page">


      {/* ============================================
          HEADER
      ============================================ */}

      <div className="page-header">

        <div>

          <div className="eyebrow">
            COLD-CHAIN OVERVIEW
          </div>

          <h1>
            Good afternoon, <span>Demo User</span>
          </h1>

          <p>
            Monitor your perishable inventory and
            respond to emerging spoilage risks.
          </p>

        </div>


        <button
          className="primary-button"
          onClick={() => navigate("/simulation")}
        >
          <span>◉</span>
          Run Live Simulation
        </button>

      </div>



      {/* ============================================
          KPI CARDS
      ============================================ */}

      <section className="kpi-grid">


        <div className="kpi-card">

          <div className="kpi-top">

            <span>
              ACTIVE BATCHES
            </span>

            <div className="kpi-icon blue">
              ▤
            </div>

          </div>

          <div className="kpi-value">
            {batches.length}
          </div>

          <div className="kpi-bottom">
            <span className="positive">
              ● Live
            </span>
            <span>
              monitored batches
            </span>
          </div>

        </div>


        <div className="kpi-card">

          <div className="kpi-top">

            <span>
              SAFE BATCHES
            </span>

            <div className="kpi-icon green">
              ✓
            </div>

          </div>

          <div className="kpi-value">
            {safeBatches}
          </div>

          <div className="kpi-bottom">
            <span className="positive">
              Low risk
            </span>
            <span>
              currently
            </span>
          </div>

        </div>


        <div className="kpi-card">

          <div className="kpi-top">

            <span>
              NEEDS ATTENTION
            </span>

            <div className="kpi-icon orange">
              !
            </div>

          </div>

          <div className="kpi-value">
            {mediumRisk}
          </div>

          <div className="kpi-bottom">
            <span className="warning">
              Medium risk
            </span>
            <span>
              batches
            </span>
          </div>

        </div>


        <div className="kpi-card">

          <div className="kpi-top">

            <span>
              HIGH RISK
            </span>

            <div className="kpi-icon red">
              !
            </div>

          </div>

          <div className="kpi-value">
            {highRisk}
          </div>

          <div className="kpi-bottom">
            <span className="danger">
              Immediate action
            </span>
          </div>

        </div>


      </section>



      {/* ============================================
          MAIN GRID
      ============================================ */}

      <section className="dashboard-grid">


        {/* TEMPERATURE PANEL */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>

              <div className="panel-label">
                SENSOR NETWORK
              </div>

              <h2>
                Temperature Monitoring
              </h2>

            </div>

            <div className="live-indicator">
              <span></span>
              LIVE
            </div>

          </div>


          <div className="temperature-summary">

            <div>
              <strong>6.5°C</strong>
              <span>Average</span>
            </div>

            <div>
              <strong>8.7°C</strong>
              <span>Highest</span>
            </div>

            <div>
              <strong>3.8°C</strong>
              <span>Lowest</span>
            </div>

          </div>


          {/* CSS CHART */}

          <div className="fake-chart">

            <div className="chart-y-axis">

              <span>10°</span>
              <span>8°</span>
              <span>6°</span>
              <span>4°</span>
              <span>2°</span>

            </div>


            <div className="chart-area">

              <div className="chart-grid-line"></div>
              <div className="chart-grid-line"></div>
              <div className="chart-grid-line"></div>
              <div className="chart-grid-line"></div>


              <svg
                className="temperature-svg"
                viewBox="0 0 700 220"
                preserveAspectRatio="none"
              >

                <defs>

                  <linearGradient
                    id="chartGradient"
                    x1="0"
                    x2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#7c3aed"
                    />

                    <stop
                      offset="100%"
                      stopColor="#38bdf8"
                    />

                  </linearGradient>

                </defs>


                <path
                  d="
                    M0 150
                    C50 135, 70 145, 110 125
                    S180 95, 220 115
                    S280 155, 320 125
                    S380 80, 420 105
                    S470 135, 510 95
                    S570 70, 610 85
                    S660 65, 700 50
                  "
                  fill="none"
                  stroke="url(#chartGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

              </svg>


              <div className="chart-labels">

                <span>08:00</span>
                <span>10:00</span>
                <span>12:00</span>
                <span>14:00</span>
                <span>16:00</span>

              </div>

            </div>

          </div>

        </div>



        {/* AI RISK PANEL */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>

              <div className="panel-label">
                AI RISK ENGINE
              </div>

              <h2>
                Current Spoilage Risk
              </h2>

            </div>

            <div className="ai-badge">
              AI PREDICTED
            </div>

          </div>


          <div className="risk-content">

            <div
              className="risk-ring"
              style={{
                "--risk": `${averageRisk}%`,
              }}
            >

              <div className="risk-ring-inner">

                <strong>
                  {averageRisk}%
                </strong>

                <span>
                  MODERATE
                </span>

              </div>

            </div>


            <div className="risk-info">

              <div className="batch-name">
                Fleet Average
              </div>

              <div className="risk-status">
                MONITOR CLOSELY
              </div>


              <div className="risk-metrics">

                <div>
                  <span>Temperature</span>
                  <strong>6.5°C</strong>
                </div>

                <div>
                  <span>Humidity</span>
                  <strong>77%</strong>
                </div>

                <div>
                  <span>Transit</span>
                  <strong>22h</strong>
                </div>

              </div>

            </div>

          </div>


          <div className="recommendation">

            <div className="recommendation-icon">
              !
            </div>

            <div>

              <strong>
                AI Recommendation
              </strong>

              <p>
                Review high-risk batches and prioritize
                delivery before risk increases further.
              </p>

            </div>

          </div>


          <button
            className="secondary-button full"
            onClick={() => navigate("/alerts")}
          >
            View Risk Alerts →
          </button>

        </div>

      </section>



      {/* ============================================
          BATCH TABLE
      ============================================ */}

      <section className="dashboard-panel batches-panel">

        <div className="panel-header">

          <div>

            <div className="panel-label">
              LIVE INVENTORY
            </div>

            <h2>
              Batch Risk Monitor
            </h2>

          </div>


          <button
            className="text-button"
            onClick={() => navigate("/batches")}
          >
            View All Batches →
          </button>

        </div>


        <div className="batch-table">


          <div className="table-row table-heading">

            <div>Batch</div>
            <div>Temperature</div>
            <div>Humidity</div>
            <div>Transit</div>
            <div>Risk</div>
            <div>Action</div>

          </div>


          {batches.map((batch) => (

            <div
              className="table-row"
              key={batch.batchId}
            >

              <div className="batch-cell">

                <div className="product-icon">
                  {batch.product === "Apple"
                    ? "🍎"
                    : batch.product === "Strawberry"
                    ? "🍓"
                    : batch.product === "Milk"
                    ? "🥛"
                    : batch.product === "Tomato"
                    ? "🍅"
                    : "🥭"}
                </div>

                <div>

                  <strong>
                    {batch.batchId}
                  </strong>

                  <span>
                    {batch.product}
                  </span>

                </div>

              </div>


              <div>
                {batch.temperature}°C
              </div>


              <div>
                {batch.humidity}%
              </div>


              <div>
                {batch.transitTime}h
              </div>


              <div>

                <span
                  className={
                    batch.risk >= 70
                      ? "risk-pill high"
                      : batch.risk >= 40
                      ? "risk-pill medium"
                      : "risk-pill low"
                  }
                >
                  {batch.risk}%
                </span>

              </div>


              <div>

                <button
                  className="row-action"
                  onClick={() =>
                    navigate(
                      `/batch/${batch.batchId}`
                    )
                  }
                >
                  Inspect →
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>



      {/* ============================================
          JOURNEY
      ============================================ */}

      <section className="journey-section">

        <div className="journey-title">

          <div className="panel-label">
            SUPPLY CHAIN JOURNEY
          </div>

          <h2>
            Cold-Chain Tracking
          </h2>

        </div>


        <div className="journey">


          <div className="journey-node active">

            <div className="journey-icon">
              🏭
            </div>

            <strong>
              Warehouse
            </strong>

            <span>
              Origin
            </span>

          </div>


          <div className="journey-line"></div>


          <div className="journey-node active">

            <div className="journey-icon">
              🚚
            </div>

            <strong>
              In Transit
            </strong>

            <span>
              Live monitoring
            </span>

          </div>


          <div className="journey-line"></div>


          <div className="journey-node">

            <div className="journey-icon">
              🏪
            </div>

            <strong>
              Distribution
            </strong>

            <span>
              Next stage
            </span>

          </div>


          <div className="journey-line"></div>


          <div className="journey-node">

            <div className="journey-icon">
              🛒
            </div>

            <strong>
              Retail
            </strong>

            <span>
              Destination
            </span>

          </div>


        </div>

      </section>


    </main>

  );

}

export default Dashboard;