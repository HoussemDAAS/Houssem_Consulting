'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Client {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  email: string;
  company: string;
  phone: string;
}

export default function ClientCard({ client, onClick }: {
  client: Client;
  onClick: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: client.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="min-w-[300px] flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all relative group"
    >
      {/* Status indicator bar */}
      <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${
        client.status === 'active' ? 'bg-green-400' : 'bg-red-400'
      }`} />

      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-3 right-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-move"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
        </svg>
      </button>

      {/* Client content */}
      <div className="ml-3">
        <h3 
          className="text-lg font-semibold truncate cursor-pointer hover:text-blue-500 transition-colors"
          onClick={onClick}
        >
          {client.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{client.company}</p>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="capitalize">{client.status}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Last contact: {client.lastContact || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}