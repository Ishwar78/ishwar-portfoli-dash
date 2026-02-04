import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';

export default function CustomPage() {
  const { slug } = useParams<{ slug: string }>();
  const { customPages } = usePortfolio();
  
  const page = customPages.find(p => p.slug === slug);
  
  // Update meta tags for SEO
  useEffect(() => {
    if (page) {
      // Update title
      document.title = page.metaTitle || page.title;
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', page.metaDescription || '');
      
      // Update OG tags
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', page.metaTitle || page.title);
      
      let ogDescription = document.querySelector('meta[property="og:description"]');
      if (!ogDescription) {
        ogDescription = document.createElement('meta');
        ogDescription.setAttribute('property', 'og:description');
        document.head.appendChild(ogDescription);
      }
      ogDescription.setAttribute('content', page.metaDescription || '');
      
      if (page.featuredImage) {
        let ogImage = document.querySelector('meta[property="og:image"]');
        if (!ogImage) {
          ogImage = document.createElement('meta');
          ogImage.setAttribute('property', 'og:image');
          document.head.appendChild(ogImage);
        }
        ogImage.setAttribute('content', page.featuredImage);
      }
    }
  }, [page]);
  
  if (!page) {
    return <Navigate to="/404" replace />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {page.featuredImage && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img 
                src={page.featuredImage} 
                alt={page.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">
            {page.title}
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {page.content}
            </ReactMarkdown>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
