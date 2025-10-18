import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../lib/api';

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = authApi.getCurrentUser();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authApi.isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    authApi.logout();
  };

  if (!user) {
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
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back!</h1>
            <p className="text-gray-600 text-lg">Hello {user.email}, ready to analyze your documents?</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            Logout
          </button>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Link
            to="/files"
            className="group bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:scale-105"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">📁</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">My Files</h3>
            <p className="text-gray-600">View and manage your uploaded documents</p>
          </Link>

          <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 opacity-75">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600">Coming soon - View your document analytics</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 opacity-75">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-3xl">⚙️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-600">Coming soon - Customize your experience</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              to="/files"
              className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <span className="text-2xl">📄</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Upload New Document</h3>
                <p className="text-gray-600 text-sm">Start analyzing a new PDF</p>
              </div>
            </Link>

            <div className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl opacity-75">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mr-4">
                <span className="text-2xl">🔍</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Search Documents</h3>
                <p className="text-gray-600 text-sm">Coming soon - Find documents quickly</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Account Information</h3>
              <p className="text-gray-600">Logged in as: {user.email}</p>
              <p className="text-gray-600 text-sm">User ID: {user.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}