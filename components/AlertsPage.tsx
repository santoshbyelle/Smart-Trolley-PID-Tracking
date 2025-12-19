
import React from 'react';
import { Alert } from '../types';
import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle2, Trash2 } from 'lucide-react';

interface Props {
  alerts: Alert[];
}

const AlertsPage: React.FC<Props> = ({ alerts }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Bell className="text-indigo-400" /> System Notifications
        </h2>
        <button className="text-sm text-slate-400 hover:text-red-400 flex items-center gap-2 transition-colors">
          <Trash2 className="w-4 h-4" /> Clear All
        </button>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
            <div className="bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-slate-600 w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-300">System Secure</h3>
            <p className="text-slate-500 text-sm mt-1">No active alerts or warnings at this time.</p>
          </div>
        ) : (
          alerts.map(alert => (
            <AlertItem key={alert.id} alert={alert} />
          ))
        )}
      </div>

      <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-3xl mt-8">
        <h4 className="font-bold text-indigo-400 mb-2">Automated Response Log</h4>
        <p className="text-sm text-slate-400">The system is configured to perform a safety halt if more than 3 high-priority obstacles are detected within 5 seconds.</p>
      </div>
    </div>
  );
};

const AlertItem: React.FC<{ alert: Alert }> = ({ alert }) => {
  const configs = {
    info: { icon: <Info className="text-blue-400" />, border: 'border-blue-500/20', bg: 'bg-blue-500/5' },
    warning: { icon: <AlertTriangle className="text-amber-400" />, border: 'border-amber-500/20', bg: 'bg-amber-500/5' },
    error: { icon: <AlertCircle className="text-red-400" />, border: 'border-red-500/20', bg: 'bg-red-500/5' }
  };

  const config = configs[alert.type];

  return (
    <div className={`flex items-start gap-4 p-5 border rounded-2xl transition-all hover:scale-[1.01] ${config.border} ${config.bg}`}>
      <div className="mt-1">{config.icon}</div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <p className="font-bold text-slate-200 capitalize">{alert.type} Alert</p>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded-md">{alert.timestamp}</span>
        </div>
        <p className="text-sm text-slate-400 mt-1">{alert.message}</p>
      </div>
    </div>
  );
};

export default AlertsPage;
