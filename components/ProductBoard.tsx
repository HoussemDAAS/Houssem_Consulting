'use client';
import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { ProductDocument } from '@/lib/models/Product';
import { useAuth } from '@/context/AuthContext';
import ProductDetailsSidebar from './ProductDetailsSidebar';
import { toast } from 'react-hot-toast';

export default function ProductBoard() {
  const { user } = useAuth();
  const [products, setProducts] = useState<ProductDocument[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductDocument | null>(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState<ProductDocument | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');



 // components/ProductBoard.tsx
const fetchProducts = async () => {
  try {
    const res = await fetch(`/api/products?timestamp=${Date.now()}`, {
      headers: { Authorization: `Bearer ${user?.token}` },
      cache: 'no-store'
    });
    
    if (!res.ok) throw new Error('Failed to load products');
    
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setError('');
  } catch (err) {
    console.error('Fetch error:', err);
    setError(err instanceof Error ? err.message : 'An error occurred');
    toast.error('Error loading products');
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;
    
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user?.token}` }
      });
  
      if (!response.ok) throw new Error(`Erreur HTTP! statut: ${response.status}`);
  
      await fetchProducts();
      toast.success('Catégorie supprimée avec succès');
    } catch (error) {
      console.error('Échec de la suppression:', error);
      toast.error(error instanceof Error ? error.message : 'Échec de la suppression');
    }
  };
  useEffect(() => {
    if (user?.token) {
      fetchProducts();
    }
  }, [user?.token]);
  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-pulse text-[#ccbeac]">
          Loading categories...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#0b0b0b] dark:text-[#f9f9f4]">
          Category Management
        </h1>
        <button
          onClick={() => { setSelectedProduct(null); setModalOpen(true); }}
          className="bg-[#ccbeac] hover:bg-[#ccbeac]/90 text-[#0b0b0b] px-4 py-2 rounded-lg 
                     flex items-center gap-2 transition-colors duration-200"
        >
          <PlusIcon className="h-5 w-5" />
          Add Category
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id.toString()}
              product={product}
              onEdit={() => { setSelectedProduct(product); setModalOpen(true); }}
              onDelete={() => handleDelete(product._id.toString())}
              onClick={() => setSelectedProductDetails(product)}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-[#ccbeac] border-2 border-dashed rounded-xl">
          No categories found. Click the button above to add a category.
        </div>
      )}

      {/* Modals */}
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

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" 
         fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}