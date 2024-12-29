import { supabase } from '@/lib/supabase/server';
import { validateTranscription } from './openai';
import { transcribeAudio } from './deepgram';
import { Logger } from '@/lib/utils/logger';

const logger = new Logger('ValidationAPI');

export async function validateByUrlKey(urlKey: string) {
  try {
    // Get the public link
    const { data: link, error: linkError } = await supabase
      .from('public_links')
      .select('*')
      .eq('url_key', urlKey)
      .single();

    if (linkError || !link) {
      logger.error('Link not found', { urlKey, error: linkError });
      throw new Error('Invalid link');
    }

    // Get all uploads for this link
    const { data: uploads, error: uploadsError } = await supabase
      .from('uploads')
      .select('*')
      .eq('public_link_id', link.id);

    if (uploadsError) {
      logger.error('Failed to fetch uploads', { linkId: link.id, error: uploadsError });
      throw uploadsError;
    }

    if (!uploads.length) {
      throw new Error('No uploads found for validation');
    }

    // Process transcriptions for all uploads
    const transcriptionPromises = uploads.map(async (upload) => {
      if (upload.transcription) return upload.transcription;

      const { data } = supabase.storage
        .from('uploads')
        .getPublicUrl(upload.file_path);

      const transcription = await transcribeAudio(data.publicUrl);
      
      await supabase
        .from('uploads')
        .update({ transcription })
        .eq('id', upload.id);

      return transcription;
    });

    const transcriptions = await Promise.all(transcriptionPromises);
    const combinedTranscription = transcriptions.join('\n\n');

    // Validate against original script
    const validationReport = await validateTranscription(
      combinedTranscription,
      link.script_text
    );

    // Update all uploads with the validation report
    await supabase
      .from('uploads')
      .update({ validation_report: validationReport })
      .eq('public_link_id', link.id);

    // Log validation completion
    await supabase.from('audit_logs').insert([{
      public_link_id: link.id,
      action: 'validation_completed',
      details: {
        upload_count: uploads.length,
        has_issues: validationReport.missingContent.length > 0 || 
                   validationReport.deviations.length > 0,
      },
    }]);

    return { transcription: combinedTranscription, validationReport };
  } catch (error) {
    logger.error('Validation failed', { error });
    throw error;
  }
}