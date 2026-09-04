import React from 'react'

export default function StatCard({ title, value, icon, colorClass, subtitle }) {
  return (
    <div className={`bg-slate-800/60 border rounded-xl p-5 flex items-start gap-4 hover:bg-slate-800/90 transition-all ${colorClass?.border || 'border-slate-700/50'}`}>
      <div className={`text-3xl p-3 rounded-xl ${colorClass?.bg || 'bg-slate-700/50'}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <p className={`text-3xl font-bold mt-0.5 ${colorClass?.text || 'text-white'}`}>{value}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  )
}
