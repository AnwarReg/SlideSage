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

// Authentication interfaces
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
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

// Utility function to format file size from bytes to human-readable string
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Utility function to extract file type from filename
const getFileTypeFromName = (filename: string): 'pdf' | 'pptx' | 'docx' => {
  const extension = filename.toLowerCase().split('.').pop();
  switch (extension) {
    case 'pdf': return 'pdf';
    case 'pptx': return 'pptx';
    case 'docx': return 'docx';
    default: return 'pdf'; // Default to PDF
  }
};

// Get API base URL from environment or use default
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Authentication endpoints
const AUTH_BASE_URL = process.env.REACT_APP_AUTH_BASE_URL || 'http://localhost:8080/api';


export const authUtils = {
  // Store JWT token and user info
  storeAuth: (token: string, user: { id: string; email: string }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Get stored JWT token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Get stored user info
  getUser: (): { id: string; email: string } | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Clear stored auth data
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authUtils.getToken();
  },

  // Get authorization header
  getAuthHeader: (): Record<string, string> => {
    const token = authUtils.getToken();
    console.log('Getting auth header, token:', token ? 'present' : 'missing');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Redirect to login if not authenticated
  requireAuth: () => {
    if (!authUtils.isAuthenticated()) {
      window.location.href = '/login';
      throw new Error('Authentication required');
    }
  }
};

// Enhanced fetch wrapper that automatically includes JWT token
const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const authHeaders = authUtils.getAuthHeader();
  
  const headers = {
    'Content-Type': 'application/json',
    ...authHeaders,
    ...options.headers,
  };
  
  console.log('Making authenticated request to:', url);
  console.log('Headers being sent:', headers);
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If unauthorized, clear auth and redirect to login
  if (response.status === 401) {
    authUtils.clearAuth();
    window.location.href = '/login';
    throw new Error('Authentication expired. Please log in again.');
  }

  return response;
};

// Enhanced fetch wrapper for multipart requests (file uploads)
const authenticatedMultipartFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const authHeaders = authUtils.getAuthHeader();
  
  const headers = {
    ...authHeaders,
    ...options.headers,
    // Don't set Content-Type for multipart - let browser handle it
  };
  
  console.log('Making authenticated multipart request to:', url);
  console.log('Headers being sent:', headers);
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If unauthorized, clear auth and redirect to login
  if (response.status === 401) {
    authUtils.clearAuth();
    window.location.href = '/login';
    throw new Error('Authentication expired. Please log in again.');
  }

  return response;
};

// Polling utility function
const pollForStatus = async <T extends { summaryStatus?: string; quizStatus?: string }>(
  fileId: string,
  statusField: keyof T,
  maxAttempts: number = 30,
  intervalMs: number = 2000
): Promise<T> => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await authenticatedFetch(`${API_BASE_URL}/files/${fileId}`);
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

// Authentication API
export const authApi = {
  // User login
  login: async (email: string, password: string): Promise<AuthResponse> => {
    console.log('Attempting login for:', email);
    
    const response = await fetch(`${AUTH_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Login failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const authResponse: AuthResponse = await response.json();
    
    // Store token and user info
    authUtils.storeAuth(authResponse.token, authResponse.user);
    
    console.log('Login successful for user:', authResponse.user.email);
    return authResponse;
  },

  // User registration
  register: async (email: string, password: string): Promise<AuthResponse> => {
    console.log('Attempting registration for:', email);
    
    const response = await fetch(`${AUTH_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Registration failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const authResponse: AuthResponse = await response.json();
    
    // Store token and user info
    authUtils.storeAuth(authResponse.token, authResponse.user);
    
    console.log('Registration successful for user:', authResponse.user.email);
    return authResponse;
  },

  // User logout
  logout: () => {
    console.log('Logging out user');
    authUtils.clearAuth();
    window.location.href = '/login';
  },

  // Get current user
  getCurrentUser: () => {
    return authUtils.getUser();
  },

  // Check authentication status
  isAuthenticated: () => {
    return authUtils.isAuthenticated();
  }
};

// API functions for Spring Boot backend
export const filesApi = {
  getFiles: async (): Promise<FileItem[]> => {
    authUtils.requireAuth();
    
    try {
      console.log('Fetching files from:', `${API_BASE_URL}/files`);
      
      const response = await authenticatedFetch(`${API_BASE_URL}/files`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch files: ${response.status} ${response.statusText}`);
      }
      
      const backendFiles = await response.json();
      console.log('Backend response:', backendFiles);
      
      // Convert backend response to FileItem format
      const fileItems: FileItem[] = backendFiles.map((file: any) => ({
        id: file.id,
        name: file.name || file.filename || `Document_${file.id.substring(0, 8)}.pdf`,
        uploadDate: file.uploadDate 
          ? new Date(file.uploadDate).toISOString().split('T')[0]
          : file.updatedAt 
          ? new Date(file.updatedAt).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        size: file.size ? formatFileSize(file.size) : file.fileSize ? formatFileSize(file.fileSize) : 'Unknown',
        type: file.type || getFileTypeFromName(file.name || file.filename || 'document.pdf')
      }));
      
      console.log('Converted file items:', fileItems);
      return fileItems;
      
    } catch (error) {
      console.error('Failed to fetch files:', error);
      // Return empty array on error instead of crashing
      return [];
    }
  },

  uploadFile: async (file: File): Promise<UploadResp> => {
    authUtils.requireAuth();
    
    console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
    console.log('API URL:', `${API_BASE_URL}/files`);
     
    const formData = new FormData();
    formData.append('file', file);

    console.log('FormData prepared with file only');

    try {
      const response = await authenticatedMultipartFetch(`${API_BASE_URL}/files`, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload error response:', errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Upload success:', result);
      return result;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  getFileDetails: async (fileId: string): Promise<FileDetailResp> => {
    authUtils.requireAuth();
    
    const response = await authenticatedFetch(`${API_BASE_URL}/files/${fileId}`);
    if (!response.ok) {
      throw new Error(`Failed to get file details: ${response.statusText}`);
    }
    return response.json();
  },

  generateSummary: async (fileId: string): Promise<FileDetailResp> => {
    authUtils.requireAuth();
    
    const response = await authenticatedFetch(`${API_BASE_URL}/files/${fileId}/summary`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to generate summary: ${response.statusText}`);
    }

    // Start polling for completion
    return pollForStatus<FileDetailResp>(fileId, 'summaryStatus');
  },

  generateQuiz: async (fileId: string): Promise<FileDetailResp> => {
    authUtils.requireAuth();
    
    const response = await authenticatedFetch(`${API_BASE_URL}/files/${fileId}/quiz`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to generate quiz: ${response.statusText}`);
    }

    // Start polling for completion
    return pollForStatus<FileDetailResp>(fileId, 'quizStatus');
  }
};