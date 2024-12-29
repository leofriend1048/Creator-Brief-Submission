import { LucideIcon } from 'lucide-react';

export interface ValidationReport {
  missingContent: string[];
  deviations: DeviationItem[];
  recommendations: string[];
}

export interface DeviationItem {
  severity: 'high' | 'medium' | 'low';
  text: string;
  originalText: string;
  transcribedText: string;
}

export interface ValidationReportProps {
  report: ValidationReport | null;
}

export interface ScoreDisplayProps {
  score: number;
  percentage: number;
}

export interface StatItemProps {
  title: string;
  count: number;
  icon: LucideIcon;
  variant: 'default' | 'destructive' | 'warning' | 'secondary';
}

export interface DeviationCardProps {
  deviation: DeviationItem;
}

export interface MissingContentProps {
  items: string[];
}