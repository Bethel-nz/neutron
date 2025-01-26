import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type LayoutType = 'grid' | 'list'

interface LayoutPreferenceState {
	layout: LayoutType
	setLayout: (layout: LayoutType) => void
}

export const useLayoutPreference = create<LayoutPreferenceState>()(
	persist(
		(set) => ({
			layout: 'grid',
			setLayout: (layout) => set({ layout }),
		}),
		{
			name: 'layout-preference',
		}
	)
) 