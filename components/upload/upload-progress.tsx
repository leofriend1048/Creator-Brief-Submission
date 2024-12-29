'use client';

import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface UploadProgressProps {
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
}

export function UploadProgress({ progress, status }: UploadProgressProps) {
  const statusMessages = {
    uploading: 'Uploading...',
    processing: 'Processing...',
    complete: 'Complete',
    error: 'Error',
  };

  const statusVariants = {
    uploading: 'secondary',
    processing: 'warning',
    complete: 'default',
    error: 'destructive',
  } as const;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Badge variant={statusVariants[status]}>
          {statusMessages[status]}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {progress}%
        </span>
      </div>
      <Progress value={progress} />
    </div>
  );
}