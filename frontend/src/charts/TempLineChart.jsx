import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Dot,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm shadow-xl">
        <p className="text-slate-400">{label}</p>
        <p className="text-green-400 font-semibold">{payload[0].value}°C</p>
      </div>
    )
  }
  return null
}

export default function TempLineChart({ data = [] }) {
  const hasHighTemp = data.some((d) => d.temp > 8)
  const lineColor = hasHighTemp ? '#ef4444' : '#16a34a'

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          🌡️ Temperature History (°C)
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full ${hasHighTemp ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {hasHighTemp ? '⚠ Elevated' : '✓ Normal'}
        </span>
      </div>
      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
          No temperature data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={8} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Safe Limit', fill: '#ef4444', fontSize: 10, position: 'right' }} />
            <Line
              type="monotone"
              dataKey="temp"
              stroke={lineColor}
              strokeWidth={2.5}
              dot={{ r: 4, fill: lineColor, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
