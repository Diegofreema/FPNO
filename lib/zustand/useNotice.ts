import { create } from "zustand";
import { NewsTypes } from "@/types";

type Store = {
  detail: NewsTypes;
  getDetail: (item: NewsTypes) => void;
};

export const useNotice = create<Store>((set) => ({
  detail: {
    messages: "",
    heading: "",
    date1: "",
  },
  getDetail: (item: NewsTypes) => set({ detail: item }),
}));
