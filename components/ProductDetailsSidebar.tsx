'use client';
import { ProductDocument } from "@/lib/models/Product";
import { motion } from "framer-motion";
import { XMarkIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export default function ProductDetailsSidebar({ product, onClose }: {
  product: ProductDocument;
  onClose: () => void;
}) {
  const [clientCount, setClientCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchClientCount = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/products/${product._id}/clients`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (isMounted) setClientCount(data.count || 0);
      } catch (err) {
        console.error('Failed to fetch client count', err);
        if (isMounted) setClientCount(0);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (product?._id) {
      fetchClientCount();
    }

    return () => { isMounted = false; };
  }, [product?._id]);

  return (
    <motion.div
      key={product._id} // Force re-render on product change
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 left-auto w-full max-w-md bg-[#f9f9f4] dark:bg-[#0b0b0b] shadow-xl p-6 z-50 h-full border-l border-[#ccbeac]"
    >
      <div className="flex justify-between items-center pb-6 border-b border-[#ccbeac]">
        <h2 className="text-2xl font-bold text-[#0b0b0b] dark:text-[#f9f9f4] truncate">
          {product.name}
        </h2>
        <button 
          onClick={onClose}
          className="text-[#0b0b0b] dark:text-[#ccbeac] hover:opacity-75 transition-opacity flex-shrink-0"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="pt-6 space-y-8 overflow-y-auto h-[calc(100vh-160px)]">
        {/* Image Display with error handling */}
        {product.image && (
          <div className="w-full aspect-video rounded-lg overflow-hidden border border-[#ccbeac]/20 bg-gray-100 dark:bg-gray-800">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-[#ccbeac] uppercase tracking-wider">
            Informations de la catégorie
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-[#0b0b0b] dark:text-[#ccbeac]/80">
                Date de création
              </p>
              <p className="font-medium text-[#0b0b0b] dark:text-[#f9f9f4]">
                {format(new Date(product.createdAt), 'dd MMMM yyyy')}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-[#ccbeac] uppercase tracking-wider">
            Statistiques
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 rounded-lg bg-[#ccbeac]/10 border border-[#ccbeac]/20">
              <p className="text-sm text-[#ccbeac]">Clients associés</p>
              {isLoading ? (
                <div className="animate-pulse h-8 w-1/2 bg-[#ccbeac]/20 rounded mt-2" />
              ) : (
                <p className="text-2xl font-bold text-[#0b0b0b] dark:text-[#f9f9f4]">
                  {clientCount}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}