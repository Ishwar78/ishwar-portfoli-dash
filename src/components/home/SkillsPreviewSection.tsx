import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { SectionHeader } from './SectionHeader';

export function SkillsPreviewSection() {
  const { siteSettings, skills } = usePortfolio();
  const topSkills = skills.slice(0, 6);

  return (
    <section className="py-24 bg-gradient-to-b from-background via-accent/30 to-background relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader
          label={siteSettings.skillsLabel || 'Expertise'}
          heading={siteSettings.skillsHeading || 'Skills & Technologies'}
          description={siteSettings.skillsDescription || 'Technologies I use to bring ideas to life'}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
          {topSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                delay: index * 0.08,
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              whileHover={{ 
                y: -10,
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.2 }
              }}
              className="group p-6 bg-card/80 backdrop-blur-sm rounded-xl border border-border hover:border-primary/50 text-center transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 + 0.2, type: "spring", stiffness: 200 }}
                className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
              >
                <span className="text-2xl font-bold text-primary">{skill.name.charAt(0)}</span>
              </motion.div>
              <p className="font-semibold group-hover:text-primary transition-colors">{skill.name}</p>
              <p className="text-xs text-muted-foreground capitalize mt-1">{skill.category}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/skills">
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary/30 hover:bg-primary/10 hover:border-primary/50 group"
            >
              View All Skills
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
