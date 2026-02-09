import React from 'react';
import { ProjectData } from '../types';
import { ProjectCard } from './ProjectCard';
import { motion } from 'framer-motion';

interface ProjectGridProps {
  projects: ProjectData[];
  isLoading: boolean;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl aspect-[4/3] bg-slate-900/30 border border-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <p className="font-serif text-lg italic">No projects found in this realm.</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr p-1"
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </motion.div>
  );
};
