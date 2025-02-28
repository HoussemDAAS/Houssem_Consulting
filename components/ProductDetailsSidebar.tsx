'use client';
import { ProductDocument } from "@/lib/models/Product";
import { motion } from "framer-motion";
import { XMarkIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';


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
        <h2 className="text-2xl font-bold text-[#0b0b0b] dark:text-[#f9f9f4]">
          {product.name}
        </h2>
        <button 
          onClick={onClose}
          className="text-[#0b0b0b] dark:text-[#ccbeac] hover:opacity-75 transition-opacity"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="pt-6 space-y-8 overflow-y-auto h-[calc(100vh-160px)]">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-[#ccbeac] uppercase tracking-wider">
            Informations de la catégorie
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-[#0b0b0b] dark:text-[#ccbeac]/80">
                Date de création
              </p>
              <p className="font-medium text-[#0b0b0b] dark:text-[#f9f9f4]">
                {format(new Date(product.createdAt), 'dd MMMM yyyy')}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-[#0b0b0b] dark:text-[#ccbeac]/80">
                Identifiant unique
              </p>
              <p className="font-medium text-[#0b0b0b] dark:text-[#f9f9f4] break-all">
                {product._id}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-[#ccbeac] uppercase tracking-wider">
            Statistiques
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#ccbeac]/10 border border-[#ccbeac]/20">
              <p className="text-sm text-[#ccbeac]">Clients associés</p>
              <p className="text-2xl font-bold text-[#0b0b0b] dark:text-[#f9f9f4]">
                {/* Add real client count data here */}
                0
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[#ccbeac]/10 border border-[#ccbeac]/20">
              <p className="text-sm text-[#ccbeac]">Appareils enregistrés</p>
              <p className="text-2xl font-bold text-[#0b0b0b] dark:text-[#f9f9f4]">
                {/* Add real devices count data here */}
                0
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}