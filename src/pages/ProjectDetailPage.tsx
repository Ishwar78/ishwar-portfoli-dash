import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { MainLayout } from '@/components/layout/MainLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { projects } = usePortfolio();

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <MainLayout>
        <div className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <Link to="/projects">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-20">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link to="/projects">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="gradient-bg text-white">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </Button>
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <Github className="mr-2 h-4 w-4" />
                      View Source
                    </Button>
                  </a>
                )}
              </div>
            </motion.div>

            {/* README */}
            {project.readme && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-lg border border-border p-6 md:p-8"
              >
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
                  <svg
                    viewBox="0 0 16 16"
                    className="h-5 w-5"
                    fill="currentColor"
                  >
                    <path d="M0 1.75A.75.75 0 01.75 1h4.253c1.227 0 2.317.59 3 1.501A3.744 3.744 0 0111.006 1h4.245a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75h-4.507a2.25 2.25 0 00-1.591.659l-.622.621a.75.75 0 01-1.06 0l-.622-.621A2.25 2.25 0 005.258 13H.75a.75.75 0 01-.75-.75V1.75zm8.755 3a2.25 2.25 0 012.25-2.25H14.5v9h-3.757c-.71 0-1.4.201-1.992.572l.004-7.322zm-1.504 7.324l.004-5.073-.002-2.253A2.25 2.25 0 005.003 2.5H1.5v9h3.757a3.75 3.75 0 011.994.574z" />
                  </svg>
                  <span className="font-semibold">README.md</span>
                </div>
                <div className="prose-github">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-lg !bg-muted"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {project.readme}
                  </ReactMarkdown>
                </div>
              </motion.div>
            )}

            {/* Meta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex items-center gap-4 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Updated: {new Date(project.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
