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
  const duration = type === 'register' ? 3000 : 1500;

  useEffect(() => {
    if (!isVisible) return;

    const totalMessages = messages.length;
    let currentIndex = 0;

    const messageInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % totalMessages;
      setMessageIndex(currentIndex);
    }, duration / totalMessages);

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
          className='fixed inset-0 z-[100] flex items-center justify-center bg-background backdrop-blur-sm'
        >
          <div className='flex flex-col items-center gap-6 p-8 rounded-lg bg-card  mx-4'>
            <motion.div
              animate={{
                rotate: [0, 360],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                },
              }}
            >
              <Box className='h-12 w-12 text-primary' />
            </motion.div>
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className='text-lg font-medium text-foreground min-h-[28px] text-center'
            >
              {messages[messageIndex]}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
