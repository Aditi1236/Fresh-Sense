import { useState } from "react";

function Login({ onLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");


  const handleSubmit = (e) => {

    e.preventDefault();


    if (!email.trim() || !password.trim()) {

      setError("Please enter your email and password.");

      return;

    }


    setError("");

    // App.jsx login function
    onLogin();

  };


  return (

    <div className="login-page">


      {/* ============================================
          LEFT BRAND AREA
      ============================================ */}

      <section className="login-brand">

        <div className="brand-glow glow-one"></div>
        <div className="brand-glow glow-two"></div>


        <div className="brand-content">

          <div className="brand-logo">

            <div className="logo-icon">
              F
            </div>

            <span>
              Fresh<span>Sense</span>
            </span>

          </div>


          <div className="brand-tag">
            AI-POWERED COLD-CHAIN INTELLIGENCE
          </div>


          <h1>
            Monitor.
            <br />
            Predict.
            <br />
            <span>Save.</span>
          </h1>


          <p className="brand-description">

            Intelligent monitoring for temperature-sensitive
            food supply chains. Detect risk early and act
            before valuable produce is lost.

          </p>


          <div className="login-features">


            <div className="login-feature">

              <div className="feature-icon">
                ◉
              </div>

              <div>
                <strong>Real-time Monitoring</strong>

                <p>
                  Temperature & humidity tracking
                </p>
              </div>

            </div>


            <div className="login-feature">

              <div className="feature-icon">
                ✦
              </div>

              <div>
                <strong>AI Risk Prediction</strong>

                <p>
                  Identify spoilage before it happens
                </p>
              </div>

            </div>


            <div className="login-feature">

              <div className="feature-icon">
                ⌁
              </div>

              <div>
                <strong>Actionable Alerts</strong>

                <p>
                  Take action before losses occur
                </p>
              </div>

            </div>


          </div>

        </div>


        <div className="login-footer">

          <span>
            FRESHSENSE AI
          </span>

          <span>
            HACKATHON PROTOTYPE
          </span>

        </div>

      </section>



      {/* ============================================
          LOGIN FORM
      ============================================ */}

      <section className="login-panel">

        <div className="login-card">


          <div className="secure-badge">
            <span>●</span>
            SECURE DEMO ENVIRONMENT
          </div>


          <h2>
            Sign in to FreshSense
          </h2>


          <p className="login-subtitle">

            Access your intelligent cold-chain
            monitoring workspace.

          </p>


          <form onSubmit={handleSubmit}>


            {/* EMAIL */}

            <div className="form-group">

              <label>
                Email
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ✉
                </span>

                <input
                  type="email"
                  placeholder="you@freshsense.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <div className="password-label">

                <label>
                  Password
                </label>

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>


              <div className="input-wrapper">

                <span className="input-icon">
                  ▣
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

              </div>

            </div>


            {/* OPTIONS */}

            <div className="login-options">

              <label className="remember">

                <input type="checkbox" />

                <span>
                  Remember me
                </span>

              </label>


              <span className="demo-text">
                Demo environment
              </span>

            </div>


            {/* ERROR */}

            {error && (

              <div className="login-error">
                {error}
              </div>

            )}


            {/* BUTTON */}

            <button
              type="submit"
              className="login-button"
            >

              <span>
                Enter Monitoring Dashboard
              </span>

              <span className="arrow">
                →
              </span>

            </button>


          </form>


          <div className="login-divider">
            <span>
              FRESHSENSE DEMO
            </span>
          </div>


          <div className="login-note">

            <div className="note-icon">
              i
            </div>

            <div>

              <strong>
                Hackathon Prototype
              </strong>

              <p>
                Use any email and password to enter
                the demonstration environment.
              </p>

            </div>

          </div>


        </div>

      </section>

    </div>

  );

}

export default Login;