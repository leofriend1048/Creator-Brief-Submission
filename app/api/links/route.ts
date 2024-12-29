import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { Logger } from '@/lib/utils/logger';

const logger = new Logger('LinksAPI');

export async function GET() {
  try {
    logger.info('Fetching all links');
    
    const { data, error } = await supabase
      .from('public_links')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Database error', { error });
      throw error;
    }

    // Transform the data to match our frontend types
    const links = data.map(link => ({
      ...link,
      createdAt: link.created_at,
      updatedAt: link.updated_at,
      urlKey: link.url_key,
      scriptText: link.script_text,
    }));

    logger.info('Successfully fetched links', { count: links.length });
    return NextResponse.json(links);
  } catch (error) {
    logger.error('Failed to fetch links', { error });
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}