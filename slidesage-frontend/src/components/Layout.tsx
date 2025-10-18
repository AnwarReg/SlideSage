import { Link, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const getUserEmail = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.email || 'User';
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
    }
    return 'User';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-lg font-bold">📚</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SlideSage
            </span>
          </Link>
          <div className="flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center space-x-1"
                >
                  <span>🏠</span>
                  <span>Dashboard</span>
                </Link>
                <Link 
                  to="/files" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center space-x-1"
                >
                  <span>📁</span>
                  <span>Files</span>
                </Link>
                <Link 
                  to="/settings" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center space-x-1"
                >
                  <span>⚙️</span>
                  <span>Settings</span>
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-sm">👤</span>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{getUserEmail()}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main>
        {children}
      </main>
    </div>
  );
}