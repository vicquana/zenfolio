import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProjectData } from '../types';
import { GlassCard } from './ui/GlassCard';
import { cleanUrl, timeAgo } from '../utils/formatters';
import { ExternalLink, Circle, Layers } from 'lucide-react';

interface ProjectCardProps {
  project: ProjectData;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const screenshotUrl = `https://api.microlink.io?url=${encodeURIComponent(project.url)}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1280&viewport.height=800`;

  const statusColor = {
    READY: 'text-emerald-400',
    ERROR: 'text-rose-400',
    BUILDING: 'text-amber-400',
    UNKNOWN: 'text-slate-400',
  }[project.status] || 'text-slate-400';

  return (
    <GlassCard
      hoverEffect={true}
      className="group flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      {/* Visual Preview Area */}
      <div className="relative aspect-video w-full overflow-hidden border-b border-white/5 bg-slate-950/50">
        {/* Loading Shimmer */}
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-slate-800/50" />
        )}
        
        <motion.img
          src={screenshotUrl}
          alt={`${project.name} preview`}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          onLoad={() => setImageLoaded(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
        />

        {/* Overlay Action */}
        <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
           <a 
            href={project.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white text-slate-950 rounded-full font-medium text-sm flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl shadow-white/5"
           >
             Visit Site <ExternalLink size={14} />
           </a>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow justify-between relative z-20">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-slate-100 tracking-tight text-lg transition-all duration-300 group-hover:text-white group-hover:origin-left group-hover:scale-[1.02] group-hover:[text-shadow:0_0_20px_rgba(255,255,255,0.4)]">
              {project.name}
            </h3>
            <div className={`p-1.5 rounded-full bg-slate-800/50 border border-white/5 ${statusColor} group-hover:border-white/10 transition-colors duration-300`}>
               <Circle size={8} fill="currentColor" className={project.status === 'BUILDING' ? 'animate-pulse' : ''} />
            </div>
          </div>
          
          <p className="text-slate-500 text-xs font-mono mb-4 flex items-center gap-1.5 truncate transition-all duration-300 group-hover:text-slate-300 group-hover:origin-left group-hover:scale-[1.02]">
            <ExternalLink size={10} />
            {cleanUrl(project.url)}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-2 group-hover:border-white/10 transition-colors duration-300">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/40 border border-white/5 text-[10px] font-medium uppercase tracking-wider text-slate-400 group-hover:bg-slate-800/80 group-hover:text-slate-200 group-hover:border-white/10 transition-all duration-300 transform group-hover:scale-105 origin-left">
              <Layers size={10} strokeWidth={2.5} className="opacity-70" />
              {project.framework}
            </div>
          </div>
          <span className="text-xs text-slate-600 font-medium transition-all duration-300 group-hover:text-slate-400 group-hover:scale-105 origin-right">
            {timeAgo(project.updatedAt)}
          </span>
        </div>
      </div>
    </GlassCard>
  );
};