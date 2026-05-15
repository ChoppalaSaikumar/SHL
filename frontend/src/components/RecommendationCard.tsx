import React, { useState } from 'react';
import { ExternalLink, Clock, Target, ChevronRight, TrendingUp, Copy, CheckCircle2 } from 'lucide-react';
import { Recommendation } from '../store/useChatStore';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  rec: Recommendation;
  index: number;
}

const RecommendationCard: React.FC<Props> = ({ rec, index }) => {
  const [copied, setCopied] = useState(false);
  const matchScore = 95 - (index * 4);

  const handleCopy = () => {
    navigator.clipboard.writeText(rec.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bento-card group cursor-default relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-5">
        <div className="flex gap-2">
          <span className="badge-ai bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-none">
            {rec.test_type || 'K'}
          </span>
          <span className="px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border dark:border-white/5">
            {rec.category || 'Standard'}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
          <TrendingUp size={12} />
          {matchScore}% Match
        </div>
      </div>

      <h3 className="font-display font-black text-xl text-slate-900 dark:text-white group-hover:text-shl-500 transition-colors mb-3 tracking-tight">
        {rec.name}
      </h3>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Clock size={14} className="text-shl-500" />
          {rec.duration || '20m'}
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Ready to Deploy
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <Target size={16} className="text-shl-500" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Measured Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {rec.skills_measured?.split(',').map((skill, i) => (
                <span key={i} className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-shl-500/5 text-shl-600 dark:text-shl-400 border border-shl-500/10">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t dark:border-white/5 flex items-center gap-3">
        <motion.a
          whileHover={{ x: 3 }}
          href={rec.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 btn-premium text-[10px] py-3 px-4"
        >
          View Assessment
          <ChevronRight size={14} />
        </motion.a>
        
        <button 
          onClick={handleCopy}
          className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-slate-400 hover:text-shl-500 hover:border-shl-500/50 transition-all relative"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <CheckCircle2 size={18} className="text-emerald-500" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Copy size={18} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
