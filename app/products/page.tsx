/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProductBoard from '@/components/ProductBoard';

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
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
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

 
    if (user?.token) fetchProducts();
  }, [user?.token]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8">Loading products...</div>
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