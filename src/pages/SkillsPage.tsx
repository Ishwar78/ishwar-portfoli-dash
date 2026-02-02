import { motion } from 'framer-motion';
import { Code2, Server, Database, Wrench } from 'lucide-react';
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Skills & Expertise</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Technologies and tools I use to build amazing products
            </p>
          </motion.div>

          {/* Skills Grid */}
          <div className="max-w-5xl mx-auto space-y-12">
            {categories.map((category, categoryIndex) => {
              const Icon = categoryIcons[category];
              const categorySkills = skillsByCategory[category];

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg gradient-bg text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-2xl font-bold">{categoryLabels[category]}</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {categorySkills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                        className="bg-card rounded-lg border border-border p-4"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-sm text-muted-foreground">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
