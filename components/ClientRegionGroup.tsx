// components/ClientRegionGroup.tsx
'use client';
import { motion } from 'framer-motion';
import ClientCard from './ClientCard';
import { ClientDocument } from '@/lib/models/Client';
import { RegionDocument } from '@/lib/models/Region';

// components/ClientRegionGroup.tsx
export default function ClientRegionGroup({
  region,
  clients,
  onSelectClient,
  regions
}: {
  region: RegionDocument;
  clients: ClientDocument[];
  onSelectClient: (client: ClientDocument) => void;
  regions: RegionDocument[];
}) {
  const actualRegion = regions.find(r => r._id.toString() === region._id.toString());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 p-4 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm border border-[#ccbeac]/30"
    >
      <div className="flex items-center gap-3 pb-3 border-b border-[#ccbeac]/20">
        {actualRegion ? (
          <>
            <h2 className="text-2xl font-bold text-[#0b0b0b] dark:text-[#f9f9f4]">
              {actualRegion.name}
            </h2>
            <span className="px-3 py-1.5 bg-[#ccbeac] text-[#0b0b0b] rounded-full text-sm font-medium">
              {actualRegion.code}
            </span>
            <span className="text-sm text-[#0b0b0b]/70 dark:text-[#f9f9f4]/70 ml-auto">
              {clients.length} client{clients.length !== 1 && 's'}
            </span>
          </>
        ) : (
          <div className="p-4 text-center text-[#0b0b0b]/50 dark:text-[#f9f9f4]/50 border-2 border-dashed rounded-xl">
            <p className="font-medium">Région introuvable</p>
          </div>
        )}
      </div>

      {clients.length === 0 ? (
        <div className="p-6 text-center text-[#ccbeac] border-2 border-dashed rounded-xl flex flex-col items-center">
          <span className="text-lg mb-2">📭</span>
          <p className="font-medium">Pas de clients dans cette région</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
          {clients.map(client => (
            <ClientCard
              key={client._id.toString()}
              client={client}
              region={actualRegion}
              onClick={() => onSelectClient(client)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}