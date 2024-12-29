'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/loading/spinner';
import { useToast } from '@/components/ui/use-toast';

export function CreateLinkForm() {
  const [script, setScript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/links/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create link');
      }

      toast({
        title: 'Success',
        description: 'Public link created successfully',
      });
      
      setScript('');
    } catch (error) {
      console.error('Create link error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create public link',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        placeholder="Enter the script text..."
        className="min-h-[200px]"
        required
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading || !script.trim()}>
        {isLoading ? (
          <>
            <Spinner size="sm" className="mr-2" />
            Creating...
          </>
        ) : (
          'Create Public Link'
        )}
      </Button>
    </form>
  );
}