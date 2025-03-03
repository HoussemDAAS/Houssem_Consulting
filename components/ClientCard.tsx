  /* eslint-disable @typescript-eslint/no-explicit-any */
  'use client';
  import { ClientDocument } from '@/lib/models/Client';
  import { RegionDocument } from '@/lib/models/Region';
  import { motion } from 'framer-motion';
  import { CubeIcon, DocumentTextIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline';
  import { InfoIcon } from 'lucide-react';

  interface ClientCardProps {
    client: ClientDocument;
    region?: RegionDocument;
    onClick: () => void;
  }

  export default function ClientCard({ client, region, onClick }: ClientCardProps) {
    const productCounts = client.products.reduce((acc, product) => {
      const productId = product.product.toString();
      acc[productId] = (acc[productId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
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

            <div className="flex flex-wrap gap-2">
              {Object.entries(productCounts).map(([productId, count]) => (
                <span 
                  key={productId}
                  className="px-3 py-1 bg-[#ccbeac]/20 text-[#0b0b0b] dark:text-[#f9f9f4] rounded-full text-sm"
                >
                  {productId.slice(-4)} {count > 1 && `${count}`}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 border-t border-[#eeeeee] dark:border-[#333333] pt-4">
          <div className="flex items-center gap-2 mb-3">
            <CubeIcon className="h-5 w-5 text-[#ccbeac]" />
            <span className="text-sm font-medium text-[#2d2d2d] dark:text-[#cccccc]">
              Produits associés ({client.products.length})
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {client.products.length > 0 ? (
              client.products.map((p, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 bg-[#f5f5f5] dark:bg-[#252525] px-3 py-2 rounded-lg"
                >
                  <PuzzlePieceIcon className="h-4 w-4 text-[#ccbeac]" />
                  <span className="text-sm text-[#2d2d2d] dark:text-[#cccccc]">
                    {(p.product as any)?.name || 'Unknown Product'}
                  </span>
                  {p.modele && (
                    <span className="text-xs text-[#666666] dark:text-[#888888] ml-2">
                      ({p.modele})
                    </span>
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