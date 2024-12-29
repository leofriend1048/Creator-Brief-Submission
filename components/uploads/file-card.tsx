'use client';

import { formatFileSize, truncateFilename } from '@/lib/utils/format';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip } from '@/components/ui/tooltip';
import { X, FileVideo } from 'lucide-react';
import type { FileWithPreview } from '@/lib/types';

interface FileCardProps {
  file: FileWithPreview;
  onRemove: () => void;
}

export function FileCard({ file, onRemove }: FileCardProps) {
  const truncatedName = truncateFilename(file.name, 24);
  const showTooltip = truncatedName !== file.name;

  return (
    <Card className="relative group">
      <CardContent className="p-4">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-3">
          {file.preview ? (
            <video
              src={file.preview}
              className="w-full h-full rounded-lg object-cover"
            />
          ) : (
            <FileVideo className="h-12 w-12 text-muted-foreground" />
          )}
        </div>

        <div className="space-y-1.5">
          <Tooltip content={file.name} enabled={showTooltip}>
            <h3 className="font-medium text-sm truncate">
              {truncatedName}
            </h3>
          </Tooltip>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-normal">
              {formatFileSize(file.size)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}