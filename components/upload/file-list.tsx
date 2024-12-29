'use client';

import { useUploadStore } from '@/lib/hooks/use-upload-store';
import { formatFileSize } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function FileList() {
  const { files, removeFile } = useUploadStore();

  if (files.length === 0) return null;

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.name}
          className="flex items-center justify-between p-4 bg-muted rounded-lg"
        >
          <div>
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatFileSize(file.size)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeFile(file.name)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}