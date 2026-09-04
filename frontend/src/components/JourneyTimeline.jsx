import React from 'react'

const STAGES = [
  { label: 'Farm',         icon: '🌾', location: 'Ludhiana' },
  { label: 'Cold Storage', icon: '🏭', location: 'Ludhiana' },
  { label: 'In Transit',   icon: '🚚', location: 'NH1 Highway' },
  { label: 'Market',       icon: '🏪', location: 'Chandigarh' },
]

const DISTANCES = ['12 km', '45 km', '38 km']

export default function JourneyTimeline({ currentStage = 0, eta }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5">
        📍 Journey Timeline
      </h3>

      {/* Stages */}
      <div className="flex items-center gap-0">
        {STAGES.map((stage, i) => {
          const isPast   = i < currentStage
          const isCurrent = i === currentStage
          const isFuture  = i > currentStage
          return (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center flex-shrink-0 w-20">
                {/* Circle */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition-all ${
                  isCurrent ? 'bg-green-600 border-green-400 shadow-lg shadow-green-500/30 scale-110' :
                  isPast    ? 'bg-green-900/50 border-green-600' :
                              'bg-slate-700/50 border-slate-600'
                }`}>
                  {stage.icon}
                </div>
                {/* Label */}
                <p className={`text-xs mt-2 text-center font-medium ${
                  isCurrent ? 'text-green-400' : isPast ? 'text-green-600' : 'text-slate-500'
                }`}>
                  {stage.label}
                </p>
                <p className={`text-xs text-center mt-0.5 ${
                  isCurrent ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {stage.location}
                </p>
                {isCurrent && (
                  <span className="text-xs bg-green-600/20 text-green-400 border border-green-600/30 rounded-full px-2 py-0.5 mt-1">
                    NOW
                  </span>
                )}
              </div>

              {/* Connector line */}
              {i < STAGES.length - 1 && (
                <div className="flex-1 flex flex-col items-center -mt-6">
                  <div className={`h-0.5 w-full ${i < currentStage ? 'bg-green-600' : 'bg-slate-600'}`} />
                  <p className="text-xs text-slate-600 mt-1">{DISTANCES[i]}</p>
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* ETA */}
      {eta !== undefined && (
        <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between text-sm">
          <span className="text-slate-400">Estimated delivery</span>
          <span className="text-white font-semibold">~{eta} hours</span>
        </div>
      )}

      {/* Text route */}
      <div className="mt-3 text-xs text-slate-500 flex items-center gap-1 flex-wrap">
        <span>Ludhiana (Farm)</span>
        <span>→</span>
        <span>Cold Storage</span>
        <span>→</span>
        <span>🚚 NH1</span>
        <span>→</span>
        <span>Chandigarh (Market)</span>
      </div>
    </div>
  )
}
