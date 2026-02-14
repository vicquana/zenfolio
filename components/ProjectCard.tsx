import React, { useMemo, useState } from 'react';
import { ProjectData } from '../types';
import { GlassCard } from './ui/GlassCard';
import { cleanUrl, timeAgo } from '../utils/formatters';
import { ExternalLink, Circle, Layers } from 'lucide-react';

interface ProjectCardProps {
  project: ProjectData;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [previewFailed, setPreviewFailed] = useState(false);
  const normalizedProjectUrl = (() => {
    if (!project.url) return null;
    const candidate = project.url.startsWith('http') ? project.url : `https://${project.url}`;
    try {
      return new URL(candidate).toString();
    } catch {
      return null;
    }
  })();
  const hasProjectUrl = Boolean(normalizedProjectUrl);
  const previewImageUrl = useMemo(() => {
    if (!normalizedProjectUrl) return null;
    return `https://image.thum.io/get/width/1200/crop/675/noanimate/${normalizedProjectUrl}`;
  }, [normalizedProjectUrl]);

  const openProject = () => {
    if (!normalizedProjectUrl) return;
    window.open(normalizedProjectUrl, '_blank', 'noopener,noreferrer');
  };

  const statusColor = {
    READY: 'text-emerald-400',
    ERROR: 'text-rose-400',
    BUILDING: 'text-amber-400',
    UNKNOWN: 'text-slate-400',
  }[project.status] || 'text-slate-400';

  return (
    <GlassCard
      hoverEffect={true}
      className={`group flex flex-col h-full ${hasProjectUrl ? 'cursor-pointer' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onClick={hasProjectUrl ? openProject : undefined}
      onKeyDown={
        hasProjectUrl
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openProject();
              }
            }
          : undefined
      }
      role={hasProjectUrl ? 'link' : undefined}
      tabIndex={hasProjectUrl ? 0 : undefined}
    >
      {/* Visual Preview Area */}
      <div className="relative aspect-video w-full overflow-hidden border-b border-white/5 bg-gradient-to-br from-slate-900/80 via-slate-850/40 to-slate-950">
        {hasProjectUrl && previewImageUrl && !previewFailed ? (
          <img
            src={previewImageUrl}
            alt={`${project.name} preview`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
            onError={() => setPreviewFailed(true)}
          />
        ) : null}
        {hasProjectUrl && previewFailed ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 px-4 text-center">
            <span className="text-xs text-slate-300 font-mono">Preview unavailable. Click to open site.</span>
          </div>
        ) : null}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_45%)]" />
        <div className="relative z-10 h-full w-full flex flex-col items-start justify-end p-4">
          <p className="text-[11px] uppercase tracking-widest text-slate-500">Project</p>
          <p className="text-sm text-slate-200 font-medium truncate w-full">{project.name}</p>
        </div>

        {/* Overlay Action */}
        <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
           {hasProjectUrl && (
             <span
              className="px-4 py-2 bg-white text-slate-950 rounded-full font-medium text-sm flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl shadow-white/5"
             >
               Visit Site <ExternalLink size={14} />
             </span>
           )}
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
            {hasProjectUrl ? cleanUrl(normalizedProjectUrl!) : 'No deployment URL'}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-2 group-hover:border-white/10 transition-colors duration-300">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/40 border border-white/5 text-[10px] font-medium uppercase tracking-wider text-slate-400 group-hover:bg-slate-800/80 group-hover:text-slate-200 group-hover:border-white/10 transition-all duration-300 transform group-hover:scale-105 origin-left">
              <Layers size={10} strokeWidth={2.5} className="opacity-70" />
              {project.framework}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-600 font-medium transition-all duration-300 group-hover:text-slate-400 group-hover:scale-105 origin-right">
              {timeAgo(project.updatedAt)}
            </span>
            {hasProjectUrl ? (
              <span className="text-xs text-slate-300 underline underline-offset-4 transition-colors">
                Visit site
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
