'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user?.token) {
      router.push('/login');
    }
  }, [user?.token, loading, router]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900"></div>;
  }

  if (!user || !user.token) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-4 flex flex-col fixed h-screen
          transform transition-transform duration-300 md:translate-x-0 z-50
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Tightly packed logos */}
        <div className="flex flex-col items-center gap-4 ">
          <div className="w-24 h-24 ">
            <Image
              src="/logo.jpeg"
              alt="Company Logo 1"
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
          <div className="w-24 h-24 ">
            <Image
              src="/logo2.svg"
              alt="Company Logo 2"
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 flex flex-col h-[calc(100vh-12rem)] mt-2">
          <nav className="space-y-2 flex-1 overflow-y-auto">
          <Link
              href=""
              className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
             
                 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard"
              className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                isActive('/dashboard')
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Costumer Management
            </Link>

            <Link
              href="/products"
              className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                isActive('/products')
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Product Management
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

          {/* Fixed bottom user section */}
          <div className="border-t dark:border-gray-700 pt-4 mt-auto">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className="flex-1 bg-gray-50 dark:bg-gray-900 ml-0 md:ml-64 overflow-auto"
        onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
      >
        {children}
      </main>
    </div>
  );
}