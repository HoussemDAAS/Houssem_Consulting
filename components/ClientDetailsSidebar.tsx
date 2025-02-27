// components/ClientDetailsSidebar.tsx
'use client';
import { useState } from 'react';
import { Client } from '@/types/client';
import { motion } from 'framer-motion';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function ClientDetailsSidebar({ 
  client, 
  onClose,
  refreshClients
}: {
  client: Client;
  onClose: () => void;
  refreshClients: () => void;
}) {
  const [newProduct, setNewProduct] = useState({
    name: '',
    characteristics: {} as Record<string, string>,
    subProducts: [] as Array<{ 
      name: string; 
      specifications: string 
    }>
  });

  const handleAddProduct = async () => {
    try {
      const response = await fetch(`/api/clients/${client._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: newProduct
        })
      });

      if (!response.ok) throw new Error('Failed to add product');
      
      refreshClients();
      setNewProduct({
        name: '',
        characteristics: {},
        subProducts: []
      });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleRemoveProduct = async (productIndex: number) => {
    try {
      const updatedProducts = client.products
        .filter((_, idx) => idx !== productIndex);
      
      const response = await fetch(`/api/clients/${client._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: updatedProducts })
      });

      if (!response.ok) throw new Error('Failed to remove product');
      
      refreshClients();
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 left-auto w-full max-w-md bg-[#f9f9f4] shadow-xl p-6 z-50 h-screen border-l border-[#ccbeac]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-[#0b0b0b]">Client Details</h3>
          <button 
            onClick={onClose}
            className="text-[#0b0b0b] hover:text-[#ccbeac]"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2">
          <div className="p-3 bg-[#ccbeac]/20 rounded-lg">
            <p className="text-sm text-[#0b0b0b]/80">Email</p>
            <p className="font-medium text-[#0b0b0b]">{client.email}</p>
          </div>
          
          {client.phone && (
            <div className="p-3 bg-[#ccbeac]/20 rounded-lg">
              <p className="text-sm text-[#0b0b0b]/80">Phone</p>
              <p className="font-medium text-[#0b0b0b]">{client.phone}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="border-t border-[#ccbeac] pt-4">
          <h3 className="text-lg font-bold text-[#0b0b0b] mb-4">Add New Category</h3>
          
          <div className="space-y-4">
            <input
              value={newProduct.name}
              onChange={(e) => setNewProduct(p => ({ ...p, name: e.target.value }))}
              placeholder="Category Name"
              className="w-full p-3 rounded-lg border border-[#ccbeac] bg-transparent"
            />

            <div className="space-y-2">
              <h4 className="font-medium text-[#0b0b0b]">Characteristics</h4>
              {Object.entries(newProduct.characteristics).map(([key], index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={key}
                    onChange={(e) => {
                      const updated = { ...newProduct.characteristics };
                      const value = updated[key];
                      delete updated[key];
                      updated[e.target.value] = value;
                      setNewProduct(p => ({ ...p, characteristics: updated }));
                    }}
                    placeholder="Characteristic name"
                    className="flex-1 p-2 border border-[#ccbeac] rounded"
                  />
                  <input
                    value={newProduct.characteristics[key]}
                    onChange={(e) => setNewProduct(p => ({
                      ...p,
                      characteristics: { ...p.characteristics, [key]: e.target.value }
                    }))}
                    placeholder="Value"
                    className="flex-1 p-2 border border-[#ccbeac] rounded"
                  />
                </div>
              ))}
              <button
                onClick={() => setNewProduct(p => ({
                  ...p,
                  characteristics: { ...p.characteristics, '': '' }
                }))}
                className="flex items-center gap-1 text-[#0b0b0b] hover:text-[#ccbeac]"
              >
                <PlusIcon className="w-4 h-4" />
                Add Characteristic
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-[#0b0b0b]">Subproducts</h4>
              {newProduct.subProducts.map((sub, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={sub.name}
                    onChange={(e) => {
                      const updated = [...newProduct.subProducts];
                      updated[index].name = e.target.value;
                      setNewProduct(p => ({ ...p, subProducts: updated }));
                    }}
                    placeholder="Subproduct name"
                    className="flex-1 p-2 border border-[#ccbeac] rounded"
                  />
                  <input
                    value={sub.specifications}
                    onChange={(e) => {
                      const updated = [...newProduct.subProducts];
                      updated[index].specifications = e.target.value;
                      setNewProduct(p => ({ ...p, subProducts: updated }));
                    }}
                    placeholder="Specifications"
                    className="flex-1 p-2 border border-[#ccbeac] rounded"
                  />
                </div>
              ))}
              <button
                onClick={() => setNewProduct(p => ({
                  ...p,
                  subProducts: [...p.subProducts, { name: '', specifications: '' }]
                }))}
                className="flex items-center gap-1 text-[#0b0b0b] hover:text-[#ccbeac]"
              >
                <PlusIcon className="w-4 h-4" />
                Add Subproduct
              </button>
            </div>

            <button
              onClick={handleAddProduct}
              className="w-full bg-[#ccbeac] text-[#0b0b0b] p-3 rounded-lg hover:bg-[#ccbeac]/90 transition-colors"
            >
              Add Category
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {client.products.map((product, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-[#ccbeac]/30">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-lg text-[#0b0b0b]">{product.name}</h4>
                <button
                  onClick={() => handleRemoveProduct(index)}
                  className="text-[#0b0b0b]/50 hover:text-[#ccbeac]"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>

              {Object.entries(product.characteristics).length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {Object.entries(product.characteristics).map(([key, value], idx) => (
                    <div key={idx} className="text-sm">
                      <span className="text-[#0b0b0b]/70">{key}:</span>
                      <span className="ml-2 text-[#0b0b0b]">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {product.subProducts.length > 0 && (
                <div className="mt-4 border-t border-[#ccbeac]/20 pt-4">
                  <h5 className="font-medium text-[#0b0b0b] mb-2">Subproducts:</h5>
                  <div className="space-y-2">
                    {product.subProducts.map((sub, idx) => (
                      <div key={idx} className="pl-3 border-l-2 border-[#ccbeac]">
                        <p className="font-medium text-[#0b0b0b]">{sub.name}</p>
                        <p className="text-sm text-[#0b0b0b]/70">{sub.specifications}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}