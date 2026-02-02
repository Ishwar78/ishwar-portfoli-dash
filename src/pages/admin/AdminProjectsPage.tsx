import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, FileText, Eye } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MultiImageUpload } from '@/components/admin/MultiImageUpload';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@/types/portfolio';

const emptyProject: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '',
  description: '',
  shortDescription: '',
  techStack: [],
  images: [],
  readme: '',
  liveUrl: '',
  githubUrl: '',
  featured: false,
};

export default function AdminProjectsPage() {
  const { projects, setProjects } = usePortfolio();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState(emptyProject);
  const [techStackInput, setTechStackInput] = useState('');
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const [readmeTab, setReadmeTab] = useState<'edit' | 'preview'>('edit');

  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        shortDescription: project.shortDescription,
        techStack: project.techStack,
        images: project.images,
        readme: project.readme,
        liveUrl: project.liveUrl || '',
        githubUrl: project.githubUrl || '',
        featured: project.featured,
      });
      setTechStackInput(project.techStack.join(', '));
      setProjectImages(project.images);
    } else {
      setEditingProject(null);
      setFormData(emptyProject);
      setTechStackInput('');
      setProjectImages([]);
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const techStack = techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingProject) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingProject.id
            ? {
                ...p,
                ...formData,
                techStack,
                images: projectImages,
                updatedAt: new Date().toISOString(),
              }
            : p
        )
      );
      toast({ title: 'Project updated successfully' });
    } else {
      const newProject: Project = {
        ...formData,
        id: Date.now().toString(),
        techStack,
        images: projectImages,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProjects((prev) => [...prev, newProject]);
      toast({ title: 'Project created successfully' });
    }

    setIsDialogOpen(false);
    setEditingProject(null);
    setFormData(emptyProject);
    setProjectImages([]);
  };

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast({ title: 'Project deleted successfully' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground">Manage your portfolio projects</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>

        {/* Projects List */}
        <div className="grid gap-4">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-lg border border-border p-4"
            >
              <div className="flex items-start gap-4">
                {project.images[0] && (
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-24 h-16 rounded object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{project.title}</h3>
                    {project.featured && (
                      <Badge variant="secondary" className="text-xs">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {project.shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(project)}
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
                        <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the
                          project "{project.title}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(project.id)}
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

          {projects.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No projects yet. Click "Add Project" to create one.
            </div>
          )}
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="My Awesome Project"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, featured: checked }))
                      }
                    />
                    <Label htmlFor="featured">Featured Project</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      shortDescription: e.target.value,
                    }))
                  }
                  placeholder="A brief description for cards"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Detailed description of the project"
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="liveUrl">Live Demo URL</Label>
                  <Input
                    id="liveUrl"
                    value={formData.liveUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, liveUrl: e.target.value }))
                    }
                    placeholder="https://example.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input
                    id="githubUrl"
                    value={formData.githubUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))
                    }
                    placeholder="https://github.com/..."
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
                <Input
                  id="techStack"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  placeholder="React, Node.js, PostgreSQL"
                  className="mt-1"
                />
              </div>

              {/* Project Images */}
              <div>
                <Label className="mb-2 block">Project Images</Label>
                <MultiImageUpload
                  value={projectImages}
                  onChange={setProjectImages}
                  maxImages={10}
                />
              </div>

              {/* README Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>README (Markdown)</Label>
                  <Tabs value={readmeTab} onValueChange={(v) => setReadmeTab(v as 'edit' | 'preview')}>
                    <TabsList className="h-8">
                      <TabsTrigger value="edit" className="text-xs px-3">
                        <FileText className="h-3 w-3 mr-1" />
                        Edit
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="text-xs px-3">
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                {readmeTab === 'edit' ? (
                  <Textarea
                    value={formData.readme}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, readme: e.target.value }))
                    }
                    placeholder="# Project Title&#10;&#10;## Features&#10;&#10;- Feature 1&#10;- Feature 2"
                    rows={12}
                    className="font-mono text-sm"
                  />
                ) : (
                  <div className="bg-accent/50 rounded-lg p-4 min-h-[300px] prose-github">
                    {formData.readme || (
                      <p className="text-muted-foreground">No README content yet</p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
