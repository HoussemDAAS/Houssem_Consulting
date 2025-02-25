'use client';
import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { ProductDocument } from '@/lib/models/Product';
import { useAuth } from '@/context/AuthContext';
import ProductDetailsSidebar from './ProductDetailsSidebar';

export default function ProductBoard() {
  const { user } = useAuth();
  const [products, setProducts] = useState<ProductDocument[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductDocument | null>(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState<ProductDocument | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products', {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to fetch products');
      
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      fetchProducts();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (loading) {
    return <div className="p-8">Loading products...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#0b0b0b] dark:text-[#f9f9f4]">
       Gestion des Categories
        </h1>
        <button
          onClick={() => { setSelectedProduct(null); setModalOpen(true); }}
          className="bg-[#ccbeac] text-[#0b0b0b] px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#ccbeac]/90"
        >
          <PlusIcon className="h-5 w-5" />
        Ajouter une categorie
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onEdit={() => { setSelectedProduct(product); setModalOpen(true); }}
            onDelete={() => handleDelete(product._id)}
            onClick={() => setSelectedProductDetails(product)}
          />
        ))}
      </div>

      <ProductModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedProduct(null); }}
        product={selectedProduct}
        refreshProducts={fetchProducts}
      />

      {selectedProductDetails && (
        <ProductDetailsSidebar
          product={selectedProductDetails}
          onClose={() => setSelectedProductDetails(null)}
        />
      )}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}