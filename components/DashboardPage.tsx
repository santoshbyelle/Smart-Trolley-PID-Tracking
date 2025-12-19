
import React, { useState, useEffect } from 'react';
import { TrolleyState, TrolleyStatus, ControlMode } from '../types';
import { 
  Power, 
  Play, 
  Pause, 
  AlertOctagon, 
  Target, 
  Ruler, 
  Activity, 
  Zap, 
  Radar,
  Coffee,
  CloudOff,
  AlertCircle,
  ShieldCheck,
  WifiOff,
  CircleStop,
  Camera,
  Map as MapIcon,
  Cloud,
  ArrowUpRight,
  ArrowDownLeft,
  Navigation,
  AlertTriangle,
  Edit3,
  Network
} from 'lucide-react';

interface Props {
  state: TrolleyState;
  onToggleStatus: (status: TrolleyStatus) => void;
  onToggleMode: (mode: ControlMode) => void;
  onSetTarget: (val: number) => void;
  isConnected: boolean;
  isHumanMoving: boolean;
  onAccessCamera: () => void;
  onAccessTracking: () => void;
  userProfile?: { email: string; mobile: string };
}

const HumanBody: React.FC<{ isWalking: boolean }> = ({ isWalking }) => (
  <div className={`relative flex flex-col items-center justify-end h-32 w-24 group`}>
    <div className="w-8 h-8 bg-slate-200 rounded-full mb-1 shadow-lg relative z-10">
      <div className="absolute top-2 left-1 w-1.5 h-1.5 bg-slate-900 rounded-full opacity-30" />
      <div className="absolute top-2 right-1 w-1.5 h-1.5 bg-slate-900 rounded-full opacity-30" />
    </div>
    <div className="w-10 h-14 bg-slate-300 rounded-t-xl rounded-b-md shadow-inner relative">
       <div className={`absolute top-1 -left-2 w-2.5 h-10 bg-slate-400 rounded-full origin-top ${isWalking ? 'animate-arm-swing-left' : ''}`} />
       <div className={`absolute top-1 -right-2 w-2.5 h-10 bg-slate-400 rounded-full origin-top ${isWalking ? 'animate-arm-swing-right' : ''}`} />
    </div>
    <div className="flex gap-1 h-12 mt-[-4px]">
      <div className={`w-3.5 h-12 bg-slate-400 rounded-full origin-top ${isWalking ? 'animate-leg-swing-left' : ''}`} />
      <div className={`w-3.5 h-12 bg-slate-400 rounded-full origin-top ${isWalking ? 'animate-leg-swing-right' : ''}`} />
    </div>
    {!isWalking && (
      <div className="absolute top-0 -right-4 bg-red-500/20 text-red-400 p-1 rounded-full border border-red-500/30 animate-pulse">
        <CircleStop className="w-3.5 h-3.5" />
      </div>
    )}
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes arm-swing-left { 0%, 100% { transform: rotate(30deg); } 50% { transform: rotate(-30deg); } }
      @keyframes arm-swing-right { 0%, 100% { transform: rotate(-30deg); } 50% { transform: rotate(30deg); } }
      @keyframes leg-swing-left { 0%, 100% { transform: rotate(-25deg); } 50% { transform: rotate(25deg); } }
      @keyframes leg-swing-right { 0%, 100% { transform: rotate(25deg); } 50% { transform: rotate(-25deg); } }
      .animate-arm-swing-left { animation: arm-swing-left 0.8s infinite ease-in-out; }
      .animate-arm-swing-right { animation: arm-swing-right 0.8s infinite ease-in-out; }
      .animate-leg-swing-left { animation: leg-swing-left 0.8s infinite ease-in-out; }
      .animate-leg-swing-right { animation: leg-swing-right 0.8s infinite ease-in-out; }
    `}} />
  </div>
);

const DashboardPage: React.FC<Props> = ({ state, onToggleStatus, onToggleMode, onSetTarget, isConnected, isHumanMoving, onAccessCamera, onAccessTracking, userProfile }) => {
  const isRunning = state.status === TrolleyStatus.TRACKING && isConnected;
  const isBreached = state.currentDistance > (state.targetDistance + 100);
  const [inputValue, setInputValue] = useState(state.targetDistance.toString());
  const [latency, setLatency] = useState(24);
  const [throughput, setThroughput] = useState({ up: 12.4, down: 42.1 });

  useEffect(() => {
    setInputValue(state.targetDistance.toString());
  }, [state.targetDistance]);

  // Simulate network jitter
  useEffect(() => {
    if (!isConnected) return;
    const inv = setInterval(() => {
      setLatency(20 + Math.floor(Math.random() * 15));
      setThroughput({
        up: 10 + Math.random() * 5,
        down: 35 + Math.random() * 10
      });
    }, 2000);
    return () => clearInterval(inv);
  }, [isConnected]);

  const handleOpenGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${state.latitude},${state.longitude}&travelmode=walking`;
    window.open(url, '_blank');
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const num = parseInt(val);
    if (!isNaN(num) && num >= 0) {
      onSetTarget(num);
    }
  };

  const getStatusConfig = (status: TrolleyStatus) => {
    if (!isConnected) return {
      icon: <WifiOff className="w-4 h-4" />,
      color: 'text-slate-500',
      bg: 'bg-slate-800/50',
      border: 'border-slate-700',
      label: 'GSM OFFLINE',
      dot: 'bg-slate-600'
    };

    switch (status) {
      case TrolleyStatus.TRACKING:
        return { icon: <Radar className="w-4 h-4" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'ACTIVE TRACKING', dot: 'bg-emerald-500 animate-pulse' };
      case TrolleyStatus.LOST:
        return { icon: <CloudOff className="w-4 h-4" />, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'TARGET LOST', dot: 'bg-orange-500 animate-ping' };
      case TrolleyStatus.EMERGENCY_STOP:
        return { icon: <AlertCircle className="w-4 h-4" />, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'EMERGENCY HALT', dot: 'bg-red-500 animate-ping' };
      default:
        return { icon: <Coffee className="w-4 h-4" />, color: 'text-slate-400', bg: 'bg-slate-800/50', border: 'border-slate-700', label: 'STANDBY', dot: 'bg-slate-500' };
    }
  };

  const statusCfg = getStatusConfig(state.status);

  return (
    <div className="space-y-6 pb-12">
      {/* Real-time Tracking Canvas */}
      <div className={`bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden h-[400px] flex items-center justify-center shadow-inner transition-all duration-700 ${!isConnected ? 'grayscale opacity-60' : ''}`}>
        
        {isBreached && isConnected && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-red-600 px-6 py-2 rounded-full flex items-center gap-3 animate-pulse border-2 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)]">
            <AlertTriangle className="w-4 h-4 text-white" />
            <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Safety Range Breach - Device Vibrating</span>
          </div>
        )}

        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        {!isConnected && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/20 backdrop-blur-[2px]">
             <div className="text-center">
               <div className="bg-slate-800/80 p-4 rounded-full inline-block mb-4 border border-slate-700">
                 <WifiOff className="w-8 h-8 text-slate-500" />
               </div>
               <h4 className="text-xl font-black text-slate-400 tracking-tighter uppercase">GSM Link Terminated</h4>
               <p className="text-xs text-slate-600 font-bold uppercase mt-1">SIM Card or Network Timeout</p>
             </div>
          </div>
        )}

        <div className="absolute bottom-1/4 left-0 right-0 h-[2px] bg-slate-800/50" />
        
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 flex flex-col items-center">
           <div className={`h-4 transition-all duration-300 w-px ${isBreached ? 'bg-red-500' : 'bg-indigo-500/30'} ${isRunning ? 'animate-pulse' : ''}`} style={{ width: `${state.currentDistance * 2}px` }} />
           <div className={`backdrop-blur-sm border px-3 py-1 rounded-full mt-2 transition-colors ${isBreached ? 'bg-red-900/80 border-red-500' : 'bg-slate-950/80 border-slate-800'}`}>
             <span className={`text-xs font-mono tracking-tighter ${isBreached ? 'text-white' : 'text-indigo-400'}`}>{isConnected ? state.currentDistance.toFixed(1) : '--.-'} cm</span>
           </div>
        </div>

        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 ml-[-160px] flex flex-col items-center mb-1">
           <HumanBody isWalking={isHumanMoving} />
           <span className="text-[10px] text-slate-500 uppercase mt-4 font-black tracking-widest bg-slate-950/40 px-3 py-1 rounded-full border border-slate-800/50">Human Target</span>
        </div>

        <div 
          className="absolute bottom-1/4 left-1/2 -translate-x-1/2 flex flex-col items-center mb-1 transition-all duration-100 ease-linear"
          style={{ transform: `translateX(${isConnected ? state.currentDistance * 1.5 : 200}px) translateX(-50%)` }}
        >
           <div className={`w-32 h-16 bg-gradient-to-br ${isBreached ? 'from-red-600 to-red-800' : 'from-indigo-500 to-indigo-700'} rounded-lg flex items-center justify-center shadow-2xl relative border-t border-indigo-300/30`}>
              <div className="flex gap-2">
                <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-400 animate-ping' : 'bg-slate-400'}`} />
                <div className="w-2 h-2 rounded-full bg-slate-300" />
              </div>
              <div className={`absolute -bottom-2 -left-1 w-6 h-6 bg-slate-800 rounded-full border-2 border-slate-700 ${isRunning ? 'animate-spin' : ''}`} style={{ animationDuration: `${Math.max(0.1, 10 / (Math.abs(state.motorSpeed) + 1))}s` }} />
              <div className={`absolute -bottom-2 -right-1 w-6 h-6 bg-slate-800 rounded-full border-2 border-slate-700 ${isRunning ? 'animate-spin' : ''}`} style={{ animationDuration: `${Math.max(0.1, 10 / (Math.abs(state.motorSpeed) + 1))}s` }} />
           </div>
           <span className="text-[10px] text-slate-500 uppercase mt-4 font-black tracking-widest bg-slate-950/40 px-3 py-1 rounded-full border border-slate-800/50">Smart Trolley</span>
        </div>

        <div className="absolute top-6 left-6 flex flex-col gap-2 z-30">
          <div className={`px-4 py-2.5 rounded-2xl text-[11px] font-black flex items-center gap-3 border shadow-lg backdrop-blur-md transition-all duration-500 ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}>
             <div className="relative flex items-center justify-center">
                <div className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
                {isRunning && <div className="absolute w-4 h-4 border border-emerald-500/50 rounded-full animate-ping" />}
             </div>
             <div className="flex items-center gap-2">
                {statusCfg.icon}
                <span className="tracking-[0.1em]">{statusCfg.label}</span>
             </div>
          </div>
        </div>

        {state.status === TrolleyStatus.LOST && isConnected && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-slate-950/40 backdrop-blur-sm">
            <button onClick={handleOpenGoogleMaps} className="bg-white text-slate-950 px-10 py-5 rounded-[28px] font-black text-base uppercase tracking-tighter shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-bounce flex items-center gap-4 border-4 border-indigo-500/20 group">
              <Navigation className="w-8 h-8 text-indigo-600 group-hover:rotate-12 transition-transform" /> Start Map Directions
            </button>
            <div className="flex gap-4">
              <button onClick={onAccessCamera} className="bg-slate-900/90 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest border border-slate-700 flex items-center gap-2">
                <Camera className="w-4 h-4 text-orange-400" /> View Cam
              </button>
              <button onClick={onAccessTracking} className="bg-slate-900/90 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest border border-slate-700 flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-indigo-400" /> GPS Map
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Live Cloud Synchronization Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-3">
               <div className={`p-2 rounded-xl border transition-colors duration-500 ${isConnected ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                 <Cloud className="w-5 h-5" />
               </div>
               <div>
                 <h3 className="text-xs font-black text-slate-200 uppercase tracking-widest">Cloud Relay Gateway</h3>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-0.5">Secure Firebase Data Link Active</p>
               </div>
             </div>
             <div className="flex items-center gap-2 bg-slate-950/50 px-3 py-1.5 rounded-full border border-slate-800">
               <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isConnected ? 'Synchronized' : 'Idle'}</span>
             </div>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-800/50">
             <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <ArrowUpRight className="w-3 h-3 text-indigo-400" /> Upstream
                </p>
                <p className="text-xl font-mono font-black text-slate-200">{isConnected ? throughput.up.toFixed(1) : '0.0'} <span className="text-[10px] opacity-40">kb/s</span></p>
             </div>
             <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <ArrowDownLeft className="w-3 h-3 text-emerald-400" /> Downstream
                </p>
                <p className="text-xl font-mono font-black text-slate-200">{isConnected ? throughput.down.toFixed(1) : '0.0'} <span className="text-[10px] opacity-40">kb/s</span></p>
             </div>
             <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-amber-400" /> Latency
                </p>
                <p className="text-xl font-mono font-black text-slate-200">{isConnected ? latency : '--'} <span className="text-[10px] opacity-40">ms</span></p>
             </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 flex overflow-hidden opacity-20">
             <div className={`h-full bg-indigo-500 transition-all duration-300 ${isConnected ? 'animate-pulse' : 'w-0'}`} style={{ width: '100%' }} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-violet-500/10 border border-violet-500/30 rounded-xl text-violet-400">
               <Network className="w-5 h-5" />
             </div>
             <h3 className="text-xs font-black text-slate-200 uppercase tracking-widest">Device Linking</h3>
           </div>
           <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed mb-4">
             Connected via GSM Node: <span className="text-indigo-400 font-black">{userProfile?.mobile || '+1 234 567 890'}</span>
           </p>
           <div className="space-y-2">
              <div className="flex justify-between items-center bg-slate-950/50 p-2 rounded-xl border border-slate-800/50">
                 <span className="text-[9px] font-black text-slate-500 uppercase">Broker Handshake</span>
                 <ShieldCheck className="w-3 h-3 text-emerald-500" />
              </div>
              <div className="flex justify-between items-center bg-slate-950/50 p-2 rounded-xl border border-slate-800/50">
                 <span className="text-[9px] font-black text-slate-500 uppercase">Encryption Lock</span>
                 <Zap className="w-3 h-3 text-amber-500" />
              </div>
           </div>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<Ruler className={`${isBreached ? 'text-red-500' : 'text-indigo-500'}`} />} label="Current Gap" value={isConnected ? `${state.currentDistance.toFixed(1)}` : 'N/A'} unit="cm" color="indigo" />
        <StatCard icon={<Target className="text-violet-500" />} label="Setpoint" value={isConnected ? `${state.targetDistance}` : 'N/A'} unit="cm" color="violet" />
        <StatCard icon={<Activity className="text-emerald-500" />} label="Error" value={isConnected ? `${state.error.toFixed(2)}` : 'N/A'} unit="cm" color="emerald" />
        <StatCard icon={<Zap className="text-amber-500" />} label="Motor Output" value={isConnected ? `${Math.abs(state.motorSpeed).toFixed(0)}` : 'N/A'} unit="RPM" color="amber" />
      </div>

      {/* Commands and Target Customization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative shadow-xl">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-300">
            <Power className="w-4 h-4 text-indigo-400" /> System Commands
          </h3>
          <div className="flex flex-wrap gap-4">
             <ControlButton onClick={() => isConnected && onToggleStatus(state.status === TrolleyStatus.TRACKING ? TrolleyStatus.IDLE : TrolleyStatus.TRACKING)} variant={state.status === TrolleyStatus.TRACKING && isConnected ? 'warning' : 'success'} icon={state.status === TrolleyStatus.TRACKING && isConnected ? <Pause /> : <Play />} label={state.status === TrolleyStatus.TRACKING && isConnected ? 'Stop Tracking' : 'Start Tracking'} disabled={!isConnected} />
             <ControlButton onClick={onAccessTracking} variant="secondary" icon={<MapIcon />} label="GPS Track" disabled={!isConnected} />
             <ControlButton onClick={() => isConnected && onToggleStatus(TrolleyStatus.EMERGENCY_STOP)} variant="danger" icon={<AlertOctagon />} label="EMG STOP" disabled={!isConnected} />
          </div>
          {!isConnected && <div className="absolute inset-0 bg-slate-900/40 rounded-3xl backdrop-blur-[1px] cursor-not-allowed pointer-events-none" />}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative shadow-xl">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-300">
            <Edit3 className="w-4 h-4 text-violet-400" /> Custom Target Proximity
          </h3>
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <input 
                type="range" 
                min="0" 
                max="500" 
                value={state.targetDistance > 500 ? 500 : state.targetDistance} 
                onChange={(e) => isConnected && onSetTarget(parseInt(e.target.value))}
                disabled={!isConnected} 
                className="flex-1 accent-indigo-500 h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer disabled:opacity-30" 
              />
              <div className={`relative group transition-opacity ${!isConnected ? 'opacity-30' : ''}`}>
                <input 
                  type="number"
                  value={inputValue}
                  onChange={handleManualInput}
                  disabled={!isConnected}
                  className="w-28 text-2xl font-mono text-center text-white bg-slate-950 border border-slate-800 px-3 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
                />
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-[8px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">CM</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest px-1">
              <span>Short (0 cm)</span>
              <span className="text-indigo-500 animate-pulse">Custom Value Active</span>
              <span>Long (500+ cm)</span>
            </div>
          </div>
          {!isConnected && <div className="absolute inset-0 bg-slate-900/40 rounded-3xl backdrop-blur-[1px] cursor-not-allowed pointer-events-none" />}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, unit: string, color: string }> = ({ icon, label, value, unit }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-slate-600 transition-all group shadow-lg">
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2.5 rounded-2xl bg-slate-800/80 group-hover:scale-110 transition-transform`}>{icon}</div>
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">{label}</span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-black font-mono tracking-tighter text-slate-100">{value}</span>
      <span className="text-xs text-slate-500 font-black uppercase tracking-widest">{unit}</span>
    </div>
  </div>
);

const ControlButton: React.FC<{ onClick: () => void, variant: 'success' | 'warning' | 'danger' | 'secondary', icon: React.ReactNode, label: string, disabled?: boolean }> = ({ onClick, variant, icon, label, disabled }) => {
  const styles = { success: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20', warning: 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/20', danger: 'bg-red-600 hover:bg-red-500 shadow-red-600/20', secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' };
  return (
    <button onClick={onClick} disabled={disabled} className={`px-5 py-3.5 rounded-2xl flex items-center gap-3 font-bold text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 border-b-2 disabled:opacity-20 disabled:cursor-not-allowed ${styles[variant]}`}>
      {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-4 h-4' })}
      <span>{label}</span>
    </button>
  );
};

export default DashboardPage;
