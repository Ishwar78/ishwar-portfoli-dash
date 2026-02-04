import { useState } from 'react';
import { Plus, Pencil, Trash2, Star, Quote } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LocalImageUpload } from '@/components/admin/LocalImageUpload';
import { useToast } from '@/hooks/use-toast';
import { Testimonial } from '@/types/portfolio';

export default function AdminTestimonialsPage() {
  const { testimonials, setTestimonials } = usePortfolio();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
    avatar: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      company: '',
      content: '',
      rating: 5,
      avatar: '',
    });
    setEditingTestimonial(null);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      content: testimonial.content,
      rating: testimonial.rating,
      avatar: testimonial.avatar || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.role || !formData.company || !formData.content) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (editingTestimonial) {
      setTestimonials((prev) =>
        prev.map((t) =>
          t.id === editingTestimonial.id
            ? { ...t, ...formData }
            : t
        )
      );
      toast({ title: 'Testimonial updated successfully' });
    } else {
      const newTestimonial: Testimonial = {
        id: Date.now().toString(),
        ...formData,
      };
      setTestimonials((prev) => [...prev, newTestimonial]);
      toast({ title: 'Testimonial added successfully' });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    toast({ title: 'Testimonial deleted' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Testimonials</h1>
            <p className="text-muted-foreground">
              Manage client testimonials and reviews
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gradient-bg">
                <Plus className="h-4 w-4 mr-2" />
                Add Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Avatar Upload */}
                <div>
                  <Label className="mb-2 block">Client Avatar</Label>
                  <LocalImageUpload
                    value={formData.avatar}
                    onChange={(url) =>
                      setFormData((prev) => ({ ...prev, avatar: url }))
                    }
                    placeholder="Upload client photo"
                    aspectRatio="square"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Client name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role *</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, role: e.target.value }))
                      }
                      placeholder="e.g., CEO, Product Manager"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Company *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, company: e.target.value }))
                      }
                      placeholder="Company name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="rating">Rating</Label>
                    <Select
                      value={formData.rating.toString()}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, rating: parseInt(value) }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} Star{num > 1 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="content">Testimonial Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, content: e.target.value }))
                    }
                    placeholder="What did the client say about your work?"
                    rows={4}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setIsDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="gradient-bg">
                    {editingTestimonial ? 'Update' : 'Add'} Testimonial
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {testimonials.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Quote className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No testimonials yet</p>
              <p className="text-sm text-muted-foreground">
                Add your first client testimonial to showcase on your portfolio
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="relative group">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {testimonial.avatar ? (
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {testimonial.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-base">{testimonial.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.role} at {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(testimonial)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(testimonial.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                    {Array.from({ length: 5 - testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-muted-foreground/30" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
