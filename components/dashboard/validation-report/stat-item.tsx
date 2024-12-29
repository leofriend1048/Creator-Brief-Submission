'use client';

import { Badge } from "@/components/ui/badge";
import type { StatItemProps } from './types';

export function StatItem({ title, count, icon: Icon, variant }: StatItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <Badge variant={variant}>{count}</Badge>
      </div>
      <div className="text-sm text-muted-foreground">{title}</div>
    </div>
  );
}