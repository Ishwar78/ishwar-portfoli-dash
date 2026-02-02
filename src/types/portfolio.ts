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

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AboutContent {
  bio: string;
  careerSummary: string;
  education: string;
  profileImage?: string;
  highlights: string[];
}

export interface SiteSettings {
  name: string;
  role: string;
  tagline: string;
  email: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
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
