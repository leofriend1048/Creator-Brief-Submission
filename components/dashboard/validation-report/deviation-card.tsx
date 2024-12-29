'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { DeviationCardProps } from './types';

export function DeviationCard({ deviation }: DeviationCardProps) {
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: "Text copied to clipboard",
    });
  };

  return (
    <div className="group border-b border-border/50 last:border-0">
      <div className="px-4 sm:px-6 lg:px-8 py-6 hover:bg-muted/50 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="destructive" className="font-medium">
                Major Deviation
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{deviation.text}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Original Script</div>
            <div className="p-4 pr-12 rounded-lg bg-muted/50 text-sm relative group">
              {deviation.originalText}
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleCopy(deviation.originalText)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Transcribed Audio</div>
            <div className="p-4 pr-12 rounded-lg bg-destructive/10 text-sm relative group">
              {deviation.transcribedText}
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleCopy(deviation.transcribedText)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}