import { supabase } from '@/lib/supabase/server';
import { ValidationService } from './validation-service';
import { Logger } from '@/lib/utils/logger';

export class BatchValidationService {
  private static logger = new Logger('BatchValidationService');

  static async validateAllUploads(urlKey: string) {
    this.logger.info('Starting batch validation', { urlKey });

    try {
      // Get all uploads for this link
      const { data: link } = await supabase
        .from('public_links')
        .select('id')
        .eq('url_key', urlKey)
        .single();

      if (!link) {
        throw new Error('Link not found');
      }

      const { data: uploads, error } = await supabase
        .from('uploads')
        .select('id')
        .eq('public_link_id', link.id)
        .is('validation_report', null);

      if (error) throw error;

      // Process each upload
      const results = await Promise.all(
        uploads.map(upload => 
          ValidationService.processUpload(upload.id)
            .catch(error => ({
              uploadId: upload.id,
              error: error instanceof Error ? error.message : 'Validation failed'
            }))
        )
      );

      this.logger.info('Batch validation completed', {
        urlKey,
        totalProcessed: uploads.length,
        successCount: results.filter(r => !('error' in r)).length
      });

      return results;
    } catch (error) {
      this.logger.error('Batch validation failed', { error });
      throw error;
    }
  }
}