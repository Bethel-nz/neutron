import { create } from 'zustand';
import { friendlyWords } from 'friendlier-words';
import { observable } from '@legendapp/state';

interface GroupDialogState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const groupDialog$ = observable({
  name: '',
});

export const useGroupDialog = create<GroupDialogState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => {
    set({ isOpen: false });
    groupDialog$.name.set('');
  },
}));
