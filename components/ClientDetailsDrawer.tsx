// components/ClientDetailsDrawer.tsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { ClientDocument } from '@/lib/models/Client';
import { RegionDocument } from '@/lib/models/Region';
import { ProductDocument } from '@/lib/models/Product';
import { CubeIcon, CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface ClientDetailsDrawerProps {
  client: ClientDocument | null;
  regions: RegionDocument[];
  products: ProductDocument[];
  onClose: () => void;
  onEdit: () => void;
}

export default function ClientDetailsDrawer({
  client,
  regions,
  products,
  onClose,
  onEdit
}: ClientDetailsDrawerProps) {
  if (!client) return null;

  const clientRegion = regions.find(r => r._id.toString() === client.region.toString());

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white dark:bg-[#111111] shadow-xl p-8 z-50 border-l border-[#ccbeac] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#2d2d2d] dark:text-[#f0f0f0] mb-2">
              {client.name}
            </h2>
            {clientRegion && (
              <span className="text-sm text-[#666] dark:text-[#999] bg-[#f5f5f5] dark:bg-[#1a1a1a] px-3 py-1 rounded-full">
                {clientRegion.name} ({clientRegion.code})
              </span>
            )}
          </div>
          <div className="flex gap-4">
            <button
              onClick={onEdit}
              className="text-[#ccbeac] hover:text-[#2d2d2d] dark:hover:text-[#f0f0f0] flex items-center gap-2"
            >
              <PencilSquareIcon className="h-6 w-6" />
              <span className="hidden sm:inline">Modifier</span>
            </button>
            <button
              onClick={onClose}
              className="text-[#2d2d2d] dark:text-[#ccbeac] hover:opacity-75"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Produits Installés */}
          <div className="bg-[#f9f9f9] dark:bg-[#1a1a1a] p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <CubeIcon className="h-8 w-8 text-[#ccbeac]" />
              <h3 className="text-xl font-semibold text-[#2d2d2d] dark:text-[#f0f0f0]">
                Produits Installés ({client.products.length})
              </h3>
            </div>

            <div className="space-y-6">
              {client.products.map((product, index) => {
                const productId = typeof product.product === 'string' 
                  ? product.product 
                  : product.product?._id.toString();
                
                const productData = products.find(p => p._id.toString() === productId) 
                  || product.product;

                return (
                  <div key={index} className="group bg-white dark:bg-[#0b0b0b] p-5 rounded-lg border border-[#eee] dark:border-[#333] hover:border-[#ccbeac] transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#ccbeac] p-2 rounded-lg">
                          <DocumentTextIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-[#2d2d2d] dark:text-[#f0f0f0]">
                            {productData?.name || 'Produit Non Reconnu'}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-[#666] dark:text-[#999]">
                            <CalendarIcon className="h-4 w-4" />
                            <span>
                              Installé le {new Date(product.addedAt).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailItem label="Modèle" value={product.modele} />
                      <DetailItem label="Référence" value={product.reference} />
                      <DetailItem label="Plage de Mesure" value={product.plageMesure} />
                      <DetailItem label="Année" value={product.annee} />
                      <DetailItem label="Version Logicielle" value={product.versionLogiciel} />
                      <DetailItem label="Informations Additionnelles" value={product.autreInformation} />
                    </div>

                    {/* New details section */}
                    {product.details && product.details.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-[#eee] dark:border-[#333]">
                        <h5 className="text-sm font-semibold mb-3 text-[#2d2d2d] dark:text-[#f0f0f0]">
                          Détails Supplémentaires ({product.details.length})
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {product.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="bg-[#f5f5f5] dark:bg-[#1a1a1a] p-3 rounded-lg">
                              <DetailItem label={detail.name} value={detail.value} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

const DetailItem = ({ label, value }: { label: string; value?: string | number }) => (
  <div className="flex flex-col space-y-1">
    <span className="text-sm text-[#666] dark:text-[#999] font-medium">{label}</span>
    <span className="text-base text-[#2d2d2d] dark:text-[#f0f0f0] font-mono">
      {value || '-- Non spécifié --'}
    </span>
  </div>
);