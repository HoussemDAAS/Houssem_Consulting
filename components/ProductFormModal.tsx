// components/ProductFormModal.tsx
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: any) => void;
}

export default function ProductFormModal({ isOpen, onClose, onSave }: ProductFormModalProps) {
  const { register, handleSubmit, reset } = useForm();
  const [subProducts, setSubProducts] = useState<Array<{ name: string; specifications: string }>>([]);

  const onSubmit = (data: any) => {
    onSave({
      ...data,
      subProducts: subProducts.filter(sp => sp.name && sp.specifications)
    });
    reset();
    setSubProducts([]);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      className="fixed inset-0 bg-[#0b0b0b]/80 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-[#f9f9f4] rounded-xl w-full max-w-2xl p-8 shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-[#0b0b0b] mb-6">Nouvelle Catégorie</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-[#0b0b0b]/80">Fabricant</label>
              <input
                {...register('fabricant', { required: true })}
                className="w-full p-3 border-2 border-[#ccbeac] rounded-lg bg-transparent"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-[#0b0b0b]/80">Modèle</label>
              <input
                {...register('modele', { required: true })}
                className="w-full p-3 border-2 border-[#ccbeac] rounded-lg bg-transparent"
              />
            </div>
          </div>

          <div className="border-t border-[#ccbeac]/30 pt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-[#0b0b0b]">Sous-produits</h3>
              <button
                type="button"
                onClick={() => setSubProducts([...subProducts, { name: '', specifications: '' }])}
                className="flex items-center gap-2 text-[#0b0b0b] hover:text-[#ccbeac]"
              >
                <PlusIcon />
                Ajouter
              </button>
            </div>

            <div className="space-y-4">
              {subProducts.map((sub, index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <input
                    value={sub.name}
                    onChange={(e) => {
                      const newSubs = [...subProducts];
                      newSubs[index].name = e.target.value;
                      setSubProducts(newSubs);
                    }}
                    placeholder="Nom"
                    className="p-2 border border-[#ccbeac] rounded"
                  />
                  <input
                    value={sub.specifications}
                    onChange={(e) => {
                      const newSubs = [...subProducts];
                      newSubs[index].specifications = e.target.value;
                      setSubProducts(newSubs);
                    }}
                    placeholder="Spécifications"
                    className="p-2 border border-[#ccbeac] rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-[#0b0b0b] hover:bg-[#ccbeac]/20 rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#ccbeac] text-[#0b0b0b] rounded-lg hover:bg-[#ccbeac]/90 font-semibold"
            >
              Créer Catégorie
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="#0b0b0b">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
    </svg>
  );
}