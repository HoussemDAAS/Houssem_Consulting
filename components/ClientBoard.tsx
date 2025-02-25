/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ClientBoard.tsx
'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DndContext } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import ClientCard from './ClientCard';
import AddClientCard from './AddClientCard';
import ClientDetailsSidebar from './ClientDetailsSidebar';
import ClientForm from './ClientForm';
import { Client } from '@/types/client';
import { AnimatePresence, motion } from 'framer-motion';

export default function ClientBoard() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      const res = await fetch(`/api/clients?timestamp=${Date.now()}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      const data = await res.json();
      setProducts(data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchClients();
      fetchProducts();
    }
  }, [user]);

  if (loading) return <div className="p-8">Loading clients...</div>;

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Client Management</h1>
      </div>

      <DndContext>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <SortableContext 
            items={clients.map(c => c._id)} 
            strategy={horizontalListSortingStrategy}
          >
            {clients.map(client => (
              <ClientCard
                key={client._id}
                client={client}
                onClick={() => setSelectedClient(client)}
              />
            ))}
            
            <AddClientCard 
              onClick={() => {
                setSelectedClient(null);
                setModalOpen(true);
              } } status={''}            />
          </SortableContext>
        </div>
      </DndContext>

      <ClientForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        client={selectedClient}
        products={products}
        refreshClients={fetchClients}
      />

      <AnimatePresence>
        {selectedClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-50 h-full"
            onClick={() => setSelectedClient(null)}
          >
<ClientDetailsSidebar
  client={selectedClient}
  onClose={() => setSelectedClient(null)}
  refreshClients={fetchClients} // Add this prop
/>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}