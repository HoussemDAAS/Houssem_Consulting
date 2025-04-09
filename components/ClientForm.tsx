/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import Select from 'react-select';
import { ClientDocument } from '@/lib/models/Client';
import { RegionDocument } from '@/lib/models/Region';
import { ProductDocument } from '@/lib/models/Product';

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  client?: ClientDocument;
  refreshClients: () => void;
  regions: RegionDocument[];
  products: ProductDocument[];
}

type FormData = {
  name: string;
  region: string;
  products: Array<{
    product: string;
    fabriquant: string;
    modele: string;
    reference: string;
    plageMesure: string;
    annee: string;
    versionLogiciel: string;
    autreInformation: string;
    status: 'negotiation' | 'closed-won' | 'closed-lost' | 'closed-declined';
    addedAt: Date;
  }>;
};

export default function ClientForm({
  isOpen,
  onClose,
  client,
  refreshClients,
  regions,
  products,
}: ClientFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      region: '',
      products: [],
    },
  });

  const [showRegionForm, setShowRegionForm] = useState(false);
  const [newRegion, setNewRegion] = useState({ name: '', code: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingRegion, setEditingRegion] = useState<RegionDocument | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { fields: productFields, append: appendProduct, remove: removeProduct } = useFieldArray({
    control,
    name: 'products',
  });

  useEffect(() => {
    if (client) {
      reset({
        name: client.name,
        region: client.region._id.toString(),
        products: client.products.map(p => ({
          ...p,
          product: (p.product as any)._id.toString(),
          fabriquant: p.fabriquant || '',
          modele: p.modele || '',
          status: p.status || 'negotiation',
          reference: p.reference || '',
          plageMesure: p.plageMesure || '',
          annee: p.annee || '',
          versionLogiciel: p.versionLogiciel || '',
          autreInformation: p.autreInformation || '',
          addedAt: p.addedAt || new Date()
        })),
      });
    }
  }, [client, reset]);

  const handleAddRegion = async () => {
    try {
      const response = await fetch('/api/regions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRegion),
      });
      
      if (!response.ok) throw new Error('Failed to create region');
      const createdRegion = await response.json();
      setValue('region', createdRegion._id);
      setShowRegionForm(false);
      setNewRegion({ name: '', code: '' });
      refreshClients();
    } catch (error) {
      console.error('Country creation error:', error);
      alert('Failed to create Country');
    }
  };

  const handleUpdateRegion = async () => {
    try {
      const response = await fetch(`/api/regions/${editingRegion?._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRegion),
      });
  
      if (!response.ok) throw new Error('Failed to update region');
      const updatedRegion = await response.json();
      setValue('region', updatedRegion._id);
      setEditingRegion(null);
      setNewRegion({ name: '', code: '' });
      refreshClients();
    } catch (error) {
      console.error('Region update error:', error);
      alert('Failed to update region');
    }
  };

  const handleDeleteRegion = async (regionId: string) => {
    if (!confirm('Delete this Country? Clients using it will need to be updated.')) return;
    try {
      const response = await fetch(`/api/regions/${regionId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete country');
      refreshClients();
    } catch (error) {
      console.error('Deletion error:', error);
      alert('Failed to delete country');
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null); // Reset error state on new submission
  
    try {
      const url = client ? `/api/clients/${client._id}` : '/api/clients';
      const method = client ? 'PUT' : 'POST';
      const cleanedData = {
        name: data.name.trim(), // Trim whitespace from name
        region: data.region,
        products: data.products.map(p => ({
          product: p.product,
          fabriquant: p.fabriquant,
          modele: p.modele,
          status: p.status,
          reference: p.reference,
          plageMesure: p.plageMesure,
          annee: p.annee,
          versionLogiciel: p.versionLogiciel,
          autreInformation: p.autreInformation,
          addedAt: p.addedAt || new Date()
        })),
      };
  
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Operation failed');
      }
  
      refreshClients();
      reset();
      onClose();
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Unknown error');
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
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-[#0b0b0b] rounded-xl p-4 sm:p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-[#ccbeac]"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              {/* Main Header */}
              <div className="sticky -top-6 bg-white dark:bg-[#0b0b0b] z-50 border-b border-[#ccbeac]/30 pt-5">
                <div className="pb-4 sm:pb-6">
                  <div className="flex justify-between items-center pb-3 sm:pb-4 ">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#0b0b0b] dark:text-[#f9f9f4]">
                      {client ? 'Edit Costumer' : 'New Costumer'}
                    </h2>
                    <button type="button" onClick={onClose} className="text-[#0b0b0b] dark:text-[#ccbeac] hover:opacity-75">
                      <XMarkIcon className="h-6 w-6 sm:h-7 sm:w-7" />
                    </button>
                  </div>
                  {submitError && (
      <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
        {submitError}
      </div>
    )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2 sm:space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#0b0b0b] dark:text-[#ccbeac]">Name *</label>
                        <input
                          {...register('name', { required: 'Required field' })}
                          className={`w-full p-2 sm:p-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-[#ccbeac]'} text-sm sm:text-base`}
                        />
                        {errors.name && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#0b0b0b] dark:text-[#ccbeac]">Country *</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Controller
                            name="region"
                            control={control}
                            rules={{ required: 'Select a region' }}
                            render={({ field }) => {
                              const options = regions.map(r => ({
                                value: r._id.toString(),
                                label: `${r.name} (${r.code})`,
                              }));
                              return (
                                <Select
                                  options={options}
                                  value={options.find(o => o.value === field.value)}
                                  onChange={(option) => field.onChange(option?.value || '')}
                                  className="flex-1 w-full"
                                  styles={{
                                    control: (base) => ({
                                      ...base,
                                      borderColor: errors.region ? '#ef4444' : '#ccbeac',
                                      minHeight: '2.5rem',
                                      fontSize: '14px',
                                    }),
                                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                                  }}
                                  menuPortalTarget={document.body}
                                />
                              );
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegionForm(!showRegionForm)}
                            className="bg-[#ccbeac] text-[#0b0b0b] px-3 py-2 sm:py-0 rounded-lg hover:bg-[#ccbeac]/90 transition-colors text-sm sm:text-base"
                          >
                            {showRegionForm ? '×' : '+'}
                          </button>
                        </div>
                        {errors.region && <p className="text-red-500 text-xs sm:text-sm mt-1">Country required</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {showRegionForm && (
                <div className="p-3 sm:p-4 bg-[#f9f9f4] dark:bg-[#1a1a1a] rounded-lg space-y-3">
                  <h3 className="font-medium text-sm sm:text-base">{editingRegion ? 'Edit Country' : 'New Country'}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      placeholder="Country name"
                      value={newRegion.name}
                      onChange={(e) => setNewRegion({ ...newRegion, name: e.target.value })}
                      className="w-full p-2 border border-[#ccbeac] rounded text-sm sm:text-base"
                    />
                    <input
                      placeholder="Country code"
                      value={newRegion.code}
                      onChange={(e) => setNewRegion({ ...newRegion, code: e.target.value.toUpperCase().slice(0, 5) })}
                      className="w-full p-2 border border-[#ccbeac] rounded text-sm sm:text-base"
                      maxLength={5}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={editingRegion ? handleUpdateRegion : handleAddRegion}
                      className="bg-[#ccbeac] text-[#0b0b0b] px-4 py-2 rounded hover:bg-[#ccbeac]/90 flex-1 text-sm sm:text-base"
                    >
                      {editingRegion ? 'Update' : 'Add'} Country
                    </button>
                    {editingRegion && (
                      <button
                        type="button"
                        onClick={() => setEditingRegion(null)}
                        className="px-4 py-2 text-red-500 hover:bg-red-100/20 rounded text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  <div className="pt-4 border-t border-[#ccbeac]">
                    <h4 className="text-sm font-medium mb-2">Existing Countries</h4>
                    <div className="space-y-2">
                      {regions.map(region => (
                        <div key={region._id} className="flex items-center justify-between">
                          <span className="truncate text-sm">{region.name} ({region.code})</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingRegion(region);
                                setNewRegion({ name: region.name, code: region.code });
                              }}
                              className="text-[#ccbeac] hover:text-[#ccbeac]/70 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRegion(region._id)}
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

              {/* Products Header */}
              <div className="sticky top-[136px] bg-white dark:bg-[#0b0b0b] z-40 border-b border-[#ccbeac]/30">
                <div className="pt-4 sm:pt-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                    <h3 className="text-lg font-medium text-[#0b0b0b] dark:text-[#ccbeac]">Products</h3>
                    <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => appendProduct({
                          product: '',
                          fabriquant: '',
                          modele: '',
                          reference: '',
                          plageMesure: '',
                          annee: '',
                          versionLogiciel: '',
                          autreInformation: '',
                          status: 'negotiation',
                          addedAt: new Date(),
                        })}
                        className="bg-[#ccbeac] text-[#0b0b0b] px-4 py-2 rounded-lg hover:bg-[#ccbeac]/90 transition-colors w-full sm:w-auto text-sm sm:text-base"
                      >
                        Add Product
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`bg-green-600 text-white px-4 py-2 rounded-lg text-sm sm:text-base font-medium ${
                          isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                        } w-full sm:w-auto`}
                      >
                        {isSubmitting ? 'Processing...' : client ? 'Update' : 'Create'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products List */}
              <div className="space-y-4 sm:space-y-6">
                {productFields.map((field, productIndex) => (
                  <div key={field.id} className="mb-4 sm:mb-6 p-3 sm:p-4 border border-[#ccbeac] rounded-lg">
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                      <h4 className="font-medium text-sm sm:text-base text-[#0b0b0b] dark:text-[#ccbeac]">
                        Product {productIndex + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeProduct(productIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="sm:col-span-2">
                      <Controller
                          name={`products.${productIndex}.product`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => {
                            const options = products.map(p => ({
                              value: p._id.toString(),
                              label: p.name,
                            }));
                            return (
                              <Select
                                options={options}
                                value={options.find(o => o.value === field.value)}
                                onChange={(option) => field.onChange(option?.value || '')}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    borderColor: '#ccbeac',
                                    minHeight: '2.5rem',
                                    fontSize: '14px',
                                  }),
                                  menuPortal: base => ({ ...base, zIndex: 9999 }),
                                }}
                                menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                              />
                            );
                          }}
                        />
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#0b0b0b] dark:text-[#ccbeac]">Status</label>
                          <select
                            {...register(`products.${productIndex}.status`)}
                            className="w-full p-2 border border-[#ccbeac] rounded-lg text-sm bg-white"
                          >
                            <option value="negotiation" className="bg-gray-200">negotiation</option>
                            <option value="closed-won" className="bg-green-200">closed-won</option>
                            <option value="closed-lost" className="bg-red-200">closed-lost</option>
                            <option value="closed-declined" className="bg-gray-900 text-white">closed-declined</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#0b0b0b] dark:text-[#ccbeac]">Manufacturer</label>
                          <input
                            {...register(`products.${productIndex}.fabriquant`)}
                            className="w-full p-2 border border-[#ccbeac] rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#0b0b0b] dark:text-[#ccbeac]">Model</label>
                          <input
                            {...register(`products.${productIndex}.modele`)}
                            className="w-full p-2 border border-[#ccbeac] rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#0b0b0b] dark:text-[#ccbeac]">Reference</label>
                          <input
                            {...register(`products.${productIndex}.reference`)}
                            className="w-full p-2 border border-[#ccbeac] rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#0b0b0b] dark:text-[#ccbeac]">Measurement Range</label>
                          <input
                            {...register(`products.${productIndex}.plageMesure`)}
                            className="w-full p-2 border border-[#ccbeac] rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#0b0b0b] dark:text-[#ccbeac]">Year</label>
                          <input
                            type="number"
                            {...register(`products.${productIndex}.annee`)}
                            className="w-full p-2 border border-[#ccbeac] rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#0b0b0b] dark:text-[#ccbeac]">Software</label>
                          <input
                            {...register(`products.${productIndex}.versionLogiciel`)}
                            className="w-full p-2 border border-[#ccbeac] rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-[#0b0b0b] dark:text-[#ccbeac]">Other Information</label>
                        <textarea
                          {...register(`products.${productIndex}.autreInformation`)}
                          className="w-full p-2 border border-[#ccbeac] rounded-lg h-24"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}