import React from 'react';
import { LayoutDashboard, MessageSquare, Shield, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  view: 'chat' | 'admin';
  setView: (view: 'chat' | 'admin') => void;
}

const Navbar: React.FC<NavbarProps> = ({ view, setView }) => {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl">
      <div className="glass-panel px-8 py-3 rounded-[2.5rem] flex items-center justify-between shadow-2xl shadow-shl-500/10">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 180 }}
            className="w-10 h-10 bg-gradient-to-br from-shl-600 to-indigo-600 rounded-[1rem] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-shl-600/30"
          >
            S
          </motion.div>
          <div className="hidden sm:block text-slate-900 transition-colors">
            <h1 className="font-display font-black text-lg tracking-tighter leading-none">SHL <span className="text-shl-500">AI</span></h1>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Consultant v2.4</p>
          </div>
        </div>

        <div className="flex bg-slate-200/50 p-1 rounded-2xl border border-slate-300/50">
          <button
            onClick={() => setView('chat')}
            className={`relative flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
              view === 'chat' 
                ? 'text-white' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {view === 'chat' && (
              <motion.div 
                layoutId="nav-bg"
                className="absolute inset-0 bg-slate-900 rounded-xl -z-10 shadow-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <MessageSquare size={14} />
            Assistant
          </button>
          <button
            onClick={() => setView('admin')}
            className={`relative flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
              view === 'admin' 
                ? 'text-white' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {view === 'admin' && (
              <motion.div 
                layoutId="nav-bg"
                className="absolute inset-0 bg-slate-900 rounded-xl -z-10 shadow-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <LayoutDashboard size={14} />
            Analytics
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 transition-colors">
            <Shield size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Enterprise Secured</span>
          </div>
          
          <div className="w-px h-6 bg-slate-300 mx-1" />

          <button className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all">
            <Bell size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
