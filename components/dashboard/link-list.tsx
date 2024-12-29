'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PublicLink } from '@/lib/types';
import { formatDate } from '@/lib/utils/format';
import { getPublicUploadUrl } from '@/lib/utils/url';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/ui/loading/spinner';

export function LinkList() {
  const [links, setLinks] = useState<PublicLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links');
      if (!response.ok) throw new Error('Failed to fetch links');
      const data = await response.json();
      setLinks(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load public links',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyLink = (urlKey: string) => {
    navigator.clipboard.writeText(getPublicUploadUrl(urlKey));
    toast({
      title: 'Success',
      description: 'Link copied to clipboard',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No links found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Created</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Script Preview</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {links.map((link) => (
          <TableRow key={link.id}>
            <TableCell>{formatDate(link.createdAt)}</TableCell>
            <TableCell>
              <Badge variant={link.status === 'completed' ? 'default' : 'secondary'}>
                {link.status}
              </Badge>
            </TableCell>
            <TableCell className="max-w-md truncate">
              {link.scriptText}
            </TableCell>
            <TableCell className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyLink(link.urlKey)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link href={`/dashboard/links/${link.id}`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}