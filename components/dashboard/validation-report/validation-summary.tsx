'use client';

import { Badge } from "@/components/ui/badge";
import { AlertCircle, XCircle } from 'lucide-react';
import { StatItem } from './stat-item';
import { ScoreDisplay } from './score-display';

interface ValidationSummaryProps {
  score: number;
  percentage: number;
  deviationCount: number;
  missingCount: number;
}

export function ValidationSummary({ 
  score, 
  percentage, 
  deviationCount, 
  missingCount 
}: ValidationSummaryProps) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-background via-background to-muted border border-border/50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.02),transparent)]" />
      <div className="px-4 sm:px-6 lg:px-8 py-6 relative">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div className="space-y-1">
            <h2 className="text-lg font-medium">Validation Report</h2>
            <p className="text-sm text-muted-foreground">
              {percentage}% script match, {missingCount} sections missing
            </p>
          </div>
          <Badge 
            variant={percentage >= 80 ? "default" : percentage >= 60 ? "warning" : "destructive"}
            className="font-medium text-sm px-3 self-start"
          >
            {percentage >= 80 ? "Passed" : percentage >= 60 ? "Review" : "Failed"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ScoreDisplay score={score} percentage={percentage} />
          <div className="grid grid-cols-2 gap-4">
            <StatItem 
              title="Deviations" 
              count={deviationCount}
              icon={XCircle}
              variant="destructive" 
            />
            <StatItem 
              title="Missing" 
              count={missingCount}
              icon={AlertCircle}
              variant="warning"
            />
          </div>
        </div>
      </div>
    </div>
  );
}