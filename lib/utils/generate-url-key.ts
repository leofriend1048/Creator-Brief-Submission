import { customAlphabet } from 'nanoid';

// Create a URL-safe nanoid generator
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);

export function generateUrlKey(): string {
  return nanoid();
}