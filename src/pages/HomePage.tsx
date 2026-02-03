import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedProjectsSection } from '@/components/home/FeaturedProjectsSection';
import { SkillsPreviewSection } from '@/components/home/SkillsPreviewSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { BlogCarousel } from '@/components/home/BlogCarousel';
import { CTASection } from '@/components/home/CTASection';
import { FloatingParticles } from '@/components/home/FloatingParticles';

export default function HomePage() {
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
