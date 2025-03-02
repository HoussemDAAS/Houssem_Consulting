/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ClientDocument } from '@/lib/models/Client';
import { RegionDocument } from '@/lib/models/Region';
import ClientRegionGroup from './ClientRegionGroup';
import ClientDetailsDrawer from './ClientDetailsDrawer';
import ClientForm from './ClientForm';
import { Skeleton } from './ui/Skeleton';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function ClientBoard() {
  const { user } = useAuth();
  const [clients, setClients] = useState<ClientDocument[]>([]);
  const [regions, setRegions] = useState<RegionDocument[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientDocument | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingClient, setEditingClient] = useState<ClientDocument | null>(null);
  const fetchData = async () => {
    try {
      const [clientsRes, regionsRes, productsRes] = await Promise.all([
        fetch(`/api/clients?cache=${Date.now()}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
          cache: 'no-store'
        }),
        fetch(`/api/regions?cache=${Date.now()}`),
        fetch(`/api/products?timestamp=${Date.now()}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
          cache: 'no-store'
        }),
      ]);

      if (!clientsRes.ok || !regionsRes.ok || !productsRes.ok) {
        throw new Error('Failed to load data');
      }
      
      const [clientsData, regionsData, productsData] = await Promise.all([
        clientsRes.json(),
        regionsRes.json(),
        productsRes.json()
      ]);

      setClients(clientsData);
      setRegions(regionsData);
      setProducts(productsData);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Loading error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchData();
  }, [user?.token]);

  const groupClientsByRegion = () => {
    const grouped = new Map<string, ClientDocument[]>();
  
    // Initialize with all regions (including empty ones)
    regions.forEach(region => {
      grouped.set(region._id.toString(), []);
    });
  

    clients.forEach(client => {

      const regionId = client.region 
        ? (typeof client.region === 'object' 
           ? client.region._id.toString() 
           : String(client.region))
        : null;
  
      if (regionId && grouped.has(regionId)) {
        grouped.get(regionId)?.push(client);
      }
    });
  
    return Array.from(grouped.entries());
  };
  const handleEditClient = () => {
    setEditingClient(selectedClient);
    setSelectedClient(null); // Close drawer
    setShowEditForm(true);
  };
  if (loading) {
    return (
      <div className="p-6 space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, j) => (
                <Skeleton key={j} className="h-32 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {error} - <button 
          onClick={fetchData} 
          className="text-[#ccbeac] hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#0b0b0b] dark:text-[#f9f9f4]">
          Client Management
        </h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-[#ccbeac] hover:bg-[#ccbeac]/90 text-[#0b0b0b] px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add Client
        </button>
      </div>

      {/* Create Client Form */}
      <ClientForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        refreshClients={fetchData}
        regions={regions}
        products={products}
      />

      {/* Edit Client Form */}
      {selectedClient && (
        <ClientForm
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
          client={selectedClient}
          refreshClients={fetchData}
          regions={regions}
          products={products}
        />
      )}

      {/* Empty State for Regions */}
      {regions.length === 0 && (
        <div className="p-6 text-center border-2 border-dashed rounded-xl">
          <p className="text-[#ccbeac] mb-4">No regions found</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-[#ccbeac] text-[#0b0b0b] px-4 py-2 rounded-lg"
          >
            Create First Region
          </button>
        </div>
      )}

      {/* Client Groups by Region */}
      {groupClientsByRegion().map(([regionId, regionClients]) => (
        <ClientRegionGroup
          key={regionId}
          region={regions.find(r => r._id.toString() === regionId)!}
          clients={regionClients}
          regions={regions}
          onSelectClient={setSelectedClient}
        />
      ))}
    {editingClient && (
        <ClientForm
          isOpen={showEditForm}
          onClose={() => {
            setShowEditForm(false);
            setEditingClient(null);
          }}
          client={editingClient}
          refreshClients={fetchData}
          regions={regions}
          products={products}
        />
      )}
      {/* Client Details Drawer */}
      <ClientDetailsDrawer
        client={selectedClient}
        regions={regions}
        products={products}  // Ensure this is the full products list
        onClose={() => setSelectedClient(null)}
        onEdit={handleEditClient}
      />
    </div>
  );
}