import { userData } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Store = {
  user: userData | null;
  getUser: (user: userData) => void;
  removeUser: () => void;
};

export const useAuth = create<Store>()(
  persist(
    (set) => ({
      user: null,
      getUser: (data) =>
        set({
          user: {
            ...data,
          },
        }),
      removeUser: () =>
        set({
          user: null,
        }),
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
