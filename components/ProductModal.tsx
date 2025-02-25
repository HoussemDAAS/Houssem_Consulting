/* eslint-disable @typescript-eslint/no-explicit-any */
// ProductModal.tsx
'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { ProductDocument } from '@/lib/models/Product';
import { XMarkIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductDocument | null;
  refreshProducts: () => void;
}

export default function ProductModal({ isOpen, onClose, product, refreshProducts }: ProductModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [subProducts, setSubProducts] = useState<Array<{ name: string; specifications: string }>>([]);

  useEffect(() => {
    if (product) {
      reset({ ...product, annee: product.annee?.toString() });
      setSubProducts(product.subProducts || []);
    } else {
      reset({
        name: '',
        fabricant: '',
        modele: '',
        reference: '',
        plageMesure: '',
        annee: new Date().getFullYear().toString(),
        versionLogiciel: '',
        autreInformation: ''
      });
      setSubProducts([]);
    }
  }, [product, reset]);

// Updated onSubmit function in ProductModal.tsx
// ProductModal.tsx - Update the onSubmit function
const onSubmit = async (data: any) => {
  try {
    if (!data.name.trim()) {
      throw new Error('Product name is required');
    }

    const payload = {
      name: data.name.trim(),
      fabricant: data.fabricant?.trim() || undefined,
      modele: data.modele?.trim() || undefined,
      reference: data.reference?.trim() || undefined,
      plageMesure: data.plageMesure?.trim() || undefined,
      versionLogiciel: data.versionLogiciel?.trim() || undefined,
      autreInformation: data.autreInformation?.trim() || undefined,
      subProducts: subProducts
        .filter(sp => sp.name.trim() !== '')
        .map(sp => ({
          name: sp.name.trim(),
          specifications: sp.specifications?.trim() || ''
        }))
    };

    if (data.annee) {
      payload.annee = parseInt(data.annee);
      if (isNaN(payload.annee)) {
        throw new Error('Year must be a valid number');
      }
    }

    const method = product ? 'PUT' : 'POST';
    const url = product ? `/api/products/${product._id}` : '/api/products';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Operation failed');
    }
    
    refreshProducts();
    onClose();
  } catch (error) {
    console.error('Submission error:', error);
    alert(error instanceof Error ? error.message : 'An error occurred');
  }
};

  const addSubProduct = () => {
    setSubProducts([...subProducts, { name: '', specifications: '' }]);
  };

  const removeSubProduct = (index: number) => {
    const updated = subProducts.filter((_, i) => i !== index);
    setSubProducts(updated);
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
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 full-viewport-overlay"         onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto"          >
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
              <div className="flex justify-between items-center border-b border-[#ccbeac] pb-4">
                <h2 className="text-2xl font-bold text-[#0b0b0b] dark:text-[#f9f9f4]">
                  {product ? 'Modifier la Categorie' : 'Ajouter une Categorie'}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[#0b0b0b] dark:text-[#ccbeac] hover:opacity-75 transition-opacity"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-[#0b0b0b] dark:text-[#ccbeac]">
                   Nom du categorie
                  </label>
                  <input
                    {...register('name', { required: true })}
                    className="w-full p-3 rounded-lg bg-white dark:bg-[#0b0b0b] border border-[#ccbeac] focus:ring-2 focus:ring-[#ccbeac]"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">Product name is required</p>
                  )}
                </div>

                {['fabricant', 'modele', 'reference', 'plageMesure', 'versionLogiciel'].map((field) => (
                  <div key={field} className="space-y-4">
                    <label className="block text-sm font-medium text-[#0b0b0b] dark:text-[#ccbeac] capitalize">
                      {field.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                      {...register(field)}
                      className="w-full p-3 rounded-lg bg-white dark:bg-[#0b0b0b] border border-[#ccbeac] focus:ring-2 focus:ring-[#ccbeac]"
                    />
                  </div>
                ))}

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-[#0b0b0b] dark:text-[#ccbeac]">
                   Année
                  </label>
                  <input
                    type="number"
                    {...register('annee')}
                    className="w-full p-3 rounded-lg bg-white dark:bg-[#0b0b0b] border border-[#ccbeac] focus:ring-2 focus:ring-[#ccbeac]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-[#0b0b0b] dark:text-[#ccbeac]">
                  Autre Information
                </label>
                <textarea
                  {...register('autreInformation')}
                  className="w-full p-3 rounded-lg bg-white dark:bg-[#0b0b0b] border border-[#ccbeac] focus:ring-2 focus:ring-[#ccbeac] h-32"
                />
              </div>

              <div className="border-t border-[#ccbeac] pt-6">
  <div className="flex justify-between items-center mb-6">
    <div className="flex items-center gap-2">
      <svg 
        className="w-6 h-6 text-[#0b0b0b] dark:text-[#ccbeac]" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <h3 className="text-xl font-semibold text-[#0b0b0b] dark:text-[#ccbeac]">
     Produits
      </h3>
    </div>
    <button
      type="button"
      onClick={addSubProduct}
      className="px-4 py-2 bg-[#ccbeac] text-[#0b0b0b] hover:bg-[#ccbeac]/90 rounded-lg flex items-center gap-2 transition-colors"
    >
      <PlusCircleIcon className="h-5 w-5" />
      <span>Ajout de produit</span>
    </button>
  </div>

  <div className="space-y-4">
    {subProducts.map((sub, index) => (
      <div 
        key={index} 
        className="group relative p-4 rounded-lg border-2 border-dashed border-[#ccbeac]/50 hover:border-solid hover:border-[#ccbeac] transition-all"
      >
        <div className="flex gap-4 items-start">
          <div className="flex-1 grid grid-cols-2 gap-4">
            <input
              value={sub.name}
              onChange={(e) => updateSubProduct(index, 'name', e.target.value)}
              placeholder="Subproduct name"
              className="p-3 rounded-lg bg-white dark:bg-[#0b0b0b] border border-[#ccbeac] focus:ring-2 focus:ring-[#ccbeac]"
            />
            <input
              value={sub.specifications}
              onChange={(e) => updateSubProduct(index, 'specifications', e.target.value)}
              placeholder="Technical specifications"
              className="p-3 rounded-lg bg-white dark:bg-[#0b0b0b] border border-[#ccbeac] focus:ring-2 focus:ring-[#ccbeac]"
            />
          </div>
          <button
            type="button"
            onClick={() => removeSubProduct(index)}
            className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:text-red-600 absolute -top-3 -right-3 bg-white dark:bg-[#0b0b0b] rounded-full shadow-lg"
          >
            <TrashIcon className="h-6 w-6" />
          </button>
        </div>
        {subProducts.length > 1 && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-[#0b0b0b] px-2">
         Produit #{index + 1}
          </div>
        )}
      </div>
    ))}
  </div>
</div>

              <div className="border-t border-[#ccbeac] pt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-[#0b0b0b] dark:text-[#ccbeac] hover:bg-[#ccbeac]/10 rounded-lg transition-colors"
                >
                  Annulé
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#ccbeac] text-[#0b0b0b] rounded-lg hover:bg-[#ccbeac]/90 transition-colors font-medium"
                >
                  {product ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
