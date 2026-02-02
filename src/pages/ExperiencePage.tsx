import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';

export default function ExperiencePage() {
  const { experiences } = usePortfolio();

  const sortedExperiences = [...experiences].sort((a, b) => {
    if (a.current) return -1;
    if (b.current) return 1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Work Experience</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              My professional journey and career milestones
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />

              {sortedExperiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative mb-8 md:mb-12 ${
                    index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-auto'
                  }`}
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-0 md:left-1/2 w-4 h-4 rounded-full border-4 border-background -translate-x-1/2 ${
                      experience.current ? 'gradient-bg' : 'bg-muted-foreground'
                    }`}
                    style={{ top: '24px' }}
                  />

                  {/* Card */}
                  <div
                    className={`ml-6 md:ml-0 ${
                      index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                    }`}
                  >
                    <div className="bg-card rounded-lg border border-border p-6 card-hover">
                      {experience.current && (
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium gradient-bg text-white mb-3">
                          Current
                        </span>
                      )}
                      <h3 className="text-xl font-bold mb-1">{experience.role}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground mb-3">
                        <Briefcase className="h-4 w-4" />
                        <span>{experience.company}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Calendar className="h-4 w-4" />
                        <span>{experience.duration}</span>
                      </div>
                      <p className="text-muted-foreground">{experience.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
