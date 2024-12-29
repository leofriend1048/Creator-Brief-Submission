'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Dropzone } from '@/components/upload/dropzone';
import { FileGrid } from '@/components/uploads/file-grid';
import { ConfirmationDialog } from '@/components/uploads/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { useUploadStore } from '@/lib/hooks/use-upload-store';
import { useToast } from '@/components/ui/use-toast';
import { Upload, CheckCircle } from 'lucide-react';

export default function UploadPage() {
  const params = useParams();
  const { files, clearFiles, removeFile } = useUploadStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setShowConfirmation(true);
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      formData.append('urlKey', params.id as string);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      toast({
        title: 'Success',
        description: 'Files uploaded successfully',
      });
      clearFiles();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload files',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleValidateAll = async () => {
    if (!params.id) return;

    setIsValidating(true);
    try {
      const response = await fetch(`/api/uploads/${params.id}/validate`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Validation failed');
      }

      toast({
        title: 'Success',
        description: 'All uploads have been validated',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to validate uploads',
        variant: 'destructive',
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Upload Files</h1>
      <div className="space-y-6">
        <Dropzone />
        <FileGrid files={files} onRemove={removeFile} />
        <div className="flex gap-4">
          {files.length > 0 && (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Uploading...' : 'Upload Files'}
            </Button>
          )}
          <Button
            onClick={handleValidateAll}
            disabled={isValidating}
            variant="secondary"
            className="flex-1"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {isValidating ? 'Submit...' : 'Submit File(s)'}
          </Button>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onConfirm={handleConfirmedSubmit}
        onCancel={() => setShowConfirmation(false)}
        fileCount={files.length}
      />
    </div>
  );
}