'use client';

import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import type { MissingContentProps } from './types';

export function MissingContent({ items }: MissingContentProps) {
  if (items.length === 0) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 border-t border-border/50 bg-muted/20">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Badge variant="warning" className="font-medium">Missing Content</Badge>
        <span className="text-sm text-muted-foreground">
          {items.length} required phrases
        </span>
      </div>
      <div className="space-y-3">
        {items.map((content, index) => (
          <div 
            key={index} 
            className="flex items-center gap-3 p-3 rounded-lg bg-background/50 text-sm hover:bg-background/80 transition-colors"
          >
            <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <span className="break-words">{content}</span>
          </div>
        ))}
      </div>
    </div>
  );
}