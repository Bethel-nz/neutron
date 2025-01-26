import { create } from 'zustand'
import { Group } from '@/types'
import { persist } from 'zustand/middleware'

interface SelectedGroupState {
	selectedGroup: Group | null
	setSelectedGroup: (group: Group) => void
	clearSelectedGroup: () => void
}

export const useSelectedGroup = create<SelectedGroupState>()(
	persist(
		(set) => ({
			selectedGroup: null,
			setSelectedGroup: (group) => set({ selectedGroup: group }),
			clearSelectedGroup: () => set({ selectedGroup: null }),
		}),
		{
			name: 'group-storage',
		}
	)
) 