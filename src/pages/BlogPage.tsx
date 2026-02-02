import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Badge } from '@/components/ui/badge';

export default function BlogPage() {
  const { blogs } = usePortfolio();

  const publishedBlogs = blogs.filter((blog) => blog.published);

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Thoughts, tutorials, and insights about software development
            </p>
          </motion.div>

          {/* Blog Grid */}
          <div className="max-w-4xl mx-auto">
            {publishedBlogs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
              </div>
            ) : (
              <div className="space-y-8">
                {publishedBlogs.map((blog, index) => (
                  <motion.article
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={`/blog/${blog.slug}`}>
                      <div className="group bg-card rounded-lg border border-border overflow-hidden card-hover">
                        <div className="flex flex-col md:flex-row">
                          {blog.featuredImage && (
                            <div className="md:w-1/3">
                              <div className="aspect-video md:aspect-square h-full">
                                <img
                                  src={blog.featuredImage}
                                  alt={blog.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            </div>
                          )}
                          <div className={`p-6 flex-1 ${blog.featuredImage ? '' : 'md:col-span-3'}`}>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {blog.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                              {blog.title}
                            </h2>
                            <p className="text-muted-foreground mb-4 line-clamp-2">
                              {blog.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <span className="text-primary flex items-center gap-1 text-sm font-medium">
                                Read more
                                <ArrowRight className="h-4 w-4" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
