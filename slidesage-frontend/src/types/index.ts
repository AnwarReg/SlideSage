// Document-focused type definitions for SlideSage

export interface SummaryResponse {
  summary: string;           // AI-generated summary
  id: number;               // Database ID
  originalFileName: string;  // Document filename (now required)
  fileType: string;         // MIME type of uploaded file
  fileSize: number;         // File size in bytes
  createdAt: string;        // ISO timestamp
  processingTime?: number;  // Time taken to process (optional)
}

export interface DocumentUploadRequest {
  file: File;               // The uploaded document
  userEmail?: string;       // User identifier (for future auth)
  summaryType?: 'detailed' | 'brief' | 'bullet-points'; // Summary options
}

export interface ProcessingStatus {
  stage: 'uploading' | 'extracting' | 'summarizing' | 'complete' | 'error';
  progress: number;         // 0-100
  message: string;          // User-friendly status message
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

// Supported file types with metadata
export interface SupportedFileType {
  extension: string;
  mimeType: string;
  description: string;
  maxSize: number;          // in bytes
  icon: string;
}