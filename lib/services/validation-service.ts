import { supabase } from '@/lib/supabase/server';
import { validateTranscription } from '@/lib/api/openai';
import { transcribeAudio } from '@/lib/api/deepgram';
import { Logger } from '@/lib/utils/logger';

export class ValidationService {
  private static logger = new Logger('ValidationService');

  static async processUpload(uploadId: string) {
    this.logger.info('Starting validation process', { uploadId });

    try {
      // Get all uploads for this link
      const { data: upload, error: uploadError } = await supabase
        .from('uploads')
        .select(`
          *,
          public_links (
            id,
            script_text
          )
        `)
        .eq('id', uploadId)
        .single();

      if (uploadError || !upload) {
        this.logger.error('Upload not found', { uploadId, error: uploadError });
        throw new Error('Upload not found');
      }

      // Get all uploads for this link
      const { data: allUploads, error: allUploadsError } = await supabase
        .from('uploads')
        .select('*')
        .eq('public_link_id', upload.public_link_id);

      if (allUploadsError) {
        this.logger.error('Failed to fetch all uploads', { error: allUploadsError });
        throw allUploadsError;
      }

      // Transcribe all uploads that don't have transcriptions
      const transcriptionPromises = allUploads
        .filter(u => !u.transcription)
        .map(async u => {
          const { data: { publicUrl } } = supabase.storage
            .from('uploads')
            .getPublicUrl(u.file_path);

          const transcription = await transcribeAudio(publicUrl);
          
          await supabase
            .from('uploads')
            .update({ transcription })
            .eq('id', u.id);

          return transcription;
        });

      await Promise.all(transcriptionPromises);

      // Get all transcriptions
      const { data: updatedUploads } = await supabase
        .from('uploads')
        .select('transcription')
        .eq('public_link_id', upload.public_link_id);

      // Combine all transcriptions
      const combinedTranscription = updatedUploads
        .map(u => u.transcription)
        .filter(Boolean)
        .join('\n\n');

      // Validate against script
      const validationReport = await validateTranscription(
        combinedTranscription,
        upload.public_links.script_text
      );

      // Update all uploads with the same validation report
      await supabase
        .from('uploads')
        .update({ validation_report: validationReport })
        .eq('public_link_id', upload.public_link_id);

      // Log validation completion
      await supabase.from('audit_logs').insert([
        {
          public_link_id: upload.public_link_id,
          action: 'validation_completed',
          details: {
            upload_count: allUploads.length,
            has_issues: validationReport.missingContent.length > 0 || 
                       validationReport.deviations.length > 0,
          },
        },
      ]);

      this.logger.info('Validation process completed successfully', { uploadId });
      return { transcription: combinedTranscription, validationReport };
    } catch (error) {
      this.logger.error('Validation process failed', { uploadId, error });
      throw error;
    }
  }
}