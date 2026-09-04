# FreshSense – Smart Cold-Chain Monitoring

> **"FreshSense predicts rising spoilage risk and tells you which batch needs action now."**

A web prototype that predicts perishable-food spoilage risk (0–100%) from temperature, humidity, product type, and transit time — powered by simulated IoT sensor data and an AI risk engine.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Live batch overview with stat cards, status table, temperature graph |
| 🔬 **Simulation** | Watch risk climb from 18% → 84% in real time (START SIMULATION) |
| 🚨 **Smart Alerts** | Triggered when risk > 60% — batch-level, actionable |
| 🚀 **Save the Batch** | One-click PRIORITIZE DELIVERY marks batch 🔴 URGENT |
| 📍 **Journey Timeline** | Farm → Cold Storage → Truck → Market with live stage |
| 🤖 **AI Risk Engine** | Rule-based fallback + optional Python/scikit-learn ML service |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (running locally on port 27017)
- Python 3.9+ (optional, for ML service)

### 1. Backend
```bash
cd backend
npm install
node seed.js          # Seed demo data (requires MongoDB)
npm run dev           # API server on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev           # Vite dev server on http://localhost:5173
```

### 3. ML Service (Optional — P2)
```bash
cd ml
pip install -r requirements.txt
python train.py       # Train model → saves model.pkl
python model.py       # Flask API on http://localhost:8000
```

> **Without ML service:** The backend automatically falls back to the rule-based `riskEngine.js`. The app is fully functional.

---

## 🎬 Judge Demo Path (2–3 min)

1. Open `http://localhost:5173` → Sign In (any credentials)
2. **Dashboard** — see Batch B002 Strawberry at 18% (SAFE)
3. Click B002 row → **Batch Details** — view risk breakdown, journey timeline
4. Navigate to **Simulation** → click **▶ START SIMULATION**
5. Watch risk escalate: `18% → 35% → 52% → 67% → 84%`
6. 🚨 Alert fires: **HIGH SPOILAGE RISK DETECTED**
7. Click **🚀 PRIORITIZE DELIVERY** → batch marked **🔴 URGENT**
8. Close: *"FreshSense predicts rising spoilage risk and tells you which batch needs action now."*

---

## 🗂 Project Structure

```
Fresh Sesnse/
├── frontend/
│   └── src/
│       ├── components/    Navbar, StatCard, RiskBadge, JourneyTimeline
│       ├── pages/         Login, Dashboard, BatchDetails, Alerts, Simulation
│       ├── charts/        TempLineChart, RiskDistributionChart
│       ├── services/      api.js
│       └── App.jsx
├── backend/
│   ├── controllers/       batchController, alertController, predictController, simulateController
│   ├── models/            Batch.js, Alert.js
│   ├── routes/            batches, alerts, predict, simulate
│   ├── services/          riskEngine.js, mlClient.js
│   ├── seed.js
│   └── server.js
├── ml/
│   ├── train.py           Synthetic data + RandomForest training
│   ├── model.py           Flask REST service
│   └── requirements.txt
└── README.md
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/batches` | All batches |
| POST | `/api/batches` | Create batch |
| GET | `/api/batches/:id` | Single batch |
| PUT | `/api/batches/:id` | Update batch |
| GET | `/api/alerts` | All alerts |
| POST | `/api/predict` | Risk prediction (ML or rule engine) |
| POST | `/api/simulate` | Advance simulation step |

---

## 🌡️ ML Risk Model

**Inputs:** `product`, `temperature`, `humidity`, `transitTime`, `tempDeviation`  
**Output:** `riskScore` (0–100), `riskLevel` (SAFE / MEDIUM / HIGH / CRITICAL)

Trained on synthetic data for 5 product types: Strawberry, Milk, Spinach, Mango, Fish.

> Note: Risk scores are *estimates* based on sensor readings. Actual spoilage may vary.

---

## 🔮 Future: IoT Integration

```
ESP32 + DHT22 + GPS
    → POST /api/batches    (live sensor push)
    → MongoDB              (storage)
    → ML Service           (prediction)
    → Dashboard            (real-time display)
```

Simulated sensor data stands in until hardware is connected.

---

## 🛠 Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + Recharts
- **Backend:** Node.js + Express + MongoDB (Mongoose)
- **ML Service:** Python + Flask + scikit-learn (RandomForestRegressor)
