'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import ClientBoard from '@/components/ClientBoard';
import ClientDetailsSidebar from '@/components/ClientDetailsSidebar';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: 'active' | 'inactive';
  lastContact?: string;
  projects?: number;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initial data
  useEffect(() => {
    setClients([
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Tech Corp',
        phone: '+1 555 123 4567',
        status: 'active',
        lastContact: '2024-03-15',
        projects: 3
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        company: 'Design Studio',
        phone: '+1 555 987 6543',
        status: 'active',
        lastContact: '2024-03-14',
        projects: 5
      }
    ]);
  }, []);

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    setClients(clients.map(client => {
      if (client.id === active.id) {
        return { ...client, status: over.id as 'active' | 'inactive' };
      }
      return client;
    }));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-4 flex flex-col">
        <div className="mb-8">
          <img src="/logo.jpeg" alt="Logo" className="h-12 w-auto" />
        </div>
        
        <nav className="space-y-2 flex-1">
          <Link href="/dashboard" className="block w-full text-left px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">
            Dashboard
          </Link>
          <Link href="/products" className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            Product Management
          </Link>
        </nav>

        <div className="border-t dark:border-gray-700 pt-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
            <button 
              onClick={logout}
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
      <div className="flex items-center gap-4 justify-end">
            <div className="">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
            <button 
              onClick={logout}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>

          <DndContext onDragEnd={handleDragEnd}>
          <ClientBoard 
            clients={clients}
            onClientClick={(client) => {
              setSelectedClient(client);
              setSidebarOpen(true);
            }}
          />
        </DndContext>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-800 shadow-xl"
            >
              <ClientDetailsSidebar
          client={selectedClient}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}