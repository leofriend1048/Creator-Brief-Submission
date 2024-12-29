'use client';

import { LucideIcon } from 'lucide-react';
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

interface ReportSectionProps {
  value: string;
  title: string;
  icon: LucideIcon;
  items: string[];
  variant?: 'default' | 'destructive' | 'warning';
}

export function ReportSection({
  value,
  title,
  icon: Icon,
  items,
  variant = 'default',
}: ReportSectionProps) {
  if (items.length === 0) return null;

  const variantStyles = {
    default: 'text-foreground',
    destructive: 'text-destructive',
    warning: 'text-warning',
  };

  return (
    <AccordionItem value={value}>
      <AccordionTrigger className={variantStyles[variant]}>
        <Icon className="h-4 w-4 mr-2" />
        {title}
      </AccordionTrigger>
      <AccordionContent>
        <ul className="list-disc pl-6 space-y-2">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}