import { motion, useInView } from 'framer-motion';
import { Code2, Server, Database, Wrench } from 'lucide-react';
import { useRef } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Progress } from '@/components/ui/progress';

const categoryIcons = {
  frontend: Code2,
  backend: Server,
  database: Database,
  tools: Wrench,
};

const categoryLabels = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  tools: 'Tools & Technologies',
};

interface SkillCardProps {
  skill: {
    id: string;
    name: string;
    level: number;
  };
  index: number;
}

function SkillCard({ skill, index }: SkillCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -30, scale: 0.95 }}
      transition={{ 
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="bg-card rounded-lg border border-border p-4 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">{skill.name}</span>
        <motion.span 
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: index * 0.08 + 0.3 }}
        >
          {skill.level}%
        </motion.span>
      </div>
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/70 rounded-full"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ 
            delay: index * 0.08 + 0.2,
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
      </div>
    </motion.div>
  );
}

interface CategorySectionProps {
  category: keyof typeof categoryIcons;
  skills: Array<{ id: string; name: string; level: number }>;
  categoryIndex: number;
}

function CategorySection({ category, skills, categoryIndex }: CategorySectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const Icon = categoryIcons[category];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ 
        delay: categoryIndex * 0.15,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <motion.div 
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ delay: categoryIndex * 0.15 + 0.1 }}
      >
        <motion.div 
          className="p-2 rounded-lg gradient-bg text-primary-foreground"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <Icon className="h-5 w-5" />
        </motion.div>
        <h2 className="text-2xl font-bold">{categoryLabels[category]}</h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        {skills.map((skill, skillIndex) => (
          <SkillCard key={skill.id} skill={skill} index={skillIndex} />
        ))}
      </div>
    </motion.div>
  );
}

export default function SkillsPage() {
  const { skills } = usePortfolio();

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  const categories = Object.keys(skillsByCategory) as Array<keyof typeof categoryIcons>;

  return (
    <MainLayout>
      <div className="py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.span 
              className="text-primary text-sm font-semibold uppercase tracking-widest mb-4 block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Expertise
            </motion.span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Skills & Technologies</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Technologies and tools I use to build amazing products
            </p>
          </motion.div>

          {/* Skills Grid */}
          <div className="max-w-5xl mx-auto space-y-16">
            {categories.map((category, categoryIndex) => (
              <CategorySection
                key={category}
                category={category}
                skills={skillsByCategory[category]}
                categoryIndex={categoryIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
