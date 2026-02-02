import { motion } from 'framer-motion';
import { ArrowRight, Download, Github, Linkedin, Mail, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout/MainLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { TypewriterText } from '@/components/home/TypewriterText';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { BlogCarousel } from '@/components/home/BlogCarousel';

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

export default function HomePage() {
  const { siteSettings, projects, skills } = usePortfolio();

  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);
  const topSkills = skills.slice(0, 6);

  const handleDownloadResume = () => {
    // Create a sample resume content - in production, this would link to an actual file
    const resumeUrl = '/resume.pdf';
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = `${siteSettings.name.replace(/\s+/g, '_')}_Resume.pdf`;
    link.click();
  };

  return (
    <MainLayout>
      {/* Hero Section */}
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
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Available for opportunities
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight tracking-tight"
            >
              Hi, I'm{' '}
              <span className="gradient-text">{siteSettings.name}</span>
            </motion.h1>

            <motion.h2
              variants={itemVariants}
              className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-6 font-medium h-[1.5em]"
            >
              <TypewriterText
                texts={[
                  siteSettings.role,
                  'React Developer',
                  'Node.js Engineer',
                  'Problem Solver',
                  'Tech Enthusiast',
                ]}
                typingSpeed={80}
                deletingSpeed={40}
                pauseDuration={2500}
              />
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              {siteSettings.tagline}. I craft elegant, scalable web applications
              using modern technologies like React, Node.js, and cloud platforms.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-4"
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
              className="flex justify-center gap-4 mt-10"
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
              <a
                href={`mailto:${siteSettings.email}`}
                className="p-3 rounded-full bg-card border border-border hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
              >
                <Mail className="h-5 w-5" />
              </a>
            </motion.div>
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

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-4 block">Portfolio</span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Featured Projects</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A selection of my recent work and personal projects
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/projects/${project.id}`}>
                    <div className="group bg-card rounded-xl overflow-hidden border border-border card-hover">
                      {project.images[0] && (
                        <div className="aspect-video overflow-hidden relative">
                          <img
                            src={project.images[0]}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {project.shortDescription}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/projects">
                <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10">
                  View All Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Skills Preview */}
      <section className="py-24 bg-gradient-to-b from-background via-accent/30 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-4 block">Expertise</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Skills & Technologies</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Technologies I use to bring ideas to life
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {topSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group p-6 bg-card rounded-xl border border-border text-center card-hover"
              >
                <p className="font-semibold group-hover:text-primary transition-colors">{skill.name}</p>
                <p className="text-xs text-muted-foreground capitalize mt-1">{skill.category}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/skills">
              <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10">
                View All Skills
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Blog Carousel Section */}
      <BlogCarousel />

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Let's Build Something{' '}
              <span className="gradient-text">Amazing</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Have a project in mind or want to collaborate? I'd love to hear from you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button size="lg" className="gradient-bg text-primary-foreground hover:opacity-90 glow h-12 px-8">
                  Get In Touch
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleDownloadResume}
                className="h-12 px-8 border-primary/30 hover:bg-primary/10"
              >
                Download Resume
                <Download className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}
