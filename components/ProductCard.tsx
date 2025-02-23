// ProductCard.tsx
'use client';
import { ProductDocument } from '@/lib/models/Product';
import { motion } from 'framer-motion';
import { InfoIcon } from 'lucide-react';

export default function ProductCard({
  product,
  onEdit,
  onDelete,
  onClick,
}: {
  product: ProductDocument;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="bg-[#f9f9f4] dark:bg-[#0b0b0b] rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer p-6 border border-[#ccbeac]"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 text-[#0b0b0b] dark:text-[#f9f9f4]">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-[#0b0b0b]/80 dark:text-[#ccbeac] mb-4">
            <InfoIcon className="h-4 w-4" />
            {product.reference}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { label: 'Fabricant', value: product.fabricant },
              { label: 'Modèle', value: product.modele },
              { label: 'Plage', value: product.plageMesure },
              { label: 'Année', value: product.annee },
            ].map((item, index) => (
              item.value && (
                <div key={index} className="space-y-1">
                  <p className="text-xs text-[#ccbeac] dark:text-[#ccbeac]/80">{item.label}</p>
                  <p className="font-medium text-[#0b0b0b] dark:text-[#f9f9f4]">
                    {item.value}
                  </p>
                </div>
              )
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="text-[#0b0b0b] dark:text-[#ccbeac] hover:text-[#ccbeac] dark:hover:text-[#f9f9f4] transition-colors"
          >
            Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {product.subProducts?.length > 0 && (
        <div className="mt-6 pt-4 border-t border-[#ccbeac]/50">
          <h4 className="text-sm font-medium text-[#ccbeac] mb-3">Subproducts</h4>
          <div className="grid grid-cols-2 gap-2">
            {product.subProducts.map((sub, index) => (
              <div 
                key={index}
                className="p-2 rounded-lg bg-[#ccbeac]/10 border border-[#ccbeac]/20"
              >
                <p className="text-sm font-medium text-[#0b0b0b] dark:text-[#f9f9f4]">
                  {sub.name}
                </p>
                {sub.specifications && (
                  <p className="text-xs text-[#0b0b0b]/80 dark:text-[#ccbeac] truncate">
                    {sub.specifications}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}