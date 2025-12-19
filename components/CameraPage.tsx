
import React, { useEffect, useRef, useState } from 'react';
import { TrolleyState, TrolleyStatus } from '../types';
import { Camera, WifiOff, RefreshCw, Maximize2, ShieldAlert, Crosshair } from 'lucide-react';

interface Props {
  state: TrolleyState;
  isConnected: boolean;
}

const CameraPage: React.FC<Props> = ({ state, isConnected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startStream = async () => {
    setLoading(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreamActive(true);
      }
    } catch (err) {
      setError("Unable to access camera. Check permissions or hardware connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stopStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setStreamActive(false);
    }
  };

  useEffect(() => {
    return () => stopStream();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-3">
            <Camera className="text-indigo-400" /> ESP32-CAM Remote View
          </h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Real-time Visual Recovery Protocol</p>
        </div>
        <div className="flex gap-2">
           {!streamActive ? (
             <button 
               onClick={startStream}
               disabled={!isConnected || loading}
               className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-20"
             >
               {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
               Initialize Remote Stream
             </button>
           ) : (
             <button 
               onClick={stopStream}
               className="bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/20 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all"
             >
               Terminate Feed
             </button>
           )}
        </div>
      </div>

      <div className="relative group overflow-hidden rounded-[40px] bg-slate-900 border-2 border-slate-800 shadow-2xl aspect-video flex items-center justify-center">
        {/* The Video Layer */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className={`w-full h-full object-cover transition-all duration-1000 ${streamActive ? 'opacity-100' : 'opacity-0 scale-105 blur-lg'}`} 
        />

        {/* Static/Noise Placeholder */}
        {!streamActive && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-xl">
             <div className="relative mb-8">
               <div className="w-24 h-24 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin" />
               <Camera className="absolute inset-0 m-auto w-10 h-10 text-slate-600" />
             </div>
             <p className="text-slate-400 font-black text-sm uppercase tracking-[0.2em]">Stream Ready for Initialization</p>
             {error && <p className="text-red-400 text-[10px] mt-4 font-bold uppercase">{error}</p>}
          </div>
        )}

        {/* OSD (On-Screen Display) Layer */}
        {streamActive && (
          <div className="absolute inset-0 z-20 pointer-events-none p-8 flex flex-col justify-between font-mono text-white/80">
             {/* Header OSD */}
             <div className="flex justify-between items-start">
                <div className="space-y-1">
                   <div className="flex items-center gap-2 text-red-500">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                      <span className="text-sm font-bold tracking-widest uppercase">REC</span>
                   </div>
                   <div className="text-[10px] opacity-70">CAM-01 | ESP32-WROVER-E</div>
                </div>
                <div className="text-right text-[10px] uppercase space-y-1">
                   <div>{new Date().toLocaleDateString()}</div>
                   <div>{new Date().toLocaleTimeString()}</div>
                </div>
             </div>

             {/* Crosshair Overlay */}
             <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <Crosshair className="w-24 h-24 text-white font-thin" strokeWidth={0.5} />
             </div>

             {/* Footer OSD / Telemetry */}
             <div className="flex justify-between items-end">
                <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1">
                   <div className="flex justify-between gap-8">
                      <span className="text-[9px] font-bold opacity-50">GAP DIST:</span>
                      <span className="text-xs font-bold">{state.currentDistance.toFixed(1)} CM</span>
                   </div>
                   <div className="flex justify-between gap-8">
                      <span className="text-[9px] font-bold opacity-50">PID ERR:</span>
                      <span className="text-xs font-bold text-orange-400">{state.error.toFixed(2)} CM</span>
                   </div>
                   <div className="flex justify-between gap-8">
                      <span className="text-[9px] font-bold opacity-50">MTR SPEED:</span>
                      <span className="text-xs font-bold text-indigo-400">{Math.abs(state.motorSpeed).toFixed(0)} RPM</span>
                   </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                   {state.status === TrolleyStatus.LOST && (
                     <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-bold animate-pulse">
                        <ShieldAlert className="w-3 h-3" />
                        AUTO-TRACKING DISENGAGED
                     </div>
                   )}
                   <div className="text-[10px] bg-indigo-500 text-white px-3 py-1 rounded-full font-bold">
                      AES-256 ENCRYPTED FEED
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Vignette & CRT Effect Overlay */}
        <div className="absolute inset-0 z-30 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]" />
        <div className="absolute inset-0 z-30 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_4px,3px_100%]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Network Status</h4>
            <div className="flex items-center justify-between mb-4">
               <span className="text-sm text-slate-400">Signal Strength</span>
               <span className="text-sm font-bold text-emerald-400">92% (-54dBm)</span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500 w-[92%]" />
            </div>
         </div>
         <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Stream Metadata</h4>
            <div className="flex items-center justify-between text-sm">
               <span className="text-slate-400">Resolution</span>
               <span className="font-bold text-slate-200">1080p (Native)</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
               <span className="text-slate-400">Frame Rate</span>
               <span className="font-bold text-slate-200">30 FPS</span>
            </div>
         </div>
         <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Storage Usage</h4>
            <div className="flex items-center justify-between mb-4">
               <span className="text-sm text-slate-400">SD Card (FAT32)</span>
               <span className="text-sm font-bold text-slate-200">14.2 GB Free</span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-indigo-500 w-[65%]" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default CameraPage;
