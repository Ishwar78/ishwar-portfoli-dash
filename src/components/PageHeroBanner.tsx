import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageHeroBannerProps {
  title: string;
  description: string;
  icon?: ReactNode;
  subtitle?: string;
  pattern?: 'dots' | 'grid' | 'waves' | 'circuit' | 'hexagons' | 'diagonal';
}

const patterns = {
  dots: (
    <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  ),
  grid: (
    <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.8" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  ),
  waves: (
    <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1200 200">
      <path d="M0,80 C200,20 400,140 600,80 C800,20 1000,140 1200,80 L1200,200 L0,200 Z" fill="currentColor" opacity="0.3" />
      <path d="M0,120 C200,60 400,180 600,120 C800,60 1000,180 1200,120 L1200,200 L0,200 Z" fill="currentColor" opacity="0.2" />
    </svg>
  ),
  circuit: (
    <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="circuit" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="2" fill="currentColor" />
          <path d="M30,0 L30,28 M30,32 L30,60 M0,30 L28,30 M32,30 L60,30" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <circle cx="0" cy="0" r="1" fill="currentColor" />
          <circle cx="60" cy="0" r="1" fill="currentColor" />
          <circle cx="0" cy="60" r="1" fill="currentColor" />
          <circle cx="60" cy="60" r="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit)" />
    </svg>
  ),
  hexagons: (
    <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hexagons" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse">
          <path d="M28,2 L54,27 L54,73 L28,98 L2,73 L2,27 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hexagons)" />
    </svg>
  ),
  diagonal: (
    <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="diagonal" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M0,16 L16,0" stroke="currentColor" strokeWidth="0.5" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#diagonal)" />
    </svg>
  ),
};

export function PageHeroBanner({
  title,
  description,
  icon,
  subtitle,
  pattern = 'dots',
}: PageHeroBannerProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/[0.03] via-accent/[0.02] to-transparent mb-8">
      {/* Pattern background */}
      <div className="text-foreground">{patterns[pattern]}</div>

      {/* Decorative gradient orbs */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 text-center">
        {icon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-6"
          >
            {icon}
          </motion.div>
        )}
        {subtitle && (
          <motion.span
            className="text-primary text-sm font-semibold uppercase tracking-widest mb-4 block"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.35 }}
          >
            {subtitle}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-muted-foreground max-w-2xl mx-auto"
        >
          {description}
        </motion.p>
      </div>
    </div>
  );
}
