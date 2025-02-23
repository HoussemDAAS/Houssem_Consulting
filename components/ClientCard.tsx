// components/ClientCard.tsx
'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Client } from '@/types/client';
import { PackageIcon } from 'lucide-react';

const generateColorFromId = (id: string) => {
  const hash = id.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return `hsl(${hash % 360}, 70%, 40%)`;
};

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
  } = useSortable({ id: client._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const borderColor = generateColorFromId(client._id);
  const totalProducts = client.products?.length || 0;
  const totalSubproducts = client.products?.reduce((acc, curr) => acc + curr.subProducts.length, 0) || 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4"
      onClick={onClick}
      style={{ borderLeftColor: borderColor }}
    >
      <button
        {...attributes}
        {...listeners}
        className="absolute top-3 right-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-move"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
        </svg>
      </button>

      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
            {client.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{client.email}</p>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <PackageIcon className="h-4 w-4 text-blue-500" />
            <span className="font-medium text-gray-700 dark:text-gray-300">{totalProducts}</span>
            <span className="text-gray-500">products</span>
          </div>
          
          {totalSubproducts > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">{totalSubproducts}</span>
              <span className="text-gray-500">subproducts</span>
            </div>
          )}
        </div>

        {client.products?.slice(0, 2).map((product, index) => (
          <div 
            key={index} 
            className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800"
          >
            <p className="text-sm font-medium truncate text-blue-600 dark:text-blue-300">
              {typeof product.product === 'object' 
                ? product.product.name 
                : 'Product'}
            </p>
            {product.subProducts.length > 0 && (
              <p className="text-xs text-blue-500 dark:text-blue-400 truncate">
                {product.subProducts.join(', ')}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}