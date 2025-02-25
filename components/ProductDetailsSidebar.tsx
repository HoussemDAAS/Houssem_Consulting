// ProductDetailsSidebar.tsx
'use client';
import { ProductDocument } from "@/lib/models/Product";
import { motion } from "framer-motion";
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ProductDetailsSidebar({ product, onClose }: {
  product: ProductDocument;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 left-auto w-full max-w-md bg-[#f9f9f4] dark:bg-[#0b0b0b] shadow-xl p-6 z-50 h-full border-l border-[#ccbeac]"
      >
      <div className="flex justify-between items-center pb-6 border-b border-[#ccbeac]">
        <h2 className="text-2xl font-bold text-[#0b0b0b] dark:text-[#f9f9f4]">{product.name}</h2>
        <button 
          onClick={onClose}
          className="text-[#0b0b0b] dark:text-[#ccbeac] hover:opacity-75 transition-opacity"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="pt-6 space-y-8 overflow-y-auto h-[calc(100vh-160px)]">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-[#ccbeac] uppercase tracking-wider">Détails Techniques</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(product).filter(([key]) => 
              !['_id', 'subProducts', 'autreInformation'].includes(key)
            ).map(([key, value]) => (
              value && (
                <div key={key} className="space-y-1">
                  <p className="text-sm text-[#0b0b0b] dark:text-[#ccbeac]/80 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="font-medium text-[#0b0b0b] dark:text-[#f9f9f4]">
                    {value}
                  </p>
                </div>
              )
            ))}
          </div>
        </div>

        {product.autreInformation && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#ccbeac] uppercase tracking-wider">Autre Information</h3>
            <p className="text-[#0b0b0b] dark:text-[#f9f9f4] leading-relaxed">
              {product.autreInformation}
            </p>
          </div>
        )}

        {product.subProducts?.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#ccbeac] uppercase tracking-wider">Produits</h3>
            <div className="space-y-3">
              {product.subProducts.map((sub, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg bg-white dark:bg-[#0b0b0b] border border-[#ccbeac]"
                >
                  <h4 className="font-medium text-[#0b0b0b] dark:text-[#f9f9f4] mb-2">{sub.name}</h4>
                  {sub.specifications && (
                    <p className="text-sm text-[#0b0b0b]/80 dark:text-[#ccbeac]">
                      {sub.specifications}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}