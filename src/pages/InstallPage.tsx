import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Smartphone, Monitor, CheckCircle, Share, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/MainLayout';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <MainLayout>
      <section className="min-h-[80vh] py-20 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-4 block">
              Install App
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Install <span className="gradient-text">Portfolio App</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Add this app to your home screen for quick access and an app-like experience
            </p>
          </motion.div>

          {isInstalled ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto"
            >
              <Card className="text-center">
                <CardContent className="pt-6">
                  <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Already Installed!</h2>
                  <p className="text-muted-foreground">
                    This app is already installed on your device. You can find it on your home screen.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Desktop/Android Installation */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Monitor className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Desktop & Android</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {deferredPrompt ? (
                      <>
                        <p className="text-muted-foreground">
                          Click the button below to install the app directly
                        </p>
                        <Button onClick={handleInstall} className="w-full gradient-bg">
                          <Download className="h-4 w-4 mr-2" />
                          Install Now
                        </Button>
                      </>
                    ) : (
                      <>
                        <p className="text-muted-foreground">
                          Follow these steps to install:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                          <li>Click the menu button (⋮) in your browser</li>
                          <li>Select "Install app" or "Add to Home screen"</li>
                          <li>Confirm the installation</li>
                        </ol>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* iOS Installation */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Smartphone className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>iPhone & iPad</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Follow these steps to install on iOS:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span>1.</span>
                        <span>Tap the Share button <Share className="inline h-4 w-4" /></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>2.</span>
                        <span>Scroll down and tap "Add to Home Screen" <Plus className="inline h-4 w-4" /></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>3.</span>
                        <span>Tap "Add" in the top right corner</span>
                      </li>
                    </ol>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 text-center"
          >
            <h3 className="text-xl font-semibold mb-8">Why Install?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { icon: '⚡', label: 'Fast Loading' },
                { icon: '📱', label: 'App-like Feel' },
                { icon: '🔔', label: 'Works Offline' },
                { icon: '🏠', label: 'Home Screen Access' },
              ].map((feature, index) => (
                <div key={index} className="p-4 rounded-lg bg-card border border-border">
                  <span className="text-2xl mb-2 block">{feature.icon}</span>
                  <span className="text-sm font-medium">{feature.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}
