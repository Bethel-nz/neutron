'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share, Plus } from 'lucide-react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [isIOS, setIsIOS] = React.useState(false);
  const [isStandalone, setIsStandalone] = React.useState(false);

  React.useEffect(() => {
    // Check if on iOS
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );

    // Check if already installed
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Show install toast when prompt is available
      if (!isIOS) {
        showInstallToast(e);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show iOS instructions after a delay
    if (isIOS && !isStandalone) {
      const timer = setTimeout(showIOSToast, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, [isIOS, isStandalone]);

  const handleInstallClick = async (promptEvent: any) => {
    if (!promptEvent) return;

    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;

    if (outcome === 'accepted') {
      toast.success('Installing Neutron');
      setDeferredPrompt(null);
    }
  };

  const showInstallToast = (promptEvent: any) => {
    toast.custom(
      (t) => (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className='bg-white rounded-lg shadow-lg p-4 flex items-center gap-4'
          >
            <div className='flex-1'>
              <h3 className='font-medium'>Install Neutron</h3>
              <p className='text-sm text-muted-foreground'>
                Install our app for a better experience
              </p>
            </div>
            <Button
              size='sm'
              onClick={() => handleInstallClick(promptEvent)}
              className='gap-2'
            >
              <Download className='h-4 w-4' />
              Install
            </Button>
          </motion.div>
        </AnimatePresence>
      ),
      {
        duration: 10000,
        position: 'bottom-right',
      }
    );
  };

  const showIOSToast = () => {
    toast.custom(
      (t) => (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className='bg-white rounded-lg shadow-lg p-4'
          >
            <h3 className='font-medium mb-2'>Install Neutron</h3>
            <p className='text-sm text-muted-foreground flex items-center gap-1'>
              To install, tap the share button
              <Share className='h-4 w-4' />
              and then "Add to Home Screen"
              <Plus className='h-4 w-4' />
            </p>
          </motion.div>
        </AnimatePresence>
      ),
      {
        duration: 10000,
        position: 'bottom-right',
      }
    );
  };

  // Component no longer needs to render anything directly
  return null;
}
