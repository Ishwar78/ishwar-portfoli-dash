import { useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { Education } from '@/types/portfolio';

export default function AdminAboutPage() {
  const { aboutContent, setAboutContent } = usePortfolio();
  const { toast } = useToast();
  const [formData, setFormData] = useState(aboutContent);
  const [highlightsInput, setHighlightsInput] = useState(aboutContent.highlights.join('\n'));
  const [educationList, setEducationList] = useState<Education[]>(
    Array.isArray(aboutContent.education) 
      ? aboutContent.education 
      : [{ id: '1', degree: String(aboutContent.education || ''), institution: '', year: '' }]
  );

  const handleSave = () => {
    const highlights = highlightsInput
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    setAboutContent({
      ...formData,
      highlights,
      education: educationList.filter(edu => edu.degree.trim() !== ''),
    });

    toast({ title: 'About content updated successfully' });
  };

  const addEducation = () => {
    setEducationList([
      ...educationList,
      { id: Date.now().toString(), degree: '', institution: '', year: '' }
    ]);
  };

  const removeEducation = (id: string) => {
    if (educationList.length > 1) {
      setEducationList(educationList.filter(edu => edu.id !== id));
    }
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducationList(educationList.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
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
              <ImageUpload
                value={formData.profileImage || ''}
                onChange={(url) =>
                  setFormData((prev) => ({ ...prev, profileImage: url }))
                }
                placeholder="Upload your profile photo"
                aspectRatio="square"
              />
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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Education</CardTitle>
              <Button variant="outline" size="sm" onClick={addEducation}>
                <Plus className="h-4 w-4 mr-2" />
                Add More
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {educationList.map((edu, index) => (
                <div key={edu.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Education {index + 1}</Label>
                    {educationList.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeEducation(edu.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Degree / Qualification</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        placeholder="e.g., Post Graduate, Bachelor's, Diploma..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Institution</Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                          placeholder="University / College name"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Year</Label>
                        <Input
                          value={edu.year}
                          onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                          placeholder="e.g., 2020"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
