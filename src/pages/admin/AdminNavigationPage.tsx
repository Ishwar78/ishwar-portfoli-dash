import { useState, useEffect } from 'react';
import { Save, Plus, X, GripVertical, ExternalLink, FileText } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { HeaderNavLink, FooterSection, FooterLink, CustomPage } from '@/types/portfolio';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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
  const { siteSettings, setSiteSettings, customPages, setCustomPages } = usePortfolio();
  const { toast } = useToast();
  
  const [headerLinks, setHeaderLinks] = useState<HeaderNavLink[]>(
    siteSettings.headerNavLinks?.length ? siteSettings.headerNavLinks : defaultNavLinks
  );
  const [footerSections, setFooterSections] = useState<FooterSection[]>(
    siteSettings.footerSections?.length ? siteSettings.footerSections : defaultFooterSections
  );
  const [footerCopyright, setFooterCopyright] = useState(siteSettings.footerCopyright || '');
  
  // Custom page dialog state
  const [isCustomPageDialogOpen, setIsCustomPageDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [pageTitle, setPageTitle] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [pageContent, setPageContent] = useState('');

  useEffect(() => {
    setHeaderLinks(siteSettings.headerNavLinks?.length ? siteSettings.headerNavLinks : defaultNavLinks);
    setFooterSections(siteSettings.footerSections?.length ? siteSettings.footerSections : defaultFooterSections);
    setFooterCopyright(siteSettings.footerCopyright || '');
  }, [siteSettings]);

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

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

  const addCustomPageLink = () => {
    setEditingPage(null);
    setPageTitle('');
    setPageSlug('');
    setPageContent('');
    setIsCustomPageDialogOpen(true);
  };

  const saveCustomPage = () => {
    if (!pageTitle.trim() || !pageSlug.trim()) {
      toast({ title: 'Title और Slug required हैं', variant: 'destructive' });
      return;
    }

    const slug = pageSlug.startsWith('/') ? pageSlug.slice(1) : pageSlug;
    const now = new Date().toISOString();

    if (editingPage) {
      // Update existing page
      setCustomPages(pages => pages.map(p => 
        p.id === editingPage.id 
          ? { ...p, title: pageTitle, slug, content: pageContent, updatedAt: now }
          : p
      ));
    } else {
      // Create new page
      const newPage: CustomPage = {
        id: Date.now().toString(),
        title: pageTitle,
        slug,
        content: pageContent,
        createdAt: now,
        updatedAt: now,
      };
      setCustomPages([...customPages, newPage]);

      // Add to header links automatically
      const newLink: HeaderNavLink = {
        id: `custom-${newPage.id}`,
        label: pageTitle,
        url: `/page/${slug}`,
        enabled: true,
        isExternal: false,
      };
      setHeaderLinks([...headerLinks, newLink]);
    }

    setIsCustomPageDialogOpen(false);
    toast({ title: editingPage ? 'Page updated successfully' : 'Custom page created!' });
  };

  const editCustomPage = (page: CustomPage) => {
    setEditingPage(page);
    setPageTitle(page.title);
    setPageSlug(page.slug);
    setPageContent(page.content);
    setIsCustomPageDialogOpen(true);
  };

  const deleteCustomPage = (pageId: string) => {
    setCustomPages(pages => pages.filter(p => p.id !== pageId));
    // Also remove from header links
    setHeaderLinks(links => links.filter(l => !l.url.includes(`/page/`) || !l.id.includes(pageId)));
    toast({ title: 'Page deleted' });
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

        <Tabs defaultValue="header" className="max-w-4xl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="header">Header Navigation</TabsTrigger>
            <TabsTrigger value="footer">Footer Sections</TabsTrigger>
            <TabsTrigger value="pages">Custom Pages</TabsTrigger>
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
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={addCustomPageLink}>
                      <FileText className="h-4 w-4 mr-1" />
                      New Page
                    </Button>
                    <Button variant="outline" size="sm" onClick={addHeaderLink}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Link
                    </Button>
                  </div>
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

          {/* Custom Pages Tab */}
          <TabsContent value="pages" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Custom Pages</CardTitle>
                    <CardDescription>Create custom pages with your own content (Markdown supported)</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={addCustomPageLink}>
                    <Plus className="h-4 w-4 mr-1" />
                    New Page
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {customPages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No custom pages yet</p>
                    <p className="text-sm">Create a new page to add custom content</p>
                  </div>
                ) : (
                  customPages.map((page) => (
                    <div key={page.id} className="flex items-center gap-3 p-4 border border-border rounded-lg bg-muted/30">
                      <FileText className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <h4 className="font-medium">{page.title}</h4>
                        <p className="text-sm text-muted-foreground">/page/{page.slug}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => editCustomPage(page)}>
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteCustomPage(page.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Custom Page Dialog */}
        <Dialog open={isCustomPageDialogOpen} onOpenChange={setIsCustomPageDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPage ? 'Edit Page' : 'Create New Page'}</DialogTitle>
              <DialogDescription>
                Add a custom page with your own content. Markdown is supported.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Page Title</label>
                <Input
                  value={pageTitle}
                  onChange={(e) => {
                    setPageTitle(e.target.value);
                    if (!editingPage) {
                      setPageSlug(generateSlug(e.target.value));
                    }
                  }}
                  placeholder="e.g., Services, Portfolio, Resources"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">URL Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">/page/</span>
                  <Input
                    value={pageSlug}
                    onChange={(e) => setPageSlug(generateSlug(e.target.value))}
                    placeholder="services"
                  />
                </div>
                <p className="text-xs text-muted-foreground">This will be the URL of your page</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Page Content (Markdown)</label>
                <Textarea
                  value={pageContent}
                  onChange={(e) => setPageContent(e.target.value)}
                  placeholder="# Your Page Title

Write your content here using Markdown...

## Section 1
Your content...

## Section 2
More content..."
                  rows={12}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Use Markdown for formatting: # Heading, **bold**, *italic*, - lists, etc.
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCustomPageDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveCustomPage}>
                  {editingPage ? 'Update Page' : 'Create Page'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
