"use client"
import { QueryClient, QueryClientProvider as ClientProvider } from '@tanstack/react-query'
import { isOnline } from './lib/utils'

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

export const queryClient = new QueryClient({defaultOptions: {
	queries: {
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		refetchOnReconnect: true,
		retry: 3,
		refetchInterval: 5 * MINUTE,
		gcTime: 30 * MINUTE,
		staleTime: 5 * MINUTE
	}
}})

export function QueryClientProvider({ children }: { children: React.ReactNode }) {
	return <ClientProvider client={queryClient}>{children}</ClientProvider>
}
