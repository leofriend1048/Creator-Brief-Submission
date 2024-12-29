'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { validateFile } from '@/lib/utils/validation';
import { useUploadStore } from '@/lib/hooks/use-upload-store';
import { useToast } from '@/components/ui/use-toast';

export function Dropzone() {
  const { addFiles } = useUploadStore();
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter((file) => {
      const { valid, error } = validateFile(file);
      if (!valid) {
        toast({
          title: 'Invalid file',
          description: error,
          variant: 'destructive',
        });
      }
      return valid;
    });

    if (validFiles.length > 0) {
      addFiles(validFiles);
      toast({
        title: 'Files added',
        description: `${validFiles.length} file(s) ready for upload`,
      });
    }
  }, [addFiles, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 100 * 1024 * 1024, // 100MB
    accept: {
      'video/*': ['.mp4', '.webm', '.ogg'],
      'audio/*': ['.mp3', '.wav', '.ogg']
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-border'}`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
      <p className="mt-2 text-sm text-muted-foreground">
        {isDragActive
          ? 'Drop the files here...'
          : 'Drag & drop files here, or click to select files'}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Maximum file size: 100MB
      </p>
    </div>
  );
}