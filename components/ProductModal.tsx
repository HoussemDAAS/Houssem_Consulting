/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { ProductDocument } from '@/lib/models/Product';


interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductDocument | null;
  refreshProducts: () => void;
}

export default function ProductModal({ isOpen, onClose, product, refreshProducts }: ProductModalProps) {
  const { register, handleSubmit, reset } = useForm();
  const [subProducts, setSubProducts] = useState<Array<{ name: string; specifications: string }>>([]);

  useEffect(() => {
    if (product) {
      reset(product);
      setSubProducts(product.subProducts);
    } else {
      reset({
        name: '',
        fabricant: '',
        modele: '',
        reference: '',
        plageMesure: '',
        annee: new Date().getFullYear(),
        versionLogiciel: '',
        autreInformation: ''
      });
      setSubProducts([]);
    }
  }, [product, reset]);

 // In your onSubmit function
// In ProductModal.tsx, update the onSubmit function:
const onSubmit = async (data: any) => {
  try {
    const method = product ? 'PUT' : 'POST';
    const url = product ? `/api/products/${product._id}` : '/api/products';

    const userToken = localStorage.getItem('userToken'); // or any other method to get the token
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}` 
      },
      body: JSON.stringify({
        ...data,
        subProducts,
        annee: data.annee ? Number(data.annee) : undefined
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Operation failed');
    }

    refreshProducts();
    onClose();
  } catch (error) {
    console.error('Error saving product:', error);
    if (error instanceof Error) {
      alert(error.message); // Show user-friendly error
    } else {
      alert('An unknown error occurred');
    }
  }
};

  const addSubProduct = () => {
    setSubProducts([...subProducts, { name: '', specifications: '' }]);
  };

  const updateSubProduct = (index: number, field: 'name' | 'specifications', value: string) => {
      const updated = [...subProducts];
      updated[index][field] = value;
      setSubProducts(updated);
    };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 h-screen"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {product ? 'Modifier Produit' : 'Nouveau Produit'}
                </h2>
                <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
  <label className="block text-sm font-medium">Product Name</label>
  <input
    {...register('name', { required: true })}
    className="w-full p-3 border rounded-lg dark:bg-gray-700"
  />
</div>
                <div>
                  <label>Fabricant</label>
                  <input
                    {...register('fabricant')}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label>Modèle</label>
                  <input
                    {...register('modele')}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label>Référence</label>
                  <input
                    {...register('reference')}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label>Plage de mesure</label>
                  <input
                    {...register('plageMesure')}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label>Année</label>
                  <input
                    type="number"
                    {...register('annee')}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label>Version Logiciel</label>
                  <input
                    {...register('versionLogiciel')}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label>Autres Informations</label>
                <textarea
                  {...register('autreInformation')}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Sous-produits</h3>
                  <button
                    type="button"
                    onClick={addSubProduct}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    + Ajouter Sous-produit
                  </button>
                </div>

                {subProducts.map((sub, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      value={sub.name}
                      onChange={(e) => updateSubProduct(index, 'name', e.target.value)}
                      placeholder="Nom"
                      className="p-2 border rounded"
                    />
                    <input
                      value={sub.specifications}
                      onChange={(e) => updateSubProduct(index, 'specifications', e.target.value)}
                      placeholder="Spécifications"
                      className="p-2 border rounded"
                    />
                  </div>
                ))}
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
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {product ? 'Sauvegarder' : 'Créer'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}