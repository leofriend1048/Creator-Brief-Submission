import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { generateUrlKey } from '@/lib/utils/url';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { script } = await request.json();

    if (!script) {
      return NextResponse.json(
        { error: 'Script text is required' },
        { status: 400 }
      );
    }

    const urlKey = generateUrlKey();

    // Create the public link
    const { data: link, error: linkError } = await supabase
      .from('public_links')
      .insert([
        {
          url_key: urlKey,
          script_text: script,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (linkError) {
      console.error('Database error:', linkError);
      return NextResponse.json(
        { error: 'Failed to create link in database' },
        { status: 500 }
      );
    }

    // Create audit log
    await supabase.from('audit_logs').insert([
      {
        public_link_id: link.id,
        action: 'link_created',
        details: { script_length: script.length },
      },
    ]);

    return NextResponse.json(link);
  } catch (error) {
    console.error('Link creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    );
  }
}