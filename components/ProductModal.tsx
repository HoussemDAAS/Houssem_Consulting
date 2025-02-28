'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { ProductDocument } from '@/lib/models/Product';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductDocument | null;
  refreshProducts: () => void;
}

export default function ProductModal({ 
  isOpen, 
  onClose, 
  product, 
  refreshProducts 
}: ProductModalProps) {
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm<{ name: string }>();

  useEffect(() => {
    reset({ name: product?.name || '' });
  }, [product, reset]);

  const onSubmit = async (data: { name: string }) => {
    try {
      const payload = { name: data.name.trim() };
      const method = product ? 'PUT' : 'POST';
      const url = product ? `/api/products/${product._id}` : '/api/products';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Operation échouée');
      }

      refreshProducts();
      onClose();
    } catch (error) {
      console.error('Erreur de soumission:', error);
      alert(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#0b0b0b] rounded-xl w-full max-w-md overflow-y-auto border border-[#ccbeac]"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[#ccbeac]">
                <h2 className="text-xl font-bold text-[#0b0b0b] dark:text-[#f9f9f4]">
                  {product ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[#0b0b0b] dark:text-[#ccbeac] hover:opacity-75 transition-opacity"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-[#0b0b0b] dark:text-[#ccbeac]">
                  Nom de la Catégorie
                </label>
                <input
                  {...register('name', { 
                    required: 'Le nom est obligatoire',
                    maxLength: {
                      value: 40,
                      message: 'Maximum 40 caractères'
                    }
                  })}
                  className={`w-full p-3 rounded-lg bg-white dark:bg-[#0b0b0b] border ${
                    errors.name ? 'border-red-500' : 'border-[#ccbeac]'
                  } focus:ring-2 focus:ring-[#ccbeac]`}
                  placeholder="Ex: Thermomètres médicaux"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-[#ccbeac]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-[#0b0b0b] dark:text-[#ccbeac] hover:bg-[#ccbeac]/10 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ccbeac] text-[#0b0b0b] rounded-lg hover:bg-[#ccbeac]/90 transition-colors font-medium"
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