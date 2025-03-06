'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, MapPin, Building, User, Pencil, Trash2, Save, X, UserPlus } from 'lucide-react';
import { ClientDocument } from '@/lib/models/Client';
import { RegionDocument } from '@/lib/models/Region';
import { SecteurDocument } from '@/lib/models/Secteur';

import { VilleDocument } from '@/lib/models/Ville';
import AddressManagementForm from './AddressSecteurForm';

interface Contact {
  _id?: string;
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phone: string;
  service: string;
}

interface EditingClient {
  id: string;
  contacts: Contact[];
}
interface PopulatedClient extends ClientDocument {
  region: RegionDocument;
  secteur: SecteurDocument;
  ville: VilleDocument;
}
interface ClientContactRegionGroupProps {
  region: RegionDocument;
  secteurs: SecteurDocument[];
  villes: VilleDocument[]; // Ensure this matches parent's passing
  clients: ClientDocument[];
  onSave: (clientId: string, updates: { 
    address?: string;
    ville?: string;
    secteur?: string;
    contacts?: Contact[] 
  }) => Promise<void>;
  onSuccess: () => void;
}

export default function ClientContactRegionGroup({ 
  region,
  secteurs,
  villes,
  clients,
  onSave,
  onSuccess
}: ClientContactRegionGroupProps) {
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<EditingClient | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [currentLocationClient, setCurrentLocationClient] = useState<ClientDocument | null>(null);
  const [localSecteurs, setLocalSecteurs] = useState<SecteurDocument[]>(secteurs);

  useEffect(() => {
    setLocalSecteurs(secteurs);
  }, [secteurs]);

  // Contact handlers
  const updateContact = (index: number, field: keyof Contact, value: string) => {
    if (!editingClient) return;
    const newContacts = [...editingClient.contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setEditingClient({ ...editingClient, contacts: newContacts });
  };

  const deleteContact = (index: number) => {
    if (!editingClient) return;
    const newContacts = editingClient.contacts.filter((_, i) => i !== index);
    setEditingClient({ ...editingClient, contacts: newContacts });
  };

  const addNewContact = () => {
    if (!editingClient) return;
    setEditingClient({
      ...editingClient,
      contacts: [
        ...editingClient.contacts,
        { firstName: '', lastName: '', position: '', email: '', phone: '', service: '' }
      ]
    });
  };

  const handleCancel = () => {
    setEditingClient(null);
  };

  const handleToggle = (clientId: string) => {
    setExpandedClient(prev => prev === clientId ? null : clientId);
  };

  const startContactEditing = (client: ClientDocument) => {
    setEditingClient({
      id: client._id.toString(),
      contacts: client.contacts?.map(contact => ({
        _id: contact._id?.toString(),
        firstName: contact.firstName || '',
        lastName: contact.lastName || '',
        position: contact.position || '',
        email: contact.email || '',
        phone: contact.phone || '',
        service: contact.service || ''
      })) || []
    });
  };

  const handleLocationEdit = (client: ClientDocument) => {
    setCurrentLocationClient(client);
    setShowAddressForm(true);
  };

  const handleSaveContacts = async () => {
    if (!editingClient) return;
    try {
      // Get the original client data
      const originalClient = clients.find(c => c._id.toString() === editingClient.id);
      
      await onSave(editingClient.id, {
        // Preserve existing location data
        ville: originalClient?.ville?._id?.toString() || originalClient?.ville?.toString(),
        secteur: originalClient?.secteur?._id?.toString() || originalClient?.secteur?.toString(),
        // Include contact updates
        contacts: editingClient.contacts.map(contact => ({
          _id: contact._id,
          firstName: contact.firstName.trim(),
          lastName: contact.lastName.trim(),
          position: contact.position.trim(),
          email: contact.email.trim(),
          phone: contact.phone.trim(),
          service: contact.service.trim()
        }))
      });
      setEditingClient(null);
      onSuccess();
    } catch (error) {
      console.error('Save error:', error);
      alert(error instanceof Error ? error.message : 'Failed to save contacts');
    }
  };
  const renderSecteurField = (client: ClientDocument) => {
    const secteurId = client.secteur?._id?.toString() || client.secteur?.toString();
    const currentSecteur = localSecteurs.find(s => s._id.toString() === secteurId);
    return (
      <div className="flex items-center gap-4 w-full">
        <Building className="h-5 w-5 text-[#ccbeac] flex-shrink-0" />
        <span>{currentSecteur?.name || '-'}</span>
      </div>
    );
  };
  
  // Update the ville rendering similarly
  const renderVilleField = (client: ClientDocument) => {
    const villeId = client.ville?._id?.toString() || client.ville?.toString();
    // Add null check for villes array
    const currentVille = (villes || []).find(v => v._id.toString() === villeId);
    return (
      <div className="flex items-center gap-4 w-full">
        <span className="text-[#ccbeac]">🏙️</span>
        <span>{currentVille?.name || '-'}</span>
      </div>
    );
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
          {clients.map(client => {
            const isEditingContacts = editingClient?.id === client._id.toString();
            const currentClient = isEditingContacts ? editingClient : client;

            return (
              <div key={client._id.toString()} className="border-b border-[#ccbeac]/30">
                <div className="flex items-center p-4 hover:bg-[#f5f5f5] dark:hover:bg-[#2d2d2d]">
                  <button
                    onClick={() => handleToggle(client._id.toString())}
                    className="flex items-center justify-center w-8 h-8 mr-2"
                  >
                    <ChevronRight className={`h-5 w-5 transition-transform ${
                      expandedClient === client._id.toString() ? 'rotate-90' : ''
                    }`} />
                  </button>

                  <div className="flex-1 flex items-center gap-4">
                    <h3 className="text-xl font-semibold text-[#0b0b0b] dark:text-[#f9f9f4]">
                      {client.name}
                    </h3>
                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        onClick={() => handleLocationEdit(client)}
                        className="p-2 hover:bg-[#ccbeac]/20 rounded-full"
                        title="Edit location"
                      >
                        <MapPin className="h-5 w-5 text-[#ccbeac]" />
                      </button>
                      {!isEditingContacts && (
                        <button
                          onClick={() => startContactEditing(client)}
                          className="p-2 hover:bg-[#ccbeac]/20 rounded-full"
                          title="Edit contacts"
                        >
                          <Pencil className="h-5 w-5 text-[#ccbeac]" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedClient === client._id.toString() && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 ml-10 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Address Field */}
                          <div className="flex items-center gap-4">
                            <MapPin className="h-5 w-5 text-[#ccbeac]" />
                            <span>{client.address || '-'}</span>
                          </div>

                          {/* Ville Field */}
{renderVilleField(client)}

                          {/* Secteur Field */}
                          {renderSecteurField(client)}
                        </div>

                        {/* Contacts Table */}
                        <div className="mt-4">
                          <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Contacts ({(client.contacts || []).length})
                          </h4>
                          
                          <div className="border rounded-lg overflow-hidden dark:border-gray-700">
                            <div className="grid grid-cols-7 gap-4 p-3 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                              {['First Name', 'Last Name', 'Position', 'Email', 'Phone', 'Service', 'Actions'].map(
                                (header, index) => (
                                  <span key={index} className="font-medium truncate min-w-[120px]">{header}</span>
                                )
                              )}
                            </div>

                            <div className="space-y-2 p-3">
                            {(isEditingContacts && editingClient?.contacts ? editingClient.contacts : client.contacts || []).map((contact, index) => (
                        <div key={contact._id || index} className="grid grid-cols-7 gap-4 items-center">
                                  {isEditingContacts ? (
                                    <>
                                      <input
                                        type="text"
                                        value={editingClient.contacts[index].firstName}
                                        onChange={(e) => updateContact(index, 'firstName', e.target.value)}
                                        className="border rounded p-2 dark:bg-gray-800 truncate min-w-[120px]"
                                        placeholder="First Name"
                                      />
                                      <input
                                        type="text"
                                        value={editingClient?.contacts[index].lastName}
                                        onChange={(e) => updateContact(index, 'lastName', e.target.value)}
                                        className="border rounded p-2 dark:bg-gray-800 truncate min-w-[120px]"
                                        placeholder="Last Name"
                                      />
                                      <input
                                        type="text"
                                        value={editingClient?.contacts[index].position}
                                        onChange={(e) => updateContact(index, 'position', e.target.value)}
                                        className="border rounded p-2 dark:bg-gray-800 truncate min-w-[120px]"
                                        placeholder="Position"
                                      />
                                      <input
                                        type="email"
                                        value={editingClient?.contacts[index].email}
                                        onChange={(e) => updateContact(index, 'email', e.target.value)}
                                        className="border rounded p-2 dark:bg-gray-800 truncate min-w-[160px]"
                                        placeholder="Email"
                                      />
                                      <input
                                        type="tel"
                                        value={editingClient?.contacts[index].phone}
                                        onChange={(e) => updateContact(index, 'phone', e.target.value)}
                                        className="border rounded p-2 dark:bg-gray-800 truncate min-w-[120px]"
                                        placeholder="Phone"
                                      />
                                      <input
                                        type="text"
                                        value={editingClient?.contacts[index].service}
                                        onChange={(e) => updateContact(index, 'service', e.target.value)}
                                        className="border rounded p-2 dark:bg-gray-800 truncate min-w-[120px]"
                                        placeholder="Service"
                                      />
                                      <button
                                        onClick={() => deleteContact(index)}
                                        className="p-2 text-red-500 hover:bg-red-100/20 rounded-full"
                                      >
                                        <Trash2 className="h-5 w-5" />
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <span className="truncate min-w-[120px]">{contact.firstName || '-'}</span>
                                      <span className="truncate min-w-[120px]">{contact.lastName || '-'}</span>
                                      <span className="truncate min-w-[120px]">{contact.position || '-'}</span>
                                      <span className="truncate min-w-[160px]">{contact.email || '-'}</span>
                                      <span className="truncate min-w-[120px]">{contact.phone || '-'}</span>
                                      <span className="truncate min-w-[120px]">{contact.service || '-'}</span>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => startContactEditing(client)}
                                          className="text-[#ccbeac] hover:bg-[#ccbeac]/20 p-1 rounded"
                                        >
                                          <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            startContactEditing(client);
                                            deleteContact(index);
                                          }}
                                          className="text-red-500 hover:bg-red-100/20 p-1 rounded"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}

                              {isEditingContacts && (
                                <div className="pt-4 border-t dark:border-gray-700">
                                  <div className="flex justify-between items-center">
                                    <button
                                      onClick={addNewContact}
                                      className="text-stone-600 hover:underline flex items-center gap-2"
                                    >
                                      <UserPlus className="h-4 w-4" />
                                      Add New Contact
                                    </button>
                                    <div className="flex gap-4">
                                      <button
                                        onClick={handleCancel}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded flex items-center gap-2 dark:text-gray-300 dark:hover:bg-gray-700"
                                      >
                                        <X className="h-4 w-4" />
                                        Cancel
                                      </button>
                                      <button
                                        onClick={handleSaveContacts}
                                        className="px-4 py-2 bg-[#ccbeac] text-[#0b0b0b] rounded flex items-center gap-2 hover:bg-[#ccbeac]/90"
                                      >
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

{currentLocationClient && (
        <AddressManagementForm
          isOpen={showAddressForm}
          onClose={() => {
            setShowAddressForm(false);
            setCurrentLocationClient(null);
          }}
          client={{
            id: currentLocationClient._id.toString(),
            address: currentLocationClient.address || '',
            ville: currentLocationClient.ville?._id?.toString(),
            secteur: currentLocationClient.secteur?._id?.toString()
          }}
          secteurs={localSecteurs}
          villes={villes}
          onSave={async (data) => {
            await onSave(currentLocationClient._id.toString(), {
              address: data.address,
              ville: data.ville,
              secteur: data.secteur
            });
            onSuccess();
          }}
        />
      )}
    </motion.div>
  );
}
