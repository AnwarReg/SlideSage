import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link to="/" className="text-xl font-bold">📚 SlideSage</Link>
          <div className="space-x-4">
            <Link to="/files" className="hover:underline">Files</Link>
            <Link to="/settings" className="hover:underline">Settings</Link>
            <Link to="/login" className="hover:underline">Login</Link>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-4">
        {children}
      </main>
    </div>
  );
}