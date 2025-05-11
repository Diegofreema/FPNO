import { create } from "zustand";

type Props = {
  image: string;
  setImage: (image: string) => void;
  removeImage: () => void;
};

export const useGetImage = create<Props>((set) => ({
  image: "",
  setImage: (image: string) => set({ image }),
  removeImage: () => set({ image: "" }),
}));
