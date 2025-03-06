/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import Select from 'react-select';
import { SecteurDocument } from '@/lib/models/Secteur';
import { VilleDocument } from '@/lib/models/Ville';

interface AddressManagementFormProps {
    isOpen: boolean;
    onClose: () => void;
    client: {
      id: string;
      address: string;
      ville?: string;
      secteur?: string;
    };
    secteurs: SecteurDocument[];
    villes: VilleDocument[];
    onSave: (data: {
      address: string;
      ville?: string;
      secteur?: string;
    }) => Promise<void>;
  }

  export default function AddressManagementForm({
    isOpen,
    onClose,
    client,
    secteurs,
    villes,
    onSave,
  }: AddressManagementFormProps) {
    const { register, handleSubmit, control, reset, setValue, watch } = useForm({
      defaultValues: {
        address: client.address,
        ville: client.ville,
        secteur: client.secteur,
      }
    });
    const [showSecteurForm, setShowSecteurForm] = useState(false);
    const [showVilleForm, setShowVilleForm] = useState(false);
    const [editingSecteur, setEditingSecteur] = useState<SecteurDocument | null>(null);
    const [editingVille, setEditingVille] = useState<VilleDocument | null>(null);
    const [newSecteur, setNewSecteur] = useState({ name: '', code: '' });
    const [newVille, setNewVille] = useState({ name: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
   
    const [localSecteurs, setLocalSecteurs] = useState<SecteurDocument[]>(secteurs || []);
    const [localVilles, setLocalVilles] = useState<VilleDocument[]>(villes || []);
    const currentSecteur = watch('secteur');
    const currentVille = watch('ville');

    useEffect(() => {
        reset({
          address: client.address,
          ville: client.ville,
          secteur: client.secteur,
        });
        setLocalSecteurs(secteurs);
        setLocalVilles(villes);
      }, [client, reset, secteurs, villes]);

  const handleAddSecteur = async () => {
    try {
      const response = await fetch('/api/secteurs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSecteur),
      });

      if (!response.ok) throw new Error('Failed to create secteur');
      
      const createdSecteur = await response.json();
      setLocalSecteurs(prev => [...prev, createdSecteur]);
      setValue('secteur', createdSecteur._id);
      setShowSecteurForm(false);
      setNewSecteur({ name: '', code: '' });
    } catch (error) {
      console.error('Secteur creation error:', error);
      alert('Failed to create secteur');
    }
  };

  const handleUpdateSecteur = async () => {
    if (!editingSecteur) return;

    try {
      const response = await fetch(`/api/secteurs/${editingSecteur._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSecteur),
      });

      if (!response.ok) throw new Error('Failed to update secteur');
      
      const updatedSecteur = await response.json();
      setLocalSecteurs(prev => 
        prev.map(s => s._id === updatedSecteur._id ? updatedSecteur : s)
      );
      
      if (currentSecteur === editingSecteur._id) {
        setValue('secteur', updatedSecteur._id);
      }
      
      setEditingSecteur(null);
      setNewSecteur({ name: '', code: '' });
    } catch (error) {
      console.error('Secteur update error:', error);
      alert('Failed to update secteur');
    }
  };

  const handleDeleteSecteur = async (secteurId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm('Are you sure you want to delete this secteur? Clients using it will have it removed.')) return;

    try {
      const response = await fetch(`/api/secteurs/${secteurId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete secteur');
      
      if (currentSecteur === secteurId) {
        setValue('secteur', '');
      }

      setLocalSecteurs(prev => prev.filter(s => s._id !== secteurId));
    } catch (error) {
      console.error('Secteur deletion error:', error);
      alert('Failed to delete secteur');
    }
  };
  const handleAddVille = async () => {
    try {
      const response = await fetch('/api/villes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVille),
      });

      if (!response.ok) throw new Error('Failed to create ville');
      
      const createdVille = await response.json();
      setLocalVilles(prev => [...prev, createdVille]);
      setValue('ville', createdVille._id);
      setShowVilleForm(false);
      setNewVille({ name: '' });
      
    } catch (error) {
      console.error('Ville creation error:', error);
      alert('Failed to create ville');
    }
  };
  const handleUpdateVille = async () => {
    if (!editingVille) return;

    try {
      const response = await fetch(`/api/villes/${editingVille._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVille),
      });

      if (!response.ok) throw new Error('Failed to update ville');
      
      const updatedVille = await response.json();
      setLocalVilles(prev => 
        prev.map(v => v._id === updatedVille._id ? updatedVille : v)
      );
      
      if (currentVille === editingVille._id) {
        setValue('ville', updatedVille._id);
      }
      
      setEditingVille(null);
      setNewVille({ name: '' });
    } catch (error) {
      console.error('Ville update error:', error);
      alert('Failed to update ville');
    }
  };
  const handleDeleteVille = async (villeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm('Are you sure you want to delete this ville? Clients using it will have it removed.')) return;

    try {
      const response = await fetch(`/api/villes/${villeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete ville');
      
      if (currentVille === villeId) {
        setValue('ville', '');
      }

      setLocalVilles(prev => prev.filter(v => v._id !== villeId));
    } catch (error) {
      console.error('Ville deletion error:', error);
      alert('Failed to delete ville');
    }
  };
  
  const startEditVille = (ville: VilleDocument, e: React.MouseEvent) => {
    e.preventDefault();
    setEditingVille(ville);
    setNewVille({ name: ville.name });
    setShowVilleForm(true);
  };
  const startEditSecteur = (secteur: SecteurDocument, e: React.MouseEvent) => {
    e.preventDefault();
    setEditingSecteur(secteur);
    setNewSecteur({ name: secteur.name, code: secteur.code });
    setShowSecteurForm(true);
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Submission error:', error);
      alert(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSubmitting(false);
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
            className="bg-white dark:bg-[#0b0b0b] rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-[#ccbeac]"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[#ccbeac]">
                <h2 className="text-2xl font-bold text-[#0b0b0b] dark:text-[#f9f9f4]">
                  Manage Location
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[#0b0b0b] dark:text-[#ccbeac] hover:opacity-75"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    {...register('address')}
                    className="w-full p-3 rounded-lg border border-[#ccbeac]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <div className="flex gap-2">
                    <Controller
                      name="ville"
                      control={control}
                      render={({ field }) => {
                        const options = localVilles.map(v => ({
                          value: v._id.toString(),
                          label: v.name,
                        }));
                        return (
                          <Select
                            options={options}
                            value={options.find(o => o.value === field.value)}
                            onChange={(option) => field.onChange(option?.value || '')}
                            className="flex-1"
                            styles={{
                              control: (base) => ({
                                ...base,
                                borderColor: '#ccbeac',
                                minHeight: '3rem',
                              }),
                              menu: (base) => ({
                                ...base,
                                zIndex: 9999,
                                maxHeight: '200px',
                              }),
                            }}
                          />
                        );
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowVilleForm(!showVilleForm);
                        setEditingVille(null);
                        setNewVille({ name: '' });
                      }}
                      className="bg-[#ccbeac] text-[#0b0b0b] px-3 rounded-lg hover:bg-[#ccbeac]/90"
                    >
                      {showVilleForm ? '×' : '+'}
                    </button>
                  </div>
                </div>

                {showVilleForm && (
                  <div className="p-4 bg-[#f9f9f4] dark:bg-[#1a1a1a] rounded-lg space-y-3">
                    <h3 className="font-medium">
                      {editingVille ? 'Edit City' : 'New City'}
                    </h3>
                    <input
                      placeholder="City name"
                      value={newVille.name}
                      onChange={(e) => setNewVille({ name: e.target.value })}
                      className="w-full p-2 border border-[#ccbeac] rounded"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={editingVille ? handleUpdateVille : handleAddVille}
                        className="bg-[#ccbeac] text-[#0b0b0b] px-4 py-2 rounded hover:bg-[#ccbeac]/90 flex-1"
                      >
                        {editingVille ? 'Update' : 'Add'} City
                      </button>
                      {editingVille && (
                        <button
                          type="button"
                          onClick={() => setEditingVille(null)}
                          className="px-4 py-2 text-red-500 hover:bg-red-100/20 rounded"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                    <div className="pt-4 border-t border-[#ccbeac]">
                      <h4 className="text-sm font-medium mb-2">Existing Cities</h4>
                      <div className="space-y-2">
                        {localVilles.map(ville => (
                          <div key={ville._id} className="flex items-center justify-between">
                            <span className="truncate">{ville.name}</span>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={(e) => startEditVille(ville, e)}
                                className="text-[#ccbeac] hover:text-[#ccbeac]/70"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteVille(ville._id, e)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sector
                  </label>
                  <div className="flex gap-2">
                    <Controller
                      name="secteur"
                      control={control}
                      render={({ field }) => {
                        const options = localSecteurs.map(s => ({
                          value: s._id.toString(),
                          label: `${s.name} (${s.code})`,
                        }));
                        return (
                          <Select
                            options={options}
                            value={options.find(o => o.value === field.value)}
                            onChange={(option) => field.onChange(option?.value || '')}
                            className="flex-1"
                            styles={{
                              control: (base) => ({
                                ...base,
                                borderColor: '#ccbeac',
                                minHeight: '3rem',
                              }),
                              menu: (base) => ({
                                ...base,
                                zIndex: 9999,
                                maxHeight: '200px',
                              }),
                            }}
                          />
                        );
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowSecteurForm(!showSecteurForm);
                        setEditingSecteur(null);
                        setNewSecteur({ name: '', code: '' });
                      }}
                      className="bg-[#ccbeac] text-[#0b0b0b] px-3 rounded-lg hover:bg-[#ccbeac]/90"
                    >
                      {showSecteurForm ? '×' : '+'}
                    </button>
                  </div>
                </div>

                {showSecteurForm && (
                  <div className="p-4 bg-[#f9f9f4] dark:bg-[#1a1a1a] rounded-lg space-y-3">
                    <h3 className="font-medium">
                      {editingSecteur ? 'Edit Sector' : 'New Sector'}
                    </h3>
                    
                    <input
                      placeholder="Sector name"
                      value={newSecteur.name}
                      onChange={(e) => setNewSecteur({ ...newSecteur, name: e.target.value })}
                      className="w-full p-2 border border-[#ccbeac] rounded"
                    />
                    <input
                      placeholder="Sector code"
                      value={newSecteur.code}
                      onChange={(e) => setNewSecteur({ 
                        ...newSecteur, 
                        code: e.target.value.toUpperCase().slice(0, 5)
                      })}
                      className="w-full p-2 border border-[#ccbeac] rounded"
                      maxLength={5}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={editingSecteur ? handleUpdateSecteur : handleAddSecteur}
                        className="bg-[#ccbeac] text-[#0b0b0b] px-4 py-2 rounded hover:bg-[#ccbeac]/90 flex-1"
                      >
                        {editingSecteur ? 'Update' : 'Add'} Sector
                      </button>
                      {editingSecteur && (
                        <button
                          type="button"
                          onClick={() => setEditingSecteur(null)}
                          className="px-4 py-2 text-red-500 hover:bg-red-100/20 rounded"
                        >
                          Cancel
                        </button>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[#ccbeac]">
                      <h4 className="text-sm font-medium mb-2">Existing Sectors</h4>
                      <div className="space-y-2">
                        {localSecteurs.map(secteur => (
                          <div key={secteur._id} className="flex items-center justify-between">
                            <span className="truncate">
                              {secteur.name} ({secteur.code})
                            </span>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={(e) => startEditSecteur(secteur, e)}
                                className="text-[#ccbeac] hover:text-[#ccbeac]/70"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteSecteur(secteur._id, e)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-[#ccbeac]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-[#0b0b0b] dark:text-[#ccbeac] hover:bg-[#ccbeac]/10 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#ccbeac] text-[#0b0b0b] rounded-lg font-medium hover:bg-[#ccbeac]/90"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}