import { motion, useInView } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePortfolio } from '@/contexts/PortfolioContext';

interface TestimonialCardProps {
  testimonial: {
    id: string;
    name: string;
    role: string;
    company: string;
    avatar?: string;
    content: string;
    rating: number;
  };
  index: number;
}

function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 15, scale: 0.97 }}
      transition={{
        delay: index * 0.1,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 group">
        <CardContent className="p-6 flex flex-col h-full">
          {/* Quote icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: index * 0.1 + 0.1, duration: 0.3 }}
          >
            <Quote className="h-8 w-8 text-primary/30 mb-4 group-hover:text-primary/50 transition-colors duration-200" />
          </motion.div>

          {/* Rating */}
          <div className="flex gap-1 mb-4">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ 
                  delay: index * 0.1 + 0.15 + i * 0.05,
                  duration: 0.25,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <Star className="h-4 w-4 fill-primary text-primary" />
              </motion.div>
            ))}
          </div>

          {/* Content */}
          <p className="text-muted-foreground flex-grow mb-6 leading-relaxed">
            "{testimonial.content}"
          </p>

          {/* Author */}
          <div className="flex items-center gap-3 pt-4 border-t border-border/50">
            <Avatar className="h-10 w-10">
              <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                {testimonial.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{testimonial.name}</p>
              <p className="text-xs text-muted-foreground">
                {testimonial.role} at {testimonial.company}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function TestimonialsSection() {
  const { testimonials } = usePortfolio();
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-50px' });

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/20 to-background" />
      <motion.div 
        className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />

      <div className="container mx-auto px-4 relative z-10">
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
            Testimonials
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            What Clients Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Feedback from people I've had the pleasure of working with
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.id} 
              testimonial={testimonial} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
