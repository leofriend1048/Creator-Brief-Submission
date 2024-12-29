'use client';

import { useEffect, useState } from 'react';
import { formatDate, formatFileSize, truncateFilename } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { VideoPlayer } from './video-player';
import { Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip } from '@/components/ui/tooltip';
import type { Upload } from '@/lib/types';

interface UploadCardProps {
  upload: Upload;
}

export function UploadCard({ upload }: UploadCardProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const response = await fetch(`/api/uploads/${upload.id}/download`);
        const data = await response.json();
        setVideoUrl(data.downloadUrl);
      } catch (error) {
        console.error('Failed to fetch video URL:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoUrl();
  }, [upload.id]);

  const truncatedName = truncateFilename(upload.fileName, 30);
  const showTooltip = truncatedName !== upload.fileName;

  return (
    <Card>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="relative w-full pt-[56.25%] mb-4">
            <Skeleton className="absolute top-0 left-0 w-full h-full rounded-lg" />
          </div>
        ) : videoUrl && (
          <div className="mb-4">
            <VideoPlayer src={videoUrl} />
          </div>
        )}
        <div className="flex justify-between items-center gap-4">
          <div className="min-w-0 flex-1"> {/* Add min-w-0 to allow truncation */}
            <Tooltip content={upload.fileName} enabled={showTooltip}>
              <h3 className="font-medium truncate">
                {truncatedName}
              </h3>
            </Tooltip>
            <p className="text-sm text-muted-foreground truncate">
              {formatFileSize(upload.fileSize)} • Uploaded {formatDate(upload.createdAt)}
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="flex-shrink-0">
            <a href={`/api/uploads/${upload.id}/download`} download={upload.fileName}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}