import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Store = {
  expoToken: string;
  setExpoToken: (token: string) => void;
  removeExpoToken: () => void;
};

export const useExpoToken = create<Store>()(
  persist(
    (set) => ({
      expoToken: '',
      setExpoToken: (token) => set({ expoToken: token }),
      removeExpoToken: () => set({ expoToken: '' }),
    }),
    {
      name: 'expo-token',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
