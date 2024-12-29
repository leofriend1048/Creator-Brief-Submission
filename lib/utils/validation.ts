import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '../constants';

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a video or audio file.',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size exceeds the maximum limit of 100MB.',
    };
  }

  return { valid: true };
}