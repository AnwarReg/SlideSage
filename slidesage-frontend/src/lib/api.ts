// API types matching Spring Boot backend

export interface UploadResp {
  id: string;
  textStatus: "READY" | "EMPTY" | "ERROR" | "NONE";
  extractedChars: number;
  preview: string;
  updatedAt: string;
}

export interface FileDetailResp extends UploadResp {
  summaryStatus: "READY" | "PENDING" | "ERROR" | "NONE";
  summary: string | null;
  quizStatus: "READY" | "PENDING" | "ERROR" | "NONE";
  quiz: any;
}

// Legacy interfaces for backward compatibility
export interface FileSummary {
  summary: string;
  keyPoints: string[];
  wordCount: number;
}

export interface KeyTerms {
  terms: Array<{
    term: string;
    definition: string;
    importance: 'high' | 'medium' | 'low';
  }>;
}

export interface Quiz {
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
}

export interface FileItem {
  id: string;
  name: string;
  uploadDate: string;
  size: string;
  type: 'pdf' | 'pptx' | 'docx';
}

// Mock files data
export const mockFiles: FileItem[] = [
  { id: '1', name: 'Lecture_Notes_Ch1.pdf', uploadDate: '2024-01-15', size: '2.3 MB', type: 'pdf' },
  { id: '2', name: 'Presentation_Slides.pptx', uploadDate: '2024-01-14', size: '5.1 MB', type: 'pptx' },
  { id: '3', name: 'Research_Paper.docx', uploadDate: '2024-01-13', size: '1.8 MB', type: 'docx' }
];

// Get API base URL from environment or use default
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Utility function to get userId (you may need to adjust this based on your auth implementation)
const getUserId = (): string => {
  // For now, return a mock UUID - replace with actual user ID from your auth system
  return 'user-123-456-789';
};

// Polling utility function
const pollForStatus = async <T extends { summaryStatus?: string; quizStatus?: string }>(
  fileId: string,
  statusField: keyof T,
  maxAttempts: number = 30,
  intervalMs: number = 2000
): Promise<T> => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(`${API_BASE_URL}/files/${fileId}`);
    if (!response.ok) {
      throw new Error(`Failed to get file details: ${response.statusText}`);
    }
    
    const data: T = await response.json();
    const status = data[statusField] as string;
    
    if (status === 'READY' || status === 'ERROR') {
      return data;
    }
    
    if (attempt < maxAttempts - 1) {
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }
  
  throw new Error('Polling timeout - operation did not complete');
};

// API functions for Spring Boot backend
export const filesApi = {
  getFiles: async (): Promise<FileItem[]> => {
    // For now, return mock data - implement actual endpoint when available
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockFiles];
  },

  uploadFile: async (file: File): Promise<UploadResp> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', getUserId());

    const response = await fetch(`${API_BASE_URL}/files`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type - let browser handle multipart boundary
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  },

  getFileDetails: async (fileId: string): Promise<FileDetailResp> => {
    const response = await fetch(`${API_BASE_URL}/files/${fileId}`);
    if (!response.ok) {
      throw new Error(`Failed to get file details: ${response.statusText}`);
    }
    return response.json();
  },

  generateSummary: async (fileId: string): Promise<FileDetailResp> => {
    const response = await fetch(`${API_BASE_URL}/files/${fileId}/ai/summary`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to generate summary: ${response.statusText}`);
    }

    // Start polling for completion
    return pollForStatus<FileDetailResp>(fileId, 'summaryStatus');
  },

  generateQuiz: async (fileId: string): Promise<FileDetailResp> => {
    const response = await fetch(`${API_BASE_URL}/files/${fileId}/ai/quiz`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to generate quiz: ${response.statusText}`);
    }

    // Start polling for completion
    return pollForStatus<FileDetailResp>(fileId, 'quizStatus');
  },

  // Legacy functions for backward compatibility
  getSummary: async (fileId: string): Promise<FileSummary> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      summary: "This document covers advanced machine learning concepts including neural networks, deep learning architectures, and their practical applications in modern AI systems. The content explores both theoretical foundations and real-world implementations.",
      keyPoints: [
        "Neural networks form the backbone of modern AI",
        "Deep learning requires large datasets for training",
        "Practical applications span multiple industries",
        "Understanding theory is crucial for implementation"
      ],
      wordCount: 1250
    };
  },

  getKeyTerms: async (fileId: string): Promise<KeyTerms> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      terms: [
        {
          term: "Neural Network",
          definition: "A computing system inspired by biological neural networks",
          importance: "high"
        },
        {
          term: "Deep Learning",
          definition: "Machine learning using neural networks with multiple layers",
          importance: "high"
        },
        {
          term: "Backpropagation",
          definition: "Algorithm for training neural networks by propagating errors backward",
          importance: "medium"
        },
        {
          term: "Gradient Descent",
          definition: "Optimization algorithm used to minimize loss functions",
          importance: "medium"
        }
      ]
    };
  }
};