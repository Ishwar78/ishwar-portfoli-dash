import { motion, useInView } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export function BlogCarousel() {
  const { blogs } = usePortfolio();
  const headerRef = useRef(null);
  const carouselRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-50px' });
  const carouselInView = useInView(carouselRef, { once: true, margin: '-30px' });
  
  const publishedBlogs = blogs.filter(blog => blog.published).slice(0, 6);
  
  if (publishedBlogs.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 15 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16"
        >
          <motion.span 
            className="text-primary text-sm font-semibold uppercase tracking-widest mb-4 block"
            initial={{ opacity: 0, y: 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.1, duration: 0.35 }}
          >
            Insights
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Latest Blog Posts</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Thoughts, tutorials, and insights on web development
          </p>
        </motion.div>

        <motion.div
          ref={carouselRef}
          initial={{ opacity: 0, y: 15 }}
          animate={carouselInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ delay: 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-6xl mx-auto"
        >
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {publishedBlogs.map((blog, index) => (
                <CarouselItem key={blog.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={carouselInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.97 }}
                    transition={{ 
                      delay: 0.15 + index * 0.08,
                      duration: 0.35,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    <Link to={`/blog/${blog.slug}`}>
                      <div className="group bg-card rounded-xl overflow-hidden border border-border h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30">
                        {blog.featuredImage && (
                          <div className="aspect-video overflow-hidden relative">
                            <img
                              src={blog.featuredImage}
                              alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                            <Calendar className="h-3 w-3" />
                            {formatDate(blog.createdAt)}
                          </div>
                          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-2">
                            {blog.title}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                            {blog.excerpt}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {blog.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 transition-all duration-200 hover:scale-105" />
            <CarouselNext className="hidden md:flex -right-12 transition-all duration-200 hover:scale-105" />
          </Carousel>
        </motion.div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={carouselInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.4, duration: 0.35 }}
        >
          <Link to="/blog">
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary/30 hover:bg-primary/10 transition-all duration-200 hover:-translate-y-0.5"
            >
              View All Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
