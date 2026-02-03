import { motion } from 'framer-motion';
import { ArrowRight, Download, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { GlowingOrb } from './GlowingOrb';

export function CTASection() {
  const { siteSettings } = usePortfolio();

  const handleDownloadResume = () => {
    const resumeUrl = siteSettings.resumeUrl || '/resume.pdf';
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
      <GlowingOrb className="bg-primary/20 top-1/2 left-1/4 -translate-y-1/2" size="lg" delay={0} />
      <GlowingOrb className="bg-accent/30 top-1/2 right-1/4 -translate-y-1/2" size="md" delay={1.5} />
      
      {/* Floating sparkles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/30"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4 + i,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {siteSettings.ctaHeading ? (
              siteSettings.ctaHeading
            ) : (
              <>
                Let's Build Something{' '}
                <motion.span 
                  className="gradient-text inline-block"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  Amazing
                </motion.span>
              </>
            )}
          </motion.h2>
          
          <motion.p 
            className="text-muted-foreground text-lg mb-10"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {siteSettings.ctaDescription || "Have a project in mind or want to collaborate? I'd love to hear from you."}
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/contact">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" className="gradient-bg text-primary-foreground hover:opacity-90 glow h-12 px-8 group">
                  {siteSettings.ctaButtonText || 'Get In Touch'}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleDownloadResume}
                className="h-12 px-8 border-primary/30 hover:bg-primary/10 hover:border-primary/50 group"
              >
                {siteSettings.ctaResumeButtonText || 'Download Resume'}
                <Download className="ml-2 h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
