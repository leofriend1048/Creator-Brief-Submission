export interface PublicLink {
  id: string;
  urlKey: string;
  scriptText: string;
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Upload {
  id: string;
  publicLinkId: string;
  filePath: string;
  fileName: string;
  fileSize: number;
  transcription: string | null;
  validationReport: ValidationReport | null;
  createdAt: string;
  updatedAt: string;
}

export interface DeviationItem {
  severity: 'high' | 'medium' | 'low';
  text: string;
  originalText: string;
  transcribedText: string;
}

export interface ValidationReport {
  missingContent: string[];
  deviations: DeviationItem[];
  recommendations: string[];
}

export interface FileWithPreview extends File {
  preview?: string;
}