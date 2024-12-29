export const ACCEPTED_FILE_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
];

export const MAX_FILE_SIZE = 1024 * 1024 * 100; // 100MB
export const MAX_CHUNK_SIZE = 1024 * 1024 * 5; // 5MB chunks for multipart upload

export const API_ROUTES = {
  CREATE_LINK: '/api/links/create',
  UPLOAD_FILE: '/api/upload',
  PROCESS_FILE: '/api/process',
} as const;