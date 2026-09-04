import React from 'react'

const CONFIG = {
  SAFE:     { emoji: '✅', text: 'SAFE',     cls: 'bg-green-500/15 text-green-400 border-green-500/30'  },
  MEDIUM:   { emoji: '🟡', text: 'MEDIUM',   cls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
  HIGH:     { emoji: '🔴', text: 'HIGH',     cls: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  CRITICAL: { emoji: '🚨', text: 'CRITICAL', cls: 'bg-red-500/15 text-red-400 border-red-500/30'    },
}

export default function RiskBadge({ level, size = 'sm' }) {
  const cfg = CONFIG[level] || CONFIG.SAFE
  const sizeClass = size === 'lg'
    ? 'text-sm px-3 py-1.5 font-semibold'
    : 'text-xs px-2 py-1 font-medium'
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border ${cfg.cls} ${sizeClass}`}>
      <span>{cfg.emoji}</span>
      {cfg.text}
    </span>
  )
}
