import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedProjectsSection } from '@/components/home/FeaturedProjectsSection';
import { SkillsPreviewSection } from '@/components/home/SkillsPreviewSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { BlogCarousel } from '@/components/home/BlogCarousel';
import { CTASection } from '@/components/home/CTASection';
import { FloatingParticles } from '@/components/home/FloatingParticles';
import { useSEO, DOMAIN } from '@/hooks/useSEO';

export default function HomePage() {
  useSEO({
    title: 'Ishwar | Web Developer & Full Stack Developer | ishwarweb.in',
    description: 'Ishwar - Professional Web Developer & Full Stack Developer. Expert in React, Node.js, TypeScript. Hire a skilled web developer for your next project.',
    keywords: 'web developer, full stack developer, Ishwar, ishwarweb.in, React developer, Node.js, TypeScript, freelance web developer, hire web developer, software engineer',
    canonical: DOMAIN,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      mainEntity: {
        '@type': 'Person',
        name: 'Ishwar',
        jobTitle: 'Full Stack Web Developer',
        url: DOMAIN,
        description: 'Professional Web Developer specializing in React, Node.js and modern web technologies',
      },
    },
  });
  return (
    <MainLayout>
      {/* Floating particles background */}
      <FloatingParticles />
      
      {/* Hero Section with Image */}
      <HeroSection />

      {/* Featured Projects */}
      <FeaturedProjectsSection />

      {/* Skills Preview */}
      <SkillsPreviewSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Blog Carousel Section */}
      <BlogCarousel />

      {/* CTA Section */}
      <CTASection />
    </MainLayout>
  );
}
