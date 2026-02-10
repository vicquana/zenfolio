import React, { useState, useEffect } from 'react';
import { ProjectGrid } from './components/ProjectGrid';
import { TokenGate } from './components/TokenGate';
import { fetchProjects } from './services/vercelService';
import { ProjectData } from './types';
import { MOCK_PROJECTS } from './constants';
import { Disc, Search, X, Filter, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filtering State
  const [selectedFramework, setSelectedFramework] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
    setSelectedFramework('All');
  };

  // Compute unique frameworks for the dropdown
  const uniqueFrameworks = Array.from(new Set(projects.map(p => p.framework))).sort();
  const frameworks = ['All', ...uniqueFrameworks];

  const filteredProjects = projects.filter(p => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchLower) || 
                          p.framework.toLowerCase().includes(searchLower);
    
    const matchesFramework = selectedFramework === 'All' || p.framework === selectedFramework;
    
    return matchesSearch && matchesFramework;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-slate-700 selection:text-white font-sans antialiased">
      
      {/* Background Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-white/5 pb-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-slate-100">
              <div className="p-2 bg-white/5 rounded-lg border border-white/5 backdrop-blur-sm">
                 <Disc className="animate-spin-slow" size={24} />
              </div>
              <h1 className="text-3xl font-medium tracking-tight">ZenFolio OS</h1>
            </div>
            <p className="text-slate-500 max-w-md text-sm leading-relaxed">
              A curated space for digital artifacts. 
              <span className="block opacity-50 text-xs mt-1 font-mono">System Status: {loading ? 'SYNCING...' : 'ONLINE'}</span>
            </p>
          </div>

          {token && (
            <div className="flex flex-col md:items-end gap-4 w-full md:w-auto">
              
              <div className="flex items-center gap-2 w-full md:w-auto">
                {/* Framework Filter Dropdown */}
                <div className="relative z-50">
                  <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`
                      flex items-center gap-2 h-10 px-4 rounded-full border text-sm transition-all duration-300
                      ${selectedFramework !== 'All' 
                        ? 'bg-slate-200 text-slate-950 border-slate-200 hover:bg-white' 
                        : 'bg-slate-900/50 border-white/10 text-slate-300 hover:border-white/20 hover:bg-slate-800/50'
                      }
                    `}
                  >
                    <Filter size={14} />
                    <span className="hidden sm:inline font-medium">{selectedFramework === 'All' ? 'Filter' : selectedFramework}</span>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isFilterOpen && (
                      <>
                        <div className="fixed inset-0" onClick={() => setIsFilterOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute right-0 top-full mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden py-1"
                        >
                          <div className="max-h-64 overflow-y-auto custom-scrollbar">
                            {frameworks.map((fw) => (
                              <button
                                key={fw}
                                onClick={() => {
                                  setSelectedFramework(fw);
                                  setIsFilterOpen(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-white/5 transition-colors text-slate-300 hover:text-white group"
                              >
                                <span>{fw}</span>
                                {selectedFramework === fw && <Check size={14} className="text-white" />}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Search Input */}
                <div className="relative group flex-grow md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-slate-300 transition-colors" size={14} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full bg-slate-900/50 border border-white/10 rounded-full h-10 pl-9 pr-4 text-sm text-slate-300 focus:outline-none focus:border-slate-600 transition-all placeholder-slate-600"
                  />
                </div>
              </div>

              <button onClick={handleLogout} className="text-xs text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1 self-end mr-1">
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