// components/ProductCard.tsx
'use client';
import { ProductDocument } from '@/lib/models/Product';
import { motion } from 'framer-motion';
import { Image, Edit3, Trash2 } from 'lucide-react';

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
      className="group bg-[#f9f9f4] dark:bg-[#0b0b0b] rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden border border-[#ccbeac]/30"
    >
      <div className="relative aspect-square bg-white/90">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-3"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#ccbeac]/50">
            <Image className="w-8 h-8" />
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-medium text-[#0b0b0b] dark:text-[#f9f9f4] truncate">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-1 text-[#0b0b0b] dark:text-[#ccbeac] hover:text-[#ccbeac] dark:hover:text-[#f9f9f4]"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-1 text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}