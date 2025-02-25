'use client';
import {useState } from 'react';

import ClientBoard from '@/components/ClientBoard';
import ClientDetailsSidebar from '@/components/ClientDetailsSidebar';
import { AnimatePresence, motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';

export interface Client {
  _id: string;
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  phone?: string;
  address?: string;
  products: Array<{
    product: string;
    subProducts: string[];
  }>;
}

export default function Dashboard() {

  const [selectedClient] = useState<Client | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);



  return (
    <DashboardLayout>
      <ClientBoard   />

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
              client={selectedClient!}
              onClose={() => setSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}