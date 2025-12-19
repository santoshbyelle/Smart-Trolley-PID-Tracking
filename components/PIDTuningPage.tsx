
import React, { useState } from 'react';
import { PIDParameters, LogEntry } from '../types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Settings2, Save, RotateCcw, HelpCircle } from 'lucide-react';

interface Props {
  params: PIDParameters;
  onUpdate: (params: PIDParameters) => void;
  logs: LogEntry[];
}

const PIDTuningPage: React.FC<Props> = ({ params, onUpdate, logs }) => {
  const [localParams, setLocalParams] = useState<PIDParameters>(params);

  const handleApply = () => {
    onUpdate(localParams);
  };

  const handleReset = () => {
    const defaults = { kp: 1.2, ki: 0.1, kd: 0.5 };
    setLocalParams(defaults);
    onUpdate(defaults);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-indigo-400" /> Gain Configuration
            </h3>
            <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500" title="Help">
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-8">
            <ParamSlider 
              label="Proportional Gain (Kp)" 
              value={localParams.kp} 
              min={0} max={10} step={0.01}
              color="text-indigo-400"
              onChange={(v) => setLocalParams(p => ({ ...p, kp: v }))}
            />
            <ParamSlider 
              label="Integral Gain (Ki)" 
              value={localParams.ki} 
              min={0} max={5} step={0.01}
              color="text-emerald-400"
              onChange={(v) => setLocalParams(p => ({ ...p, ki: v }))}
            />
            <ParamSlider 
              label="Derivative Gain (Kd)" 
              value={localParams.kd} 
              min={0} max={2} step={0.01}
              color="text-amber-400"
              onChange={(v) => setLocalParams(p => ({ ...p, kd: v }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-10">
            <button 
              onClick={handleApply}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20"
            >
              <Save className="w-4 h-4" /> Apply
            </button>
            <button 
              onClick={handleReset}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 py-3 rounded-2xl font-bold border border-slate-700 transition-all"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
           <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Educational Note</h4>
           <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
             <p><span className="text-indigo-400 font-bold">Kp:</span> High values increase speed but risk overshoot and instability.</p>
             <p><span className="text-emerald-400 font-bold">Ki:</span> Eliminates steady-state error but can cause "hunting" oscillations.</p>
             <p><span className="text-amber-400 font-bold">Kd:</span> Dampens movement and improves response time during rapid changes.</p>
           </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-[500px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold">System Response Preview</h3>
            <div className="flex gap-4 text-xs font-medium">
               <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-indigo-500 rounded-full" /> Actual</span>
               <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-red-400 rounded-full" /> Setpoint</span>
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={logs}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickFormatter={(val) => val.split(' ')[0]} 
                />
                <YAxis domain={['auto', 'auto']} stroke="#475569" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#94a3b8' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="distance" 
                  stroke="#6366f1" 
                  strokeWidth={2} 
                  dot={false} 
                  isAnimationActive={false} 
                />
                <Line 
                  type="stepAfter" 
                  dataKey="setpoint" 
                  stroke="#f87171" 
                  strokeWidth={1} 
                  strokeDasharray="5 5" 
                  dot={false} 
                  isAnimationActive={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <ControlMetric label="Rise Time" value="1.2s" trend="down" />
           <ControlMetric label="Overshoot" value="4.5%" trend="up" />
           <ControlMetric label="Settling Time" value="2.8s" trend="down" />
           <ControlMetric label="SS Error" value="0.12cm" trend="neutral" />
        </div>
      </div>
    </div>
  );
};

const ParamSlider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  color: string;
  onChange: (val: number) => void;
}> = ({ label, value, min, max, step, color, onChange }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <span className={`font-mono font-bold ${color}`}>{value.toFixed(2)}</span>
    </div>
    <input 
      type="range" 
      min={min} max={max} step={step} 
      value={value} 
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
    />
  </div>
);

const ControlMetric: React.FC<{ label: string; value: string; trend: 'up' | 'down' | 'neutral' }> = ({ label, value, trend }) => (
  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center">
     <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">{label}</p>
     <p className="text-lg font-mono text-white">{value}</p>
  </div>
);

export default PIDTuningPage;
