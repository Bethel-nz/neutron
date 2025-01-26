import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SearchState {
	query: string
	setQuery: (query: string) => void
	clearQuery: () => void
}

export const useSearch = create<SearchState>()(
	persist(
		(set) => ({
			query: '',
			setQuery: (query) => set({ query }),
			clearQuery: () => set({ query: '' })
		}),
		{
			name: 'search-storage'
		}
	)
) 