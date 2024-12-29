import { supabase } from '@/lib/supabase/server'; // Use server client with service role
import { MAX_FILE_SIZE } from '@/lib/constants';
import { Logger } from '@/lib/utils/logger';

export class UploadService {
  private static logger = new Logger('UploadService');

  static async uploadFile(file: File, publicLinkId: string): Promise<string> {
    this.logger.info('Starting file upload', { fileName: file.name, size: file.size });

    if (file.size > MAX_FILE_SIZE) {
      this.logger.error('File size exceeds limit', { size: file.size, limit: MAX_FILE_SIZE });
      throw new Error('File size exceeds maximum limit');
    }

    try {
      const filePath = `${publicLinkId}/${file.name}`;
      
      this.logger.debug('Reading file as array buffer');
      const arrayBuffer = await file.arrayBuffer();
      const fileData = new Uint8Array(arrayBuffer);

      this.logger.debug('Uploading to Supabase storage', { path: filePath });
      const { error } = await supabase.storage
        .from('uploads')
        .upload(filePath, fileData, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        this.logger.error('Supabase upload failed', { error });
        throw error;
      }

      this.logger.info('File upload successful', { path: filePath });
      return filePath;
    } catch (error) {
      this.logger.error('Upload failed', { error });
      throw new Error('Failed to upload file');
    }
  }
}