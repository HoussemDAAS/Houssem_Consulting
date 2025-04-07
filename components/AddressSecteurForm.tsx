'use client';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Select from 'react-select';
import { SecteurDocument } from '@/lib/models/Secteur';
import { VilleDocument } from '@/lib/models/Ville';
import { RegionDocument } from '@/lib/models/Region';

interface AddressManagementFormProps {
  isOpen: boolean;
  onClose: () => void;
  client: {
    id: string;
    address: string;
    ville?: string;
    secteur?: string;
    region: string;
  };
  secteurs: SecteurDocument[];
  villes: VilleDocument[];
  regions: RegionDocument[];
  onSave: (data: {
    address: string;
    ville?: string;
    secteur?: string;
  }) => Promise<void>;
}

export default function AddressSecteurForm({
  isOpen,
  onClose,
  client,
  secteurs = [],
  villes = [],
  regions = [],
  onSave,
}: AddressManagementFormProps) {
  const { register, handleSubmit, control, reset, setValue } = useForm({
    defaultValues: {
      address: client.address,
      ville: client.ville,
      secteur: client.secteur,
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredVilles, setFilteredVilles] = useState<VilleDocument[]>([]);

  // Filter villes based on client's region
  useEffect(() => {
    if (client.region && villes.length > 0) {
      const filtered = villes.filter(v => v.region?.toString() === client.region);
      setFilteredVilles(filtered);
      // Reset ville if it's not in the filtered list
      if (client.ville && !filtered.some(v => v._id.toString() === client.ville)) {
        setValue('ville', '');
      }
    } else {
      setFilteredVilles([]);
    }
  }, [client.region, villes, client.ville, setValue]);

  // Initialize form
  useEffect(() => {
    reset({
      address: client.address,
      ville: client.ville,
      secteur: client.secteur,
    });
  }, [client, reset]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onSave({
        address: data.address,
        ville: data.ville || undefined,
        secteur: data.secteur || undefined
      });
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
                    placeholder="Enter address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Region</label>
                  <select
                    value={client.region}
                    className="w-full p-3 rounded-lg border border-[#ccbeac] bg-white dark:bg-[#1a1a1a] cursor-not-allowed"
                    disabled
                  >
                    {regions.length > 0 ? (
                      regions.map(region => (
                        <option key={region._id} value={region._id.toString()}>
                          {region.name} ({region.code})
                        </option>
                      ))
                    ) : (
                      <option value="">No regions available</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <Controller
                    name="ville"
                    control={control}
                    render={({ field }) => {
                      const options = filteredVilles.map(v => ({
                        value: v._id.toString(),
                        label: v.name,
                      }));
                      
                      return (
                        <Select
                          options={options}
                          value={options.find(o => o.value === field.value)}
                          onChange={(option) => field.onChange(option?.value || undefined)}
                          className="react-select-container"
                          classNamePrefix="react-select"
                          placeholder={
                            filteredVilles.length > 0 
                              ? "Select a city" 
                              : "No cities available for this region"
                          }
                          isDisabled={filteredVilles.length === 0}
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderColor: '#ccbeac',
                              minHeight: '3rem',
                              backgroundColor: 'white',
                            }),
                            menu: (base) => ({
                              ...base,
                              zIndex: 9999,
                            }),
                          }}
                          theme={(theme) => ({
                            ...theme,
                            colors: {
                              ...theme.colors,
                              primary: '#ccbeac',
                              primary25: '#f5f5f5',
                            },
                          })}
                        />
                      );
                    }}
                  />
                  {filteredVilles.length === 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      No cities available for the selected region
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sector</label>
                  <Controller
                    name="secteur"
                    control={control}
                    render={({ field }) => {
                      const options = secteurs.map(s => ({
                        value: s._id.toString(),
                        label: `${s.name} (${s.code})`,
                      }));
                      return (
                        <Select
                          options={options}
                          value={options.find(o => o.value === field.value)}
                          onChange={(option) => field.onChange(option?.value || undefined)}
                          className="react-select-container"
                          classNamePrefix="react-select"
                          placeholder="Select a sector"
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderColor: '#ccbeac',
                              minHeight: '3rem',
                              backgroundColor: 'white',
                            }),
                            menu: (base) => ({
                              ...base,
                              zIndex: 9999,
                            }),
                          }}
                          theme={(theme) => ({
                            ...theme,
                            colors: {
                              ...theme.colors,
                              primary: '#ccbeac',
                              primary25: '#f5f5f5',
                            },
                          })}
                        />
                      );
                    }}
                  />
                </div>
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
                  className="px-6 py-2 bg-[#ccbeac] text-[#0b0b0b] rounded-lg font-medium hover:bg-[#ccbeac]/90 disabled:opacity-70"
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