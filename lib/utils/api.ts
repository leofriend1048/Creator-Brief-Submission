import { NextResponse } from 'next/server';
import { Logger } from './logger';

const logger = new Logger('APIUtils');

interface ErrorResponse {
  error: string;
  status?: number;
}

export async function handleAPIError(error: unknown): Promise<NextResponse<ErrorResponse>> {
  logger.error('API error', { error });

  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  const status = error instanceof Error && 'status' in error ? (error as any).status : 500;

  return NextResponse.json(
    { error: message },
    { status }
  );
}

export function createAPIRoute(handler: Function) {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleAPIError(error);
    }
  };
}