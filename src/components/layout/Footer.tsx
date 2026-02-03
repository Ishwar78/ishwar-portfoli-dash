import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { FooterSection } from '@/types/portfolio';

const defaultFooterSections: FooterSection[] = [
  {
    id: 'quick-links',
    title: 'Quick Links',
    links: [
      { id: '1', label: 'About', url: '/about' },
      { id: '2', label: 'Projects', url: '/projects' },
      { id: '3', label: 'Blog', url: '/blog' },
      { id: '4', label: 'Contact', url: '/contact' },
    ]
  }
];

export function Footer() {
  const { siteSettings } = usePortfolio();
  const currentYear = new Date().getFullYear();

  const footerSections = siteSettings.footerSections?.length 
    ? siteSettings.footerSections 
    : defaultFooterSections;

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold gradient-text mb-3">{siteSettings.name}</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              {siteSettings.tagline}
            </p>
            <div className="flex items-center gap-3">
              {siteSettings.github && (
                <a
                  href={siteSettings.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              {siteSettings.linkedin && (
                <a
                  href={siteSettings.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {siteSettings.twitter && (
                <a
                  href={siteSettings.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              <a
                href={`mailto:${siteSettings.email}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Dynamic Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.id}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.id}>
                    {link.isExternal ? (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.url}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href={`mailto:${siteSettings.email}`} className="hover:text-foreground transition-colors">
                  {siteSettings.email}
                </a>
              </li>
              <li>
                <Link to="/Ishwar/login" className="text-xs opacity-50 hover:text-foreground transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {siteSettings.footerCopyright || `© ${currentYear} ${siteSettings.name}. All rights reserved.`}
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-destructive fill-destructive" /> using React
          </p>
        </div>
      </div>
    </footer>
  );
}
