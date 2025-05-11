import AsyncStorage from "@react-native-async-storage/async-storage";
import { Href } from "expo-router";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Store = {
  currentPath: Href;
  setPath: (path: Href) => void;
};

export const usePath = create<Store>((set) => ({
  currentPath: "/",
  setPath: (path: Href) => set({ currentPath: path }),
}));

type LockStore = {
  isLocked: "true" | "false";
  lock: () => void;
  unlock: () => void;
};

export const useIsLocked = create<LockStore>()(
  persist(
    (set) => ({
      isLocked: "false",
      lock: () => set({ isLocked: "true" }),

      unlock: () => {
        set({ isLocked: "false" });
      },
    }),
    {
      name: "isLocked",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
