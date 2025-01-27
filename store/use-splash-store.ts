import { create } from 'zustand';

type SplashType = 'login' | 'register';

interface SplashState {
  isVisible: boolean;
  type: SplashType;
  showSplash: (type: SplashType) => void;
  hideSplash: () => void;
}

export const useSplashStore = create<SplashState>((set) => ({
  isVisible: false,
  type: 'login',
  showSplash: (type) => set({ isVisible: true, type }),
  hideSplash: () => set({ isVisible: false }),
}));
