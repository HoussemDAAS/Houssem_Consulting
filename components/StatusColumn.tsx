// components/StatusColumn.tsx
'use client';
import { Client } from '@/types/client';
import ClientCard from './ClientCard';
import AddClientCard from './AddClientCard';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';

export default function StatusColumn({ status, clients, onClientClick, children }: {
  status: string;
  clients: Client[];
  onClientClick: (client: Client) => void;
  children?: React.ReactNode;
}) {
  const { setNodeRef } = useSortable({ id: status });

  return (
    <div ref={setNodeRef} className="flex-1 min-w-[300px]">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-lg font-semibold capitalize">{status} Clients</h2>
        <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 rounded-full">
          {clients.length}
        </span>
      </div>
      
      <div className="flex flex-col gap-4">
        {/* Client Cards Container */}
        <SortableContext 
          items={clients.map(c => c._id)} 
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {clients.map(client => (
              <ClientCard
                key={client._id}
                client={client}
                onClick={() => onClientClick(client)}
              />
            ))}
          </div>
        </SortableContext>
        
        {/* Add Client Card always at bottom */}
        {children}
      </div>
    </div>
  );
}