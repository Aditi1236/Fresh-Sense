import React, { createContext, useContext, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Batches from "./pages/Batches";
import BatchDetails from "./pages/BatchDetails";
import Alerts from "./pages/Alerts";
import Simulation from "./pages/Simulation";
import Analytics from "./pages/Analytics";


// =====================================================
// DEMO DATA
// =====================================================

export const initialBatches = [
  {
    batchId: "B001",
    product: "Apple",
    temperature: 4.2,
    humidity: 72,
    transitTime: 18,
    risk: 18,
    status: "SAFE",
  },
  {
    batchId: "B002",
    product: "Strawberry",
    temperature: 8.7,
    humidity: 86,
    transitTime: 31,
    risk: 78,
    status: "HIGH",
  },
  {
    batchId: "B003",
    product: "Milk",
    temperature: 3.8,
    humidity: 68,
    transitTime: 12,
    risk: 24,
    status: "SAFE",
  },
  {
    batchId: "B004",
    product: "Tomato",
    temperature: 6.5,
    humidity: 79,
    transitTime: 22,
    risk: 56,
    status: "MEDIUM",
  },
  {
    batchId: "B005",
    product: "Mango",
    temperature: 9.1,
    humidity: 82,
    transitTime: 28,
    risk: 68,
    status: "HIGH",
  },
];


// =====================================================
// CONTEXT
// =====================================================

const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}


// =====================================================
// APP CONTENT
// =====================================================

function AppContent() {

  const [loggedIn, setLoggedIn] = useState(false);

  const [batches, setBatches] = useState(initialBatches);


  // ---------------------------------------------------
  // LOGIN
  // ---------------------------------------------------

  const login = () => {
    setLoggedIn(true);
  };


  // ---------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------

  const logout = () => {
    setLoggedIn(false);
  };


  // ---------------------------------------------------
  // UPDATE BATCH
  // ---------------------------------------------------

  const updateBatch = (batchId, updates) => {

    setBatches((current) =>
      current.map((batch) =>
        batch.batchId === batchId
          ? { ...batch, ...updates }
          : batch
      )
    );

  };


  const contextValue = {
    loggedIn,
    batches,
    login,
    logout,
    updateBatch,
  };


  return (

    <AppContext.Provider value={contextValue}>

      <div className="app-root">

        {/* Navbar only after login */}
        {loggedIn && <Navbar />}


        <Routes>

          {/* ============================================
              LOGIN
          ============================================ */}

          <Route
            path="/"
            element={
              loggedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login onLogin={login} />
              )
            }
          />


          {/* ============================================
              DASHBOARD
          ============================================ */}

          <Route
            path="/dashboard"
            element={
              loggedIn ? (
                <Dashboard />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />


          {/* ============================================
              BATCHES
          ============================================ */}

          <Route
            path="/batches"
            element={
              loggedIn ? (
                <Batches />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />


          {/* ============================================
              BATCH DETAILS
          ============================================ */}

          <Route
            path="/batch/:batchId"
            element={
              loggedIn ? (
                <BatchDetails />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />


          {/* ============================================
              ALERTS
          ============================================ */}

          <Route
            path="/alerts"
            element={
              loggedIn ? (
                <Alerts />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />


          {/* ============================================
              SIMULATION
          ============================================ */}

          <Route
            path="/simulation"
            element={
              loggedIn ? (
                <Simulation />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />


          {/* ============================================
              ANALYTICS
          ============================================ */}

          <Route
            path="/analytics"
            element={
              loggedIn ? (
                <Analytics />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />


          {/* ============================================
              FALLBACK
          ============================================ */}

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>

      </div>

    </AppContext.Provider>

  );
}


// =====================================================
// ROOT APP
// =====================================================

export default function App() {

  return (

    <BrowserRouter>

      <AppContent />

    </BrowserRouter>

  );

}