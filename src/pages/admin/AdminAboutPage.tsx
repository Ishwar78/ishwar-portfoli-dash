import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function AdminAboutPage() {
  const { aboutContent, setAboutContent, siteSettings } = usePortfolio();
  const { toast } = useToast();
  const [formData, setFormData] = useState(aboutContent);
  const [highlightsInput, setHighlightsInput] = useState(aboutContent.highlights.join('\n'));

  const handleSave = () => {
    const highlights = highlightsInput
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    setAboutContent({
      ...formData,
      highlights,
    });

    toast({ title: 'About content updated successfully' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">About</h1>
            <p className="text-muted-foreground">Manage your about page content</p>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Profile Image */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                {formData.profileImage ? (
                  <img
                    src={formData.profileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-lg object-cover border border-border"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {siteSettings.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <Label htmlFor="profileImage">Image URL</Label>
                  <Input
                    id="profileImage"
                    value={formData.profileImage || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, profileImage: e.target.value }))
                    }
                    placeholder="https://example.com/your-photo.jpg"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter a URL for your profile image
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bio</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
                placeholder="Write a short bio about yourself..."
                rows={5}
              />
            </CardContent>
          </Card>

          {/* Career Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Career Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.careerSummary}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, careerSummary: e.target.value }))
                }
                placeholder="Summarize your career and experience..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Education</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.education}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, education: e.target.value }))
                }
                placeholder="Your educational background..."
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Highlights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={highlightsInput}
                onChange={(e) => setHighlightsInput(e.target.value)}
                placeholder="Full Stack Development&#10;Cloud Architecture&#10;Team Leadership"
                rows={5}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Enter one highlight per line
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
