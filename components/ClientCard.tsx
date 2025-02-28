'use client';
import { ProductDocument } from '@/lib/models/Product';
import { motion } from 'framer-motion';

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
          <h3 className="text-lg font-semibold text-[#0b0b0b] dark:text-[#f9f9f4]">
            {product.name}
          </h3>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="text-[#0b0b0b] dark:text-[#ccbeac] hover:text-[#ccbeac] dark:hover:text-[#f9f9f4] transition-colors"
          >
            Modifier
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    </motion.div>
  );
}