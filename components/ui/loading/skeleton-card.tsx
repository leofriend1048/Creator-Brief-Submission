interface SkeletonCardProps {
  rows?: number;
}

export function SkeletonCard({ rows = 3 }: SkeletonCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-3 bg-muted animate-pulse rounded" />
      ))}
    </div>
  );
}