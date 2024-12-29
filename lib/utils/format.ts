export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncateFilename(filename: string, maxLength: number): string {
  if (filename.length <= maxLength) return filename;
  
  const extension = filename.split('.').pop();
  const nameWithoutExt = filename.slice(0, filename.lastIndexOf('.'));
  
  // Calculate how many characters we can keep from the name
  const availableLength = maxLength - (extension?.length ?? 0) - 4; // 4 accounts for "..." and "."
  
  if (availableLength <= 0) return filename.slice(0, maxLength - 3) + '...';
  
  return `${nameWithoutExt.slice(0, availableLength)}...${extension ? `.${extension}` : ''}`;
}