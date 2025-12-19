
import React from 'react';
import { LogEntry } from '../types';
import { FileDown, Search, Filter, ArrowUpDown } from 'lucide-react';

interface Props {
  logs: LogEntry[];
}

const LogsPage: React.FC<Props> = ({ logs }) => {
  const exportCSV = () => {
    const headers = ["Timestamp", "Distance (cm)", "Setpoint (cm)", "Error (cm)", "PID Output"];
    const rows = logs.map(l => [l.timestamp, l.distance.toFixed(2), l.setpoint, l.error.toFixed(2), l.output.toFixed(2)]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(r => r.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `trolley_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search logs..." 
            className="bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-80"
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-3 rounded-2xl text-sm font-medium hover:bg-slate-800 transition-all">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20"
          >
            <FileDown className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 font-bold uppercase text-[10px] tracking-widest border-b border-slate-800">
                <th className="px-6 py-4">
                  <div className="flex items-center gap-2">Timestamp <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-6 py-4">Distance</th>
                <th className="px-6 py-4">Setpoint</th>
                <th className="px-6 py-4">Error</th>
                <th className="px-6 py-4">Output Signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {logs.slice().reverse().map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-400">{log.timestamp}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-white">{log.distance.toFixed(2)}</span>
                    <span className="ml-1 text-[10px] text-slate-500">cm</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-400">{log.setpoint} cm</td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${Math.abs(log.error) > 5 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {log.error.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-full" 
                            style={{ width: `${Math.min(100, (Math.abs(log.output) / 10) * 100)}%` }} 
                          />
                       </div>
                       <span className="font-mono text-xs">{log.output.toFixed(1)}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-500 italic">
                    No data logged yet. Start tracking to capture metrics.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-slate-500 text-center italic">Logs are stored in local memory and will be cleared on session refresh unless exported.</p>
    </div>
  );
};

export default LogsPage;
