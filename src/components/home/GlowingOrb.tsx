import { motion } from 'framer-motion';

interface GlowingOrbProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  delay?: number;
}

const sizeClasses = {
  sm: 'w-32 h-32',
  md: 'w-64 h-64',
  lg: 'w-96 h-96',
};

export function GlowingOrb({ className = '', size = 'md', delay = 0 }: GlowingOrbProps) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${sizeClasses[size]} ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}
