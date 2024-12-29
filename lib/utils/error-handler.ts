import { toast } from '@/components/ui/use-toast';

interface ErrorWithMessage {
  message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

export function handleError(error: unknown, fallbackMessage: string) {
  console.error('Error:', error);
  
  const message = isErrorWithMessage(error) 
    ? error.message 
    : fallbackMessage;

  toast({
    title: 'Error',
    description: message,
    variant: 'destructive',
  });
}