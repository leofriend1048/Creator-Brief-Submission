import { NextResponse } from 'next/server';
import { processUpload } from '@/lib/api/validation';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await processUpload(params.id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}