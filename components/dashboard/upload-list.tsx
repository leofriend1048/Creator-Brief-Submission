import { Upload } from '@/lib/types';
import { formatDate, formatFileSize } from '@/lib/utils/format';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface UploadListProps {
  uploads: Upload[];
}

export function UploadList({ uploads }: UploadListProps) {
  if (uploads.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No files uploaded yet
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>File Name</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Uploaded</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {uploads.map((upload) => (
          <TableRow key={upload.id}>
            <TableCell>{upload.fileName}</TableCell>
            <TableCell>{formatFileSize(upload.fileSize)}</TableCell>
            <TableCell>{formatDate(upload.createdAt)}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`/api/uploads/${upload.id}/download`}
                  download={upload.fileName}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </a>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}