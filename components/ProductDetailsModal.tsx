// components/ProductDetailsModal.tsx
'use client';
import { motion } from 'framer-motion';

export default function ProductDetailsModal({ product, onClose }: {
  product: any;
  onClose: () => void;
}) {
  return (
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
        className="bg-[#f9f9f4] rounded-xl w-full max-w-2xl p-8"
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-[#0b0b0b]">{product.name}</h2>
          <button onClick={onClose} className="text-[#0b0b0b] hover:text-[#ccbeac]">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <h3 className="font-semibold text-[#0b0b0b]/80">Fabricant</h3>
            <p className="text-[#0b0b0b]">{product.fabricant}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-[#0b0b0b]/80">Modèle</h3>
            <p className="text-[#0b0b0b]">{product.modele}</p>
          </div>
        </div>

        <div className="border-t border-[#ccbeac]/30 pt-6">
          <h3 className="text-xl font-semibold text-[#0b0b0b] mb-4">Sous-produits</h3>
          <div className="space-y-3">
            {product.subProducts.map((sub: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-[#ffffff] rounded-lg shadow-sm border border-[#ccbeac]/20"
              >
                <h4 className="font-medium text-[#0b0b0b]">{sub.name}</h4>
                <p className="text-sm text-[#0b0b0b]/70 mt-1">{sub.specifications}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}