'use client';

import { FileCard } from './file-card';
import type { FileWithPreview } from '@/lib/types';

interface FileGridProps {
  files: FileWithPreview[];
  onRemove: (name: string) => void;
}

export function FileGrid({ files, onRemove }: FileGridProps) {
  if (files.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => (
        <FileCard 
          key={file.name} 
          file={file} 
          onRemove={() => onRemove(file.name)} 
        />
      ))}
    </div>
  );
}