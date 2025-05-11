import { userData } from '@/types';
import { create } from 'zustand';

type Store = {
  user: userData | null;
  getUser: (user: userData) => void;
  removeUser: () => void;
};

export const useTempData = create<Store>()((set) => ({
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
}));
