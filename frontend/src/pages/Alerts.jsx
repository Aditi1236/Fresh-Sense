import React, { useEffect, useState } from 'react';
import { getAlerts } from '../services/api';
import RiskBadge from '../components/RiskBadge';

function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    getAlerts()
      .then(setAlerts)
      .catch(() => setAlerts([]));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold text-white mb-6">🚨 System Alerts</h1>
      {alerts.length === 0 ? (
        <p className="text-slate-400 text-center py-8">No alerts at the moment.</p>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
              <RiskBadge level={alert.level} />
              <p className="text-slate-300">{alert.message}</p>
              <p className="text-xs text-slate-500 mt-1">{new Date(alert.timestamp).toLocaleTimeString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Alerts;