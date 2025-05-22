import { create } from 'zustand';

export type SelectedMessage = {
  messageId: string;
  senderId: string;
};
type Store = {
  selected: SelectedMessage[];
  setSelected: (selectedMessage: SelectedMessage) => void;
  removeSelected: (selectedMessage: SelectedMessage) => void;
  clear: () => void;
};

export const useSelected = create<Store>((set) => ({
  selected: [],
  setSelected: (selectedMessage) => {
    set((state) => {
      const selected = [...state.selected];
      const index = selected.findIndex(
        (message) => message.messageId === selectedMessage.messageId
      );
      if (index === -1) {
        selected.push(selectedMessage);
      } else {
        selected.splice(index, 1);
      }
      return { selected };
    });
  },
  clear: () => {
    set({ selected: [] });
  },
  removeSelected: (selectedMessage) => {
    set((state) => {
      const selected = [...state.selected];
      const index = selected.findIndex(
        (message) => message.messageId === selectedMessage.messageId
      );
      if (index !== -1) {
        selected.splice(index, 1);
      }
      return { selected };
    });
  },
}));
