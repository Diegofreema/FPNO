import { create } from 'zustand';

interface ShowCameraState {
  showCamera: boolean;
  setShowCamera: () => void;
}

export const useShowCamera = create<ShowCameraState>((set) => ({
  showCamera: false,
  setShowCamera: () => set((state) => ({ showCamera: !state.showCamera })),
}));
