import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Store = {
  lock: boolean;
  toggleLock: () => void;
  deviceIsLock: boolean;
  lockDevice: () => void;
  unlockDevice: () => void;
};

export const useFingerPrint = create<Store>()(
  persist(
    (set) => ({
      lock: false,
      deviceIsLock: false,
      toggleLock: () => set((state) => ({ lock: !state.lock })),
      lockDevice: () => set(() => ({ deviceIsLock: true })),
      unlockDevice: () => set(() => ({ deviceIsLock: false })),
    }),
    {
      name: "lock",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
