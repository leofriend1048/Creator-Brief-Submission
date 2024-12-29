import { NextResponse } from 'next/server';
import { validateByUrlKey } from '@/lib/api/validation';
import { Logger } from '@/lib/utils/logger';

const logger = new Logger('ValidationAPI');

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    logger.info('Processing validation request', { uploadId: params.id });
    const result = await validateByUrlKey(params.id);
    return NextResponse.json(result);
  } catch (error) {
    logger.error('Validation failed', { error });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to validate uploads' },
      { status: 500 }
    );
  }
}