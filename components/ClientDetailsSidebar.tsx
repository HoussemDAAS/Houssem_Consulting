'use client';

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: 'active' | 'inactive';
}

export default function ClientDetailsSidebar({ client, isOpen, onClose }: {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      {client && (
        <div className="h-full flex flex-col">
          <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold">{client.name}</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">CONTACT INFORMATION</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">{client.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  </div>
                  <div>
                    <p className="font-medium">{client.phone}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  </div>
                  <div>
                    <p className="font-medium">{client.company}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">STATUS</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  client.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {client.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}