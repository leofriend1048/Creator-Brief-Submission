'use client';

import { PublicLink } from '@/lib/types';
import { formatDate } from '@/lib/utils/format';
import { getPublicUploadUrl } from '@/lib/utils/url';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface LinkDetailsProps {
  link: PublicLink;
}

export function LinkDetails({ link }: LinkDetailsProps) {
  const { toast } = useToast();

  const copyLink = () => {
    navigator.clipboard.writeText(getPublicUploadUrl(link.urlKey));
    toast({
      title: 'Success',
      description: 'Link copied to clipboard',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Link Details</CardTitle>
          <Badge variant={link.status === 'completed' ? 'default' : 'secondary'}>
            {link.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Public Link</h3>
          <div className="flex items-center gap-2">
            <code className="bg-muted px-2 py-1 rounded">
              {getPublicUploadUrl(link.urlKey)}
            </code>
            <Button variant="outline" size="sm" onClick={copyLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-2">Script</h3>
          <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
            {link.scriptText}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Created: {formatDate(link.createdAt)}
        </div>
      </CardContent>
    </Card>
  );
}