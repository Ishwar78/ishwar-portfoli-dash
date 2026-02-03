import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { AnimatedCard } from './AnimatedCard';
import { SectionHeader } from './SectionHeader';
import { GlowingOrb } from './GlowingOrb';

export function FeaturedProjectsSection() {
  const { siteSettings, projects } = usePortfolio();
  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);

  if (featuredProjects.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background orbs */}
      <GlowingOrb className="bg-primary/10 -top-20 -left-20" size="lg" delay={0} />
      <GlowingOrb className="bg-accent/20 -bottom-10 -right-20" size="md" delay={2} />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader
          label={siteSettings.featuredProjectsLabel || 'Portfolio'}
          heading={siteSettings.featuredProjectsHeading || 'Featured Projects'}
          description={siteSettings.featuredProjectsDescription || 'A selection of my recent work and personal projects'}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => (
            <AnimatedCard key={project.id} index={index}>
              <Link to={`/projects/${project.id}`}>
                <div className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                  {project.images[0] && (
                    <div className="aspect-video overflow-hidden relative">
                      <motion.img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
                      <motion.div 
                        className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {project.shortDescription}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.slice(0, 3).map((tech, techIndex) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 + techIndex * 0.05 }}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium hover:bg-primary/20 transition-colors"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </AnimatedCard>
          ))}
        </div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/projects">
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary/30 hover:bg-primary/10 hover:border-primary/50 group"
            >
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
