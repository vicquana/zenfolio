import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, ArrowRight } from 'lucide-react';

interface TokenGateProps {
  onConnect: (token: string) => void;
  onDemo: () => void;
  error?: string | null;
}

export const TokenGate: React.FC<TokenGateProps> = ({ onConnect, onDemo, error }) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) onConnect(token.trim());
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800/50 text-slate-300 border border-white/10 mb-6">
            <KeyRound size={20} />
          </div>
          <h2 className="text-3xl text-slate-100 mb-3 tracking-tight font-light">Enter the Gate</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Connect your Vercel Read-Only Token to visualize your digital creations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Vercel Access Token"
              className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-4 text-center text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-500 focus:bg-slate-900/80 transition-all duration-300 font-mono text-sm"
            />
            <div className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
          </div>

          <button
            type="submit"
            disabled={!token}
            className="w-full bg-white text-slate-950 font-medium py-3.5 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center gap-2"
          >
            Authenticate <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-6 text-center">
             <button 
              onClick={onDemo}
              className="text-xs text-slate-500 hover:text-slate-300 underline decoration-slate-700 underline-offset-4 transition-colors"
            >
              Enter demo mode (Mock Data)
            </button>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-3 rounded bg-red-950/30 border border-red-500/20 text-red-400 text-xs text-center font-mono"
          >
            {error}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};