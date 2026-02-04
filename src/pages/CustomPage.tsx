import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MainLayout } from '@/components/layout/MainLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';

export default function CustomPage() {
  const { slug } = useParams<{ slug: string }>();
  const { customPages } = usePortfolio();
  
  const page = customPages.find(p => p.slug === slug);
  
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
