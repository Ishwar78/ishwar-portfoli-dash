import { motion } from 'framer-motion';
import { FolderKanban, FileText, MessageSquare, Eye, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardPage() {
  const { projects, blogs, messages, skills, experiences } = usePortfolio();

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
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your admin panel</p>
        </div>

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
