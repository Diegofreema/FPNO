import { create } from "zustand";

type ShowToastOptions = "error" | "success";

type ShowToast = {
  isOpen: boolean;
  message: string;
  description: string;
  onShow: ({
    message,
    description,
  }: {
    message: string;
    description: string;
    type: ShowToastOptions;
  }) => void;
  onHide: () => void;
  type: ShowToastOptions;
};

export const useShowToast = create<ShowToast>((set, get) => ({
  isOpen: false,
  message: "",
  description: "",
  type: "success",
  onShow: ({ message, description, type }) => {
    set({ isOpen: true, message, description, type });
  },
  onHide: () => {
    set({ isOpen: false, message: "", description: "" });
  },
}));
