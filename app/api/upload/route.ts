import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { UploadService } from '@/lib/services/upload-service';
import { ValidationService } from '@/lib/services/validation-service';
import { Logger } from '@/lib/utils/logger';

const logger = new Logger('UploadAPI');

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const urlKey = formData.get('urlKey') as string;

    if (!urlKey) {
      return NextResponse.json({ error: 'URL key is required' }, { status: 400 });
    }

    logger.info('Processing upload request', { fileCount: files.length, urlKey });

    // Get the public link
    const { data: link, error: linkError } = await supabase
      .from('public_links')
      .select('*')
      .eq('url_key', urlKey)
      .single();

    if (linkError || !link) {
      logger.error('Failed to fetch link', { urlKey, error: linkError });
      return NextResponse.json(
        { error: 'Invalid upload link' }, 
        { status: 400 }
      );
    }

    const results = [];
    for (const file of files) {
      try {
        logger.debug('Processing file', { fileName: file.name });
        const filePath = await UploadService.uploadFile(file, link.id);
        
        // Create upload record
        const { data: upload, error: uploadError } = await supabase
          .from('uploads')
          .insert([{
            public_link_id: link.id,
            file_path: filePath,
            file_name: file.name,
            file_size: file.size,
          }])
          .select()
          .single();

        if (uploadError) throw uploadError;

        logger.info('File processed successfully', { fileName: file.name, uploadId: upload.id });
        results.push({ success: true, upload });
      } catch (error) {
        logger.error('File processing failed', { fileName: file.name, error });
        results.push({
          success: false,
          fileName: file.name,
          error: error instanceof Error ? error.message : 'Upload failed'
        });
      }
    }

    // Update link status if any files were uploaded successfully
    if (results.some(r => r.success)) {
      await supabase
        .from('public_links')
        .update({ status: 'completed' })
        .eq('id', link.id);

      // Log the upload
      await supabase.from('audit_logs').insert([{
        public_link_id: link.id,
        action: 'files_uploaded',
        details: { file_count: files.length },
      }]);
    }

    return NextResponse.json({
      success: true,
      uploads: results.filter(r => r.success).map(r => r.upload)
    });
  } catch (error) {
    logger.error('Upload process failed', { error });
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}