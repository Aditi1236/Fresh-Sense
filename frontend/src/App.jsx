import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import BatchDetails from './pages/BatchDetails'
import Alerts from './pages/Alerts'
import Simulation from './pages/Simulation'

function Layout() {
  const location = useLocation()
  const hideNav = location.pathname === '/'
  return (
    <div className="min-h-screen bg-slate-950">
      {!hideNav && <Navbar />}
      <main className={hideNav ? '' : 'pt-16'}>
        <Routes>
          <Route path="/"              element={<Login />} />
          <Route path="/dashboard"     element={<Dashboard />} />
          <Route path="/batch/:batchId" element={<BatchDetails />} />
          <Route path="/alerts"        element={<Alerts />} />
          <Route path="/simulation"    element={<Simulation />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
