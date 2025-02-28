// components/ClientDetailsSidebar.tsx
'use client';
import { useState } from 'react';
import { Client } from '@/types/client';
import { motion } from 'framer-motion';
import { TrashIcon } from '@heroicons/react/24/outline';
import ProductFormModal from './ProductFormModal';
import ProductDetailsModal from './ProductDetailsModal';

export default function ClientDetailsSidebar({ 
  client, 
  onClose,
  refreshClients
}: {
  client: Client;
  onClose: () => void;
  refreshClients: () => void;
}) {
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleAddProduct = async (productData: any) => {
    try {
      const response = await fetch(`/api/clients/${client._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products: [...client.products, productData]
        })
      });

      if (!response.ok) throw new Error('Failed to add product');
      
      refreshClients();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDeleteProduct = async (productIndex: number) => {
    try {
      const updatedProducts = client.products.filter((_, idx) => idx !== productIndex);
      
      const response = await fetch(`/api/clients/${client._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products: updatedProducts })
      });

      if (!response.ok) throw new Error('Failed to remove product');
      
      refreshClients();
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  return (
    <>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        className="fixed inset-0 left-auto w-full max-w-md bg-[#f9f9f4] shadow-xl p-6 z-50 h-screen border-l border-[#ccbeac]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#0b0b0b]">{client.name}</h2>
          <button onClick={onClose} className="text-[#0b0b0b] hover:text-[#ccbeac]">
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-[#ffffff] rounded-lg shadow-sm border border-[#ccbeac]/20">
            <h3 className="text-lg font-semibold text-[#0b0b0b] mb-2">Informations</h3>
            <p className="text-[#0b0b0b]/80">{client.email}</p>
            {client.phone && <p className="text-[#0b0b0b]/80 mt-1">{client.phone}</p>}
          </div>

          <button
            onClick={() => setShowProductForm(true)}
            className="w-full bg-[#ccbeac] text-[#0b0b0b] p-3 rounded-lg hover:bg-[#ccbeac]/90 transition-colors font-medium"
          >
            + Ajouter une Catégorie
          </button>

          <div className="space-y-4">
            {client.products.map((product, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-white rounded-lg shadow-sm cursor-pointer border border-[#ccbeac]/30"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-[#0b0b0b]">{product.name}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProduct(index);
                    }}
                    className="text-[#0b0b0b]/40 hover:text-[#ccbeac]"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2 text-sm text-[#0b0b0b]/70">
                  {product.subProducts.length} sous-produits
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <ProductFormModal
        isOpen={showProductForm}
        onClose={() => setShowProductForm(false)}
        onSave={handleAddProduct}
      />

      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}