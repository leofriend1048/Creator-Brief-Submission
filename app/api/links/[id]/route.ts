import { createAPIRoute } from '@/lib/utils/api';
import { getLinkDetails } from '@/lib/api/links';
import { NextResponse } from 'next/server';

export const GET = createAPIRoute(async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const { link, uploads } = await getLinkDetails(params.id);
  return NextResponse.json({ link, uploads });
});