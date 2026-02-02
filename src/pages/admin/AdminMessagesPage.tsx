import { motion } from 'framer-motion';
import { Mail, Trash2, Eye, EyeOff, Calendar, Briefcase, Building2 } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ContactMessage, ContactReason } from '@/types/portfolio';

const REASON_LABELS: Record<ContactReason, string> = {
  'hiring-fulltime': 'Hiring – Full Time',
  'hiring-internship': 'Hiring – Internship',
  'freelance': 'Freelance Project',
  'other': 'Other',
};

export default function AdminMessagesPage() {
  const { messages, setMessages } = usePortfolio();
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const unreadCount = messages.filter((m) => !m.read).length;

  const handleMarkAsRead = (id: string, read: boolean) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read } : m))
    );
  };

  const handleDelete = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    toast({ title: 'Message deleted successfully' });
  };

  const handleOpenMessage = (message: ContactMessage) => {
    if (!message.read) {
      handleMarkAsRead(message.id, true);
    }
    setSelectedMessage(message);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Messages</h1>
            <p className="text-muted-foreground">
              Contact form submissions
              {unreadCount > 0 && ` (${unreadCount} unread)`}
            </p>
          </div>
        </div>

        {/* Messages List */}
        <div className="space-y-3">
          {sortedMessages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-card rounded-lg border p-4 cursor-pointer transition-colors ${
                message.read ? 'border-border' : 'border-primary bg-accent/30'
              }`}
              onClick={() => handleOpenMessage(message)}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-3 h-3 rounded-full mt-1.5 ${
                    message.read ? 'bg-muted-foreground/30' : 'bg-green-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{message.name}</h3>
                      {!message.read && (
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{message.email}</p>
                  {message.reason && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      <Briefcase className="h-3 w-3 mr-1" />
                      {REASON_LABELS[message.reason]}
                    </Badge>
                  )}
                  <p className="text-sm mt-2 line-clamp-2">{message.message}</p>
                </div>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMarkAsRead(message.id, !message.read)}
                    title={message.read ? 'Mark as unread' : 'Mark as read'}
                  >
                    {message.read ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Message?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the message from {message.name}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(message.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </motion.div>
          ))}

          {messages.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No messages yet</p>
              <p className="text-sm">Messages from your contact form will appear here</p>
            </div>
          )}
        </div>

        {/* Message Detail Dialog */}
        <Dialog
          open={!!selectedMessage}
          onOpenChange={() => setSelectedMessage(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Message Details</DialogTitle>
            </DialogHeader>
            {selectedMessage && (
              <div className="space-y-4 py-4">
                <div>
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.reason && (
                  <div>
                    <p className="text-sm text-muted-foreground">Reason for Contact</p>
                    <Badge variant="secondary" className="mt-1">
                      <Briefcase className="h-3 w-3 mr-1" />
                      {REASON_LABELS[selectedMessage.reason]}
                    </Badge>
                  </div>
                )}
                {selectedMessage.company && (
                  <div>
                    <p className="text-sm text-muted-foreground">Company / Organization</p>
                    <p className="font-medium flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {selectedMessage.company}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Message</p>
                  <p className="mt-1 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                <div className="flex gap-2 pt-4">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: Your message`}
                    className="flex-1"
                  >
                    <Button className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
