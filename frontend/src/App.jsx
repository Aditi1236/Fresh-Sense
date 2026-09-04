import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Batches from "./pages/Batches";
import BatchDetails from "./pages/BatchDetails";
import Alerts from "./pages/Alerts";
import Simulation from "./pages/Simulation";
import Analytics from "./pages/Analytics";

function Layout() {
  const location = useLocation();

  // Login page par Navbar hide rahega
  const hideNav = location.pathname === "/";

  return (
    <div className="min-h-screen bg-slate-950">

      {!hideNav && <Navbar />}

      <main className={hideNav ? "" : "pt-16"}>
        <Routes>

          {/* LOGIN */}
          <Route
            path="/"
            element={<Login />}
          />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* ALL BATCHES */}
          <Route
            path="/batches"
            element={<Batches />}
          />

          {/* SINGLE BATCH DETAILS */}
          <Route
            path="/batch/:batchId"
            element={<BatchDetails />}
          />

          {/* ALERTS */}
          <Route
            path="/alerts"
            element={<Alerts />}
          />

          {/* SIMULATION */}
          <Route
            path="/simulation"
            element={<Simulation />}
          />

          {/* ANALYTICS */}
          <Route path="/analytics" 
          element={<Analytics />} 
          />

        </Routes>
      </main>

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
