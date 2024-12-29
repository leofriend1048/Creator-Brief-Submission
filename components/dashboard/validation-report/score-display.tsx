'use client';

import { Progress } from "@/components/ui/progress";
import type { ScoreDisplayProps } from './types';

export function ScoreDisplay({ score, percentage }: ScoreDisplayProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-semibold">{percentage}%</span>
        <span className="text-muted-foreground">accuracy</span>
      </div>
      <div className="space-y-2">
        <Progress value={percentage} className="h-2 bg-muted/30" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}