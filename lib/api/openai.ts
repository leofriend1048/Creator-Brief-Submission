import OpenAI from 'openai';
import { validationReportSchema } from '@/lib/schemas/validation';
import type { ValidationReport } from '@/lib/types';
import { Logger } from '@/lib/utils/logger';

const logger = new Logger('OpenAIService');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function validateTranscription(
  transcription: string,
  script: string
): Promise<ValidationReport> {
  logger.info('Starting script validation');

  try {
    const prompt = `Compare the following transcription with the original script and provide a detailed analysis:

Original Script:
${script}

Transcription:
${transcription}

Provide a JSON response with exactly these keys:
{
  "missingContent": ["List of missing content or key phrases"],
  "deviations": [
    {
      "severity": "high" | "medium" | "low",
      "text": "Description of the deviation",
      "originalText": "The original script text",
      "transcribedText": "The transcribed text"
    }
  ],
  "recommendations": ["List of specific recommendations for improvement"]
}

Focus on accuracy and completeness. Each deviation should include severity level and exact text comparisons.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ 
        role: 'user', 
        content: prompt 
      }],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    try {
      const parsedContent = JSON.parse(content);
      const validationResult = validationReportSchema.parse(parsedContent);
      
      logger.info('Validation completed successfully');
      return validationResult;
    } catch (parseError) {
      logger.error('Failed to parse or validate OpenAI response', { 
        error: parseError,
        content 
      });
      
      // Provide a fallback response with proper types
      return {
        missingContent: ['Failed to analyze missing content'],
        deviations: [{
          severity: 'high',
          text: 'Failed to analyze deviations',
          originalText: 'N/A',
          transcribedText: 'N/A'
        }],
        recommendations: ['Please try validating again']
      };
    }
  } catch (error) {
    logger.error('Validation failed', { error });
    throw error;
  }
}