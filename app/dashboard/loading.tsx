import { SkeletonCard } from '@/components/ui/loading/skeleton-card';

export default function DashboardLoading() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="h-8 w-48 bg-muted animate-pulse rounded" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}