import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, FileText, MessageSquare, TrendingUp, Download, Smartphone, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function AdminDashboardPage() {
  const { projects, blogs, messages, skills } = usePortfolio();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  const unreadMessages = messages.filter((m) => !m.read).length;

  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      icon: FolderKanban,
      href: '/admin/projects',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Blog Posts',
      value: blogs.length,
      icon: FileText,
      href: '/admin/blogs',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Messages',
      value: messages.length,
      subtitle: unreadMessages > 0 ? `${unreadMessages} unread` : undefined,
      icon: MessageSquare,
      href: '/admin/messages',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Skills',
      value: skills.length,
      icon: TrendingUp,
      href: '/admin/skills',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header with PWA Install */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your admin panel</p>
          </div>
          
          {/* PWA Install Button */}
          {!isInstalled ? (
            <Button
              onClick={handleInstallClick}
              className="gradient-bg text-white gap-2"
              disabled={!deferredPrompt && !isIOS}
            >
              <Download className="h-4 w-4" />
              Install Admin App
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">App Installed</span>
            </div>
          )}
        </div>

        {/* iOS Instructions Modal */}
        {showIOSInstructions && isIOS && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-primary">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Install on iOS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  To install the Admin App on your iOS device:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Tap the <strong>Share</strong> button in Safari</li>
                  <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                  <li>Tap <strong>"Add"</strong> to confirm</li>
                </ol>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowIOSInstructions(false)}
                >
                  Got it
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={stat.href}>
                  <Card className="hover:border-primary transition-colors cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stat.value}</div>
                      {stat.subtitle && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {stat.subtitle}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              {messages.length === 0 ? (
                <p className="text-muted-foreground text-sm">No messages yet</p>
              ) : (
                <div className="space-y-3">
                  {messages.slice(0, 5).map((message) => (
                    <div
                      key={message.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-accent/50"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          message.read ? 'bg-muted-foreground' : 'bg-green-500'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{message.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {message.email}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {message.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link
                to="/admin/messages"
                className="block mt-4 text-sm text-primary hover:underline"
              >
                View all messages →
              </Link>
            </CardContent>
          </Card>

          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Projects</CardTitle>
            </CardHeader>
            <CardContent>
              {projects.length === 0 ? (
                <p className="text-muted-foreground text-sm">No projects yet</p>
              ) : (
                <div className="space-y-3">
                  {projects.slice(0, 5).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-accent/50"
                    >
                      {project.images[0] && (
                        <img
                          src={project.images[0]}
                          alt={project.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{project.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {project.techStack.slice(0, 3).join(', ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link
                to="/admin/projects"
                className="block mt-4 text-sm text-primary hover:underline"
              >
                Manage projects →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
