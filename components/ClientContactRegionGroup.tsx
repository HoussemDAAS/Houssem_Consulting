"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  MapPin,
  Building,
  User,
  Pencil,
  Trash2,
  Save,
  X,
  UserPlus,
} from "lucide-react";
import { ClientDocument } from "@/lib/models/Client";
import { RegionDocument } from "@/lib/models/Region";
import { SecteurDocument } from "@/lib/models/Secteur";
import { VilleDocument } from "@/lib/models/Ville";
import AddressSecteurForm from "./AddressSecteurForm";

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

interface ClientContactRegionGroupProps {
  region: RegionDocument;
  secteurs: SecteurDocument[];
  villes: VilleDocument[];
  clients: ClientDocument[];
  onSave: (
    clientId: string,
    updates: {
      address?: string;
      ville?: string;
      secteur?: string;
      contacts?: Contact[];
    }
  ) => Promise<void>;
  onSuccess: () => void;
}

export default function ClientContactRegionGroup({
  region,
  secteurs,
  villes,
  clients,
  onSave,
  onSuccess,
}: ClientContactRegionGroupProps) {
  const [isRegionOpen, setIsRegionOpen] = useState(true); // Region accordion state
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<EditingClient | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [currentLocationClient, setCurrentLocationClient] = 
    useState<ClientDocument | null>(null);
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
        {
          firstName: "",
          lastName: "",
          position: "",
          email: "",
          phone: "",
          service: "",
        },
      ],
    });
  };

  const handleToggle = (clientId: string) => {
    setExpandedClient((prev) => (prev === clientId ? null : clientId));
  };

  const startContactEditing = (client: ClientDocument) => {
    if (expandedClient !== client._id.toString()) {
      setExpandedClient(client._id.toString());
    }
    setEditingClient({
      id: client._id.toString(),
      contacts:
        client.contacts?.map((contact) => ({
          _id: contact._id?.toString(),
          firstName: contact.firstName || "",
          lastName: contact.lastName || "",
          position: contact.position || "",
          email: contact.email || "",
          phone: contact.phone || "",
          service: contact.service || "",
        })) || [],
    });
  };

  const handleLocationEdit = (client: ClientDocument) => {
    setCurrentLocationClient(client);
    setShowAddressForm(true);
  };

  const handleSaveContacts = async () => {
    if (!editingClient) return;
    try {
      await onSave(editingClient.id, {
        contacts: editingClient.contacts.map((contact) => ({
          _id: contact._id,
          firstName: contact.firstName.trim(),
          lastName: contact.lastName.trim(),
          position: contact.position.trim(),
          email: contact.email.trim(),
          phone: contact.phone.trim(),
          service: contact.service.trim(),
        })),
      });
      setEditingClient(null);
      onSuccess();
    } catch (error) {
      console.error("Save error:", error);
      alert(error instanceof Error ? error.message : "Failed to save contacts");
    }
  };

  const getSecteurName = (client: ClientDocument) => {
    const secteurId =
      client.secteur?._id?.toString() || client.secteur?.toString();
    return (
      localSecteurs.find((s) => s._id.toString() === secteurId)?.name || "-"
    );
  };

  const getVilleName = (client: ClientDocument) => {
    const villeId = client.ville?._id?.toString() || client.ville?.toString();
    return villes.find((v) => v._id.toString() === villeId)?.name || "-";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-[#ccbeac]/30"
    >
      {/* Region Accordion Header */}
      <button
        onClick={() => setIsRegionOpen(!isRegionOpen)}
        className="w-full p-3 sm:p-4 hover:bg-[#f5f5f5] dark:hover:bg-[#2d2d2d] border-b border-[#ccbeac]/30"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChevronDown
              className={`h-5 w-5 transition-transform ${
                isRegionOpen ? "rotate-180" : ""
              }`}
            />
            <h2 className="text-lg sm:text-xl font-semibold text-[#0b0b0b] dark:text-[#f9f9f4]">
              {region.name}
            </h2>
            <span className="px-2 py-1 bg-[#ccbeac] text-[#0b0b0b] rounded text-xs sm:text-sm">
              {region.code}
            </span>
          </div>
          <span className="text-xs sm:text-sm text-[#666] dark:text-[#999]">
            {clients.length} client{clients.length !== 1 && "s"}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {isRegionOpen && (
          <motion.div
            initial={{ opacity: 1, height: "auto" }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {clients.length === 0 ? (
              <div className="p-4 sm:p-6 text-center text-[#ccbeac] text-sm sm:text-base">
                <span className="text-lg mb-2">📭</span>
                <p className="font-medium">No clients in this region</p>
              </div>
            ) : (
              <div className="divide-y divide-[#ccbeac]/30">
                {clients.map((client) => {
                  const isEditingContacts =
                    editingClient?.id === client._id.toString();

                  return (
                    <div
                      key={client._id.toString()}
                      className="border-b border-[#ccbeac]/30"
                    >
                      {/* Client Header */}
                      <div className="flex items-center p-3 sm:p-4 hover:bg-[#f5f5f5] dark:hover:bg-[#2d2d2d]">
                        <button
                          onClick={() => handleToggle(client._id.toString())}
                          className="w-8 h-8 flex items-center justify-center mr-2"
                        >
                          <ChevronRight
                            className={`h-5 w-5 transition-transform ${
                              expandedClient === client._id.toString()
                                ? "rotate-90"
                                : ""
                            }`}
                          />
                        </button>

                        <div className="flex-1 flex items-center gap-2 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-[#0b0b0b] dark:text-[#f9f9f4] truncate">
                            {client.name}
                          </h3>
                          <div className="flex items-center gap-1 ml-auto">
                            <button
                              onClick={() => handleLocationEdit(client)}
                              className="p-1.5 hover:bg-[#ccbeac]/20 rounded-full"
                              title="Edit location"
                            >
                              <MapPin className="h-5 w-5 text-[#ccbeac]" />
                            </button>
                            {!isEditingContacts && (
                              <button
                                onClick={() => startContactEditing(client)}
                                className="p-1.5 hover:bg-[#ccbeac]/20 rounded-full"
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
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            {/* Location Info */}
                            <div className="px-4 pb-4 ml-10 space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="h-5 w-5 text-[#ccbeac] flex-shrink-0" />
                                  <span className="truncate">{client.address || '-'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-[#ccbeac]">🏙️</span>
                                  <span className="truncate">{getVilleName(client)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Building className="h-5 w-5 text-[#ccbeac] flex-shrink-0" />
                                  <span className="truncate">{getSecteurName(client)}</span>
                                </div>
                              </div>

                              {/* Contacts Section */}
                              <div className="mt-3">
                                <h4 className="text-base font-semibold mb-2 flex items-center gap-2">
                                  <User className="h-5 w-5" />
                                  Contacts ({(client.contacts || []).length})
                                </h4>

                                <div className="border rounded-lg overflow-hidden dark:border-gray-700">
                                  <div className="sm:hidden p-2 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                                    <span className="font-medium text-sm">Contact Details</span>
                                  </div>

                                  <div className="space-y-2 p-2">
                                    {(isEditingContacts ? editingClient.contacts : client.contacts || []).map((contact, index) => (
                                      <div key={contact._id || `new-${index}`} className="group">
                                        {isEditingContacts ? (
                                          <div className="space-y-2 p-2 border-b dark:border-gray-700">
                                            {['firstName', 'lastName', 'position', 'email', 'phone', 'service'].map((field) => (
                                              <div key={field} className="space-y-1">
                                                <label className="text-xs text-[#ccbeac] capitalize">
                                                  {field.replace(/([A-Z])/g, ' $1')}
                                                </label>
                                                <input
                                                  value={contact[field] || ''}
                                                  onChange={(e) => updateContact(index, field, e.target.value)}
                                                  className="w-full p-1.5 text-sm border rounded dark:bg-gray-800"
                                                  placeholder={field.replace(/([A-Z])/g, ' $1')}
                                                />
                                              </div>
                                            ))}
                                            <div className="flex justify-end gap-2 mt-2">
                                              <button
                                                onClick={() => deleteContact(index)}
                                                className="p-1.5 text-red-500 hover:bg-red-100/20 rounded"
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </button>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="p-2 border-b dark:border-gray-700">
                                            <div className="flex justify-between items-start">
                                              <div className="space-y-1">
                                                <div className="font-medium">
                                                  {contact.firstName} {contact.lastName}
                                                </div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                                  {contact.position} • {contact.service}
                                                </div>
                                                <div className="text-xs">
                                                  {contact.email || 'No email'} | {contact.phone || 'No phone'}
                                                </div>
                                              </div>
                                              <div className="flex gap-1">
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
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>

                                  {isEditingContacts && (
                                    <div className="p-2 border-t dark:border-gray-700">
                                      <div className="flex flex-col sm:flex-row justify-between gap-2">
                                        <button
                                          onClick={addNewContact}
                                          className="text-stone-600 hover:underline flex items-center gap-2 text-sm px-2 py-1.5"
                                        >
                                          <UserPlus className="h-4 w-4" />
                                          Add Contact
                                        </button>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                          <button
                                            onClick={() => setEditingClient(null)}
                                            className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded flex items-center gap-2 text-sm dark:text-gray-300"
                                          >
                                            <X className="h-4 w-4" />
                                            Cancel
                                          </button>
                                          <button
                                            onClick={handleSaveContacts}
                                            className="px-3 py-1.5 bg-[#ccbeac] text-[#0b0b0b] rounded flex items-center gap-2 hover:bg-[#ccbeac]/90 text-sm"
                                          >
                                            <Save className="h-4 w-4" />
                                            Save
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
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
          </motion.div>
        )}
      </AnimatePresence>

      {currentLocationClient && (
        <AddressSecteurForm
          isOpen={showAddressForm}
          onClose={() => {
            setShowAddressForm(false);
            setCurrentLocationClient(null);
          }}
          client={{
            id: currentLocationClient._id.toString(),
            address: currentLocationClient.address || "",
            ville: currentLocationClient.ville?._id?.toString() || "",
            secteur: currentLocationClient.secteur?._id?.toString() || "",
          }}
          secteurs={localSecteurs}
          villes={villes}
          onSave={async (data) => {
            await onSave(currentLocationClient._id.toString(), {
              address: data.address,
              ville: data.ville,
              secteur: data.secteur,
            });
            onSuccess();
          }}
        />
      )}
    </motion.div>
  );
}