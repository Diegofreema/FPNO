import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Id } from "@/convex/_generated/dataModel";

type Store = {
  id: Id<"users"> | null;
  getId: (id: Id<"users">) => void;
  removeId: () => void;
};

export const useId = create<Store>()(
  persist(
    (set) => ({
      id: null,
      getId: (id) =>
        set({
          id,
        }),
      removeId: () =>
        set({
          id: null,
        }),
    }),
    {
      name: "id",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
