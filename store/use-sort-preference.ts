import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SortDirection = 'asc' | 'desc'

interface SortPreferenceState {
	direction: SortDirection
	toggleDirection: () => void
}

export const useSortPreference = create<SortPreferenceState>()(
	persist(
		(set) => ({
			direction: 'desc',
			toggleDirection: () => set((state) => ({
				direction: state.direction === 'asc' ? 'desc' : 'asc'
			})),
		}),
		{
			name: 'sort-preference',
		}
	)
)
