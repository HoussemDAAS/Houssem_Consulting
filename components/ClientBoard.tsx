// components/ClientBoard.tsx
'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ClientCard from './ClientCard';
import AddClientCard from './AddClientCard';
import ClientDetailsSidebar from './ClientDetailsSidebar';
import { Client } from '@/types/client';
import { motion } from 'framer-motion';

export default function ClientBoard() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      const res = await fetch(`/api/clients?cache=${Date.now()}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
        cache: 'no-store'
      });
      
      if (!res.ok) throw new Error('Failed to fetch clients');
      
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      const fetchData = async () => {
        let attempts = 0;
        const tryFetch = async () => {
          try {
            await fetchClients();
          } catch (error) {
            if (attempts < 3) {
              attempts++;
              setTimeout(tryFetch, 1000 * attempts);
            }
          }
        };
        await tryFetch();
      };
      fetchData();
    }
  }, [user?.token]);

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ccbeac]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#0b0b0b]">Gestion des Clients</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(client => (
          <ClientCard
            key={client._id}
            client={client}
            onClick={() => setSelectedClient(client)}
          />
        ))}
        <AddClientCard 
          onClick={() => {/* Open client creation modal */}}
          status="active"
        />
      </div>

      {selectedClient && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-[#0b0b0b]/30 z-50"
          onClick={() => setSelectedClient(null)}
        >
          <ClientDetailsSidebar
            client={selectedClient}
            onClose={() => setSelectedClient(null)}
            refreshClients={fetchClients}
          />
        </motion.div>
      )}
    </div>
  );
}