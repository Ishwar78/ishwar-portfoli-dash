import { motion } from 'framer-motion';
import { User, Briefcase, GraduationCap, Award } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';

export default function AboutPage() {
  const { aboutContent, siteSettings } = usePortfolio();

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Me</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get to know more about my journey and what drives me
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Profile Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col md:flex-row gap-8 items-start mb-16"
            >
              {aboutContent.profileImage ? (
                <img
                  src={aboutContent.profileImage}
                  alt={siteSettings.name}
                  className="w-48 h-48 rounded-2xl object-cover border border-border"
                />
              ) : (
                <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-6xl font-bold text-white">
                    {siteSettings.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold mb-2">{siteSettings.name}</h2>
                <p className="text-muted-foreground mb-4">{siteSettings.role}</p>
                <p className="text-foreground leading-relaxed">{aboutContent.bio}</p>
              </div>
            </motion.div>

            {/* Career Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-accent">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold">Career Summary</h2>
              </div>
              <div className="bg-card rounded-lg border border-border p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {aboutContent.careerSummary}
                </p>
              </div>
            </motion.div>

            {/* Education */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-accent">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold">Education</h2>
              </div>
              <div className="bg-card rounded-lg border border-border p-6">
                <p className="text-muted-foreground">{aboutContent.education}</p>
              </div>
            </motion.div>

            {/* Highlights */}
            {aboutContent.highlights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-accent">
                    <Award className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold">Highlights</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aboutContent.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="bg-card rounded-lg border border-border p-4 flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full gradient-bg" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
