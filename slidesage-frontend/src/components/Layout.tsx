import { Link, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('auth-token');
  const userEmail = localStorage.getItem('user-email');

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-email');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link to="/" className="text-xl font-bold">📚 SlideSage</Link>
          <div className="space-x-4">
            {isLoggedIn ? (
              <>
                <Link to="/files" className="hover:underline">Files</Link>
                <Link to="/settings" className="hover:underline">Settings</Link>
                <span className="text-blue-200">({userEmail})</span>
                <button onClick={handleLogout} className="hover:underline">Logout</button>
              </>
            ) : (
              <Link to="/login" className="hover:underline">Login</Link>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-4">
        {children}
      </main>
    </div>
  );
}