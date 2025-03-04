'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Package, Pencil, Trash } from 'lucide-react';
import { ClientDocument } from '@/lib/models/Client';
import { ProductDocument } from '@/lib/models/Product';
import { RegionDocument } from '@/lib/models/Region';

interface ClientAccordionProps {
  client: ClientDocument;
  products: ProductDocument[];
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ClientAccordion = ({ client, products, isOpen, onToggle, onEdit, onDelete }: ClientAccordionProps) => {
  return (
    <div className="border-b border-[#ccbeac]/30">
      <div className="flex items-center p-4 hover:bg-[#f5f5f5] dark:hover:bg-[#2d2d2d]">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-8 h-8 mr-2"
        >
          <ChevronRight className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        </button>

        <div className="flex-1 flex items-center gap-4">
          <button
            onClick={onEdit}
            className="text-left flex-1 flex items-center gap-4 group"
          >
            <h3 className="text-xl font-semibold text-[#0b0b0b] dark:text-[#f9f9f4]">
              {client.name}
            </h3>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-[#ccbeac]" />
              <span className="text-sm text-[#666] dark:text-[#999]">
                ({client.products.length} products)
              </span>
            </div>
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-2 hover:bg-[#ccbeac]/20 rounded-full"
            >
              <Pencil className="h-5 w-5 text-[#ccbeac]" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Are you sure you want to delete this client?')) {
                  onDelete();
                }
              }}
              className="p-2 hover:bg-red-100/50 rounded-full transition-colors"
            >
              <Trash className="h-5 w-5 text-red-500" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 ml-10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#ccbeac]/30">
                    <th className="text-left py-2"></th>
                    <th className="text-left py-2 text-secondaryColor">Modèle</th>
                    <th className="text-left py-2 text-secondaryColor">Fabriquant</th>
                    <th className="text-left py-2 text-secondaryColor">Référence</th>
                    <th className="text-left py-2 text-secondaryColor">Plage Mesure</th>
                    <th className="text-left py-2 text-secondaryColor">Année</th>
                    <th className="text-left py-2 text-secondaryColor">Logiciel</th>
                    <th className="text-left py-2 text-secondaryColor">Autre Information</th>

                  </tr>
                </thead>
                <tbody>
                  {client.products.map((p, index) => (
                    <tr key={index} className="border-b border-[#ccbeac]/10">
                      <td className="py-2 font-medium">
                        {p.product?.name || 'Product Not Found'}
                      </td>
                      <td className="py-2">{p.modele || '-'}</td>
                      <td>{p.fabriquant || '-'}</td>
                      <td className="py-2">{p.reference || '-'}</td>
                      <td className="py-2">{p.plageMesure || '-'}</td>
                      <td className="py-2">{p.annee || '-'}</td>
                      <td className="py-2">{p.versionLogiciel || '-'}</td>
                      <td>{p.autreInformation || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ClientRegionGroupProps {
  region: RegionDocument;
  clients: ClientDocument[];
  regions: RegionDocument[];
  products: ProductDocument[];
  onEditClient: (client: ClientDocument) => void;
  onDeleteClient: (clientId: string) => void;
}

export default function ClientRegionGroup({
  region,
  clients,
  regions,
  products,
  onEditClient,
  onDeleteClient
}: ClientRegionGroupProps) {
  const [expandedClient, setExpandedClient] = useState<string | null>(null);

  const handleToggle = (clientId: string) => {
    setExpandedClient(prev => prev === clientId ? null : clientId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-[#ccbeac]/30"
    >
      <div className="flex items-center justify-between p-4 border-b border-[#ccbeac]/30">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-[#0b0b0b] dark:text-[#f9f9f4]">
            {region.name}
          </h2>
          <span className="px-2 py-1 bg-[#ccbeac] text-[#0b0b0b] rounded text-sm">
            {region.code}
          </span>
        </div>
        <span className="text-sm text-[#666] dark:text-[#999]">
          {clients.length} client{clients.length !== 1 && 's'}
        </span>
      </div>

      {clients.length === 0 ? (
        <div className="p-6 text-center text-[#ccbeac]">
          <span className="text-lg mb-2">📭</span>
          <p className="font-medium">No clients in this region</p>
        </div>
      ) : (
        <div className="divide-y divide-[#ccbeac]/30">
          {clients.map(client => (
            <ClientAccordion
              key={client._id.toString()}
              client={client}
              products={products}
              isOpen={expandedClient === client._id.toString()}
              onToggle={() => handleToggle(client._id.toString())}
              onEdit={() => onEditClient(client)}
              onDelete={() => onDeleteClient(client._id.toString())}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}