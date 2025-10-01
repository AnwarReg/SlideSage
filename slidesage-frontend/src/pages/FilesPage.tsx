import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { filesApi, FileItem, UploadResp, PLACEHOLDER_USER_ID } from '../lib/api';

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
      const result = await filesApi.uploadFile(selectedFile, PLACEHOLDER_USER_ID);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12">
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Files</h1>
            <p className="text-gray-600 text-lg">Analyze your documents with AI-powered insights</p>
          </div>
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
              className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center space-x-3"
            >
              <span className="text-2xl group-hover:animate-bounce">📁</span>
              <span>{uploading ? 'Uploading...' : 'Upload PDF'}</span>
              {uploading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
              )}
            </button>
          </div>
        </div>

        {/* Upload Result Display */}
        {uploadResult && (
          <div className="mb-8 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-emerald-800">Upload Successful!</h3>
                <p className="text-emerald-600">Your document has been processed</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                <div className="text-sm font-medium text-gray-600 mb-1">File ID</div>
                <div className="font-mono text-sm text-gray-800 break-all">{uploadResult.id}</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                <div className="text-sm font-medium text-gray-600 mb-1">Status</div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  uploadResult.textStatus === 'READY' ? 'bg-emerald-100 text-emerald-800' :
                  uploadResult.textStatus === 'EMPTY' ? 'bg-amber-100 text-amber-800' :
                  uploadResult.textStatus === 'ERROR' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {uploadResult.textStatus}
                </span>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                <div className="text-sm font-medium text-gray-600 mb-1">Extracted Characters</div>
                <div className="text-lg font-bold text-gray-800">{uploadResult.extractedChars.toLocaleString()}</div>
              </div>
            </div>
            {uploadResult.preview && (
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-6">
                <div className="text-sm font-medium text-gray-600 mb-2">Preview</div>
                <div className="p-4 bg-white border rounded-lg text-gray-700 text-sm max-h-32 overflow-y-auto leading-relaxed">
                  {uploadResult.preview}
                </div>
              </div>
            )}
            <div className="flex justify-center">
              <Link
                to={`/files/${uploadResult.id}`}
                className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 space-x-2"
              >
                <span>🚀</span>
                <span>Analyze with AI</span>
              </Link>
            </div>
          </div>
        )}

        {files.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📄</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No files uploaded yet</h3>
            <p className="text-gray-600 mb-8">Upload your first PDF to get started with AI analysis</p>
            <button
              onClick={handleUploadClick}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Upload Your First PDF
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6">
            {files.map((file) => (
              <Link
                key={file.id}
                to={`/files/${file.id}`}
                className="group bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl">{getFileIcon(file.type)}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {file.name}
                      </h3>
                      <p className="text-gray-500 flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <span>📅</span>
                          <span>{file.uploadDate}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>💾</span>
                          <span>{file.size}</span>
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="text-blue-500 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
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