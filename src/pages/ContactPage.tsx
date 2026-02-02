import { motion } from 'framer-motion';
import { Mail, Send, Github, Linkedin, Twitter, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';
import { MainLayout } from '@/components/layout/MainLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ContactReason } from '@/types/portfolio';

const REASON_OPTIONS: { value: ContactReason; label: string }[] = [
  { value: 'hiring-fulltime', label: 'Hiring – Full Time' },
  { value: 'hiring-internship', label: 'Hiring – Internship' },
  { value: 'freelance', label: 'Freelance Project' },
  { value: 'other', label: 'Other' },
];

// Zod validation schema
const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name must be less than 100 characters' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' })
    .max(255, { message: 'Email must be less than 255 characters' }),
  reason: z.enum(['hiring-fulltime', 'hiring-internship', 'freelance', 'other'], {
    required_error: 'Please select a reason for contact',
  }),
  company: z
    .string()
    .trim()
    .max(100, { message: 'Company name must be less than 100 characters' })
    .optional(),
  message: z
    .string()
    .trim()
    .min(10, { message: 'Message must be at least 10 characters' })
    .max(1000, { message: 'Message must be less than 1000 characters' }),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface FormErrors {
  name?: string;
  email?: string;
  reason?: string;
  company?: string;
  message?: string;
}

export default function ContactPage() {
  const { siteSettings, setMessages } = usePortfolio();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    reason: undefined as unknown as ContactReason,
    company: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = (field: keyof ContactFormData, value: string | undefined) => {
    try {
      if (field === 'reason') {
        contactSchema.shape.reason.parse(value);
      } else if (field === 'company') {
        contactSchema.shape.company.parse(value);
      } else {
        (contactSchema.shape[field] as z.ZodType).parse(value);
      }
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: error.errors[0].message }));
      }
    }
  };

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof ContactFormData) => {
    validateField(field, formData[field]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = contactSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof ContactFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: result.data.name,
        email: result.data.email,
        reason: result.data.reason,
        company: result.data.company,
        message: result.data.message,
        read: false,
        createdAt: new Date().toISOString(),
      },
    ]);

    toast({
      title: 'Message sent!',
      description: "Thank you for reaching out. I'll get back to you soon.",
    });

    setFormData({ name: '', email: '', reason: undefined as unknown as ContactReason, company: '', message: '' });
    setErrors({});
    setIsSubmitting(false);
  };

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have a project in mind or want to collaborate? I'd love to hear from you.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold mb-6">Let's Connect</h2>
                <p className="text-muted-foreground mb-8">
                  Whether you have a question, a project idea, or just want to say hello,
                  feel free to reach out. I'm always open to discussing new opportunities.
                </p>

                <div className="space-y-4">
                  <a
                    href={`mailto:${siteSettings.email}`}
                    className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors"
                  >
                    <div className="p-2 rounded-lg gradient-bg text-primary-foreground">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{siteSettings.email}</p>
                    </div>
                  </a>

                  {siteSettings.github && (
                    <a
                      href={siteSettings.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-accent">
                        <Github className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">GitHub</p>
                        <p className="text-sm text-muted-foreground">View my repositories</p>
                      </div>
                    </a>
                  )}

                  {siteSettings.linkedin && (
                    <a
                      href={siteSettings.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-accent">
                        <Linkedin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">LinkedIn</p>
                        <p className="text-sm text-muted-foreground">Connect with me</p>
                      </div>
                    </a>
                  )}

                  {siteSettings.twitter && (
                    <a
                      href={siteSettings.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-accent">
                        <Twitter className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Twitter</p>
                        <p className="text-sm text-muted-foreground">Follow me</p>
                      </div>
                    </a>
                  )}
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-card rounded-lg border border-border p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        onBlur={() => handleBlur('name')}
                        className={`mt-1 ${errors.name ? 'border-destructive' : ''}`}
                        maxLength={100}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        className={`mt-1 ${errors.email ? 'border-destructive' : ''}`}
                        maxLength={255}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="reason">Reason for Contact <span className="text-destructive">*</span></Label>
                      <Select
                        value={formData.reason}
                        onValueChange={(value) => handleChange('reason', value)}
                      >
                        <SelectTrigger className={`mt-1 ${errors.reason ? 'border-destructive' : ''}`}>
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {REASON_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.reason && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.reason}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="company">Company / Organization</Label>
                      <Input
                        id="company"
                        placeholder="Your company or organization (optional)"
                        value={formData.company}
                        onChange={(e) => handleChange('company', e.target.value)}
                        onBlur={() => handleBlur('company')}
                        className={`mt-1 ${errors.company ? 'border-destructive' : ''}`}
                        maxLength={100}
                      />
                      {errors.company && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.company}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="message">
                        Message <span className="text-destructive">*</span>
                        <span className="text-muted-foreground text-xs ml-2">
                          ({formData.message.length}/1000)
                        </span>
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Please include details such as the role you're hiring for, job type (remote/on-site/hybrid), and location..."
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        onBlur={() => handleBlur('message')}
                        rows={5}
                        className={`mt-1 ${errors.message ? 'border-destructive' : ''}`}
                        maxLength={1000}
                      />
                      {errors.message && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full gradient-bg text-primary-foreground"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
