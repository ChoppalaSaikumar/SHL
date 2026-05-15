import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ChatInterface from './components/ChatInterface';
import RecommendationCard from './components/RecommendationCard';
import AdminDashboard from './components/AdminDashboard';
import ComparisonModal from './components/ComparisonModal';
import { useChatStore } from './store/useChatStore';
import { motion, AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Sparkles, ArrowRight, Zap, Target, ShieldCheck } from 'lucide-react';

const queryClient = new QueryClient();

function App() {
  const [view, setView] = useState<'chat' | 'admin'>('chat');
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const { recommendations } = useChatStore();

  // Force Light Mode on mount
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-500 selection:bg-shl-500/20 antialiased overflow-x-hidden">
        
        {/* Light-optimized Quantum background */}
        <div className="bg-quantum fixed inset-0 z-0 pointer-events-none opacity-30" />

        <div className="relative z-10">
          <Navbar 
            view={view} 
            setView={setView} 
          />

          <main className="pt-28 pb-20 px-4 sm:px-6">
            {view === 'chat' ? (
              <div className="max-w-[1600px] mx-auto">
                
                <AnimatePresence>
                  {recommendations.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center py-16 mb-8"
                    >
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-shl-500/10 border border-shl-500/20 text-shl-600 text-xs font-bold mb-6">
                        <Sparkles size={14} className="text-shl-500" />
                        Next-Gen AI Talent Intelligence
                      </div>
                      <h1 className="text-hero text-neon leading-[1.1] text-5xl md:text-7xl font-black tracking-tighter mb-6">
                        Precision <br />
                        Assessment Strategy.
                      </h1>
                      <p className="max-w-2xl mx-auto text-lg text-slate-500 mb-10 font-medium">
                        Empowering HR leaders with AI-driven SHL recommendations. 
                        Optimize your hiring workflow with natural conversation.
                      </p>
                      
                      <div className="flex flex-wrap justify-center gap-8 opacity-40">
                        {[Zap, Target, ShieldCheck].map((Icon, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm font-bold">
                            <Icon size={18} className="text-shl-500" />
                            {['AI Grounded', 'Role Specific', 'Enterprise Secured'][i]}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <motion.div 
                    layout
                    className={`${recommendations.length > 0 ? 'lg:col-span-7' : 'lg:col-span-8 lg:col-start-3'} transition-all duration-700 ease-in-out`}
                  >
                    <div className="bento-card border-glow p-0 overflow-hidden h-[720px] flex flex-col shadow-2xl bg-white/80">
                      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white/50 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-50">Consultant Online</span>
                        </div>
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                        </div>
                      </div>
                      <ChatInterface />
                    </div>
                  </motion.div>
                  
                  <AnimatePresence>
                    {recommendations.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="lg:col-span-5 flex flex-col h-[720px]"
                      >
                        <div className="flex items-center justify-between mb-6 px-2">
                          <div>
                            <h3 className="font-display font-black text-2xl tracking-tight text-slate-900">Recommended</h3>
                            <p className="text-[10px] text-shl-500 font-black uppercase tracking-widest">Matched Assessments</p>
                          </div>
                          <button 
                            onClick={() => setIsCompareOpen(true)}
                            className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-shl-500 transition-all"
                          >
                            Compare Analysis
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                          {recommendations.map((rec, i) => (
                            <RecommendationCard key={i} rec={rec} index={i} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AdminDashboard />
              </motion.div>
            )}
          </main>
        </div>

        <ComparisonModal 
          isOpen={isCompareOpen} 
          onClose={() => setIsCompareOpen(false)} 
          items={recommendations} 
        />
      </div>
    </QueryClientProvider>
  );
}

export default App;
