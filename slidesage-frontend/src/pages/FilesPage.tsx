import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface FileItem {
  id: string;
  name: string;
  uploadDate: string;
  size: string;
  type: 'pdf' | 'pptx' | 'docx';
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load files on component mount
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      // Mock files for now
      const mockFiles: FileItem[] = [
        {
          id: '1',
          name: 'Sample Document.pdf',
          uploadDate: '2024-01-15',
          size: '2.3 MB',
          type: 'pdf'
        },
        {
          id: '2', 
          name: 'Research Paper.pdf',
          uploadDate: '2024-01-14',
          size: '4.1 MB',
          type: 'pdf'
        }
      ];
      setFiles(mockFiles);
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setUploading(true);
    
    try {
      // Mock upload - just add to files list
      const newFileItem: FileItem = {
        id: Date.now().toString(),
        name: selectedFile.name,
        uploadDate: new Date().toISOString().split('T')[0],
        size: (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB',
        type: 'pdf'
      };
      setFiles(prev => [newFileItem, ...prev]);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'pptx': return '📊';
      case 'docx': return '📝';
      default: return '📄';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Documents</h1>
            <p className="text-gray-600 text-lg">Upload and manage your PDF documents for AI analysis</p>
          </div>
          
          {/* Upload Section */}
          <div className="flex flex-col items-end">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.pptx,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={handleUploadClick}
              disabled={uploading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center space-x-3"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">📤</span>
                  <span>Upload Document</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Files Grid */}
        {files.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📄</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No documents yet</h3>
            <p className="text-gray-600 mb-6">Upload your first PDF to get started with AI analysis</p>
            <button
              onClick={handleUploadClick}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              Upload Document
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file) => (
              <Link
                key={file.id}
                to={`/files/${file.id}`}
                className="group bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">{getFileIcon(file.type)}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">{file.uploadDate}</div>
                    <div className="text-sm text-gray-600 font-medium">{file.size}</div>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors duration-200">
                  {file.name}
                </h3>
                
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {file.type.toUpperCase()}
                  </span>
                  <div className="text-blue-600 group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}