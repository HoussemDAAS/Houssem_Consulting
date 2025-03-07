'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user?.token) {
      router.push('/login');
    }
  }, [user?.token, loading, router]);

  // Modify your loading state to prevent flickering
  if (loading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900"></div>;
  }

  // Add additional protection for user state
  if (!user || !user.token) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-4 flex flex-col fixed h-screen">
        <div className="relative w-full flex flex-col justify-center items-center gap-3 mt-3">
          <div className="relative w-20 h-20">
            <Image src="/logo.jpeg" alt="Company Logo 1" fill className="object-contain" />
          </div>
          <div className="flex items-center">
            <span className="text-2xl text-secondaryColor">×</span>
          </div>
          <div className="relative w-20 h-20">
            <Image src="/logo2.svg" alt="Company Logo 2" fill className="object-contain" />
          </div>
        </div>

        <hr className="my-4 border-gray-200 dark:border-gray-700" />
        <nav className="space-y-2 flex-1 overflow-auto">
          <Link 
            href="/dashboard" 
            className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
              isActive('/dashboard') 
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Client Management
          </Link>

          <Link 
            href="/products" 
            className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
              isActive('/products')
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Category Management
          </Link>
          <Link 
            href="/contacts" 
            className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
              isActive('/contacts')
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Contact Management
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
              User Management
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
                logout();
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

      <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 ml-64 overflow-auto">
        {children}
      </main>
    </div>
  );
}
