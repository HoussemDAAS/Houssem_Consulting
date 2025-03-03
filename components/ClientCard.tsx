/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { ClientDocument } from '@/lib/models/Client';
import { RegionDocument } from '@/lib/models/Region';
import { ProductDocument } from '@/lib/models/Product';
import { motion } from 'framer-motion';
import { CubeIcon, DocumentTextIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline';
import { InfoIcon } from 'lucide-react';

interface ClientCardProps {
  client: ClientDocument;
  region?: RegionDocument;
  products: ProductDocument[];
  onClick: () => void;
}

export default function ClientCard({ client, region, products, onClick }: ClientCardProps) {
  // Group products by ID with count and models
  const productDetails = client.products.reduce((acc, p) => {
    const productId = typeof p.product === 'string' ? p.product : p.product._id.toString();
    const product = products.find(prod => prod._id.toString() === productId);
    const productName = product?.name || 'Unknown Product';
    
    if (!acc[productId]) {
      acc[productId] = {
        name: productName,
        count: 0,
        models: new Set<string>(),
        instances: []
      };
    }
    
    acc[productId].count++;
    if (p.modele) acc[productId].models.add(p.modele);
    acc[productId].instances.push(p);
    
    return acc;
  }, {} as Record<string, { name: string; count: number; models: Set<string>; instances: any[] }>);

  // Prepare displayed products
  const productEntries = Object.values(productDetails);
  const showMore = productEntries.length > 4;
  const displayedProducts = showMore ? productEntries.slice(0, 3) : productEntries;
  const moreCount = productEntries.length - 3;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-[#1a1a1a] rounded-xl p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer border border-[#e0e0e0] dark:border-[#333333]"
      onClick={onClick}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 text-[#0b0b0b] dark:text-[#f9f9f4]">
            {client.name}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-[#0b0b0b]/80 dark:text-[#ccbeac] mb-4">
            <InfoIcon className="h-4 w-4" />
            {region?.name} ({region?.code})
          </div>

        
        </div>
      </div>
      <div className="mt-4 border-t border-[#eeeeee] dark:border-[#333333] pt-4">
        <div className="flex items-center gap-2 mb-3">
          <CubeIcon className="h-5 w-5 text-[#ccbeac]" />
          <span className="text-sm font-medium text-[#2d2d2d] dark:text-[#cccccc]">
            Product Details ({client.products.length})
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {client.products.length > 0 ? (
            Object.values(productDetails).map((product, index) => (
              <div 
                key={index}
                className="flex flex-col gap-2 bg-[#f5f5f5] dark:bg-[#252525] px-3 py-2 rounded-lg w-full"
              >
                <div className="flex items-center gap-2">
                  <PuzzlePieceIcon className="h-4 w-4 text-[#ccbeac]" />
                  <span className="text-sm font-medium text-[#2d2d2d] dark:text-[#cccccc]">
                    {product.name} {product.count > 1 && `(${product.count})`}
                  </span>
                </div>
                {product.models.size > 0 && (
                  <div className="flex flex-wrap gap-2 ml-6">
                    {Array.from(product.models).map((model, modelIndex) => (
                      <span
                        key={modelIndex}
                        className="text-xs text-[#666666] dark:text-[#888888] bg-[#ffffff] dark:bg-[#1a1a1a] px-2 py-1 rounded"
                      >
                        {model}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2 text-[#666666] dark:text-[#888888]">
              <DocumentTextIcon className="h-4 w-4" />
              <span className="text-sm">No products installed</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}