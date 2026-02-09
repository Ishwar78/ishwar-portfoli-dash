import { motion, useInView } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';
import { useRef } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { PageHeroBanner } from '@/components/PageHeroBanner';

interface TimelineCardProps {
  experience: {
    id: string;
    role: string;
    company: string;
    duration: string;
    description: string;
    current: boolean;
  };
  index: number;
}

function TimelineCard({ experience, index }: TimelineCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
      transition={{ 
        delay: index * 0.1,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={`relative mb-8 md:mb-12 ${
        index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-auto'
      }`}
    >
      {/* Timeline dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ 
          delay: index * 0.1 + 0.1,
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className={`absolute left-0 md:left-1/2 w-4 h-4 rounded-full border-4 border-background -translate-x-1/2 ${
          experience.current ? 'gradient-bg' : 'bg-muted-foreground'
        }`}
        style={{ top: '24px' }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.97 }}
        transition={{ 
          delay: index * 0.1 + 0.15,
          duration: 0.35,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className={`ml-6 md:ml-0 ${
          index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
        }`}
      >
        <div className="bg-card rounded-lg border border-border p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30">
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
      </motion.div>
    </motion.div>
  );
}

export default function ExperiencePage() {
  const { experiences } = usePortfolio();
  const timelineRef = useRef(null);
  const timelineInView = useInView(timelineRef, { once: true, margin: '-100px' });

  const sortedExperiences = [...experiences].sort((a, b) => {
    if (a.current) return -1;
    if (b.current) return 1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <MainLayout>
      <PageHeroBanner
        title="Work Experience"
        description="My professional journey and career milestones"
        icon={<Briefcase className="h-7 w-7" />}
        pattern="grid"
      />
      <div className="pb-20">
        <div className="container mx-auto px-4">

          {/* Timeline */}
          <div className="max-w-3xl mx-auto">
            <div className="relative" ref={timelineRef}>
              {/* Timeline line */}
              <motion.div 
                className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2"
                initial={{ scaleY: 0, originY: 0 }}
                animate={timelineInView ? { scaleY: 1 } : { scaleY: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              />

              {sortedExperiences.map((experience, index) => (
                <TimelineCard key={experience.id} experience={experience} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
