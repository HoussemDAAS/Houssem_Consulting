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

// ProductBoard.tsx
return (
  <div className="flex flex-col h-full">
    {/* Fixed Header */}
    <div className="fixed top-0 left-0 right-0 bg-white dark:bg-[#1a1a1a] z-40 border-b border-[#ccbeac]/30 md:left-64">
  <div className="p-4 md:p-6 ml-14 md:ml-0"> {/* Added ml-14 for mobile */}
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h1 className="text-xl md:text-2xl font-bold text-[#0b0b0b] dark:text-[#f9f9f4] truncate">
        product Management {/* Added truncate */}
      </h1>
          <button
            onClick={() => { setSelectedProduct(null); setModalOpen(true); }}
            className="bg-[#ccbeac] hover:bg-[#ccbeac]/90 text-[#0b0b0b] px-4 py-2 rounded-lg flex items-center gap-2 w-full md:w-auto justify-center text-sm md:text-base"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Category</span>
          </button>
        </div>
      </div>
    </div>

    {/* Content Area */}
    <div className="pt-[76px] md:pt-[88px] flex-1 overflow-y-auto px-4 md:px-6 pb-6">
      {/* Error Display */}
      {error && (
        <div className="p-3 sm:p-4 bg-red-100 text-red-700 rounded-lg border border-red-200 text-sm sm:text-base mb-6">
          {error}
        </div>
      )}

      {/* Products Grid */}
      {products.length > 0 ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"> 
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
        <div className="p-6 sm:p-8 text-center text-[#ccbeac] border-2 border-dashed rounded-xl text-sm sm:text-base">
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