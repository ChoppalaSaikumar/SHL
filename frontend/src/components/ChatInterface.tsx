import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../store/useChatStore';
import { chatService } from '../services/api';
import ReactMarkdown from 'react-markdown';

const ChatInterface: React.FC = () => {
  const { messages, addMessage, isLoading, setLoading, recommendations, setRecommendations, setEndOfConversation } = useChatStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: input };
    addMessage(userMessage);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMessage];
      const response = await chatService.sendMessage(history);
      
      addMessage({ role: 'assistant', content: response.reply });
      setRecommendations(response.recommendations);
      setEndOfConversation(response.end_of_conversation);
    } catch (error) {
      console.error(error);
      addMessage({ 
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble connecting to the server. Please check your connection and try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/5 dark:bg-black/5">
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scroll-smooth custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                    msg.role === 'user' 
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' 
                      : 'bg-shl-600 text-white'
                  }`}
                >
                  {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                </motion.div>
                
                <div className={`space-y-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`px-5 py-4 rounded-[2rem] shadow-sm text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'chat-bubble-user rounded-tr-none' 
                      : 'chat-bubble-ai dark:text-slate-200 rounded-tl-none'
                  }`}>
                    <ReactMarkdown className="prose dark:prose-invert prose-sm">
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                  <span className="text-[10px] font-bold opacity-30 uppercase tracking-tighter px-2">
                    {msg.role === 'user' ? 'You' : 'SHL Consultant'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-start"
          >
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-shl-600 text-white flex items-center justify-center shadow-lg animate-pulse">
                <Bot size={18} />
              </div>
              <div className="px-6 py-4 chat-bubble-ai rounded-[2rem] rounded-tl-none flex items-center gap-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                      className="w-1.5 h-1.5 bg-shl-500 rounded-full"
                    />
                  ))}
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-shl-600 opacity-60">Consulting Catalog</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={scrollRef} className="h-4" />
      </div>

      <div className="p-6 relative">
        <div className="max-w-3xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-shl-500 to-indigo-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-focus-within:opacity-50" />
          
          <div className="relative flex items-center gap-3 glass-panel p-2 rounded-[2.5rem] shadow-2xl animate-glow">
            <div className="pl-4 text-slate-400">
              <Command size={18} />
            </div>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about SHL assessments..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 dark:text-white outline-none placeholder:text-slate-400 font-medium"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-shl-600 hover:bg-shl-700 disabled:opacity-50 text-white p-3 rounded-full transition-all shadow-lg shadow-shl-600/30"
            >
              <Send size={20} />
            </motion.button>
          </div>
        </div>
        
        <p className="text-center mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Powered by SHL Intelligence • Trusted by 10k+ Recruiters
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
