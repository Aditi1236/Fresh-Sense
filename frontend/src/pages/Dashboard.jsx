import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBatches } from '../services/api'
import StatCard from '../components/StatCard'
import RiskBadge from '../components/RiskBadge'
import TempLineChart from '../charts/TempLineChart'
import RiskDistributionChart from '../charts/RiskDistributionChart'

function getRiskColor(score) {
  if (score <= 30) return 'text-green-400'
  if (score <= 60) return 'text-yellow-400'
  return 'text-red-400'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getBatches()
      .then((res) => setBatches(res.data))
      .catch(() => setError('Unable to load batches. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  const total    = batches.length
  const safe     = batches.filter((b) => b.riskLevel === 'SAFE').length
  const atRisk   = batches.filter((b) => b.riskLevel === 'MEDIUM' || b.riskLevel === 'HIGH').length
  const critical = batches.filter((b) => b.riskLevel === 'CRITICAL').length

  // B002 temp history for chart
  const b002 = batches.find((b) => b.batchId === 'B002')
  const tempHistory = b002?.tempHistory || []

  const sorted = [...batches].sort((a, b) => b.riskScore - a.riskScore)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">🌿</div>
          <p className="text-slate-400">Loading cold-chain data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-6 text-center max-w-md">
          <div className="text-3xl mb-3">⚠️</div>
          <p className="text-red-400 font-medium">{error}</p>
          <p className="text-slate-500 text-sm mt-2">Make sure MongoDB is running and backend is on port 5000</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-700/40 hover:bg-red-700/60 text-red-300 rounded-lg text-sm transition">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            FreshSense – Smart Cold-Chain Monitoring
          </h1>
          <p className="text-slate-400 mt-1">
            Real-time spoilage risk monitoring across your cold chain
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Live
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Batches" value={total} icon="📦"
          colorClass={{ border: 'border-blue-700/30', bg: 'bg-blue-500/10', text: 'text-blue-400' }}
          subtitle="Active shipments" />
        <StatCard title="Safe" value={safe} icon="✅"
          colorClass={{ border: 'border-green-700/30', bg: 'bg-green-500/10', text: 'text-green-400' }}
          subtitle="Risk score 0–30%" />
        <StatCard title="At Risk" value={atRisk} icon="⚠️"
          colorClass={{ border: 'border-yellow-700/30', bg: 'bg-yellow-500/10', text: 'text-yellow-400' }}
          subtitle="Risk score 31–60%" />
        <StatCard title="Critical" value={critical} icon="🚨"
          colorClass={{ border: 'border-red-700/30', bg: 'bg-red-500/10', text: 'text-red-400' }}
          subtitle="Risk score 61–100%" />
      </div>

      {/* Status Table */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl mb-8 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">📋 Batch Status Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">Click a row to view full batch details</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3 text-left">Batch ID</th>
                <th className="px-6 py-3 text-left">Product</th>
                <th className="px-6 py-3 text-left">Temp (°C)</th>
                <th className="px-6 py-3 text-left">Humidity (%)</th>
                <th className="px-6 py-3 text-left">Transit (h)</th>
                <th className="px-6 py-3 text-left">Risk Score</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {sorted.map((batch) => (
                <tr
                  key={batch.batchId}
                  onClick={() => navigate(`/batch/${batch.batchId}`)}
                  className="hover:bg-slate-700/30 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono font-semibold text-white group-hover:text-green-400 transition-colors">
                      {batch.batchId}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{batch.product}</td>
                  <td className="px-6 py-4 text-slate-300">{batch.temperature}°C</td>
                  <td className="px-6 py-4 text-slate-300">{batch.humidity}%</td>
                  <td className="px-6 py-4 text-slate-300">{batch.transitTime}h</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${getRiskColor(batch.riskScore)}`}>
                      {batch.riskScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <RiskBadge level={batch.riskLevel} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TempLineChart data={tempHistory} />
        <RiskDistributionChart batches={batches} />
      </div>
    </div>
  )
}
