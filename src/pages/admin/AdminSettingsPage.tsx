import { useState, useEffect } from 'react';
import { Save, Plus, X } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { FileUpload } from '@/components/admin/FileUpload';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettingsPage() {
  const { siteSettings, setSiteSettings } = usePortfolio();
  const { toast } = useToast();
  const [formData, setFormData] = useState(siteSettings);
  const [typingRoles, setTypingRoles] = useState<string[]>(
    siteSettings.typingRoles?.length 
      ? siteSettings.typingRoles 
      : ['Full Stack Developer', 'React Developer', 'Node.js Engineer']
  );

  // Sync formData when siteSettings changes (e.g., from localStorage)
  useEffect(() => {
    setFormData(siteSettings);
    setTypingRoles(
      siteSettings.typingRoles?.length 
        ? siteSettings.typingRoles 
        : ['Full Stack Developer', 'React Developer', 'Node.js Engineer']
    );
  }, [siteSettings]);

  const addTypingRole = () => {
    setTypingRoles([...typingRoles, '']);
  };

  const removeTypingRole = (index: number) => {
    setTypingRoles(typingRoles.filter((_, i) => i !== index));
  };

  const updateTypingRole = (index: number, value: string) => {
    const updated = [...typingRoles];
    updated[index] = value;
    setTypingRoles(updated);
  };

  const handleSave = () => {
    const filteredRoles = typingRoles.filter(role => role.trim() !== '');
    setSiteSettings({ ...formData, typingRoles: filteredRoles });
    toast({ title: 'Settings saved successfully' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your site settings</p>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <div className="grid gap-6 max-w-2xl">
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Hero Image</Label>
                <p className="text-xs text-muted-foreground mb-2">This image appears on your home page hero section</p>
                <ImageUpload
                  value={formData.heroImage || ''}
                  onChange={(url) =>
                    setFormData((prev) => ({ ...prev, heroImage: url }))
                  }
                  placeholder="Upload your hero image"
                  aspectRatio="square"
                />
              </div>
              <div>
                <Label htmlFor="experienceYears">Experience Badge Text</Label>
                <Input
                  id="experienceYears"
                  value={formData.experienceYears || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, experienceYears: e.target.value }))
                  }
                  placeholder="e.g., 5+ YRS or leave empty to hide"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Leave empty to hide the badge</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Typing Roles</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addTypingRole}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Role
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-3">These roles will cycle through in the hero section</p>
                <div className="space-y-2">
                  {typingRoles.map((role, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={role}
                        onChange={(e) => updateTypingRole(index, e.target.value)}
                        placeholder="e.g., Full Stack Developer"
                      />
                      {typingRoles.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTypingRole(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="heroDescription">Hero Description</Label>
                <Textarea
                  id="heroDescription"
                  value={formData.heroDescription || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, heroDescription: e.target.value }))
                  }
                  placeholder="I craft elegant, scalable web applications using modern technologies like React, Node.js, and cloud platforms."
                  className="mt-1 min-h-[100px]"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This text appears below your tagline on the home page ({formData.heroDescription?.length || 0}/500)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Resume Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resume / CV</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Upload Resume</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Upload your resume as PDF or image. This will be used for the "Download CV" button.
                </p>
                <FileUpload
                  value={formData.resumeUrl || ''}
                  onChange={(url) =>
                    setFormData((prev) => ({ ...prev, resumeUrl: url }))
                  }
                  placeholder="Upload your resume (PDF or Image)"
                  maxSizeMB={10}
                />
              </div>
            </CardContent>
          </Card>

          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Your Name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="role">Role / Title</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, role: e.target.value }))
                  }
                  placeholder="Full Stack Developer"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tagline: e.target.value }))
                  }
                  placeholder="Building digital experiences that matter"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="your@email.com"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="github">GitHub URL</Label>
                <Input
                  id="github"
                  value={formData.github || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, github: e.target.value }))
                  }
                  placeholder="https://github.com/username"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, linkedin: e.target.value }))
                  }
                  placeholder="https://linkedin.com/in/username"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter URL</Label>
                <Input
                  id="twitter"
                  value={formData.twitter || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, twitter: e.target.value }))
                  }
                  placeholder="https://twitter.com/username"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
