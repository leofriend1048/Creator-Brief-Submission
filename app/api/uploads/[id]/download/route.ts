import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get upload record
    const { data: upload, error: uploadError } = await supabase
      .from('uploads')
      .select('*')
      .eq('id', params.id)
      .single();

    if (uploadError) throw uploadError;

    // Get file download URL
    const { data, error: downloadError } = await supabase.storage
      .from('uploads')
      .createSignedUrl(upload.file_path, 60); // URL valid for 60 seconds

    if (downloadError) throw downloadError;

    return NextResponse.json({ downloadUrl: data.signedUrl });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate download URL' },
      { status: 500 }
    );
  }
}