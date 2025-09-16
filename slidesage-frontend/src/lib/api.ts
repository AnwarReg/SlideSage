// Mock data and API functions for development

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

// Mock API functions (will be replaced with real API calls later)
export const filesApi = {
  getFiles: async (): Promise<FileItem[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockFiles];
  },

  uploadFile: async (fileName: string): Promise<FileItem> => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate fake file
    return {
      id: Date.now().toString(),
      name: fileName,
      uploadDate: new Date().toISOString().split('T')[0],
      size: (Math.random() * 10 + 1).toFixed(1) + ' MB',
      type: 'pdf'
    };
  }, // ← ADD THIS COMMA

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
  },

  generateQuiz: async (fileId: string): Promise<Quiz> => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return {
      questions: [
        {
          id: 1,
          question: "What is the primary advantage of deep learning over traditional machine learning?",
          options: [
            "Faster training time",
            "Automatic feature extraction",
            "Less data required",
            "Simpler algorithms"
          ],
          correctAnswer: 1,
          explanation: "Deep learning can automatically extract features from raw data, eliminating the need for manual feature engineering."
        },
        {
          id: 2,
          question: "Which algorithm is commonly used to train neural networks?",
          options: [
            "Linear regression",
            "Decision trees",
            "Backpropagation",
            "K-means clustering"
          ],
          correctAnswer: 2,
          explanation: "Backpropagation is the standard algorithm for training neural networks by computing gradients."
        }
      ]
    };
  }
}; // ← ADD THIS CLOSING BRACE