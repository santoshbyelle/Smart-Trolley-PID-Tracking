
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Settings2, 
  LineChart, 
  Bell, 
  Database, 
  Power, 
  User, 
  AlertTriangle,
  Battery,
  Thermometer,
  Zap,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Wifi,
  WifiOff,
  UserCheck,
  Move,
  Camera,
  Map as MapIcon
} from 'lucide-react';
import { 
  TrolleyState, 
  TrolleyStatus, 
  ControlMode, 
  PIDParameters, 
  LogEntry, 
  Alert 
} from './types';
import { TrolleySimulator } from './services/simulationService';

// Import sub-pages
import DashboardPage from './components/DashboardPage';
import PIDTuningPage from './components/PIDTuningPage';
import AnalyticsPage from './components/AnalyticsPage';
import AlertsPage from './components/AlertsPage';
import LogsPage from './components/LogsPage';
import LoginPage from './components/LoginPage';
import CameraPage from './components/CameraPage';
import TrackingPage from './components/TrackingPage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isConnected, setIsConnected] = useState(true); 
  const [isHumanMoving, setIsHumanMoving] = useState(false); 
  const [userProfile, setUserProfile] = useState({ email: '', mobile: '' });
  
  const [trolleyState, setTrolleyState] = useState<TrolleyState>({
    currentDistance: 150,
    targetDistance: 100,
    error: 50,
    motorSpeed: 0,
    pidOutput: 0,
    status: TrolleyStatus.IDLE,
    mode: ControlMode.AUTO,
    batteryLevel: 85,
    temperature: 32,
    obstacleDetected: false,
    latitude: 40.7128,
    longitude: -74.0060,
    gsmSignal: 85,
    satelliteCount: 12
  });

  const [pidParams, setPidParams] = useState<PIDParameters>({ kp: 1.2, ki: 0.1, kd: 0.5 });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  const simulatorRef = useRef<TrolleySimulator>(new TrolleySimulator());
  const humanMovementRef = useRef<number>(150);
  const lastVibrationTime = useRef<number>(0);

  useEffect(() => {
    if (!isLoggedIn || !isConnected) return;

    const interval = setInterval(() => {
      if (isHumanMoving) {
        humanMovementRef.current += (Math.random() - 0.4) * 8; 
      } else {
        humanMovementRef.current += (Math.random() - 0.5) * 0.5;
      }
      
      const newState = simulatorRef.current.update(humanMovementRef.current);
      setTrolleyState(newState);

      // Distance Breach Logic: Check if current gap is > target + 100cm threshold
      const distanceThreshold = newState.targetDistance + 100;
      if (newState.currentDistance > distanceThreshold) {
        const now = Date.now();
        // Vibrate if cooldown (5 seconds) has passed
        if (now - lastVibrationTime.current > 5000) {
          if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
          }
          lastVibrationTime.current = now;

          // Add a high-priority alert
          setAlerts(prev => {
            const breachAlert: Alert = {
              id: now.toString(),
              type: 'error',
              message: `CRITICAL RANGE BREACH: Gap is ${newState.currentDistance.toFixed(0)}cm (Limit: ${distanceThreshold}cm)`,
              timestamp: new Date().toLocaleTimeString()
            };
            return [breachAlert, ...prev].slice(0, 15);
          });
        }
      }

      setLogs(prev => {
        const newLog: LogEntry = {
          timestamp: new Date().toLocaleTimeString(),
          distance: newState.currentDistance,
          setpoint: newState.targetDistance,
          error: newState.error,
          output: newState.pidOutput
        };
        const next = [...prev, newLog];
        return next.length > 100 ? next.slice(next.length - 100) : next;
      });

      if (newState.obstacleDetected) {
        setAlerts(prev => {
          if (prev.length > 0 && prev[0].message === 'Obstacle Detected!') return prev;
          const newAlert: Alert = {
            id: Date.now().toString(),
            type: 'warning',
            message: 'Obstacle Detected!',
            timestamp: new Date().toLocaleTimeString()
          };
          return [newAlert, ...prev].slice(0, 15);
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isLoggedIn, isConnected, isHumanMoving]);

  const handleUpdatePID = (params: PIDParameters) => {
    setPidParams(params);
    simulatorRef.current.setPID(params);
  };

  const handleUpdateTarget = (val: number) => {
    simulatorRef.current.setTarget(val);
  };

  const handleUpdateStatus = (status: TrolleyStatus) => {
    simulatorRef.current.setStatus(status);
  };

  const handleUpdateMode = (mode: ControlMode) => {
    simulatorRef.current.setMode(mode);
  };

  const toggleHardwareConnection = () => {
    setIsConnected(!isConnected);
    if (isConnected) {
      simulatorRef.current.setStatus(TrolleyStatus.IDLE);
    }
  };

  const handleLogin = (data: { email: string; mobile: string }) => {
    setUserProfile(data);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden font-sans text-slate-200">
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 ease-in-out border-r border-slate-800 bg-slate-900/50 backdrop-blur-md flex flex-col z-50`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight">SmartTrolley</span>}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <NavItem icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" active={activeTab === 'dashboard'} expanded={isSidebarOpen} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<MapIcon className="w-5 h-5" />} label="Live Tracking" active={activeTab === 'tracking'} expanded={isSidebarOpen} onClick={() => setActiveTab('tracking')} />
          <NavItem icon={<Camera className="w-5 h-5" />} label="Live Cam" active={activeTab === 'camera'} expanded={isSidebarOpen} onClick={() => setActiveTab('camera')} />
          <NavItem icon={<Settings2 className="w-5 h-5" />} label="PID Tuning" active={activeTab === 'tuning'} expanded={isSidebarOpen} onClick={() => setActiveTab('tuning')} />
          <NavItem icon={<LineChart className="w-5 h-5" />} label="Analytics" active={activeTab === 'analytics'} expanded={isSidebarOpen} onClick={() => setActiveTab('analytics')} />
          <NavItem icon={<Bell className="w-5 h-5" />} label="Alerts" active={activeTab === 'alerts'} expanded={isSidebarOpen} badge={alerts.length > 0 ? alerts.length : undefined} onClick={() => setActiveTab('alerts')} />
          <NavItem icon={<Database className="w-5 h-5" />} label="Data Logs" active={activeTab === 'logs'} expanded={isSidebarOpen} onClick={() => setActiveTab('logs')} />
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:text-white hover:bg-red-500/10 transition-colors">
             <LogOut className="w-5 h-5" />
             {isSidebarOpen && <span className="font-medium text-sm">Sign Out</span>}
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/30 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-lg font-semibold capitalize text-slate-100">{activeTab.replace('camera', 'Live Feed').replace('tracking', 'GPS Tracking')}</h1>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsHumanMoving(!isHumanMoving)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
                isHumanMoving 
                  ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' 
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
            >
              <Move className={`w-4 h-4 ${isHumanMoving ? 'animate-bounce' : ''}`} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden lg:inline">
                {isHumanMoving ? 'Human Walking' : 'Human Idle'}
              </span>
            </button>

            <button 
              onClick={toggleHardwareConnection}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-500 group relative ${
                isConnected 
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                  : 'bg-slate-800/50 border-slate-700 text-slate-500 opacity-60'
              }`}
            >
              <div className="relative">
                {isConnected ? (
                  <>
                    <Wifi className="w-4 h-4" />
                    <div className="absolute inset-0 bg-emerald-400 rounded-full blur-sm opacity-50 animate-pulse" />
                  </>
                ) : (
                  <WifiOff className="w-4 h-4" />
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">
                {isConnected ? 'GSM LINKED' : 'OFFLINE'}
              </span>
            </button>

            <div className="flex items-center gap-2">
              <Battery className={`w-5 h-5 ${trolleyState.batteryLevel < 20 ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`} />
              <span className="text-sm font-medium">{Math.floor(trolleyState.batteryLevel)}%</span>
            </div>
            
            <div className="h-8 w-[1px] bg-slate-800" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-200">{userProfile.email.split('@')[0]}</p>
                <p className="text-[9px] text-indigo-400 font-bold tracking-tighter uppercase">{userProfile.mobile}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {activeTab === 'dashboard' && (
            <DashboardPage 
              state={isConnected ? trolleyState : { ...trolleyState, status: TrolleyStatus.IDLE, currentDistance: 0, motorSpeed: 0 }} 
              onToggleStatus={handleUpdateStatus} 
              onToggleMode={handleUpdateMode} 
              onSetTarget={handleUpdateTarget}
              isConnected={isConnected}
              isHumanMoving={isHumanMoving}
              onAccessCamera={() => setActiveTab('camera')}
              onAccessTracking={() => setActiveTab('tracking')}
              userProfile={userProfile}
            />
          )}
          {activeTab === 'camera' && (
            <CameraPage 
              state={trolleyState} 
              isConnected={isConnected}
            />
          )}
          {activeTab === 'tracking' && (
            <TrackingPage 
              state={trolleyState} 
              isConnected={isConnected}
            />
          )}
          {activeTab === 'tuning' && <PIDTuningPage params={pidParams} onUpdate={handleUpdatePID} logs={logs} />}
          {activeTab === 'analytics' && <AnalyticsPage logs={logs} />}
          {activeTab === 'alerts' && <AlertsPage alerts={alerts} />}
          {activeTab === 'logs' && <LogsPage logs={logs} />}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  expanded?: boolean;
  badge?: number;
  onClick: () => void;
}> = ({ icon, label, active, expanded, badge, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all relative ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
    }`}
  >
    {icon}
    {expanded && <span className="font-medium text-sm">{label}</span>}
    {badge && expanded && (
      <span className="absolute right-3 top-3 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
        {badge}
      </span>
    )}
  </button>
);

export default App;
