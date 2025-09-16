// Mock data and API functions for development

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
  }
};