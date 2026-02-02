import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { Blog } from '@/types/portfolio';

const emptyBlog = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  tags: [] as string[],
  published: false,
};

export default function AdminBlogsPage() {
  const { blogs, setBlogs } = usePortfolio();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState(emptyBlog);
  const [tagsInput, setTagsInput] = useState('');
  const [contentTab, setContentTab] = useState<'edit' | 'preview'>('edit');

  const handleOpenDialog = (blog?: Blog) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content,
        featuredImage: blog.featuredImage || '',
        tags: blog.tags,
        published: blog.published,
      });
      setTagsInput(blog.tags.join(', '));
    } else {
      setEditingBlog(null);
      setFormData(emptyBlog);
      setTagsInput('');
    }
    setIsDialogOpen(true);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSave = () => {
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingBlog) {
      setBlogs((prev) =>
        prev.map((b) =>
          b.id === editingBlog.id
            ? {
                ...b,
                ...formData,
                tags,
                updatedAt: new Date().toISOString(),
              }
            : b
        )
      );
      toast({ title: 'Blog post updated successfully' });
    } else {
      const newBlog: Blog = {
        ...formData,
        id: Date.now().toString(),
        slug: formData.slug || generateSlug(formData.title),
        tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setBlogs((prev) => [...prev, newBlog]);
      toast({ title: 'Blog post created successfully' });
    }

    setIsDialogOpen(false);
    setEditingBlog(null);
    setFormData(emptyBlog);
  };

  const handleDelete = (id: string) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    toast({ title: 'Blog post deleted successfully' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Blog Posts</h1>
            <p className="text-muted-foreground">Manage your blog content</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>

        {/* Blog List */}
        <div className="grid gap-4">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-lg border border-border p-4"
            >
              <div className="flex items-start gap-4">
                {blog.featuredImage && (
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-24 h-16 rounded object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{blog.title}</h3>
                    <Badge variant={blog.published ? 'default' : 'secondary'}>
                      {blog.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {blog.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {blog.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(blog)}
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
                        <AlertDialogTitle>Delete Blog Post?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{blog.title}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(blog.id)}
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

          {blogs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No blog posts yet. Click "New Post" to create one.
            </div>
          )}
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBlog ? 'Edit Blog Post' : 'New Blog Post'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        title,
                        slug: prev.slug || generateSlug(title),
                      }));
                    }}
                    placeholder="My Awesome Blog Post"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="my-awesome-blog-post"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                  }
                  placeholder="A brief summary of your post..."
                  rows={2}
                  className="mt-1"
                />
              </div>

              {/* Featured Image Upload */}
              <div>
                <Label className="mb-2 block">Featured Image</Label>
                <ImageUpload
                  value={formData.featuredImage}
                  onChange={(url) =>
                    setFormData((prev) => ({ ...prev, featuredImage: url }))
                  }
                  placeholder="Upload featured image"
                  aspectRatio="video"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="React, Tutorial, Web Dev"
                  className="mt-1"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, published: checked }))
                  }
                />
                <Label htmlFor="published">Published</Label>
              </div>

              {/* Content Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Content (Markdown)</Label>
                  <Tabs value={contentTab} onValueChange={(v) => setContentTab(v as 'edit' | 'preview')}>
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
                {contentTab === 'edit' ? (
                  <Textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, content: e.target.value }))
                    }
                    placeholder="# Heading&#10;&#10;Write your blog content in Markdown..."
                    rows={15}
                    className="font-mono text-sm"
                  />
                ) : (
                  <div className="bg-accent/50 rounded-lg p-4 min-h-[350px] prose-github overflow-y-auto">
                    {formData.content ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {formData.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-muted-foreground">No content yet</p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingBlog ? 'Save Changes' : 'Create Post'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
