import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { chatService } from '../services/api';
import { Database, Activity, Server, Clock, CheckCircle2, AlertCircle, BarChart3, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: chatService.getAdminStats,
    refetchInterval: 30000,
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-4 border-shl-500/20 border-t-shl-500 rounded-full animate-spin" />
        <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">Authenticating Node...</p>
      </div>
    </div>
  );

  const metrics = [
    { label: 'Network Health', value: 'Operational', icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Vector Nodes', value: stats?.vector_db?.count || 0, icon: Database, color: 'text-shl-500', bg: 'bg-shl-500/10' },
    { label: 'Neural Core', value: 'GPT-4 Turbo', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'System Uptime', value: '99.99%', icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto p-10 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white">Neural Intelligence Hub</h2>
          <p className="text-slate-500 font-medium">Real-time monitoring of RAG performance and system integrity.</p>
        </div>
        <div className="px-6 py-3 glass-panel rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-400">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Gateway Active • {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {metrics.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bento-card relative overflow-hidden group"
          >
            <div className={`w-14 h-14 ${m.bg} ${m.color} rounded-[1.25rem] flex items-center justify-center mb-6 shadow-inner`}>
              <m.icon size={28} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{m.label}</p>
            <p className="text-3xl font-display font-black text-slate-900 dark:text-white">{m.value}</p>
            
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <m.icon size={80} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bento-card border-glow p-8">
          <h3 className="font-display font-black text-2xl tracking-tight mb-8">Retrieval Analytics</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex gap-6 p-5 rounded-3xl bg-slate-50 dark:bg-white/5 border border-transparent hover:border-shl-500/30 transition-all cursor-default">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-black text-lg shrink-0 shadow-xl">
                  {i+1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-black tracking-tight">"Senior Java Engineer Assessment"</p>
                    <span className="text-[10px] font-bold text-slate-400">0.4s Latency</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mb-3">Retrieved: Java 8 (Advanced), Cognitive G+, Mechanical Reasoning</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-shl-500/10 text-shl-500 text-[10px] font-bold uppercase tracking-widest">
                      Score: 0.942
                    </div>
                    <div className="w-24 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div className="w-[94%] h-full bg-shl-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bento-card p-8 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/20">
          <h3 className="font-display font-black text-2xl tracking-tight mb-8">Deployment Readiness</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl glass-panel">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wider">SSL Encryption</span>
              </div>
              <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-2xl glass-panel">
              <div className="flex items-center gap-3">
                <Zap size={18} className={stats?.status.includes('mock') ? "text-amber-500" : "text-emerald-500"} />
                <span className="text-xs font-bold uppercase tracking-wider">AI Intelligence</span>
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stats?.status.includes('mock') ? "text-amber-500 bg-amber-500/10" : "text-emerald-500 bg-emerald-500/10"}`}>
                {stats?.status.includes('mock') ? "Mock Mode" : "Production (GPT-4)"}
              </span>
            </div>

            <div className="pt-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Launch Progress</p>
              <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="w-[100%] h-full bg-gradient-to-r from-shl-500 to-emerald-500 rounded-full" />
              </div>
            </div>
            
            <button className="w-full btn-premium py-4 text-xs">
              Generate Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
