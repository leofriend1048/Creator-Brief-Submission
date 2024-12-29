'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LinkDetails } from '@/components/dashboard/link-details';
import { ValidationReport } from '@/components/dashboard/validation-report';
import { UploadGrid } from '@/components/uploads/upload-grid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { SkeletonCard } from '@/components/ui/loading/skeleton-card';
import type { PublicLink, Upload } from '@/lib/types';

export default function LinkDetailsPage() {
  const params = useParams();
  const [link, setLink] = useState<PublicLink | null>(null);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (params.id) {
      fetchLinkDetails();
    }
  }, [params.id]);

  const fetchLinkDetails = async () => {
    try {
      const response = await fetch(`/api/links/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch link details');
      const data = await response.json();
      setLink(data.link);
      setUploads(data.uploads);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load link details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <SkeletonCard rows={4} />
        <SkeletonCard rows={2} />
        <SkeletonCard rows={3} />
      </div>
    );
  }

  if (!link) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              Link not found
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get the validation report from the most recent upload
  const validationReport = uploads.length > 0 ? uploads[0].validationReport : null;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <LinkDetails link={link} />
      
      {validationReport && (
        <ValidationReport report={validationReport} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Files</CardTitle>
        </CardHeader>
        <CardContent>
          <UploadGrid uploads={uploads} />
        </CardContent>
      </Card>
    </div>
  );
}