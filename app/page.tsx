import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center space-y-8 p-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Video Upload & Script Validation
        </h1>
        <p className="text-xl text-muted-foreground">
          Create public links for video uploads and validate transcriptions against your scripts.
        </p>
        <Button asChild size="lg">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}