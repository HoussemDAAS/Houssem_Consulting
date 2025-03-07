'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ClientDocument } from '@/lib/models/Client';
import { RegionDocument } from '@/lib/models/Region';
import { SecteurDocument } from '@/lib/models/Secteur';
import { Skeleton } from './ui/Skeleton';
import ClientContactRegionGroup from './ClientContactRegionGroup';
import { VilleDocument } from '@/lib/models/Ville';
import ClientForm from './ClientForm';

interface Contact {
  _id?: string;
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phone: string;
  service: string;
}

export default function ClientContactBoard() {
  const { user } = useAuth();
  const [clients, setClients] = useState<ClientDocument[]>([]);
  const [regions, setRegions] = useState<RegionDocument[]>([]);
  const [secteurs, setSecteurs] = useState<SecteurDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [villes, setVilles] = useState<VilleDocument[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const fetchData = async () => {
  try {
    setLoading(true);
    const [clientsRes, regionsRes, secteursRes, villesRes] = await Promise.all([
      fetch(`/api/clients?cache=${Date.now()}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
        cache: 'no-store'
      }),
      fetch(`/api/regions?cache=${Date.now()}`),
      fetch(`/api/secteurs?cache=${Date.now()}`),
      fetch(`/api/villes?cache=${Date.now()}`) // Add villes fetch
    ]);

    if (!clientsRes.ok || !regionsRes.ok || !secteursRes.ok || !villesRes.ok) {
      throw new Error('Failed to load data');
    }
    
    const [clientsData, regionsData, secteursData, villesData] = await Promise.all([
      clientsRes.json(),
      regionsRes.json(),
      secteursRes.json(),
      villesRes.json() // Add villes data
    ]);

    setClients(clientsData);
    setRegions(regionsData);
    setSecteurs(secteursData);
    setVilles(villesData); // Set villes state
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
    
    // Create groups only for regions with clients
    clients.forEach(client => {
      const regionId = client.region?._id?.toString();
      if (regionId) {
        if (!grouped.has(regionId)) {
          grouped.set(regionId, []);
        }
        grouped.get(regionId)?.push(client);
      }
    });
  
    return Array.from(grouped.entries());
  };

  const handleSave = async (clientId: string, updates: { 
    address?: string;
    ville?: string;
    secteur?: string;
    contacts: Contact[] 
  }) => {
    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save changes');
      }
      
      await fetchData();
    } catch (error) {
      console.error('Save error:', error);
      setError(error instanceof Error ? error.message : 'Failed to save changes');
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
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
          Contact Management
        </h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-[#ccbeac] hover:bg-[#ccbeac]/90 text-[#0b0b0b] px-4 py-2 rounded-lg"
        >
          + Add Client
        </button>
      </div>
      <ClientForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        refreshClients={fetchData}
        regions={regions}
        products={[]}
     
      />

      {groupClientsByRegion().map(([regionId, regionClients]) => {
  const region = regions.find(r => r._id.toString() === regionId);
  return region ? (
    <ClientContactRegionGroup
      key={regionId}
      region={region}
      secteurs={secteurs}
      villes={villes} // Add this prop
      clients={regionClients}
      onSave={handleSave}
      onSuccess={fetchData}
    />
  ) : null;
})}
    </div>
  );
}