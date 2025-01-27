'use client';

import { Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSplashStore } from '@/store/use-splash-store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const registerMessages = [
  'Setting up your space...',
  'Creating your first group...',
  'Almost there...',
];

const loginMessages = [
  'Welcome back!',
  'Loading your bookmarks...',
  'Getting things ready...',
];

export function SplashScreen() {
  const { isVisible, hideSplash, type } = useSplashStore();
  const [messageIndex, setMessageIndex] = useState(0);
  const router = useRouter();

  const messages = type === 'register' ? registerMessages : loginMessages;
  const duration = type === 'register' ? 6000 : 3000; // Shorter for login

  useEffect(() => {
    if (!isVisible) return;

    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1500); // Slightly faster message changes

    const timer = setTimeout(() => {
      hideSplash();
      router.refresh();
    }, duration);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(timer);
    };
  }, [isVisible, hideSplash, router, messages, duration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex items-center justify-center bg-background'
        >
          <div className='flex flex-col items-center gap-6'>
            <motion.div
              animate={{
                rotateX: [0, 360],
                transition: { duration: 2, repeat: Infinity, ease: 'linear' },
              }}
            >
              <Box className='h-12 w-12 text-primary' />
            </motion.div>
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className='text-lg font-medium text-foreground'
            >
              {messages[messageIndex]}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
