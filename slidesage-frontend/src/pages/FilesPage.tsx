import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { filesApi, FileItem, UploadResp } from '../lib/api';

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResp | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setUploading(true);
    setUploadResult(null);
    
    try {
      const result = await filesApi.uploadFile(selectedFile);
      setUploadResult(result);
      
      // Convert UploadResp to FileItem for the files list
      const newFileItem: FileItem = {
        id: result.id,
        name: selectedFile.name,
        uploadDate: new Date(result.updatedAt).toISOString().split('T')[0],
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
      <div className="py-8 text-center">
        <p className="text-gray-600">Loading files...</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Files</h1>
        <div className="space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : '📁 Upload PDF'}
          </button>
        </div>
      </div>

      {/* Upload Result Display */}
      {uploadResult && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">📄 Upload Successful!</h3>
          <div className="space-y-2 text-sm">
            <div><strong>File ID:</strong> {uploadResult.id}</div>
            <div><strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                uploadResult.textStatus === 'READY' ? 'bg-green-100 text-green-800' :
                uploadResult.textStatus === 'EMPTY' ? 'bg-yellow-100 text-yellow-800' :
                uploadResult.textStatus === 'ERROR' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {uploadResult.textStatus}
              </span>
            </div>
            <div><strong>Extracted Characters:</strong> {uploadResult.extractedChars.toLocaleString()}</div>
            {uploadResult.preview && (
              <div>
                <strong>Preview:</strong>
                <div className="mt-1 p-2 bg-white border rounded text-gray-700 text-xs max-h-24 overflow-y-auto">
                  {uploadResult.preview}
                </div>
              </div>
            )}
            <div className="flex space-x-2 mt-3">
              <Link
                to={`/files/${uploadResult.id}`}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                View Details & Generate AI Content
              </Link>
            </div>
          </div>
        </div>
      )}

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