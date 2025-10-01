import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { filesApi, FileDetailResp } from '../lib/api';

export default function FileDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [fileDetails, setFileDetails] = useState<FileDetailResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load file details on component mount
  useEffect(() => {
    if (id) {
      loadFileDetails();
    }
  }, [id]);

  const loadFileDetails = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const details = await filesApi.getFileDetails(id);
      setFileDetails(details);
    } catch (error) {
      console.error('Failed to load file details:', error);
      setError('Failed to load file details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!id || !fileDetails) return;
    
    setLoadingSummary(true);
    try {
      const updatedDetails = await filesApi.generateSummary(id);
      setFileDetails(updatedDetails);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!id || !fileDetails) return;
    
    setLoadingQuiz(true);
    try {
      const updatedDetails = await filesApi.generateQuiz(id);
      setFileDetails(updatedDetails);
    } catch (error) {
      console.error('Failed to generate quiz:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setLoadingQuiz(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ERROR': return 'bg-red-100 text-red-800';
      case 'EMPTY': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderQuizContent = (quiz: any) => {
    if (typeof quiz === 'string') {
      return <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">{quiz}</div>;
    }
    if (quiz?.questions && Array.isArray(quiz.questions)) {
      return (
        <div className="space-y-8">
          {quiz.questions.map((question: any, index: number) => (
            <div key={question.id || index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-start mb-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                  <span className="text-indigo-600 font-bold text-sm">{index + 1}</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 leading-relaxed">
                  {question.question}
                </h4>
              </div>
              {question.options && (
                <div className="space-y-3 mb-4 ml-12">
                  {question.options.map((option: string, optionIndex: number) => (
                    <div
                      key={optionIndex}
                      className={`p-4 rounded-xl transition-all duration-200 ${
                        optionIndex === question.correctAnswer
                          ? 'bg-emerald-50 border-2 border-emerald-200 shadow-sm'
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
                          optionIndex === question.correctAnswer
                            ? 'bg-emerald-200 text-emerald-800'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                        <span className="text-gray-800">{option}</span>
                        {optionIndex === question.correctAnswer && (
                          <span className="ml-auto text-emerald-600 font-semibold">✓ Correct</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {question.explanation && (
                <div className="ml-12 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-blue-600 text-sm">💡</span>
                    </div>
                    <div>
                      <div className="font-semibold text-blue-800 mb-1">Explanation</div>
                      <div className="text-blue-700 text-sm leading-relaxed">{question.explanation}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
    return <div className="text-center py-8 text-gray-500">Quiz format not recognized</div>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading file details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link to="/files" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 text-lg font-medium transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Files
          </Link>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">❌</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-800">Error Loading File</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
            <button
              onClick={loadFileDetails}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!fileDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link to="/files" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 text-lg font-medium transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Files
          </Link>
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📄</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">File Not Found</h3>
            <p className="text-gray-600 mt-2">The requested file could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  const isTextEmpty = fileDetails.textStatus === 'EMPTY';
  const aiButtonsDisabled = isTextEmpty || fileDetails.textStatus !== 'READY';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link to="/files" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 text-lg font-medium transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Files
          </Link>
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mr-6">
              <span className="text-3xl">📄</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">File Analysis</h1>
              <p className="text-gray-600 font-mono text-sm bg-gray-100 px-3 py-1 rounded-lg inline-block">{fileDetails.id}</p>
            </div>
          </div>
        </div>

        {/* File Status Section */}
        <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">📊</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Text Extraction Status</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border">
              <div className="text-sm font-medium text-gray-600 mb-2">Processing Status</div>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(fileDetails.textStatus)}`}>
                {fileDetails.textStatus}
              </span>
            </div>
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border">
              <div className="text-sm font-medium text-gray-600 mb-2">Extracted Characters</div>
              <div className="text-2xl font-bold text-gray-900">{fileDetails.extractedChars.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border">
              <div className="text-sm font-medium text-gray-600 mb-2">Last Updated</div>
              <div className="text-sm text-gray-700">{new Date(fileDetails.updatedAt).toLocaleString()}</div>
            </div>
          </div>
          
          {fileDetails.preview && (
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border">
              <div className="text-sm font-medium text-gray-600 mb-3">Document Preview</div>
              <div className="p-4 bg-white border rounded-xl text-gray-700 text-sm max-h-40 overflow-y-auto leading-relaxed shadow-inner">
                {fileDetails.preview}
              </div>
            </div>
          )}
        </div>

        {/* Warning for empty text */}
        {isTextEmpty && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-amber-800 mb-1">No Text Content Found</h3>
                <p className="text-amber-700">This file appears to contain no extractable text. AI features are disabled.</p>
              </div>
            </div>
          </div>
        )}

        {/* AI Action Buttons */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <button
            onClick={handleGenerateSummary}
            disabled={aiButtonsDisabled || loadingSummary || fileDetails.summaryStatus === 'PENDING'}
            className="group relative bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 rounded-2xl p-8 hover:border-blue-400 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Generate Summary</h3>
              <p className="text-gray-600 mb-4">
                {loadingSummary || fileDetails.summaryStatus === 'PENDING' 
                  ? 'Analyzing document...' 
                  : fileDetails.summaryStatus === 'READY' 
                  ? 'Create new summary'
                  : 'AI-powered document summary'}
              </p>
              {loadingSummary || fileDetails.summaryStatus === 'PENDING' ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              ) : fileDetails.summaryStatus && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(fileDetails.summaryStatus)}`}>
                  {fileDetails.summaryStatus}
                </span>
              )}
            </div>
          </button>

          <button
            onClick={handleGenerateQuiz}
            disabled={aiButtonsDisabled || loadingQuiz || fileDetails.quizStatus === 'PENDING'}
            className="group relative bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 rounded-2xl p-8 hover:border-purple-400 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🧠</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Generate Quiz</h3>
              <p className="text-gray-600 mb-4">
                {loadingQuiz || fileDetails.quizStatus === 'PENDING'
                  ? 'Creating questions...' 
                  : fileDetails.quizStatus === 'READY'
                  ? 'Create new quiz'
                  : 'Test your knowledge'}
              </p>
              {loadingQuiz || fileDetails.quizStatus === 'PENDING' ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
              ) : fileDetails.quizStatus && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(fileDetails.quizStatus)}`}>
                  {fileDetails.quizStatus}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Results Sections */}
        <div className="space-y-8">
          {/* Summary Section */}
          {fileDetails.summary && fileDetails.summaryStatus === 'READY' && (
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Document Summary</h2>
              </div>
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border">
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
                  {fileDetails.summary}
                </div>
              </div>
            </div>
          )}

          {/* Quiz Section */}
          {fileDetails.quiz && fileDetails.quizStatus === 'READY' && (
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Knowledge Quiz</h2>
              </div>
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border">
                {renderQuizContent(fileDetails.quiz)}
              </div>
            </div>
          )}

          {/* Error States */}
          {fileDetails.summaryStatus === 'ERROR' && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">❌</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-800 mb-1">Summary Generation Failed</h3>
                  <p className="text-red-700">Unable to generate summary. Please try again.</p>
                </div>
              </div>
            </div>
          )}

          {fileDetails.quizStatus === 'ERROR' && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">❌</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-800 mb-1">Quiz Generation Failed</h3>
                  <p className="text-red-700">Unable to generate quiz. Please try again.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}