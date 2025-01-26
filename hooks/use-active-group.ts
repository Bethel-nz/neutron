import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Group } from '@/types';
import { queryClient } from '@/query.client';

interface ActiveGroupState {
  activeGroup: Group | null;
  setActiveGroup: (group: Group) => void;
  resetActiveGroup: () => void;
}

export const useActiveGroup = create<ActiveGroupState>()(
  persist(
    (set) => ({
      activeGroup: null,
      setActiveGroup: (group: Group) => {
		  queryClient.invalidateQueries({ queryKey: ['bookmarks', group.id] });
        set({ activeGroup: group });
      },
      resetActiveGroup: () => set({ activeGroup: null }),
    }),
    {
      name: 'active-group-storage',
      skipHydration: true,
    }
  )
);


