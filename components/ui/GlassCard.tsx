import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hoverEffect = false,
  ...props 
}) => {
  return (
    <motion.div
      className={`
        relative overflow-hidden
        bg-slate-900/40 
        backdrop-blur-md 
        border border-white/5 
        rounded-xl
        ${hoverEffect ? 'hover:bg-slate-800/50 hover:border-white/10 transition-colors duration-300' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Noise texture overlay for that analog warmth/wabisabi feel */}
      <div className="noise-overlay absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-overlay" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
