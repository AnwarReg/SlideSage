import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl mb-8 shadow-2xl">
            <span className="text-4xl">🚀</span>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Welcome to SlideSage
          </h1>
          <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your documents into intelligent summaries and interactive quizzes with the power of AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center space-x-3"
            >
              <span className="text-2xl group-hover:animate-bounce">�</span>
              <span>Get Started</span>
            </Link>
            <Link
              to="/register"
              className="bg-white/50 backdrop-blur-sm border border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/70 transition-all duration-300 hover:scale-105"
            >
              Create Account
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">📄</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Upload Documents</h3>
            <p className="text-gray-600">Simply upload your PDF files and let our AI extract the key information</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">📝</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Generate Summaries</h3>
            <p className="text-gray-600">Get intelligent, concise summaries that capture the essence of your documents</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🧠</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create Quizzes</h3>
            <p className="text-gray-600">Test your knowledge with automatically generated quizzes based on your content</p>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-12 inline-block">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to transform your learning?</h2>
            <p className="text-gray-600 mb-8 text-lg">Join thousands of users who are already using AI to enhance their document analysis</p>
            <Link
              to="/register"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center space-x-2"
            >
              <span>🚀</span>
              <span>Start Now</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}