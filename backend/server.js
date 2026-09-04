const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// ROUTES
// ==========================================

app.use("/api/batches", require("./routes/batches"));
app.use("/api/alerts", require("./routes/alerts"));
app.use("/api/predict", require("./routes/predict"));
app.use("/api/simulate", require("./routes/simulate"));

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    message: "FreshSense API is running",
    database: "Demo Mode",
    time: new Date()
  });
});

// ==========================================
// LOGIN
// ANY EMAIL + ANY PASSWORD WORKS
// ==========================================

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  // Email and password must not be empty
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter email and password"
    });
  }

  // Demo login
  return res.status(200).json({
    success: true,
    message: "Login successful",

    user: {
      name: "FreshSense User",
      email: email,
      role: "User"
    },

    token: "freshsense-demo-token"
  });
});

// ==========================================
// LOGOUT
// ==========================================

app.post("/api/auth/logout", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log("");
  console.log("========================================");
  console.log("🌱 FreshSense Backend");
  console.log("========================================");
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`❤️ Health: http://localhost:${PORT}/api/health`);
  console.log("🗄️ Database: Demo Mode");
  console.log("🔐 Login: Any email + password");
  console.log("========================================");
  console.log("");
});

module.exports = app;
