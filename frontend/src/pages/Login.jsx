import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="login-page">

      {/* Background ambient glow */}
      <div className="glow glow-green"></div>
      <div className="glow glow-blue"></div>

      <div className="login-container">

        {/* ================= LEFT BRANDING ================= */}
        <div className="login-brand">

          <div className="brand-icon">🌿</div>

          <h1>FreshSense</h1>

          <h2>Smart Cold-Chain Monitoring</h2>

          <p>
            Monitor temperature, analyze conditions and predict
            food spoilage risk before it becomes a loss.
          </p>

          <div className="login-features">

            <div className="login-feature">
              <span className="login-feature-icon">🌡️</span>
              <div>
                <strong>Real-time Monitoring</strong>
                <small>Track cold-chain conditions</small>
              </div>
            </div>

            <div className="login-feature">
              <span className="login-feature-icon">🤖</span>
              <div>
                <strong>AI Risk Prediction</strong>
                <small>Predict potential spoilage risk</small>
              </div>
            </div>

            <div className="login-feature">
              <span className="login-feature-icon">🚨</span>
              <div>
                <strong>Smart Alerts</strong>
                <small>Act before food is lost</small>
              </div>
            </div>

          </div>

          <div className="powered">
            POWERED BY AI-DRIVEN ANALYTICS
          </div>

        </div>

        {/* ================= RIGHT LOGIN ================= */}
        <div className="login-form-section">

          <div className="login-card">

            <div className="login-card-top">
              <span className="status-dot"></span>
              <span>SECURE ACCESS</span>
            </div>

            <h2>Welcome back</h2>

            <p className="login-subtitle">
              Sign in to access your FreshSense dashboard
            </p>

            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div className="input-group">
                <label>Email address</label>

                <div className="input-wrapper">
                  <span>✉</span>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@freshsense.io"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="input-group">
                <label>Password</label>

                <div className="input-wrapper">
                  <span>🔒</span>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="login-button">
                <span>Sign in to Dashboard</span>
                <span className="arrow">→</span>
              </button>

            </form>

            <div className="demo-mode">
              <span>●</span>
              Demo mode — any credentials work
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}
