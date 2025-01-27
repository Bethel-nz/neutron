'use client';
import {
  QueryClient,
  QueryClientProvider as ClientProvider,
} from '@tanstack/react-query';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
      retry: 3,
      refetchInterval: 2 * MINUTE,
      gcTime: 5 * MINUTE,
      staleTime: 5 * MINUTE,
    },
  },
});

export function QueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientProvider client={queryClient}>{children}</ClientProvider>;
}
