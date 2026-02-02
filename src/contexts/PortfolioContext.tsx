import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Project, Skill, Experience, Blog, ContactMessage, AboutContent, SiteSettings } from '@/types/portfolio';

interface PortfolioContextType {
  // Projects
  projects: Project[];
  setProjects: (projects: Project[] | ((prev: Project[]) => Project[])) => void;
  
  // Skills
  skills: Skill[];
  setSkills: (skills: Skill[] | ((prev: Skill[]) => Skill[])) => void;
  
  // Experience
  experiences: Experience[];
  setExperiences: (experiences: Experience[] | ((prev: Experience[]) => Experience[])) => void;
  
  // Blogs
  blogs: Blog[];
  setBlogs: (blogs: Blog[] | ((prev: Blog[]) => Blog[])) => void;
  
  // Contact Messages
  messages: ContactMessage[];
  setMessages: (messages: ContactMessage[] | ((prev: ContactMessage[]) => ContactMessage[])) => void;
  
  // About Content
  aboutContent: AboutContent;
  setAboutContent: (content: AboutContent | ((prev: AboutContent) => AboutContent)) => void;
  
  // Site Settings
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings | ((prev: SiteSettings) => SiteSettings)) => void;
  
  // Admin Auth
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
}

const defaultAboutContent: AboutContent = {
  bio: "I'm a passionate Full Stack Developer with expertise in building modern web applications. I love creating elegant solutions to complex problems and am constantly learning new technologies.",
  careerSummary: "5+ years of experience in software development, specializing in React, Node.js, and cloud technologies. I've worked with startups and enterprises alike, delivering scalable and maintainable solutions.",
  education: "Bachelor's Degree in Computer Science",
  highlights: [
    "Full Stack Development",
    "Cloud Architecture",
    "Team Leadership",
    "Agile Methodologies"
  ],
  profileImage: ""
};

const defaultSiteSettings: SiteSettings = {
  name: "Ishwar",
  role: "Full Stack Developer",
  tagline: "Building digital experiences that matter",
  email: "ishwar@example.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com"
};

const defaultSkills: Skill[] = [
  { id: '1', name: 'React', category: 'frontend', level: 90 },
  { id: '2', name: 'TypeScript', category: 'frontend', level: 85 },
  { id: '3', name: 'Tailwind CSS', category: 'frontend', level: 88 },
  { id: '4', name: 'Next.js', category: 'frontend', level: 82 },
  { id: '5', name: 'Node.js', category: 'backend', level: 85 },
  { id: '6', name: 'Express', category: 'backend', level: 80 },
  { id: '7', name: 'Python', category: 'backend', level: 75 },
  { id: '8', name: 'GraphQL', category: 'backend', level: 70 },
  { id: '9', name: 'PostgreSQL', category: 'database', level: 80 },
  { id: '10', name: 'MongoDB', category: 'database', level: 78 },
  { id: '11', name: 'Redis', category: 'database', level: 65 },
  { id: '12', name: 'Git', category: 'tools', level: 90 },
  { id: '13', name: 'Docker', category: 'tools', level: 75 },
  { id: '14', name: 'AWS', category: 'tools', level: 70 },
  { id: '15', name: 'Figma', category: 'tools', level: 65 },
];

const defaultProjects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A full-featured e-commerce platform with cart, checkout, and payment integration.',
    shortDescription: 'Modern e-commerce solution with React and Node.js',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800'],
    readme: '# E-Commerce Platform\n\nA modern e-commerce solution built with React and Node.js.\n\n## Features\n\n- User authentication\n- Product catalog\n- Shopping cart\n- Secure checkout\n- Payment integration\n\n## Tech Stack\n\n- **Frontend:** React, TypeScript, Tailwind CSS\n- **Backend:** Node.js, Express\n- **Database:** PostgreSQL\n- **Payments:** Stripe',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates.',
    shortDescription: 'Real-time task management for teams',
    techStack: ['React', 'Firebase', 'Tailwind CSS'],
    images: ['https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800'],
    readme: '# Task Management App\n\nA collaborative task management solution.\n\n## Features\n\n- Real-time collaboration\n- Drag and drop\n- Team workspaces\n- Notifications',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const defaultExperiences: Experience[] = [
  {
    id: '1',
    company: 'Tech Company',
    role: 'Senior Full Stack Developer',
    duration: 'Jan 2022 - Present',
    description: 'Leading development of web applications using React and Node.js. Mentoring junior developers and implementing best practices.',
    startDate: '2022-01-01',
    current: true,
  },
  {
    id: '2',
    company: 'Startup Inc',
    role: 'Full Stack Developer',
    duration: 'Jun 2020 - Dec 2021',
    description: 'Developed and maintained multiple client projects. Implemented CI/CD pipelines and improved code quality.',
    startDate: '2020-06-01',
    endDate: '2021-12-31',
    current: false,
  },
];

const defaultBlogs: Blog[] = [
  {
    id: '1',
    title: 'Getting Started with React and TypeScript',
    slug: 'getting-started-react-typescript',
    excerpt: 'Learn how to set up a React project with TypeScript and best practices for type-safe development.',
    content: '# Getting Started with React and TypeScript\n\nTypeScript brings type safety to React development...\n\n## Why TypeScript?\n\n- Catch errors early\n- Better IDE support\n- Improved refactoring\n\n## Setting Up\n\n```bash\nnpm create vite@latest my-app -- --template react-ts\n```',
    tags: ['React', 'TypeScript', 'Tutorial'],
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useLocalStorage<Project[]>('portfolio-projects', defaultProjects);
  const [skills, setSkills] = useLocalStorage<Skill[]>('portfolio-skills', defaultSkills);
  const [experiences, setExperiences] = useLocalStorage<Experience[]>('portfolio-experiences', defaultExperiences);
  const [blogs, setBlogs] = useLocalStorage<Blog[]>('portfolio-blogs', defaultBlogs);
  const [messages, setMessages] = useLocalStorage<ContactMessage[]>('portfolio-messages', []);
  const [aboutContent, setAboutContent] = useLocalStorage<AboutContent>('portfolio-about', defaultAboutContent);
  const [siteSettings, setSiteSettings] = useLocalStorage<SiteSettings>('portfolio-settings', defaultSiteSettings);
  const [isAdmin, setIsAdmin] = useLocalStorage<boolean>('portfolio-admin', false);

  return (
    <PortfolioContext.Provider
      value={{
        projects,
        setProjects,
        skills,
        setSkills,
        experiences,
        setExperiences,
        blogs,
        setBlogs,
        messages,
        setMessages,
        aboutContent,
        setAboutContent,
        siteSettings,
        setSiteSettings,
        isAdmin,
        setIsAdmin,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
