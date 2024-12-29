import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);

export function generateUrlKey(): string {
  return nanoid();
}

export function getPublicUploadUrl(urlKey: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_URL}/upload/${urlKey}`;
}