import { useState, useEffect } from 'react';
import { Save, Plus, X } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { FileUpload } from '@/components/admin/FileUpload';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const GRADIENT_PRESETS = [
  { value: 'blue-cyan', label: 'Blue to Cyan (Default)', colors: ['#3B82F6', '#06B6D4'] },
  { value: 'purple-pink', label: 'Purple to Pink', colors: ['#8B5CF6', '#EC4899'] },
  { value: 'green-teal', label: 'Green to Teal', colors: ['#22C55E', '#14B8A6'] },
  { value: 'orange-red', label: 'Orange to Red', colors: ['#F97316', '#EF4444'] },
  { value: 'indigo-violet', label: 'Indigo to Violet', colors: ['#6366F1', '#8B5CF6'] },
];

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
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label htmlFor="showAvailabilityBadge">Show Availability Badge</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Display "Available for opportunities" badge in hero section
                  </p>
                </div>
                <Switch
                  id="showAvailabilityBadge"
                  checked={formData.showAvailabilityBadge !== false}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, showAvailabilityBadge: checked }))
                  }
                />
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

          {/* Hero Buttons */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hero Button Labels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="viewProjectsText">View Projects Button</Label>
                <Input
                  id="viewProjectsText"
                  value={formData.viewProjectsText || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, viewProjectsText: e.target.value }))
                  }
                  placeholder="View Projects"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contactMeText">Contact Me Button</Label>
                <Input
                  id="contactMeText"
                  value={formData.contactMeText || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, contactMeText: e.target.value }))
                  }
                  placeholder="Contact Me"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="downloadCvText">Download CV Button</Label>
                <Input
                  id="downloadCvText"
                  value={formData.downloadCvText || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, downloadCvText: e.target.value }))
                  }
                  placeholder="Download CV"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">CTA Section (Bottom of Home Page)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ctaHeading">CTA Heading</Label>
                <Input
                  id="ctaHeading"
                  value={formData.ctaHeading || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, ctaHeading: e.target.value }))
                  }
                  placeholder="Let's Build Something Amazing"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="ctaDescription">CTA Description</Label>
                <Textarea
                  id="ctaDescription"
                  value={formData.ctaDescription || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, ctaDescription: e.target.value }))
                  }
                  placeholder="Have a project in mind or want to collaborate? I'd love to hear from you."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="ctaButtonText">Primary Button Text</Label>
                <Input
                  id="ctaButtonText"
                  value={formData.ctaButtonText || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, ctaButtonText: e.target.value }))
                  }
                  placeholder="Get In Touch"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="ctaResumeButtonText">Resume Button Text</Label>
                <Input
                  id="ctaResumeButtonText"
                  value={formData.ctaResumeButtonText || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, ctaResumeButtonText: e.target.value }))
                  }
                  placeholder="Download Resume"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Featured Projects Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Featured Projects Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="featuredProjectsLabel">Label (small text above heading)</Label>
                <Input
                  id="featuredProjectsLabel"
                  value={formData.featuredProjectsLabel || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, featuredProjectsLabel: e.target.value }))
                  }
                  placeholder="Portfolio"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="featuredProjectsHeading">Section Heading</Label>
                <Input
                  id="featuredProjectsHeading"
                  value={formData.featuredProjectsHeading || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, featuredProjectsHeading: e.target.value }))
                  }
                  placeholder="Featured Projects"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="featuredProjectsDescription">Section Description</Label>
                <Textarea
                  id="featuredProjectsDescription"
                  value={formData.featuredProjectsDescription || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, featuredProjectsDescription: e.target.value }))
                  }
                  placeholder="A selection of my recent work and personal projects"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skills Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="skillsLabel">Label (small text above heading)</Label>
                <Input
                  id="skillsLabel"
                  value={formData.skillsLabel || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, skillsLabel: e.target.value }))
                  }
                  placeholder="Expertise"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="skillsHeading">Section Heading</Label>
                <Input
                  id="skillsHeading"
                  value={formData.skillsHeading || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, skillsHeading: e.target.value }))
                  }
                  placeholder="Skills & Technologies"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="skillsDescription">Section Description</Label>
                <Textarea
                  id="skillsDescription"
                  value={formData.skillsDescription || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, skillsDescription: e.target.value }))
                  }
                  placeholder="Technologies I use to bring ideas to life"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Gradient Theme */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gradient Theme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="gradientPreset">Color Scheme</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  This affects gradient text, buttons, and accent colors throughout the site
                </p>
                <Select
                  value={formData.gradientPreset || 'blue-cyan'}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, gradientPreset: value as any }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a gradient theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADIENT_PRESETS.map((preset) => (
                      <SelectItem key={preset.value} value={preset.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{
                              background: `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})`,
                            }}
                          />
                          {preset.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                <span
                  className="text-2xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${
                      GRADIENT_PRESETS.find(p => p.value === (formData.gradientPreset || 'blue-cyan'))?.colors[0]
                    }, ${
                      GRADIENT_PRESETS.find(p => p.value === (formData.gradientPreset || 'blue-cyan'))?.colors[1]
                    })`,
                  }}
                >
                  Gradient Text Preview
                </span>
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
