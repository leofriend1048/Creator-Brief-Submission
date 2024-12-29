'use client';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { ValidationSectionProps } from './types';

export function ValidationSection({ 
  title, 
  items, 
  variant = 'default',
  icon: Icon 
}: ValidationSectionProps) {
  if (items.length === 0) return null;

  return (
    <Alert variant={variant}>
      <Icon className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        {title}
        <Badge variant={variant}>{items.length}</Badge>
      </AlertTitle>
      <AlertDescription>
        <ul className="list-disc pl-5 mt-2">
          {items.map((item, index) => (
            <li key={index} className="mt-2">{item}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}