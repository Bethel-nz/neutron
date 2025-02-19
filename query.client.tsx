'use client';
import { useBookmarkQueue } from '@/store/use-bookmark-queue';
import {
  QueryClientProvider as ClientProvider,
  QueryClient,
} from '@tanstack/react-query';
import { useEffect } from 'react';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 3,
      refetchInterval: false,
      gcTime: HOUR,
      staleTime: 5 * MINUTE,
    },
  },
});

function OnlineStatusHandler() {
  const { checkConnectivity, retryFailedOperations } = useBookmarkQueue();

  useEffect(() => {
    let retryTimeoutId: number;

    const handleOnline = async () => {
      const isConnected = await checkConnectivity();

      if (isConnected) {
        if (retryTimeoutId) window.clearTimeout(retryTimeoutId);

        await Promise.all([
          retryFailedOperations(),
          queryClient.refetchQueries({ type: 'active' }),
        ]);
      } else {
        retryTimeoutId = window.setTimeout(() => handleOnline(), 30000);
      }
    };

    window.addEventListener('online', handleOnline);

    handleOnline();

    return () => {
      window.removeEventListener('online', handleOnline);
      if (retryTimeoutId) window.clearTimeout(retryTimeoutId);
    };
  }, [checkConnectivity, retryFailedOperations]);

  return null;
}

export function QueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientProvider client={queryClient}>
      <OnlineStatusHandler />
      {children}
    </ClientProvider>
  );
}
