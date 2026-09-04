import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBatch, updateBatch } from '../services/api'
import RiskBadge from '../components/RiskBadge'
import JourneyTimeline from '../components/JourneyTimeline'
import TempLineChart from '../charts/TempLineChart'

const FACTOR_COLORS = {
  LOW:    'bg-green-500/15 text-green-400 border-green-500/30',
  MEDIUM: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  HIGH:   'bg-red-500/15 text-red-400 border-red-500/30',
}

function FactorBadge({ level }) {
  return (
    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${FACTOR_COLORS[level] || FACTOR_COLORS.LOW}`}>
      {level}
    </span>
  )
}

function getStageFromLocation(location = '') {
  const l = location.toLowerCase()
  if (l.includes('farm')) return 0
  if (l.includes('cold storage')) return 1
  if (l.includes('truck') || l.includes('highway') || l.includes('transit')) return 2
  if (l.includes('market') || l.includes('distribution') || l.includes('chandigarh')) return 3
  return 1
}

function computeFactors(batch) {
  const tempDev = Math.abs(batch.temperature - 4) // rough deviation from safe center
  return {
    temperature: tempDev > 4 ? 'HIGH' : tempDev > 2 ? 'MEDIUM' : 'LOW',
    humidity:    batch.humidity > 92 ? 'HIGH' : batch.humidity > 85 ? 'MEDIUM' : 'LOW',
    transit:     batch.transitTime > 20 ? 'HIGH' : batch.transitTime > 12 ? 'MEDIUM' : 'LOW',
  }
}

function buildReason(batch, factors) {
  const parts = []
  if (factors.temperature !== 'LOW') {
    parts.push(`the temperature (${batch.temperature}°C) deviates from the safe range`)
  }
  if (factors.humidity !== 'LOW') {
    parts.push(`humidity (${batch.humidity}%) is outside the optimal level`)
  }
  if (factors.transit !== 'LOW') {
    parts.push(`the transit duration of ${batch.transitTime}h increases cumulative exposure`)
  }
  if (parts.length === 0) {
    return `The estimated risk is ${batch.riskLevel} (${batch.riskScore}%). All parameters are within acceptable ranges, but continued monitoring is advised.`
  }
  return `The estimated risk is ${batch.riskLevel} (${batch.riskScore}%) because ${parts.join(', and ')}. This is an estimate based on current sensor data — actual spoilage may vary.`
}

export default function BatchDetails() {
  const { batchId } = useParams()
  const navigate = useNavigate()
  const [batch, setBatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [prioritized, setPrioritized] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getBatch(batchId)
      .then((res) => {
        setBatch(res.data)
        if (res.data.priority === 'URGENT') setPrioritized(true)
      })
      .catch(() => setBatch(null))
      .finally(() => setLoading(false))
  }, [batchId])

  const handlePrioritize = async () => {
    setSaving(true)
    try {
      const res = await updateBatch(batchId, { priority: 'URGENT' })
      setBatch(res.data)
      setPrioritized(true)
    } catch {
      alert('Failed to update priority. Check backend.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading batch...</div>
  }
  if (!batch) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Batch {batchId} not found.
      </div>
    )
  }

  const factors = computeFactors(batch)
  const reason  = buildReason(batch, factors)
  const stage   = getStageFromLocation(batch.location)
  const eta     = Math.max(0, 36 - batch.transitTime)
  const isHighRisk = batch.riskLevel === 'HIGH' || batch.riskLevel === 'CRITICAL'

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm mb-6"
      >
        ← Back to Dashboard
      </button>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-extrabold text-white">{batch.product}</h1>
            <RiskBadge level={batch.riskLevel} size="lg" />
            {batch.priority === 'URGENT' && (
              <span className="text-sm bg-red-600/20 text-red-400 border border-red-600/30 rounded-full px-3 py-1 font-semibold">
                🔴 URGENT
              </span>
            )}
          </div>
          <p className="text-slate-400">Batch ID: <span className="font-mono text-white">{batch.batchId}</span></p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-4xl font-extrabold" style={{
            color: batch.riskScore > 60 ? '#ef4444' : batch.riskScore > 30 ? '#f59e0b' : '#16a34a'
          }}>
            {batch.riskScore}%
          </p>
          <p className="text-slate-400 text-sm">Estimated Spoilage Risk</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Info Grid */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">📊 Batch Information</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Temperature', value: `${batch.temperature}°C`, icon: '🌡️' },
              { label: 'Humidity',    value: `${batch.humidity}%`,     icon: '💧' },
              { label: 'Transit Time', value: `${batch.transitTime}h`, icon: '⏱️' },
              { label: 'Location',    value: batch.location,           icon: '📍' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="bg-slate-900/50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">{icon} {label}</p>
                <p className="text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Factor Breakdown */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">🔍 Risk Factor Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: 'Temperature Deviation', level: factors.temperature, desc: `Current: ${batch.temperature}°C` },
              { label: 'Humidity Level',         level: factors.humidity,    desc: `Current: ${batch.humidity}%` },
              { label: 'Transit Duration',        level: factors.transit,     desc: `Duration: ${batch.transitTime}h` },
            ].map(({ label, level, desc }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
                <div>
                  <p className="text-sm text-white font-medium">{label}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
                <FactorBadge level={level} />
              </div>
            ))}
          </div>
          {/* Plain-language reason */}
          <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
            <p className="text-xs text-slate-400 leading-relaxed">💡 {reason}</p>
          </div>
        </div>
      </div>

      {/* Save the Batch Panel */}
      {isHighRisk && (
        <div className="bg-red-900/10 border border-red-700/40 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🚨</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-400 mb-1">Save the Batch</h3>
              <p className="text-slate-300 text-sm mb-1">
                Estimated Spoilage Risk: <span className="text-red-400 font-bold">{batch.riskScore}%</span>
              </p>
              <p className="text-slate-400 text-sm mb-4">
                This batch has a <strong>{batch.riskLevel}</strong> estimated risk. Prioritizing delivery can reduce further exposure.
              </p>
              {prioritized ? (
                <div className="flex items-center gap-2 text-green-400 bg-green-900/20 border border-green-700/30 rounded-lg px-4 py-3">
                  <span>✅</span>
                  <span className="font-semibold">Batch added to priority delivery list. Status: 🔴 URGENT</span>
                </div>
              ) : (
                <button
                  onClick={handlePrioritize}
                  disabled={saving}
                  className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg shadow-red-900/30"
                >
                  {saving ? '⏳ Updating...' : '🚀 PRIORITIZE DELIVERY'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Temperature Chart */}
      {batch.tempHistory && batch.tempHistory.length > 0 && (
        <div className="mb-6">
          <TempLineChart data={batch.tempHistory} />
        </div>
      )}

      {/* Journey Timeline */}
      <div className="mb-6">
        <JourneyTimeline currentStage={stage} eta={eta} />
      </div>

      {/* Simulated Route Map */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">🗺️ Simulated Route</h3>
        <div className="flex items-center gap-2 text-sm flex-wrap">
          {[
            { label: '🌾 Ludhiana Farm', dist: '12 km →' },
            { label: '🏭 Cold Storage',  dist: '45 km →' },
            { label: '🚚 NH1 Highway',   dist: '38 km →' },
            { label: '🏪 Market',        dist: null },
          ].map(({ label, dist }, i) => (
            <React.Fragment key={i}>
              <div className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                i === stage
                  ? 'bg-green-600/20 border border-green-600/40 text-green-300'
                  : i < stage
                  ? 'bg-slate-700/30 text-slate-400 border border-slate-700/30'
                  : 'bg-slate-800/30 text-slate-600 border border-slate-800/30'
              }`}>
                {label}
                {i === stage && <span className="ml-2 text-xs bg-green-600 text-white px-1.5 py-0.5 rounded">HERE</span>}
              </div>
              {dist && <span className="text-slate-600 text-xs">{dist}</span>}
            </React.Fragment>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Total route: Ludhiana → Chandigarh &nbsp;|&nbsp; Est. distance: ~95 km &nbsp;|&nbsp; ETA: ~{eta}h
        </p>
      </div>
    </div>
  )
}
