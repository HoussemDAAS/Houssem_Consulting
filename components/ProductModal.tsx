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
          className="fixed inset-0 bg-[#0b0b0b]/80 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#f9f9f4] dark:bg-[#0b0b0b] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#ccbeac]"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
              <div className="flex justify-between items-center border-b border-[#ccbeac] pb-4">
                <h2 className="text-2xl font-bold text-[#0b0b0b] dark:text-[#f9f9f4]">
                  {product ? 'Edit Product' : 'New Product'}
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
                    Product Name *
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
                    Year
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
                  Additional Information
                </label>
                <textarea
                  {...register('autreInformation')}
                  className="w-full p-3 rounded-lg bg-white dark:bg-[#0b0b0b] border border-[#ccbeac] focus:ring-2 focus:ring-[#ccbeac] h-32"
                />
              </div>

              <div className="border-t border-[#ccbeac] pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-[#0b0b0b] dark:text-[#ccbeac]">
                    Subproducts
                  </h3>
                  <button
                    type="button"
                    onClick={addSubProduct}
                    className="flex items-center gap-2 text-[#0b0b0b] dark:text-[#ccbeac] hover:opacity-75 transition-opacity"
                  >
                    <PlusCircleIcon className="h-5 w-5" />
                    Add Subproduct
                  </button>
                </div>

                <div className="space-y-4">
                  {subProducts.map((sub, index) => (
                    <div key={index} className="flex gap-4 items-start group">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <input
                          value={sub.name}
                          onChange={(e) => updateSubProduct(index, 'name', e.target.value)}
                          placeholder="Name"
                          className="p-3 rounded-lg bg-white dark:bg-[#0b0b0b] border border-[#ccbeac]"
                        />
                        <input
                          value={sub.specifications}
                          onChange={(e) => updateSubProduct(index, 'specifications', e.target.value)}
                          placeholder="Specifications"
                          className="p-3 rounded-lg bg-white dark:bg-[#0b0b0b] border border-[#ccbeac]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSubProduct(index)}
                        className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#ccbeac] text-[#0b0b0b] rounded-lg hover:bg-[#ccbeac]/90 transition-colors font-medium"
                >
                  {product ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}