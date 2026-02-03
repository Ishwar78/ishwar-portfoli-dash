import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon, Github, Linkedin, Mail } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { cn } from '@/lib/utils';

const defaultNavLinks = [
  { id: '1', label: 'Home', url: '/', enabled: true, isExternal: false },
  { id: '2', label: 'About', url: '/about', enabled: true, isExternal: false },
  { id: '3', label: 'Skills', url: '/skills', enabled: true, isExternal: false },
  { id: '4', label: 'Experience', url: '/experience', enabled: true, isExternal: false },
  { id: '5', label: 'Projects', url: '/projects', enabled: true, isExternal: false },
  { id: '6', label: 'Blog', url: '/blog', enabled: true, isExternal: false },
  { id: '7', label: 'Contact', url: '/contact', enabled: true, isExternal: false },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { siteSettings } = usePortfolio();
  const location = useLocation();

  // Use custom nav links if available, otherwise use defaults
  const navLinks = useMemo(() => {
    if (siteSettings.headerNavLinks?.length) {
      return siteSettings.headerNavLinks.filter(link => link.enabled);
    }
    return defaultNavLinks;
  }, [siteSettings.headerNavLinks]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold">
            <span className="gradient-text">{siteSettings.name}</span>
            <span className="text-primary">.</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => 
              link.isExternal ? (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.id}
                  to={link.url}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    location.pathname === link.url
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Social Links */}
            <div className="hidden lg:flex items-center gap-1">
              {siteSettings.github && (
                <a href={siteSettings.github} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary/10 hover:text-primary">
                    <Github className="h-4 w-4" />
                  </Button>
                </a>
              )}
              {siteSettings.linkedin && (
                <a href={siteSettings.linkedin} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary/10 hover:text-primary">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </a>
              )}
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-border"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => 
                link.isExternal ? (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.id}
                    to={link.url}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      location.pathname === link.url
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
}
