import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { filesApi, FileItem } from '../lib/api';

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Load files on component mount
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const fileList = await filesApi.getFiles();
      setFiles(fileList);
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const newFile = await filesApi.uploadFile(`Document_${Date.now()}.pdf`);
      setFiles(prev => [newFile, ...prev]); // Add to beginning of list
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
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
      <div className="py-8 text-center">
        <p className="text-gray-600">Loading files...</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Files</h1>
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : '📁 Upload File'}
        </button>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No files uploaded yet</p>
          <p>Click "Upload File" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file) => (
            <Link
              key={file.id}
              to={`/files/${file.id}`}
              className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getFileIcon(file.type)}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{file.name}</h3>
                    <p className="text-sm text-gray-500">
                      Uploaded {file.uploadDate} • {file.size}
                    </p>
                  </div>
                </div>
                <div className="text-gray-400">→</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}