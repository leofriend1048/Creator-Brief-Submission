import { supabase } from '@/lib/supabase/client';

export async function uploadFile(file: File, publicLinkId: string) {
  try {
    const filePath = `${publicLinkId}/${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;
    
    // Get the public URL immediately after upload
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    return { data, publicUrl };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function getFileUrl(filePath: string) {
  const { data } = supabase.storage
    .from('uploads')
    .getPublicUrl(filePath);
    
  return data.publicUrl;
}