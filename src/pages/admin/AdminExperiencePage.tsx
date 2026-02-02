import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { useToast } from '@/hooks/use-toast';
import { Experience } from '@/types/portfolio';

const emptyExperience = {
  company: '',
  role: '',
  duration: '',
  description: '',
  startDate: '',
  endDate: '',
  current: false,
};

export default function AdminExperiencePage() {
  const { experiences, setExperiences } = usePortfolio();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [formData, setFormData] = useState(emptyExperience);

  const sortedExperiences = [...experiences].sort((a, b) => {
    if (a.current) return -1;
    if (b.current) return 1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  const handleOpenDialog = (exp?: Experience) => {
    if (exp) {
      setEditingExp(exp);
      setFormData({
        company: exp.company,
        role: exp.role,
        duration: exp.duration,
        description: exp.description,
        startDate: exp.startDate,
        endDate: exp.endDate || '',
        current: exp.current,
      });
    } else {
      setEditingExp(null);
      setFormData(emptyExperience);
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingExp) {
      setExperiences((prev) =>
        prev.map((e) =>
          e.id === editingExp.id
            ? { ...e, ...formData, endDate: formData.current ? undefined : formData.endDate }
            : e
        )
      );
      toast({ title: 'Experience updated successfully' });
    } else {
      const newExp: Experience = {
        ...formData,
        id: Date.now().toString(),
        endDate: formData.current ? undefined : formData.endDate,
      };
      setExperiences((prev) => [...prev, newExp]);
      toast({ title: 'Experience added successfully' });
    }

    setIsDialogOpen(false);
    setEditingExp(null);
    setFormData(emptyExperience);
  };

  const handleDelete = (id: string) => {
    setExperiences((prev) => prev.filter((e) => e.id !== id));
    toast({ title: 'Experience deleted successfully' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Experience</h1>
            <p className="text-muted-foreground">Manage your work experience</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </div>

        {/* Experience List */}
        <div className="space-y-4">
          {sortedExperiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-lg border border-border p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-accent">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{exp.role}</h3>
                      {exp.current && (
                        <Badge className="gradient-bg text-white border-0">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{exp.company}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {exp.duration}
                    </p>
                    <p className="text-sm mt-3">{exp.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(exp)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Experience?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove this experience from your portfolio.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(exp.id)}
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

          {experiences.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No experience added yet. Click "Add Experience" to add one.
            </div>
          )}
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingExp ? 'Edit Experience' : 'Add New Experience'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="role">Role / Position</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, role: e.target.value }))
                  }
                  placeholder="Senior Full Stack Developer"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, company: e.target.value }))
                  }
                  placeholder="Tech Company Inc"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, duration: e.target.value }))
                  }
                  placeholder="Jan 2022 - Present"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                    disabled={formData.current}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="current"
                  checked={formData.current}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, current: checked }))
                  }
                />
                <Label htmlFor="current">Currently working here</Label>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Describe your role and responsibilities..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingExp ? 'Save Changes' : 'Add Experience'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
