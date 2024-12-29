import { Upload } from '@/lib/types';
import { UploadCard } from './upload-card';

interface UploadGridProps {
  uploads: Upload[];
}

export function UploadGrid({ uploads }: UploadGridProps) {
  if (uploads.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No files uploaded yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {uploads.map((upload) => (
        <UploadCard key={upload.id} upload={upload} />
      ))}
    </div>
  );
}