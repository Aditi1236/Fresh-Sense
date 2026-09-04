import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const links = [
  { to: '/dashboard',  label: 'Dashboard',   icon: '📊' },
  { to: '/alerts',     label: 'Alerts',       icon: '🚨' },
  { to: '/simulation', label: 'Simulation',   icon: '🔬' },
]

export default function Navbar() {
  const navigate = useNavigate()
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-700/60 h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl">🌿</span>
          <span className="text-gradient font-extrabold tracking-tight">FreshSense</span>
        </button>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Live Monitoring
        </div>
      </div>
    </nav>
  )
}
