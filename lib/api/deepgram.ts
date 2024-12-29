import { Logger } from '@/lib/utils/logger';

const logger = new Logger('DeepgramService');

export async function transcribeAudio(audioUrl: string): Promise<string> {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  
  if (!apiKey) {
    throw new Error('Deepgram API key is not configured');
  }

  try {
    logger.info('Starting transcription', { audioUrl });

    const response = await fetch('https://api.deepgram.com/v1/listen?model=general&language=en-US&punctuate=true', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: audioUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      logger.error('Transcription failed', { error });
      throw new Error('Failed to transcribe audio');
    }

    const data = await response.json();
    const transcript = data.results?.channels[0]?.alternatives[0]?.transcript;

    if (!transcript) {
      throw new Error('No transcription available');
    }

    logger.info('Transcription completed successfully');
    return transcript;
  } catch (error) {
    logger.error('Transcription error', { error });
    throw new Error('Failed to transcribe audio');
  }
}