import { queryClient } from '@/query.client';
import type { Group } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ActiveGroupState {
  activeGroup: Group | null;
  lastActiveTimestamp: number;
  setActiveGroup: (group: Group) => void;
  resetActiveGroup: () => void;
}

export const useActiveGroup = create<ActiveGroupState>()(
  persist(
    (set) => ({
      activeGroup: null,
      lastActiveTimestamp: 0,
      setActiveGroup: (group: Group) => {
        queryClient.invalidateQueries({ queryKey: ['bookmarks', group.id] });
        set({
          activeGroup: group,
          lastActiveTimestamp: Date.now(),
        });
      },
      resetActiveGroup: () =>
        set({
          activeGroup: null,
          lastActiveTimestamp: Date.now(),
        }),
    }),
    {
      name: 'active-group-storage',
      skipHydration: true,
      partialize: (state) => ({
        activeGroup: state.activeGroup,
        lastActiveTimestamp: state.lastActiveTimestamp,
      }),
    }
  )
);

// Optional: Add a hook to get the last active group
export const useLastActiveGroup = () => {
  const { activeGroup, lastActiveTimestamp } = useActiveGroup();
  return {
    lastActiveGroup: activeGroup,
    lastActiveTimestamp,
  };
};
