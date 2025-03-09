'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Package, Pencil, Trash } from 'lucide-react';
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
const statusColors = {
  'Agreed': 'bg-green-500',
  'In Progress': 'bg-orange-500',
  'Refused': 'bg-red-500',
  '': 'bg-gray-400',
};
const ClientAccordion = ({ client, products, isOpen, onToggle, onEdit, onDelete }: ClientAccordionProps) => {
  return (
    <div className="border-b border-[#ccbeac]/30">
     <div className="flex items-center p-3 md:p-4 hover:bg-[#f5f5f5] dark:hover:bg-[#2d2d2d]">
  <button
    onClick={onToggle}
    className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 mr-1 md:mr-2 flex-shrink-0"
  >
    <ChevronRight className={`h-4 w-4 md:h-5 md:w-5 ${isOpen ? 'rotate-90' : ''}`} />
  </button>

  <div className="flex items-center gap-2 md:gap-4 w-full min-w-0">
    <div className="flex-1 min-w-0">
      <button onClick={onEdit} className="text-left w-full truncate">
      <div className="flex items-center gap-2 flex-1">
      <motion.div
  initial={{ scale: 1 }}
  animate={{ scale: 1.1 }}
  transition={{
    repeat: Infinity,
    repeatType: "mirror",
    duration: 0.8,
    ease: "easeInOut"
  }}
  className={`w-3 h-3 rounded-full ${statusColors[client.status]}`}
/>
          <h3 className="font-semibold truncate">{client.name}</h3>
        </div>
      </button>
      <div className="flex items-center gap-1 mt-1 truncate">
        <Package className="h-3 w-3 md:h-4 md:w-4 text-[#ccbeac] flex-shrink-0" />
        <span className="text-xs md:text-sm text-[#666] dark:text-[#999] truncate">
          ({client.products.length} products)
        </span>
      </div>
    </div>
    
    <div className="flex items-center gap-1 md:gap-2 flex-shrink-0 ml-2">
      <button
        onClick={onEdit}
        className="p-1 md:p-2 hover:bg-[#ccbeac]/20 rounded-full"
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
        className="p-1 md:p-2 hover:bg-red-100/50 rounded-full transition-colors"
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
      <div className="px-2 md:px-4 pb-4 ml-6 md:ml-10">
        {/* Mobile View */}
        <div className="md:hidden space-y-2">
          {client.products.map((p, index) => (
            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-sm">
                  {p.product?.name || 'Product Not Found'}
                </span>
                <span className="text-xs text-gray-500">#{index + 1}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                  <span className="text-gray-500 dark:text-gray-400">Manufacturer:</span> {p.fabriquant || '-'}
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Model:</span> {p.modele || '-'}
                </div>
           
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Reference:</span> {p.reference || '-'}
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Range:</span> {p.plageMesure || '-'}
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Year:</span> {p.annee || '-'}
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Software:</span> {p.versionLogiciel || '-'}
                </div>
                {p.autreInformation && (
                  <div className="col-span-2">
                    <span className="text-gray-500 dark:text-gray-400">Notes:</span> {p.autreInformation}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
  
        <div className="hidden md:block overflow-x-auto">
  <table className="w-full text-sm min-w-[800px]">
    <thead>
      <tr className="border-b border-[#ccbeac]/30">
        <th className="text-left py-2 px-2 whitespace-nowrap">Product</th>
        <th className="text-left py-2 px-2 whitespace-nowrap">Manufacturer</th>
        <th className="text-left py-2 px-2 whitespace-nowrap">Model</th>
        <th className="text-left py-2 px-2 whitespace-nowrap">Reference</th>
        <th className="text-left py-2 px-2 whitespace-nowrap">Range</th>
        <th className="text-left py-2 px-2 whitespace-nowrap">Year</th>
        <th className="text-left py-2 px-2 whitespace-nowrap">Software</th>
        <th className="text-left py-2 px-2 whitespace-nowrap min-w-[200px]">Notes</th>
      </tr>
    </thead>
    <tbody>
      {client.products.map((p, index) => (
        <tr key={index} className="border-b border-[#ccbeac]/10 hover:bg-gray-50 dark:hover:bg-gray-800">
          <td className="py-2 px-2 font-medium whitespace-nowrap">
            {p.product?.name || 'Product Not Found'}
          </td>
          <td className="py-2 px-2 whitespace-nowrap">{p.fabriquant || '-'}</td>
          <td className="py-2 px-2 whitespace-nowrap">{p.modele || '-'}</td>
          <td className="py-2 px-2 whitespace-nowrap">{p.reference || '-'}</td>
          <td className="py-2 px-2 whitespace-nowrap">{p.plageMesure || '-'}</td>
          <td className="py-2 px-2 whitespace-nowrap">{p.annee || '-'}</td>
          <td className="py-2 px-2 whitespace-nowrap">{p.versionLogiciel || '-'}</td>
          <td className="py-2 px-2 max-w-[300px] overflow-hidden overflow-ellipsis">
            {p.autreInformation || '-'}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
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
  const [isRegionOpen, setIsRegionOpen] = useState(true); // Default open

  const handleToggle = (clientId: string) => {
    setExpandedClient(prev => prev === clientId ? null : clientId);
  };

  return (
    <motion.div
      className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-[#ccbeac]/30"
      initial={{ opacity: 1 }}
    >
      {/* Region Header */}
      <button
        onClick={() => setIsRegionOpen(!isRegionOpen)}
        className="w-full p-3 md:p-4 hover:bg-[#f5f5f5] dark:hover:bg-[#2d2d2d]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChevronDown className={`h-5 w-5 transition-transform ${isRegionOpen ? 'rotate-180' : ''}`} />
            <h2 className="text-lg md:text-xl font-semibold text-[#0b0b0b] dark:text-[#f9f9f4]">
              {region.name}
            </h2>
            <span className="px-2 py-1 bg-[#ccbeac] text-[#0b0b0b] rounded text-xs md:text-sm">
              {region.code}
            </span>
          </div>
          <span className="text-xs md:text-sm text-[#666] dark:text-[#999]">
            {clients.length} client{clients.length !== 1 && 's'}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {isRegionOpen && (
          <motion.div
            initial={{ opacity: 1, height: 'auto' }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
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
        )}
      </AnimatePresence>
    </motion.div>
  );
}