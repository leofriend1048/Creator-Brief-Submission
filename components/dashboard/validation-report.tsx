'use client';

import { AlertCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { ValidationReport as ValidationReportType } from '@/lib/types';

interface ValidationReportProps {
  report: ValidationReportType | null;
}

export function ValidationReport({ report }: ValidationReportProps) {
  if (!report) {
    return (
      <Alert>
        <AlertTitle>No validation report available</AlertTitle>
        <AlertDescription>
          The validation report for this upload is not yet available.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {report.deviations.length > 0 && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle className="flex items-center gap-2">
            Deviations Found
            <Badge variant="destructive">{report.deviations.length}</Badge>
          </AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              {report.deviations.map((deviation, index) => (
                <li key={index} className="space-y-1">
                  <div className="font-medium">{deviation.text}</div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Original: </span>
                    {deviation.originalText}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Transcribed: </span>
                    {deviation.transcribedText}
                  </div>
                  <Badge variant={
                    deviation.severity === 'high' ? 'destructive' :
                    deviation.severity === 'medium' ? 'warning' : 'secondary'
                  }>
                    {deviation.severity} severity
                  </Badge>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {report.missingContent.length > 0 && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="flex items-center gap-2">
            Missing Content
            <Badge variant="warning">{report.missingContent.length}</Badge>
          </AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 mt-2">
              {report.missingContent.map((content, index) => (
                <li key={index}>{content}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {report.recommendations.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="flex items-center gap-2">
            Recommendations
            <Badge variant="secondary">{report.recommendations.length}</Badge>
          </AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 mt-2">
              {report.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}