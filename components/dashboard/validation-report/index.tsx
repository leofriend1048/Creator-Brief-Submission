'use client';

import { AlertCircle, XCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ScoreDisplay } from './score-display';
import { StatItem } from './stat-item';
import { DeviationCard } from './deviation-card';
import { MissingContent } from './missing-content';
import { ValidationSummary } from './validation-summary';
import type { ValidationReportProps } from './types';

export function ValidationReport({ report }: ValidationReportProps) {
  if (!report) return null;

  const calculateScore = () => {
    const deviationPenalty = report.deviations.length * 1.5;
    const missingContentPenalty = report.missingContent.length * 1.0;
    return Math.max(1, Math.min(5, 5 - deviationPenalty - missingContentPenalty));
  };

  const score = calculateScore();
  const scorePercentage = Math.round(score * 20);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Summary Section */}
      <ValidationSummary 
        score={score} 
        percentage={scorePercentage}
        deviationCount={report.deviations.length}
        missingCount={report.missingContent.length}
      />

      {/* Main Analysis Card */}
      <div className="bg-gradient-to-br from-background via-background to-muted border border-border/50 rounded-lg overflow-hidden">
        {/* Side-by-side Comparison */}
        {report.deviations.map((deviation, index) => (
          <DeviationCard key={index} deviation={deviation} />
        ))}

        {/* Missing Content */}
        <MissingContent items={report.missingContent} />
      </div>
    </div>
  );
}