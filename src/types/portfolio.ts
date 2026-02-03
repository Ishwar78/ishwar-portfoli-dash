export interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  techStack: string[];
  images: string[];
  readme: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'tools';
  level: number; // 0-100
  icon?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ContactReason = 'hiring-fulltime' | 'hiring-internship' | 'freelance' | 'other';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  reason: ContactReason;
  company?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export interface AboutContent {
  bio: string;
  careerSummary: string;
  education: Education[];
  profileImage?: string;
  highlights: string[];
}

export interface SiteSettings {
  name: string;
  role: string;
  tagline: string;
  heroDescription?: string;
  email: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  typingRoles?: string[];
  heroImage?: string;
  experienceYears?: string;
  resumeUrl?: string;
  showAvailabilityBadge?: boolean;
  viewProjectsText?: string;
  contactMeText?: string;
  downloadCvText?: string;
  ctaHeading?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaResumeButtonText?: string;
  // Section headings
  featuredProjectsLabel?: string;
  featuredProjectsHeading?: string;
  featuredProjectsDescription?: string;
  skillsLabel?: string;
  skillsHeading?: string;
  skillsDescription?: string;
  // Gradient customization
  gradientPreset?: 'blue-cyan' | 'purple-pink' | 'green-teal' | 'orange-red' | 'indigo-violet';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}
