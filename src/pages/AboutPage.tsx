import { motion, useInView } from 'framer-motion';
import { Briefcase, GraduationCap, Award, Lightbulb, Building2 } from 'lucide-react';
import { useRef } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Animation variants following minimal, professional guidelines
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

function AnimatedSection({ children, className, delay = 0 }: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            delay,
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
}

function AnimatedCard({ children, className, index = 0 }: AnimatedCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, scale: 0.97 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            delay: index * 0.08,
            duration: 0.35,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  const { aboutContent, siteSettings, skills, experiences } = usePortfolio();

  // Handle legacy string format for education
  const educationList = Array.isArray(aboutContent.education) 
    ? aboutContent.education 
    : [{ id: '1', degree: String(aboutContent.education || ''), institution: '', year: '' }];

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  const categoryLabels: Record<string, string> = {
    frontend: 'Frontend',
    backend: 'Backend',
    database: 'Database',
    tools: 'Tools & Others',
  };

  // Sort experiences by date
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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Me</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get to know more about my journey and what drives me
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Profile Section */}
            <AnimatedSection className="flex flex-col md:flex-row gap-8 items-start mb-16">
              {aboutContent.profileImage ? (
                <motion.img
                  src={aboutContent.profileImage}
                  alt={siteSettings.name}
                  className="w-48 h-48 rounded-2xl object-cover border border-border"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
              ) : (
                <motion.div 
                  className="w-48 h-48 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-6xl font-bold text-white">
                    {siteSettings.name.charAt(0)}
                  </span>
                </motion.div>
              )}
              <div>
                <h2 className="text-2xl font-bold mb-2">{siteSettings.name}</h2>
                <p className="text-muted-foreground mb-4">{siteSettings.role}</p>
                <p className="text-foreground leading-relaxed">{aboutContent.bio}</p>
              </div>
            </AnimatedSection>

            {/* Career Summary */}
            <AnimatedSection className="mb-12" delay={0.05}>
              <div className="flex items-center gap-3 mb-4">
                <motion.div 
                  className="p-2 rounded-lg bg-accent"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Briefcase className="h-5 w-5" />
                </motion.div>
                <h2 className="text-2xl font-bold">Career Summary</h2>
              </div>
              <AnimatedCard className="bg-card rounded-lg border border-border p-6 hover:border-primary/30 transition-colors duration-300">
                <p className="text-muted-foreground leading-relaxed">
                  {aboutContent.careerSummary}
                </p>
              </AnimatedCard>
            </AnimatedSection>

            {/* Experience Section */}
            {sortedExperiences.length > 0 && (
              <AnimatedSection className="mb-12" delay={0.1}>
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className="p-2 rounded-lg bg-accent"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Building2 className="h-5 w-5" />
                  </motion.div>
                  <h2 className="text-2xl font-bold">Experience</h2>
                </div>
                <div className="space-y-4">
                  {sortedExperiences.map((exp, index) => (
                    <AnimatedCard 
                      key={exp.id} 
                      index={index}
                      className="bg-card rounded-lg border border-border p-6 hover:border-primary/30 transition-colors duration-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{exp.role}</h3>
                        {exp.current && (
                          <Badge variant="secondary" className="w-fit">Current</Badge>
                        )}
                      </div>
                      <p className="text-primary font-medium">{exp.company}</p>
                      <p className="text-muted-foreground text-sm mb-3">{exp.duration}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{exp.description}</p>
                    </AnimatedCard>
                  ))}
                </div>
              </AnimatedSection>
            )}

            {/* Education */}
            <AnimatedSection className="mb-12" delay={0.15}>
              <div className="flex items-center gap-3 mb-4">
                <motion.div 
                  className="p-2 rounded-lg bg-accent"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <GraduationCap className="h-5 w-5" />
                </motion.div>
                <h2 className="text-2xl font-bold">Education</h2>
              </div>
              <div className="space-y-4">
                {educationList.filter(edu => edu.degree).map((edu, index) => (
                  <AnimatedCard 
                    key={edu.id} 
                    index={index}
                    className="bg-card rounded-lg border border-border p-6 hover:border-primary/30 transition-colors duration-300"
                  >
                    <h3 className="font-semibold text-lg mb-1">{edu.degree}</h3>
                    {(edu.institution || edu.year) && (
                      <p className="text-muted-foreground text-sm">
                        {edu.institution}
                        {edu.institution && edu.year && ' • '}
                        {edu.year}
                      </p>
                    )}
                  </AnimatedCard>
                ))}
              </div>
            </AnimatedSection>

            {/* Highlights */}
            {aboutContent.highlights.length > 0 && (
              <AnimatedSection className="mb-12" delay={0.2}>
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className="p-2 rounded-lg bg-accent"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Award className="h-5 w-5" />
                  </motion.div>
                  <h2 className="text-2xl font-bold">Highlights</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aboutContent.highlights.map((highlight, index) => (
                    <AnimatedCard
                      key={index}
                      index={index}
                      className="bg-card rounded-lg border border-border p-4 flex items-center gap-3 hover:border-primary/30 transition-colors duration-300"
                    >
                      <div className="w-2 h-2 rounded-full gradient-bg" />
                      <span>{highlight}</span>
                    </AnimatedCard>
                  ))}
                </div>
              </AnimatedSection>
            )}

            {/* Core Competencies / Skills Section */}
            {skills.length > 0 && (
              <AnimatedSection delay={0.25}>
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className="p-2 rounded-lg bg-accent"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Lightbulb className="h-5 w-5" />
                  </motion.div>
                  <h2 className="text-2xl font-bold">Core Competencies</h2>
                </div>
                <div className="space-y-6">
                  {Object.entries(skillsByCategory).map(([category, categorySkills], catIndex) => (
                    <AnimatedCard 
                      key={category} 
                      index={catIndex}
                      className="bg-card rounded-lg border border-border p-6 hover:border-primary/30 transition-colors duration-300"
                    >
                      <h3 className="font-semibold text-lg mb-4">{categoryLabels[category] || category}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {categorySkills.map((skill) => (
                          <div key={skill.id} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{skill.name}</span>
                              <span className="text-muted-foreground">{skill.level}%</span>
                            </div>
                            <Progress value={skill.level} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </AnimatedCard>
                  ))}
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
