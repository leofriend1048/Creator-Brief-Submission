import { SkeletonCard } from '@/components/ui/loading/skeleton-card';

export default function LinkDetailsLoading() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <SkeletonCard rows={4} />
      <SkeletonCard rows={2} />
      <SkeletonCard rows={3} />
    </div>
  );
}