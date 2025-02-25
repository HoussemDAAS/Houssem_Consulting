'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900"></div>;
  }

  if (!user) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-4 flex flex-col">
        <div className="mb-8">
          <img src="/logo.jpeg" alt="Logo" className="h-12 w-auto" />
        </div>
        
        <nav className="space-y-2 flex-1">
          <Link 
            href="/dashboard" 
            className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
              isActive('/dashboard') 
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Tableau de bord
          </Link>
          
          <Link 
            href="/products" 
            className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
              isActive('/products')
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
          Gestion des Categories et leurs produits
          </Link>

          {user.role === 'admin' && (
            <Link
              href="/users"
              className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                isActive('/users')
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
             Gestion des utilisateurs du plateforme
            </Link>
          )}
        </nav>

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
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
}