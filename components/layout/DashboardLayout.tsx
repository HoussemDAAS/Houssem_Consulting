'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900"></div>;
  }

  if (!user) {
    return null; // Already handled by useEffect
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-4 flex flex-col">
        <div className="mb-8">
          <img src="/logo.jpeg" alt="Logo" className="h-12 w-auto" />
        </div>
        
        <nav className="space-y-2 flex-1">
          <Link href="/dashboard" className="block w-full text-left px-4 py-2 rounded-lg  dark:bg-gray-700">
            Dashboard
          </Link>
          <Link href="/products" className="block w-full text-left px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">
            Product Management
          </Link>
        </nav>

        {/* User Section */}
        <div className="border-t dark:border-gray-700 pt-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                router.push('/login');
              }}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
}