import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, Search, FolderKanban } from 'lucide-react';
import { useState, useRef } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeroBanner } from '@/components/PageHeroBanner';
import { useSEO, DOMAIN } from '@/hooks/useSEO';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    shortDescription: string;
    images: string[];
    techStack: string[];
    liveUrl?: string;
    githubUrl?: string;
  };
  index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 15, scale: 0.97 }}
      transition={{
        delay: index * 0.08,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div className="group bg-card rounded-lg overflow-hidden border border-border h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30">
        {project.images[0] && (
          <Link to={`/projects/${project.id}`}>
            <div className="aspect-video overflow-hidden">
              <img
                src={project.images[0]}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
        )}
        <div className="p-6 flex-1 flex flex-col">
          <Link to={`/projects/${project.id}`}>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
              {project.title}
            </h3>
          </Link>
          <p className="text-muted-foreground text-sm mb-4 flex-1">
            {project.shortDescription}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Link to={`/projects/${project.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full transition-all duration-200 hover:-translate-y-0.5">
                View Details
              </Button>
            </Link>
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="transition-all duration-200 hover:scale-105 hover:text-primary">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="transition-all duration-200 hover:scale-105 hover:text-primary">
                  <Github className="h-4 w-4" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsPage() {
  useSEO({
    title: 'Projects | Ishwar - Web Developer Portfolio',
    description: 'Explore web development projects by Ishwar. E-commerce platforms, task management apps, and more built with React, Node.js, TypeScript.',
    keywords: 'web developer projects, portfolio projects, React projects, Node.js projects, full stack projects, web applications, software projects',
    canonical: `${DOMAIN}/projects`,
  });

  const { projects } = usePortfolio();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const filtersRef = useRef(null);
  const filtersInView = useInView(filtersRef, { once: true, margin: '-50px' });

  // Get all unique tech stacks
  const allTechStacks = [...new Set(projects.flatMap((p) => p.techStack))].sort();

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTech = !selectedTech || project.techStack.includes(selectedTech);
    return matchesSearch && matchesTech;
  });

  return (
    <MainLayout>
      <PageHeroBanner
        title="Projects"
        description="A collection of my work, side projects, and experiments"
        icon={<FolderKanban className="h-7 w-7" />}
        pattern="hexagons"
      />
      <div className="pb-20">
        <div className="container mx-auto px-4">

          {/* Filters */}
          <motion.div
            ref={filtersRef}
            initial={{ opacity: 0, y: 15 }}
            animate={filtersInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 transition-all duration-200 focus:shadow-md focus:shadow-primary/10"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap md:overflow-visible">
                <Button
                  variant={selectedTech === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTech(null)}
                  className="transition-all duration-200 hover:-translate-y-0.5 flex-shrink-0"
                >
                  All
                </Button>
                {allTechStacks.map((tech) => (
                  <Button
                    key={tech}
                    variant={selectedTech === tech ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTech(tech)}
                    className="transition-all duration-200 hover:-translate-y-0.5 flex-shrink-0"
                  >
                    {tech}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground">No projects found matching your criteria.</p>
            </motion.div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
