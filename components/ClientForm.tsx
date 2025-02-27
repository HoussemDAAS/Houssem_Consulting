// components/ClientForm.tsx
'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Client } from '@/types/client';

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client;
  refreshClients: () => void;
}

export default function ClientForm({ isOpen, onClose, client, refreshClients }: ClientFormProps) {
  const { register, handleSubmit, reset } = useForm<Client>();
  const [error, setError] = useState('');

  useEffect(() => {
    if (client) {
      reset(client);
    } else {
      reset({ status: 'active' });
    }
  }, [client, reset]);

  const onSubmit = async (data: Client) => {
    try {
      const url = client ? `/api/clients/${client._id}` : '/api/clients';
      const method = client ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Operation failed');
      
      refreshClients();
      onClose(); // Ensure form closes
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save client');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {client ? 'Modifier Client' : 'Nouveau Client'}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {error && <div className="text-red-500 p-2 bg-red-100 rounded">{error}</div>}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2">Nom *</label>
                  <input
                    {...register('name', { required: true })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2">Email *</label>
                  <input
                    type="email"
                    {...register('email', { required: true })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2">Statut</label>
                  <select
                    {...register('status')}
                    className="w-full p-2 border rounded"
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Téléphone</label>
                  <input
                    {...register('phone')}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block mb-2">Adresse</label>
                  <input
                    {...register('address')}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primaryColor text-white rounded hover:bg-secondaryColor"
                >
                  {client ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}