
import React from 'react';
import { LogEntry } from '../types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { LineChart, Share2, Download } from 'lucide-react';

interface Props {
  logs: LogEntry[];
}

const AnalyticsPage: React.FC<Props> = ({ logs }) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
         <div>
           <h2 className="text-2xl font-bold">System Performance</h2>
           <p className="text-slate-400 text-sm">Aggregated real-time metrics for current tracking session.</p>
         </div>
         <div className="flex gap-3">
           <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm transition-all">
             <Share2 className="w-4 h-4" /> Share
           </button>
           <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-bold transition-all">
             <Download className="w-4 h-4" /> Export Report
           </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnalyticsCard title="Error Propagation (cm)" subtitle="Difference between setpoint and actual position">
           <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={logs}>
                <defs>
                  <linearGradient id="colorError" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="timestamp" hide />
                <YAxis stroke="#475569" fontSize={10} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="error" 
                  stroke="#ef4444" 
                  fillOpacity={1} 
                  fill="url(#colorError)" 
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              </AreaChart>
           </ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard title="Control Effort (PWM)" subtitle="Output signal sent to motor drivers">
           <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={logs}>
                <defs>
                  <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="timestamp" hide />
                <YAxis stroke="#475569" fontSize={10} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="output" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorOutput)" 
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              </AreaChart>
           </ResponsiveContainer>
        </AnalyticsCard>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
        <h3 className="text-xl font-bold mb-6">Long-term Reliability Tracking</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="space-y-4">
             <p className="text-sm font-semibold text-slate-500 uppercase">Average Error (MAE)</p>
             <p className="text-5xl font-mono text-white">1.04<span className="text-lg ml-1 text-slate-600">cm</span></p>
             <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[88%]" />
             </div>
             <p className="text-xs text-slate-500">92% stability index compared to baseline.</p>
           </div>
           
           <div className="space-y-4">
             <p className="text-sm font-semibold text-slate-500 uppercase">Total Distance Covered</p>
             <p className="text-5xl font-mono text-white">4.2<span className="text-lg ml-1 text-slate-600">km</span></p>
             <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[45%]" />
             </div>
             <p className="text-xs text-slate-500">Total operational time: 14h 22m</p>
           </div>

           <div className="space-y-4">
             <p className="text-sm font-semibold text-slate-500 uppercase">Battery Cycle Health</p>
             <p className="text-5xl font-mono text-white">98<span className="text-lg ml-1 text-slate-600">%</span></p>
             <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full w-[98%]" />
             </div>
             <p className="text-xs text-slate-500">Predicted replacement in 14 months.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const AnalyticsCard: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
    <div className="mb-6">
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
    </div>
    {children}
  </div>
);

export default AnalyticsPage;
