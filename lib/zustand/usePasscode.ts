import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Store = {
  passCode: string;
  isPassCode: boolean;
  getPassCode: (passCode: string) => void;
  togglePassCode: (value: boolean) => void;
  removePassCode: () => void;
  deviceIsLock: boolean;
  lockDevice: () => void;
  unlockDevice: () => void;
};

export const usePassCode = create<Store>()(
  persist(
    (set) => ({
      passCode: "",
      getPassCode: (passCode: string) => set({ passCode }),

      removePassCode: () =>
        set({
          passCode: "",
        }),
      isPassCode: false,
      togglePassCode: (value: boolean) => set(() => ({ isPassCode: value })),

      deviceIsLock: false,
      lockDevice: () => set({ deviceIsLock: true }),
      unlockDevice: () => set({ deviceIsLock: false }),
    }),
    {
      name: "passCode",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
