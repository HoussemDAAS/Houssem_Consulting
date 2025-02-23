// components/ClientDetailsSidebar.tsx
'use client';
import { useEffect, useState } from 'react';
import { Client } from '@/types/client';
import { ProductDocument } from '@/lib/models/Product';
import { motion } from 'framer-motion';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';

interface ClientProductWithDetails {
  product: string | ProductDocument;
  subProducts: string[];
}

export default function ClientDetailsSidebar({ client, onClose }: {
  client: Client;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const [allProducts, setAllProducts] = useState<ProductDocument[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedSubProducts, setSelectedSubProducts] = useState<string[]>([]);
  const [clientProducts, setClientProducts] = useState<ClientProductWithDetails[]>(client.products || []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        const data = await res.json();
        setAllProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [user]);

  const handleAddProduct = async () => {
    if (!selectedProductId) return;

    try {
      const newProduct = {
        product: selectedProductId,
        subProducts: selectedSubProducts
      };

      // Optimistic update
      setClientProducts(prev => [
        ...prev,
        {
          ...newProduct,
          product: allProducts.find(p => p._id === selectedProductId)!,
        }
      ]);

      const res = await fetch(`/api/clients/${client._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          products: [
            ...clientProducts,
            newProduct
          ]
        })
      });

      if (!res.ok) throw new Error('Failed to update client');
      
      const updatedClient = await res.json();
      setClientProducts(updatedClient.products.map((p: ClientProductWithDetails) => ({
        ...p,
        product: allProducts.find(ap => ap._id === p.product) || p.product
      })));
      
      setSelectedProductId('');
      setSelectedSubProducts([]);
    } catch (error) {
      console.error('Error adding product:', error);
      setClientProducts(clientProducts);
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    try {
      setClientProducts(prev => prev.filter(p => 
        typeof p.product === 'object' 
          ? p.product._id !== productId 
          : p.product !== productId
      ));

      const res = await fetch(`/api/clients/${client._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          products: clientProducts.filter(p => 
            typeof p.product === 'object' 
              ? p.product._id !== productId 
              : p.product !== productId
          )
        })
      });

      if (!res.ok) throw new Error('Failed to update client');
      
      const updatedClient = await res.json();
      setClientProducts(updatedClient.products.map((p: ClientProductWithDetails) => ({
        ...p,
        product: allProducts.find(ap => ap._id === p.product) || p.product
     } ),));
    } catch (error) {
      console.error('Error removing product:', error);
      setClientProducts(clientProducts);
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-800 shadow-xl p-6 z-50 h-screen border-l border-gray-200 dark:border-gray-700"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Client Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">{client.email}</p>
            </div>
            {client.phone && (
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">{client.phone}</p>
              </div>
            )}
            {client.address && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">{client.address}</p>
              </div>
            )}
          </div>
        </div>

      {/* Product Selection */}
      {!isLoading && (
        <div className="space-y-4">
          <select
            value={selectedProductId}
            onChange={(e) => {
              const product = allProducts.find(p => p._id === e.target.value);
              setSelectedProductId(e.target.value);
              setSelectedSubProducts(product?.subProducts.map(sp => sp.name) || []);
            }}
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent"
          >
            <option value="">Select Product</option>
            {allProducts.map(product => (
              <option
                key={product._id}
                value={product._id}
                disabled={clientProducts.some(p => 
                  typeof p.product === 'object' 
                    ? p.product._id === product._id 
                    : p.product === product._id
                )}
              >
                {product.name}
              </option>
            ))}
          </select>

          {selectedProductId && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {allProducts.find(p => p._id === selectedProductId)?.subProducts.map((sub, index) => (
                  <label key={index} className="flex items-center gap-2 p-2 border rounded">
                    <input
                      type="checkbox"
                      checked={selectedSubProducts.includes(sub.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSubProducts([...selectedSubProducts, sub.name]);
                        } else {
                          setSelectedSubProducts(selectedSubProducts.filter(n => n !== sub.name));
                        }
                      }}
                    />
                    <span>{sub.name}</span>
                  </label>
                ))}
              </div>
              <button
                onClick={handleAddProduct}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              >
                Add Product
              </button>
            </div>
          )}
        </div>
      )}

      {/* Associated Products List */}
      <div className="mt-6 space-y-4">
        {clientProducts.map((cp, index) => {
          const product = typeof cp.product === 'object' ? cp.product : allProducts.find(p => p._id === cp.product);
          
          return (
            <div key={index} className="p-4 border rounded relative">
              <button
                onClick={() => handleRemoveProduct(
                  typeof cp.product === 'object' ? cp.product._id : cp.product
                )}
                className="absolute top-2 right-2 text-red-500"
              >
                <TrashIcon className="w-5 h-5" />
              </button>

              {product ? (
                <>
                  <h4 className="font-semibold">{product.name}</h4>
                  {cp.subProducts.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Selected Subproducts:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {cp.subProducts.map((sub, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 rounded"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <span>Loading product...</span>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}