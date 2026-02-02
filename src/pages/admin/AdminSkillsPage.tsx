import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Skill } from '@/types/portfolio';

const categories = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'database', label: 'Database' },
  { value: 'tools', label: 'Tools & Technologies' },
];

const emptySkill: { name: string; category: Skill['category']; level: number } = {
  name: '',
  category: 'frontend',
  level: 75,
};

export default function AdminSkillsPage() {
  const { skills, setSkills } = usePortfolio();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState(emptySkill);

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const handleOpenDialog = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        name: skill.name,
        category: skill.category,
        level: skill.level,
      });
    } else {
      setEditingSkill(null);
      setFormData(emptySkill);
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingSkill) {
      setSkills((prev) =>
        prev.map((s) =>
          s.id === editingSkill.id
            ? { ...s, ...formData }
            : s
        )
      );
      toast({ title: 'Skill updated successfully' });
    } else {
      const newSkill: Skill = {
        ...formData,
        id: Date.now().toString(),
      };
      setSkills((prev) => [...prev, newSkill]);
      toast({ title: 'Skill added successfully' });
    }

    setIsDialogOpen(false);
    setEditingSkill(null);
    setFormData(emptySkill);
  };

  const handleDelete = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
    toast({ title: 'Skill deleted successfully' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Skills</h1>
            <p className="text-muted-foreground">Manage your skills and expertise</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </div>

        {/* Skills by Category */}
        <div className="space-y-8">
          {categories.map((category) => {
            const categorySkills = skillsByCategory[category.value] || [];
            if (categorySkills.length === 0) return null;

            return (
              <div key={category.value}>
                <h2 className="text-lg font-semibold mb-4">{category.label}</h2>
                <div className="grid gap-3">
                  {categorySkills.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-card rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{skill.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {skill.level}%
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(skill)}
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
                                <AlertDialogTitle>Delete Skill?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will remove "{skill.name}" from your skills list.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(skill.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}

          {skills.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No skills added yet. Click "Add Skill" to add one.
            </div>
          )}
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div>
                <Label htmlFor="name">Skill Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., React, Node.js"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: Skill['category']) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Skill Level</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.level}%
                  </span>
                </div>
                <Slider
                  value={[formData.level]}
                  onValueChange={([value]) =>
                    setFormData((prev) => ({ ...prev, level: value }))
                  }
                  min={0}
                  max={100}
                  step={5}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingSkill ? 'Save Changes' : 'Add Skill'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
