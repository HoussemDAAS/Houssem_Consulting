// components/ClientForm.tsx
'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';

export default function ClientForm({ isOpen, onClose, client, products, refreshClients }) {
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const [selectedProducts, setSelectedProducts] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (client) {
      reset(client);
      const initialProducts = client.products?.reduce((acc, curr) => {
        acc[curr.product] = curr.subProducts;
        return acc;
      }, {});
      setSelectedProducts(initialProducts || {});
    } else {
      reset({ status: 'active' });
      setSelectedProducts({});
    }
  }, [client, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        products: Object.entries(selectedProducts)
          .filter(([_, subs]) => subs.length > 0)
          .map(([productId, subProducts]) => ({
            product: productId,
            subProducts
          }))
      };

      const method = client ? 'PUT' : 'POST';
      const url = client ? `/api/clients/${client._id}` : '/api/clients';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Operation failed');
      }

      refreshClients();
      onClose();
    } catch (err) {
      setError(err.message);
      console.error('Submission error:', err);
    }
  };

  const toggleProduct = (productId) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: prev[productId] ? null : []
    }));
  };

  const toggleSubProduct = (productId, subName) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: prev[productId]?.includes(subName)
        ? prev[productId].filter(name => name !== subName)
        : [...(prev[productId] || []), subName]
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 full-viewport-overlay"

          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto"         >
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {client ? 'Modifier Client' : 'Nouveau Client'}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {error && <div className="text-red-500 p-2 rounded bg-red-100">{error}</div>}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label>Nom *</label>
                  <input
                    {...register('name', { required: true })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label>Email *</label>
                  <input
                    type="email"
                    {...register('email', { required: true })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label>Téléphone</label>
                  <input
                    {...register('phone')}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label>Address</label>
                  <input
                    {...register('address')}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-4">Produits associés</h3>
                <div className="space-y-4">
                  {products.map(product => (
                    <div key={product._id} className="border p-4 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={!!selectedProducts[product._id]}
                          onChange={() => toggleProduct(product._id)}
                        />
                        <span>{product.name}</span>
                      </div>
                      
                      {selectedProducts[product._id] && (
                        <div className="ml-4 space-y-2">
                          {product.subProducts.map((sub, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedProducts[product._id].includes(sub.name)}
                                onChange={() => toggleSubProduct(product._id, sub.name)}
                              />
                              <span>{sub.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primaryColor text-white rounded hover:bg-secondaryColor"
                >
                  {client ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}