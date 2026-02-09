import React, { useState, useEffect } from 'react';
import { ProjectGrid } from './components/ProjectGrid';
import { TokenGate } from './components/TokenGate';
import { fetchProjects } from './services/vercelService';
import { ProjectData } from './types';
import { MOCK_PROJECTS } from './constants';
import { Command, Disc, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Effect to load token from session storage for persistence during session
  useEffect(() => {
    const savedToken = sessionStorage.getItem('vercel_token');
    if (savedToken) {
      handleConnect(savedToken);
    }
  }, []);

  const handleConnect = async (inputToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProjects(inputToken);
      setProjects(data);
      setToken(inputToken);
      sessionStorage.setItem('vercel_token', inputToken);
    } catch (err: any) {
      setError(err.message || "Failed to connect");
      sessionStorage.removeItem('vercel_token');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    setLoading(true);
    // Simulate network delay for the vibe
    setTimeout(() => {
      setProjects(MOCK_PROJECTS);
      setToken('demo-mode');
      setLoading(false);
    }, 1500);
  };

  const handleLogout = () => {
    setToken(null);
    setProjects([]);
    sessionStorage.removeItem('vercel_token');
    setSearchQuery('');
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.framework.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-slate-700 selection:text-white font-sans antialiased">
      
      {/* Background Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-white/5 pb-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-slate-100">
              <div className="p-2 bg-white/5 rounded-lg border border-white/5 backdrop-blur-sm">
                 <Disc className="animate-spin-slow" size={24} />
              </div>
              <h1 className="text-3xl font-serif font-medium tracking-wide">ZenFolio OS</h1>
            </div>
            <p className="text-slate-500 max-w-md text-sm leading-relaxed">
              A curated space for digital artifacts. 
              <span className="block opacity-50 text-xs mt-1 font-mono">System Status: {loading ? 'SYNCING...' : 'ONLINE'}</span>
            </p>
          </div>

          {token && (
            <div className="flex flex-col md:items-end gap-4 w-full md:w-auto">
              <div className="relative group w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-slate-300 transition-colors" size={14} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter artifacts..."
                  className="w-full bg-slate-900/50 border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm text-slate-300 focus:outline-none focus:border-slate-600 transition-all placeholder-slate-600"
                />
              </div>
              <button onClick={handleLogout} className="text-xs text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1 self-end">
                Disconnect <X size={10} />
              </button>
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main>
          <AnimatePresence mode="wait">
            {!token ? (
              <motion.div
                key="gate"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <TokenGate onConnect={handleConnect} onDemo={handleDemo} error={error} />
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                 <ProjectGrid projects={filteredProjects} isLoading={loading} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-white/5 flex justify-between items-center text-xs text-slate-600 font-mono">
          <div className="flex gap-4">
            <span>COMMAND+K</span>
            <span>ESC</span>
          </div>
          <div className="opacity-50">
            DESIGNED FOR VERCEL
          </div>
        </footer>

      </div>
    </div>
  );
}
