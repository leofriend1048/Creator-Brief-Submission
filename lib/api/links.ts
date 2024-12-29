import { supabase } from '@/lib/supabase/server';
import type { PublicLink, Upload } from '@/lib/types';
import { Logger } from '@/lib/utils/logger';

const logger = new Logger('LinksAPI');

export async function getLinkDetails(linkId: string) {
  try {
    // Get link by id or urlKey
    const { data: link, error: linkError } = await supabase
      .from('public_links')
      .select('*')
      .or(`id.eq.${linkId},url_key.eq.${linkId}`)
      .single();

    if (linkError) {
      logger.error('Failed to fetch link', { linkId, error: linkError });
      throw linkError;
    }

    // Get uploads for this link
    const { data: uploads = [], error: uploadsError } = await supabase
      .from('uploads')
      .select('*')
      .eq('public_link_id', link.id)
      .order('created_at', { ascending: false });

    if (uploadsError) {
      logger.error('Failed to fetch uploads', { linkId: link.id, error: uploadsError });
      throw uploadsError;
    }

    return {
      link: {
        ...link,
        createdAt: link.created_at,
        updatedAt: link.updated_at,
        urlKey: link.url_key,
        scriptText: link.script_text,
      } as PublicLink,
      uploads: uploads.map((upload) => ({
        ...upload,
        createdAt: upload.created_at,
        updatedAt: upload.updated_at,
        fileName: upload.file_name,
        filePath: upload.file_path,
        fileSize: upload.file_size,
        publicLinkId: upload.public_link_id,
        validationReport: upload.validation_report,
      })) as Upload[],
    };
  } catch (error) {
    logger.error('Failed to get link details', { linkId, error });
    throw error;
  }
}