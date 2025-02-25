/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProductDocument } from '@/lib/models/Product';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

interface ProductFormProps {
  product?: ProductDocument;
  onClose: () => void;
  onSuccess: () => void;
}

interface SubProduct {
  name: string;
  specifications: string;
}

export default function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const { user } = useAuth();
  const { register, handleSubmit, setValue } = useForm();
  const [subProducts, setSubProducts] = useState<SubProduct[]>([]);

  useEffect(() => {
    if (product) {
      Object.entries(product).forEach(([key, value]) => {
        setValue(key, value);
      });
      setSubProducts(product.subProducts);
    }
  }, [product, setValue]);

  const onSubmit = async (data: any) => {
    if (!user) return;
    
    try {
      const payload = {
        ...data,
        subProducts,
        annee: Number(data.annee)
      };

      const url = product ? `/api/products/${product._id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Operation failed');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
 className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"

    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
         className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <h2 className="text-2xl font-bold mb-6">
          {product ? 'Edit Product' : 'New Product'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium">Fabricant</label>
              <input
                {...register('fabricant', { required: true })}
                className="w-full p-3 border rounded-lg dark:bg-gray-700"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium">Modèle</label>
              <input
                {...register('modele', { required: true })}
                className="w-full p-3 border rounded-lg dark:bg-gray-700"
              />
            </div>

            {/* Add other fields similarly */}
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Sous-produits</h3>
              <button
                type="button"
                onClick={() => setSubProducts([...subProducts, { name: '', specifications: '' }])}
                className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
              >
                <PlusIcon /> Ajouter
              </button>
            </div>

            {subProducts.map((sub, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                <input
                  value={sub.name}
                  onChange={(e) => {
                    const newSubs = [...subProducts];
                    newSubs[index].name = e.target.value;
                    setSubProducts(newSubs);
                  }}
                  className="p-2 border rounded dark:bg-gray-700"
                  placeholder="Nom"
                />
                <input
                  value={sub.specifications}
                  onChange={(e) => {
                    const newSubs = [...subProducts];
                    newSubs[index].specifications = e.target.value;
                    setSubProducts(newSubs);
                  }}
                  className="p-2 border rounded dark:bg-gray-700"
                  placeholder="Spécifications"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {product ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}