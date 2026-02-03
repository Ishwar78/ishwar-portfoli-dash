import { useState, useEffect } from 'react';
import { Save, Plus, X, GripVertical, ExternalLink } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { HeaderNavLink, FooterSection, FooterLink } from '@/types/portfolio';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const defaultNavLinks: HeaderNavLink[] = [
  { id: '1', label: 'Home', url: '/', enabled: true },
  { id: '2', label: 'About', url: '/about', enabled: true },
  { id: '3', label: 'Skills', url: '/skills', enabled: true },
  { id: '4', label: 'Experience', url: '/experience', enabled: true },
  { id: '5', label: 'Projects', url: '/projects', enabled: true },
  { id: '6', label: 'Blog', url: '/blog', enabled: true },
  { id: '7', label: 'Contact', url: '/contact', enabled: true },
];

const defaultFooterSections: FooterSection[] = [
  {
    id: 'quick-links',
    title: 'Quick Links',
    links: [
      { id: '1', label: 'About', url: '/about' },
      { id: '2', label: 'Projects', url: '/projects' },
      { id: '3', label: 'Blog', url: '/blog' },
      { id: '4', label: 'Contact', url: '/contact' },
    ]
  }
];

export default function AdminNavigationPage() {
  const { siteSettings, setSiteSettings } = usePortfolio();
  const { toast } = useToast();
  
  const [headerLinks, setHeaderLinks] = useState<HeaderNavLink[]>(
    siteSettings.headerNavLinks?.length ? siteSettings.headerNavLinks : defaultNavLinks
  );
  const [footerSections, setFooterSections] = useState<FooterSection[]>(
    siteSettings.footerSections?.length ? siteSettings.footerSections : defaultFooterSections
  );
  const [footerCopyright, setFooterCopyright] = useState(siteSettings.footerCopyright || '');

  useEffect(() => {
    setHeaderLinks(siteSettings.headerNavLinks?.length ? siteSettings.headerNavLinks : defaultNavLinks);
    setFooterSections(siteSettings.footerSections?.length ? siteSettings.footerSections : defaultFooterSections);
    setFooterCopyright(siteSettings.footerCopyright || '');
  }, [siteSettings]);

  // Header link handlers
  const addHeaderLink = () => {
    const newLink: HeaderNavLink = {
      id: Date.now().toString(),
      label: 'New Link',
      url: '/',
      enabled: true,
      isExternal: false,
    };
    setHeaderLinks([...headerLinks, newLink]);
  };

  const updateHeaderLink = (id: string, field: keyof HeaderNavLink, value: any) => {
    setHeaderLinks(links => links.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  const removeHeaderLink = (id: string) => {
    setHeaderLinks(links => links.filter(link => link.id !== id));
  };

  // Footer section handlers
  const addFooterSection = () => {
    const newSection: FooterSection = {
      id: Date.now().toString(),
      title: 'New Section',
      links: [],
    };
    setFooterSections([...footerSections, newSection]);
  };

  const updateFooterSectionTitle = (sectionId: string, title: string) => {
    setFooterSections(sections => sections.map(section =>
      section.id === sectionId ? { ...section, title } : section
    ));
  };

  const removeFooterSection = (sectionId: string) => {
    setFooterSections(sections => sections.filter(section => section.id !== sectionId));
  };

  const addFooterLink = (sectionId: string) => {
    const newLink: FooterLink = {
      id: Date.now().toString(),
      label: 'New Link',
      url: '/',
      isExternal: false,
    };
    setFooterSections(sections => sections.map(section =>
      section.id === sectionId 
        ? { ...section, links: [...section.links, newLink] }
        : section
    ));
  };

  const updateFooterLink = (sectionId: string, linkId: string, field: keyof FooterLink, value: any) => {
    setFooterSections(sections => sections.map(section =>
      section.id === sectionId 
        ? {
            ...section,
            links: section.links.map(link =>
              link.id === linkId ? { ...link, [field]: value } : link
            )
          }
        : section
    ));
  };

  const removeFooterLink = (sectionId: string, linkId: string) => {
    setFooterSections(sections => sections.map(section =>
      section.id === sectionId 
        ? { ...section, links: section.links.filter(link => link.id !== linkId) }
        : section
    ));
  };

  const handleSave = () => {
    setSiteSettings(prev => ({
      ...prev,
      headerNavLinks: headerLinks,
      footerSections: footerSections,
      footerCopyright: footerCopyright || undefined,
    }));
    toast({ title: 'Navigation settings saved successfully' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Navigation</h1>
            <p className="text-muted-foreground">Customize header and footer links</p>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="header" className="max-w-3xl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="header">Header Navigation</TabsTrigger>
            <TabsTrigger value="footer">Footer Sections</TabsTrigger>
          </TabsList>

          {/* Header Navigation Tab */}
          <TabsContent value="header" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Header Links</CardTitle>
                    <CardDescription>Manage navigation menu items</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={addHeaderLink}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Link
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {headerLinks.map((link) => (
                  <div key={link.id} className="flex items-center gap-3 p-3 border border-border rounded-lg bg-muted/30">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Input
                        value={link.label}
                        onChange={(e) => updateHeaderLink(link.id, 'label', e.target.value)}
                        placeholder="Label"
                      />
                      <Input
                        value={link.url}
                        onChange={(e) => updateHeaderLink(link.id, 'url', e.target.value)}
                        placeholder="URL"
                      />
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={link.enabled}
                            onCheckedChange={(checked) => updateHeaderLink(link.id, 'enabled', checked)}
                          />
                          <span className="text-xs text-muted-foreground">Visible</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={link.isExternal}
                            onCheckedChange={(checked) => updateHeaderLink(link.id, 'isExternal', checked)}
                          />
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeHeaderLink(link.id)}
                      className="text-destructive hover:text-destructive h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {headerLinks.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No header links added</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Footer Sections Tab */}
          <TabsContent value="footer" className="space-y-4 mt-4">
            {/* Footer Copyright */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Footer Copyright</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={footerCopyright}
                  onChange={(e) => setFooterCopyright(e.target.value)}
                  placeholder="© 2024 Your Name. All rights reserved."
                />
                <p className="text-xs text-muted-foreground mt-1">Leave empty for default copyright text</p>
              </CardContent>
            </Card>

            {/* Footer Sections */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Footer Sections</CardTitle>
                    <CardDescription>Create custom footer sections with links</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={addFooterSection}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Section
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {footerSections.map((section) => (
                  <div key={section.id} className="border border-border rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <Input
                        value={section.title}
                        onChange={(e) => updateFooterSectionTitle(section.id, e.target.value)}
                        placeholder="Section Title"
                        className="flex-1 font-medium"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFooterSection(section.id)}
                        className="text-destructive hover:text-destructive h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2 pl-4 border-l-2 border-border">
                      {section.links.map((link) => (
                        <div key={link.id} className="flex items-center gap-2">
                          <Input
                            value={link.label}
                            onChange={(e) => updateFooterLink(section.id, link.id, 'label', e.target.value)}
                            placeholder="Link Label"
                            className="flex-1"
                          />
                          <Input
                            value={link.url}
                            onChange={(e) => updateFooterLink(section.id, link.id, 'url', e.target.value)}
                            placeholder="URL"
                            className="flex-1"
                          />
                          <div className="flex items-center gap-1">
                            <Switch
                              checked={link.isExternal}
                              onCheckedChange={(checked) => updateFooterLink(section.id, link.id, 'isExternal', checked)}
                            />
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFooterLink(section.id, link.id)}
                            className="text-destructive hover:text-destructive h-7 w-7"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addFooterLink(section.id)}
                        className="text-muted-foreground"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Link
                      </Button>
                    </div>
                  </div>
                ))}
                {footerSections.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No footer sections added</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
