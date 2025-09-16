import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { filesApi, FileSummary, KeyTerms, Quiz } from '../lib/api';

export default function FileDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [summary, setSummary] = useState<FileSummary | null>(null);
  const [keyTerms, setKeyTerms] = useState<KeyTerms | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingTerms, setLoadingTerms] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  const handleGetSummary = async () => {
    if (!id) return;
    setLoadingSummary(true);
    try {
      const result = await filesApi.getSummary(id);
      setSummary(result);
    } catch (error) {
      console.error('Failed to get summary:', error);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleGetKeyTerms = async () => {
    if (!id) return;
    setLoadingTerms(true);
    try {
      const result = await filesApi.getKeyTerms(id);
      setKeyTerms(result);
    } catch (error) {
      console.error('Failed to get key terms:', error);
    } finally {
      setLoadingTerms(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!id) return;
    setLoadingQuiz(true);
    try {
      const result = await filesApi.generateQuiz(id);
      setQuiz(result);
    } catch (error) {
      console.error('Failed to generate quiz:', error);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/files" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Files
        </Link>
        <h1 className="text-2xl font-bold">File Detail: Document_{id}</h1>
        <p className="text-gray-600 mt-2">Analyze your document with AI-powered tools</p>
      </div>

      {/* Action Buttons */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={handleGetSummary}
          disabled={loadingSummary}
          className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors disabled:opacity-50"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-semibold">Get Summary</h3>
            <p className="text-sm text-gray-600 mt-1">
              {loadingSummary ? 'Generating...' : 'AI-powered summary'}
            </p>
          </div>
        </button>

        <button
          onClick={handleGetKeyTerms}
          disabled={loadingTerms}
          className="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 transition-colors disabled:opacity-50"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">🔑</div>
            <h3 className="font-semibold">Get Key Terms</h3>
            <p className="text-sm text-gray-600 mt-1">
              {loadingTerms ? 'Extracting...' : 'Important concepts'}
            </p>
          </div>
        </button>

        <button
          onClick={handleGenerateQuiz}
          disabled={loadingQuiz}
          className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 transition-colors disabled:opacity-50"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">🧠</div>
            <h3 className="font-semibold">Generate Quiz</h3>
            <p className="text-sm text-gray-600 mt-1">
              {loadingQuiz ? 'Creating...' : 'Test your knowledge'}
            </p>
          </div>
        </button>
      </div>

      {/* Results Sections */}
      <div className="space-y-8">
        {/* Summary Section */}
        {summary && (
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              📝 Summary ({summary.wordCount} words)
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">{summary.summary}</p>
            <div>
              <h3 className="font-semibold mb-2">Key Points:</h3>
              <ul className="list-disc list-inside space-y-1">
                {summary.keyPoints.map((point, index) => (
                  <li key={index} className="text-gray-600">{point}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Key Terms Section */}
        {keyTerms && (
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              🔑 Key Terms ({keyTerms.terms.length} terms)
            </h2>
            <div className="grid gap-4">
              {keyTerms.terms.map((term, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{term.term}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${getImportanceColor(term.importance)}`}>
                      {term.importance}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{term.definition}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quiz Section */}
        {quiz && (
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              🧠 Quiz ({quiz.questions.length} questions)
            </h2>
            <div className="space-y-6">
              {quiz.questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">
                    {index + 1}. {question.question}
                  </h3>
                  <div className="space-y-2 mb-3">
                    {question.options.map((option, optionIndex) => (
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
                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                    <strong>Explanation:</strong> {question.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}