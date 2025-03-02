'use client';
import { ClientDocument } from '@/lib/models/Client';
import { RegionDocument } from '@/lib/models/Region';
import { motion } from 'framer-motion';
import { CubeIcon, DocumentTextIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline';

interface ClientCardProps {
  client: ClientDocument;
  region?: RegionDocument;
  onClick: () => void;
}

export default function ClientCard({ client, region, onClick }: ClientCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-[#1a1a1a] rounded-xl p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer border border-[#e0e0e0] dark:border-[#333333]"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#2d2d2d] dark:text-[#f0f0f0] mb-1">
            {client.name}
          </h3>
          {region && (
            <span className="text-sm text-[#666666] dark:text-[#aaaaaa]">
              {region.name} Region
            </span>
          )}
        </div>
        {region && (
          <span className="text-xs font-medium text-[#ffffff] px-3 py-1 rounded-full bg-[#ccbeac] shadow-sm">
            {region.code}
          </span>
        )}
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