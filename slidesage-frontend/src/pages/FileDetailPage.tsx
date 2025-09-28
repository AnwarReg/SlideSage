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
      return <div className="whitespace-pre-wrap">{quiz}</div>;
    }
    if (quiz?.questions && Array.isArray(quiz.questions)) {
      return (
        <div className="space-y-6">
          {quiz.questions.map((question: any, index: number) => (
            <div key={question.id || index} className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3">
                {index + 1}. {question.question}
              </h4>
              {question.options && (
                <div className="space-y-2 mb-3">
                  {question.options.map((option: string, optionIndex: number) => (
                    <div
                      key={optionIndex}
                      className={`p-2 rounded ${
                        optionIndex === question.correctAnswer
                          ? 'bg-green-100 border border-green-300'
                          : 'bg-gray-50'
                      }`}
                    >
                      {String.fromCharCode(65 + optionIndex)}. {option}
                      {optionIndex === question.correctAnswer && (
                        <span className="text-green-600 ml-2">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {question.explanation && (
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                  <strong>Explanation:</strong> {question.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
    return <div>Quiz format not recognized</div>;
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-600">Loading file details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <Link to="/files" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Files
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={loadFileDetails}
            className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!fileDetails) {
    return (
      <div className="py-8">
        <Link to="/files" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Files
        </Link>
        <p className="text-gray-600">File not found.</p>
      </div>
    );
  }

  const isTextEmpty = fileDetails.textStatus === 'EMPTY';
  const aiButtonsDisabled = isTextEmpty || fileDetails.textStatus !== 'READY';

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/files" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Files
        </Link>
        <h1 className="text-2xl font-bold">File Details</h1>
        <p className="text-gray-600 mt-2">ID: {fileDetails.id}</p>
      </div>

      {/* File Status Section */}
      <div className="bg-white border rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">📄 Text Extraction Status</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Status:</span>
            <span className={`px-2 py-1 rounded text-sm ${getStatusColor(fileDetails.textStatus)}`}>
              {fileDetails.textStatus}
            </span>
          </div>
          <div>
            <span className="font-medium">Extracted Characters:</span>
            <span className="ml-2">{fileDetails.extractedChars.toLocaleString()}</span>
          </div>
          {fileDetails.preview && (
            <div>
              <span className="font-medium">Preview:</span>
              <div className="mt-2 p-3 bg-gray-50 border rounded text-sm text-gray-700 max-h-32 overflow-y-auto">
                {fileDetails.preview}
              </div>
            </div>
          )}
          <div className="text-xs text-gray-500">
            Last updated: {new Date(fileDetails.updatedAt).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Warning for empty text */}
      {isTextEmpty && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-yellow-800">
            ⚠️ This file appears to contain no extractable text. AI features are disabled.
          </p>
        </div>
      )}

      {/* AI Action Buttons */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={handleGenerateSummary}
          disabled={aiButtonsDisabled || loadingSummary || fileDetails.summaryStatus === 'PENDING'}
          className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-semibold">Generate Summary</h3>
            <p className="text-sm text-gray-600 mt-1">
              {loadingSummary || fileDetails.summaryStatus === 'PENDING' 
                ? 'Generating...' 
                : fileDetails.summaryStatus === 'READY' 
                ? 'Regenerate Summary'
                : 'AI-powered summary'}
            </p>
            {fileDetails.summaryStatus && (
              <span className={`inline-block mt-1 px-2 py-1 rounded text-xs ${getStatusColor(fileDetails.summaryStatus)}`}>
                {fileDetails.summaryStatus}
              </span>
            )}
          </div>
        </button>

        <button
          onClick={handleGenerateQuiz}
          disabled={aiButtonsDisabled || loadingQuiz || fileDetails.quizStatus === 'PENDING'}
          className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">🧠</div>
            <h3 className="font-semibold">Generate Quiz</h3>
            <p className="text-sm text-gray-600 mt-1">
              {loadingQuiz || fileDetails.quizStatus === 'PENDING'
                ? 'Creating...' 
                : fileDetails.quizStatus === 'READY'
                ? 'Regenerate Quiz'
                : 'Test your knowledge'}
            </p>
            {fileDetails.quizStatus && (
              <span className={`inline-block mt-1 px-2 py-1 rounded text-xs ${getStatusColor(fileDetails.quizStatus)}`}>
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
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              📝 Summary
            </h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {fileDetails.summary}
            </div>
          </div>
        )}

        {/* Quiz Section */}
        {fileDetails.quiz && fileDetails.quizStatus === 'READY' && (
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              🧠 Quiz
            </h2>
            {renderQuizContent(fileDetails.quiz)}
          </div>
        )}

        {/* Error States */}
        {fileDetails.summaryStatus === 'ERROR' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">❌ Failed to generate summary. Please try again.</p>
          </div>
        )}

        {fileDetails.quizStatus === 'ERROR' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">❌ Failed to generate quiz. Please try again.</p>
          </div>
        )}
      </div>
    </div>
  );
}