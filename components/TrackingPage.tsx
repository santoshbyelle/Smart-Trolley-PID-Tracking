
import React, { useState } from 'react';
import { TrolleyState, TrolleyStatus } from '../types';
import { 
  Map as MapIcon, 
  Navigation, 
  Signal, 
  Satellite, 
  Copy, 
  Check, 
  LocateFixed,
  WifiOff,
  History,
  ShieldAlert,
  ExternalLink,
  Compass
} from 'lucide-react';

interface Props {
  state: TrolleyState;
  isConnected: boolean;
}

const TrackingPage: React.FC<Props> = ({ state, isConnected }) => {
  const [copied, setCopied] = useState(false);

  const copyCoords = () => {
    navigator.clipboard.writeText(`${state.latitude.toFixed(6)}, ${state.longitude.toFixed(6)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenGoogleMaps = () => {
    // Standard Google Maps Directions URL
    // destination parameter takes latitude,longitude
    const url = `https://www.google.com/maps/dir/?api=1&destination=${state.latitude},${state.longitude}&travelmode=walking`;
    window.open(url, '_blank');
  };

  const getSignalStrengthColor = (signal: number) => {
    if (signal > 80) return 'bg-emerald-500';
    if (signal > 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-3">
            <Navigation className="text-indigo-400" /> GPS Navigation Terminal
          </h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Satellite Tracking • GSM Recovery Protocol</p>
        </div>
        
        <div className="flex items-center gap-3">
          <StatusBadge 
            icon={<Satellite className="w-4 h-4" />} 
            label="GPS Fix" 
            value={`${state.satelliteCount} Sats`} 
            active={isConnected} 
          />
          <StatusBadge 
            icon={<Signal className="w-4 h-4" />} 
            label="GSM / LTE" 
            value={`${state.gsmSignal.toFixed(0)}%`} 
            active={isConnected} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Visualization */}
        <div className="lg:col-span-3 relative bg-slate-900 border-2 border-slate-800 rounded-[40px] overflow-hidden min-h-[550px] shadow-2xl group/map">
          {/* Mock Map Background - Dark Styled Map Simulation */}
          <div className="absolute inset-0 bg-[#0a0f1a]">
             <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
             <div className="absolute inset-0 opacity-5 border-[1px] border-slate-500" style={{ backgroundSize: '100px 100px', backgroundImage: 'linear-gradient(to right, #475569 1px, transparent 1px), linear-gradient(to bottom, #475569 1px, transparent 1px)' }} />
             
             {/* Simulated Road Lines */}
             <div className="absolute top-1/2 left-0 right-0 h-12 bg-slate-900/50 -translate-y-1/2 -rotate-12 border-y border-slate-800/30" />
             <div className="absolute top-0 bottom-0 left-1/3 w-12 bg-slate-900/50 rotate-6 border-x border-slate-800/30" />
          </div>

          {/* Current Location Marker */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isConnected ? (
              <div className="relative group cursor-pointer transition-transform hover:scale-110">
                 {/* Ripple Effect */}
                 <div className="absolute inset-0 w-24 h-24 -m-9 bg-indigo-500/10 rounded-full animate-ping" />
                 <div className="absolute inset-0 w-16 h-16 -m-5 bg-indigo-500/20 rounded-full animate-pulse" />
                 
                 {/* Pin Icon */}
                 <div className="bg-indigo-600 p-4 rounded-full border-2 border-white/20 shadow-[0_0_30px_rgba(79,70,229,0.6)] relative z-10">
                   <LocateFixed className="w-8 h-8 text-white" />
                 </div>

                 {/* Information Tooltip Above Pin */}
                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-4 rounded-2xl shadow-2xl w-56 transition-all opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">Trolley Telemetry</p>
                    <div className="space-y-1.5">
                       <div className="flex justify-between text-xs text-white">
                          <span className="opacity-50">Status</span>
                          <span className="font-bold text-emerald-400">{state.status}</span>
                       </div>
                       <div className="flex justify-between text-xs text-white">
                          <span className="opacity-50">Heading</span>
                          <span className="font-bold">NNE 22°</span>
                       </div>
                       <div className="flex justify-between text-xs text-white">
                          <span className="opacity-50">Lat</span>
                          <span className="font-mono text-[10px]">{state.latitude.toFixed(5)}</span>
                       </div>
                       <div className="flex justify-between text-xs text-white">
                          <span className="opacity-50">Long</span>
                          <span className="font-mono text-[10px]">{state.longitude.toFixed(5)}</span>
                       </div>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-slate-800/50 p-6 rounded-full inline-block mb-4 border border-slate-700">
                  <WifiOff className="w-12 h-12 text-slate-600" />
                </div>
                <p className="text-slate-500 font-black uppercase tracking-widest text-sm">Waiting for Satellite Lock...</p>
              </div>
            )}
          </div>

          {/* Map UI Elements */}
          <div className="absolute top-8 right-8 flex flex-col gap-3">
             <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700 shadow-xl">
               <Compass className="w-6 h-6 text-indigo-400 animate-spin" style={{ animationDuration: '4s' }} />
             </div>
          </div>

          {/* Large Navigation Button (Google Maps Link) */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 z-40">
             <button 
               onClick={handleOpenGoogleMaps}
               disabled={!isConnected}
               className={`w-full bg-white text-slate-950 px-8 py-5 rounded-[24px] font-black text-sm uppercase tracking-tighter shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-20 hover:bg-indigo-50 hover:text-indigo-600 ${state.status === TrolleyStatus.LOST ? 'ring-4 ring-orange-500 animate-bounce' : ''}`}
             >
               <MapIcon className="w-6 h-6" />
               Get Directions to Trolley
               <ExternalLink className="w-4 h-4 opacity-50" />
             </button>
          </div>

          {/* Lost Status Overlay */}
          {state.status === TrolleyStatus.LOST && isConnected && (
            <div className="absolute top-8 left-8 flex items-center gap-4 bg-orange-600 px-6 py-4 rounded-2xl border-2 border-orange-400/30 shadow-2xl z-30">
               <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
               <div className="text-left">
                  <p className="text-sm font-black text-white uppercase tracking-tighter">Target Recovery Active</p>
                  <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Tracking via GSM / AGPS Mesh</p>
               </div>
            </div>
          )}
        </div>

        {/* Telemetry Sidebar */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
             <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Device Coordinates</h3>
             
             <div className="space-y-4">
                <CoordItem label="LATITUDE" value={state.latitude.toFixed(6)} />
                <CoordItem label="LONGITUDE" value={state.longitude.toFixed(6)} />
             </div>

             <div className="grid grid-cols-2 gap-3 mt-6">
               <button 
                 onClick={copyCoords}
                 className="flex flex-col items-center justify-center gap-2 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700"
               >
                 {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Copy</span>
               </button>
               <button 
                 onClick={handleOpenGoogleMaps}
                 className="flex flex-col items-center justify-center gap-2 py-4 rounded-2xl bg-indigo-600/10 hover:bg-indigo-600/20 transition-all border border-indigo-500/20"
               >
                 <MapIcon className="w-4 h-4 text-indigo-400" />
                 <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Google Maps</span>
               </button>
             </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
             <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Connectivity Stats</h3>
             <div className="space-y-6">
                <div>
                   <div className="flex justify-between items-center text-xs font-bold mb-2">
                      <span className="text-slate-500 uppercase tracking-tighter">GSM Signal</span>
                      <span className="text-indigo-400">{state.gsmSignal.toFixed(0)}%</span>
                   </div>
                   <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-500 ${getSignalStrengthColor(state.gsmSignal)}`} style={{ width: `${state.gsmSignal}%` }} />
                   </div>
                </div>
                <div>
                   <div className="flex justify-between items-center text-xs font-bold mb-2">
                      <span className="text-slate-500 uppercase tracking-tighter">Satellite Precision</span>
                      <span className="text-emerald-400">0.8 HDOP</span>
                   </div>
                   <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full ${i <= 5 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                      ))}
                   </div>
                </div>
             </div>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl group cursor-help">
             <div className="flex items-center gap-3 mb-4">
               <History className="w-5 h-5 text-indigo-400" />
               <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Track History</h3>
             </div>
             <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase">Showing 14 active breadcrumbs from current session. Path variance within 0.2m.</p>
             <div className="mt-4 flex flex-col gap-2">
                <div className="h-1 bg-slate-800 rounded-full w-full opacity-30" />
                <div className="h-1 bg-slate-800 rounded-full w-2/3 opacity-20" />
                <div className="h-1 bg-slate-800 rounded-full w-1/2 opacity-10" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ icon: React.ReactNode, label: string, value: string, active: boolean }> = ({ icon, label, value, active }) => (
  <div className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all ${active ? 'bg-slate-900 border-slate-800 shadow-lg' : 'opacity-30 border-slate-800'}`}>
    <div className="text-indigo-400">{icon}</div>
    <div className="text-left">
      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
      <p className="text-xs font-black text-slate-200 uppercase tracking-widest">{active ? value : '---'}</p>
    </div>
  </div>
);

const CoordItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50 hover:border-slate-700 transition-colors group">
    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 group-hover:text-indigo-500 transition-colors">{label}</p>
    <p className="text-lg font-mono font-bold text-slate-200 tracking-tight">{value}</p>
  </div>
);

const MapButton: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
  <button className="bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all shadow-xl active:scale-95">
    {icon}
  </button>
);

export default TrackingPage;
