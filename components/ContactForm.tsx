// components/ContactForm.tsx
'use client';
import { Dialog } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { ClientDocument } from '@/lib/models/Client';

export default function ContactForm({
  isOpen,
  onClose,
  client,
  onSuccess,
  contactToEdit
}: {
  isOpen: boolean;
  onClose: () => void;
  client: ClientDocument | null;
  onSuccess: () => void;
  contactToEdit?: {
    firstName: string;
    lastName: string;
    service: string;
    position: string;
    email: string;
    phone: string;
    index: number;
  } | null;
}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [service, setService] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (contactToEdit) {
      setFirstName(contactToEdit.firstName);
      setLastName(contactToEdit.lastName);
      setService(contactToEdit.service);
      setPosition(contactToEdit.position);
      setEmail(contactToEdit.email);
      setPhone(contactToEdit.phone);
    } else {
      resetForm();
    }
  }, [contactToEdit]);

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setService('');
    setPosition('');
    setEmail('');
    setPhone('');
  };

  const handleSubmit = async () => {
    if (!client) return;

    try {
      const newContact = {
        firstName,
        lastName,
        service,
        position,
        email,
        phone
      };

      let updatedContacts = [...(client.contacts || [])];
      
      if (contactToEdit) {
        updatedContacts[contactToEdit.index] = newContact;
      } else {
        updatedContacts = [...updatedContacts, newContact];
      }

      const response = await fetch(`/api/clients/${client._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contacts: updatedContacts
        })
      });

      if (!response.ok) throw new Error('Failed to save contact');
      
      onClose();
      resetForm();
      onSuccess();
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
          <Dialog.Title className="text-lg font-semibold mb-4 dark:text-white">
            {contactToEdit ? 'Edit Contact' : 'Add New Contact'}
          </Dialog.Title>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Service</label>
                <input
                  type="text"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Position</label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#ccbeac] text-[#0b0b0b] rounded hover:bg-[#ccbeac]/90"
            >
              {contactToEdit ? 'Save Changes' : 'Add Contact'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}