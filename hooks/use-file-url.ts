import { FileType } from '@/types';
import { create } from 'zustand';

type File = {
  url: string;
  type: FileType;
};
export interface FileUrlStore {
  file: File | null;
  setFileUrl: (file: File) => void;
}

export const useFileUrlStore = create<FileUrlStore>((set) => ({
  file: null,
  setFileUrl: (file) => set({ file }),
}));
