import { useEffect, useState } from 'react';

const STORAGE_KEY = 'activeGroup';
const DEFAULT_GROUP = 'default';

export function useActiveGroup() {
  const [activeGroup, setActiveGroup] = useState<string>(() => {
    // Initialize from localStorage if available, otherwise use default
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored || DEFAULT_GROUP;
    }
    return DEFAULT_GROUP;
  });

  useEffect(() => {
    // Persist to localStorage whenever activeGroup changes
    if (activeGroup) {
      localStorage.setItem(STORAGE_KEY, activeGroup);
    }
  }, [activeGroup]);

  const setGroup = (group: string) => {
    if (!group) return;
    setActiveGroup(group);
  };

  return {
    activeGroup,
    setActiveGroup: setGroup,
  };
}
