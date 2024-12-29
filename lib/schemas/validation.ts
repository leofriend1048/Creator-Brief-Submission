import { z } from 'zod';

// Define the deviation item schema
const deviationItemSchema = z.object({
  severity: z.enum(['high', 'medium', 'low']),
  text: z.string(),
  originalText: z.string(),
  transcribedText: z.string()
});

// Define the validation report schema
export const validationReportSchema = z.object({
  missingContent: z.array(z.string()),
  deviations: z.array(deviationItemSchema),
  recommendations: z.array(z.string())
});

export type ValidationReport = z.infer<typeof validationReportSchema>;

export const VALIDATION_PROMPT = `
Compare the following transcription with the original script and provide a detailed analysis:

Original Script:
{script}

Transcription:
{transcription}

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