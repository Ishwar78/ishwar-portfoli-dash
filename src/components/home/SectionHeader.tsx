import { motion } from 'framer-motion';

interface SectionHeaderProps {
  label: string;
  heading: string;
  description: string;
}

export function SectionHeader({ label, heading, description }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="text-center mb-16"
    >
      <motion.span 
        className="text-primary text-sm font-semibold uppercase tracking-widest mb-4 block"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {label}
      </motion.span>
      <motion.h2 
        className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {heading}
      </motion.h2>
      <motion.p 
        className="text-muted-foreground max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
}
