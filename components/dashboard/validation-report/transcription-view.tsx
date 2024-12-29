'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

interface TranscriptionViewProps {
  transcription: string | null;
}

export function TranscriptionView({ transcription }: TranscriptionViewProps) {
  if (!transcription) return null;

  return (
    <AccordionItem value="transcription">
      <AccordionTrigger>Transcription</AccordionTrigger>
      <AccordionContent>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          {transcription}
        </ScrollArea>
      </AccordionContent>
    </AccordionItem>
  );
}