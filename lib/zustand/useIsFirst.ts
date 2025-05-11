import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
type Store = {
  isFirst: boolean;
  setIsFirstToFalse: () => void;
};

export const useIsFirst = create<Store>()(
  persist(
    (set) => ({
      isFirst: true,
      setIsFirstToFalse: () => set({ isFirst: false }),
    }),
    { name: "isFirst", storage: createJSONStorage(() => AsyncStorage) },
  ),
);
