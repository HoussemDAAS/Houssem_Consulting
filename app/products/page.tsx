'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProductBoard from '@/components/ProductBoard';


export default function ProductsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products?timestamp=${Date.now()}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error('Échec du chargement des catégories');
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Format de données invalide');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchProducts();
  }, [user?.token]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-[#ccbeac]">Chargement en cours...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {error ? (
        <div className="p-8 text-red-500">{error}</div>
      ) : (
        <ProductBoard/>
      )}
    </DashboardLayout>
  );
}