import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Store = {
  isFirstTime: boolean;
  setFirstTimeToFalse: () => void;
};

export const useFirstTimeModal = create<Store>()(
  persist(
    (set) => ({
      isFirstTime: true,
      setFirstTimeToFalse: () => set(() => ({ isFirstTime: false })),
    }),
    {
      name: 'firstTimeModal',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
