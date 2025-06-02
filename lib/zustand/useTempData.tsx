import {User} from '@/types';
import {create} from 'zustand';

type Store = {
  user: User | null;
  getUser: (user: User) => void;
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
