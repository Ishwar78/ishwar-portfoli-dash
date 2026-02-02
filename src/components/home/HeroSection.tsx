import { motion } from 'framer-motion';
import { ArrowRight, Download, Github, Linkedin, Twitter, Mail, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { TypewriterText } from './TypewriterText';
import ishwarProfileDefault from '@/assets/ishwar-profile.jpeg';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function HeroSection() {
  const { siteSettings } = usePortfolio();

  // Use custom hero image if set, otherwise use default
  const heroImage = siteSettings.heroImage || ishwarProfileDefault;
  const experienceYears = siteSettings.experienceYears || '5+ YRS';
  
  // Use custom typing roles if set, otherwise use defaults
  const typingRoles = siteSettings.typingRoles?.length 
    ? siteSettings.typingRoles 
    : [siteSettings.role, 'React Developer', 'Node.js Engineer', 'Problem Solver', 'Tech Enthusiast'];

  const handleDownloadResume = () => {
    const resumeUrl = siteSettings.resumeUrl || '/resume.pdf';
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    }
  };

  return (
    <section className="min-h-[90vh] flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/20 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-float" style={{ animationDelay: '-1.5s' }} />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-accent/30 blur-3xl animate-float" style={{ animationDelay: '-0.7s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
        >
          {/* Profile Image */}
          <motion.div 
            variants={itemVariants}
            className="flex-shrink-0 order-1 lg:order-2"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-accent/50 rounded-2xl blur-2xl opacity-50 animate-pulse" />
              <img
                src={heroImage}
                alt={siteSettings.name}
                className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-cover rounded-2xl border-2 border-primary/20 shadow-2xl"
              />
              {experienceYears && (
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                  {experienceYears}
                </div>
              )}
            </div>
          </motion.div>

          {/* Content */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Available for opportunities
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight tracking-tight"
            >
              Hi, I'm{' '}
              <span className="gradient-text">{siteSettings.name}</span>
            </motion.h1>

            <motion.h2
              variants={itemVariants}
              className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-6 font-medium h-[1.5em]"
            >
              <TypewriterText
                texts={typingRoles}
                typingSpeed={80}
                deletingSpeed={40}
                pauseDuration={2500}
              />
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground mb-10 max-w-2xl leading-relaxed"
            >
              {siteSettings.tagline}. I craft elegant, scalable web applications
              using modern technologies like React, Node.js, and cloud platforms.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center lg:justify-start gap-4"
            >
              <Link to="/projects">
                <Button size="lg" className="gradient-bg text-primary-foreground hover:opacity-90 glow h-12 px-8">
                  View Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="h-12 px-8 border-primary/30 hover:bg-primary/10 hover:border-primary/50">
                  Contact Me
                  <Mail className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="ghost" 
                onClick={handleDownloadResume}
                className="h-12 px-8 hover:bg-primary/10"
              >
                Download CV
                <Download className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center lg:justify-start gap-4 mt-10"
            >
              {siteSettings.github && (
                <a
                  href={siteSettings.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-card border border-border hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              {siteSettings.linkedin && (
                <a
                  href={siteSettings.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-card border border-border hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {siteSettings.twitter && (
                <a
                  href={siteSettings.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-card border border-border hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              <a
                href={`mailto:${siteSettings.email}`}
                className="p-3 rounded-full bg-card border border-border hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
              >
                <Mail className="h-5 w-5" />
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
