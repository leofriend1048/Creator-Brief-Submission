'use client';

import { create } from 'zustand';

interface UploadState {
  files: File[];
  addFiles: (newFiles: File[]) => void;
  removeFile: (fileName: string) => void;
  clearFiles: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  files: [],
  addFiles: (newFiles) =>
    set((state) => ({
      files: [...state.files, ...newFiles],
    })),
  removeFile: (fileName) =>
    set((state) => ({
      files: state.files.filter((file) => file.name !== fileName),
    })),
  clearFiles: () => set({ files: [] }),
}));