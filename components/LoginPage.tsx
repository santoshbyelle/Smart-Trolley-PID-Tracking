
import React, { useState } from 'react';
import { Zap, Lock, Mail, ChevronRight, Github, Phone } from 'lucide-react';

interface Props {
  onLogin: (userData: { email: string; mobile: string }) => void;
}

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('admin@trolley.tech');
  const [mobile, setMobile] = useState('+1 234 567 890');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ email, mobile });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] animate-pulse" />
      
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-[40px] shadow-2xl relative z-10 backdrop-blur-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-600 p-4 rounded-3xl shadow-xl shadow-indigo-600/40 mb-6">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">System Login</h1>
          <p className="text-slate-500 text-sm font-medium text-center">Smart Trolley GSM Link Protocol<br/>Authorized Research Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Research Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Mobile No. (GSM Link)</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="tel" 
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+1 000 000 0000"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Access Password</label>
              <a href="#" className="text-[10px] text-indigo-400 font-bold hover:text-indigo-300">Recover</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="password" 
                defaultValue="password"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/30 active:scale-[0.98] mt-4"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Link & Synchronize</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-4">Fast Authentication</p>
          <div className="flex justify-center gap-4">
            <button className="flex-1 py-3 bg-slate-950 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-xs font-bold">
               <div className="w-4 h-4 flex items-center justify-center font-black text-blue-400">G</div>
               Google Login
            </button>
            <button className="flex-1 py-3 bg-slate-950 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-xs font-bold">
              <Github className="w-4 h-4" />
              Github
            </button>
          </div>
        </div>
      </div>
      
      <p className="absolute bottom-8 left-0 right-0 text-center text-[10px] text-slate-700 font-bold uppercase tracking-[0.2em] pointer-events-none">
        GSM GATEWAY PROTOCOL v4.2.0 • ENCRYPTED VIA CLOUD PORTAL
      </p>
    </div>
  );
};

export default LoginPage;
