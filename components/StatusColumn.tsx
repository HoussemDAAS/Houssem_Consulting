'use client';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';

import ClientCard from './ClientCard';
import AddClientCard from './AddClientCard';
import { motion } from 'framer-motion';

interface Client {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  email: string;
  company: string;
  phone: string;
}

export default function StatusColumn({ status, clients, onClientClick }: {
  status: 'active' | 'inactive';
  clients: Client[];
  onClientClick: (client: Client) => void;
}) {
  const { setNodeRef } = useSortable({ id: status });

  return (
    <div ref={setNodeRef} className="flex-1">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-lg font-semibold capitalize">{status} Clients</h2>
        <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 rounded-full">
          {clients.length}
        </span>
      </div>
      
      <SortableContext items={clients} strategy={verticalListSortingStrategy}>
        <div className="flex gap-4 pb-4 overflow-x-auto scrollbar-hide">
          {clients.map(client => (
            <ClientCard
              key={client.id}
              client={client}
              onClick={() => onClientClick(client)}
            />
          ))}
          {/* <AddClientCard status={status} /> */}
        </div>
      </SortableContext>
      <motion.div 
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="min-w-[300px] flex-shrink-0"
        >
          <AddClientCard status={status} />
        </motion.div>
    </div>
  );
}