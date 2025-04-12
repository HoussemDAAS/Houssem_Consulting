/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect, useMemo } from 'react';
import { PrinterIcon } from '@heroicons/react/24/outline';
import FilterSelect from '@/components/FilterSelect';
import { useAuth } from '@/context/AuthContext';
import { ClientDocument } from '@/lib/models/Client';

import RegionPieChart from './RegionPieChart';
import AnalyticsPieChart from './RegionPieChart';
const DashboardBoard = () => {
  const { user } = useAuth();
  // State management
  const [countries, setCountries] = useState<any[]>([]);
  const [allVilles, setAllVilles] = useState<any[]>([]);
  const [clients, setClients] = useState<ClientDocument[]>([]);
  
  // Filter states
  const [selectedCountries, setSelectedCountries] = useState<any[]>([]);
  const [selectedCities, setSelectedCities] = useState<any[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [selectedSecteurs, setSelectedSecteurs] = useState<any[]>([]);

  // Derived state
  const selectedRegionId = useMemo(() => 
    selectedCountries.length === 1 ? selectedCountries[0].value : null,
    [selectedCountries]
  );

  const filteredVilles = useMemo(() => {
    if (!selectedRegionId) return [];
    return allVilles.filter(v => 
      v.region?._id?.toString() === selectedRegionId || 
      v.region?.toString() === selectedRegionId
    );
  }, [selectedRegionId, allVilles]);

  const manufacturers = useMemo(() => {
    const allMfrs = clients.flatMap(c => c.products.map(p => p.fabriquant).filter(Boolean));
    return Array.from(new Set(allMfrs)).map(m => ({ value: m, label: m }));
  }, [clients]);

  // Data fetching
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user?.token) return;

      try {
        const [countriesRes, clientsRes, villesRes] = await Promise.all([
          fetch('/api/regions'),
          fetch(`/api/clients?cache=${Date.now()}`, {
            headers: { Authorization: `Bearer ${user.token}` },
            cache: 'no-store'
          }),
          fetch('/api/villes')
        ]);

        const [countriesData, clientsData, villesData] = await Promise.all([
          countriesRes.json(),
          clientsRes.json(),
          villesRes.json()
        ]);

        setCountries(countriesData);
        setClients(clientsData);
        setAllVilles(villesData);
        setSelectedCountries(countriesData.map(c => ({ value: c._id, label: c.name })));
      } catch (error) {
        console.error('Data fetch error:', error);
      }
    };
    fetchInitialData();
  }, [user?.token]);

  // Effects
  useEffect(() => {
    if (selectedCountries.length !== 1) setSelectedCities([]);
  }, [selectedCountries]);

  
  // Add this color array above the main component

  return (
    <div className="flex flex-col h-full mt-12 md:mt-0">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-[#1a1a1a] z-40 border-b border-[#ccbeac]/30 md:left-64">
        <div className="p-4 md:p-6 ml-14 md:ml-0">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-xl md:text-2xl font-bold text-[#0b0b0b] dark:text-[#f9f9f4] truncate">
              Activity per Login
            </h1>
            <button className="bg-[#ccbeac] hover:bg-[#ccbeac]/90 text-[#0b0b0b] px-4 py-2 rounded-lg flex items-center gap-2 w-full md:w-auto justify-center text-sm md:text-base">
              <PrinterIcon className="h-5 w-5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="pt-[76px] md:pt-[88px] px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <FilterSelect
            label="Country"
            endpoint="/api/regions"
            value={selectedCountries}
            onChange={setSelectedCountries}
            isMulti
            defaultOptions={countries.map(c => ({ value: c._id, label: c.name }))}
          />

          {selectedRegionId && (
            <FilterSelect
              label="City"
              options={filteredVilles.map(v => ({ value: v._id, label: v.name }))}
              value={selectedCities}
              onChange={setSelectedCities}
              isMulti
            />
          )}

          <FilterSelect
            label="Manufacturer"
            options={manufacturers}
            value={selectedManufacturers}
            onChange={setSelectedManufacturers}
            isMulti
          />

          <FilterSelect
            label="Product"
            endpoint="/api/products"
            value={selectedProducts}
            onChange={setSelectedProducts}
            isMulti
          />

          <FilterSelect
            label="Secteur"
            endpoint="/api/secteurs"
            value={selectedSecteurs}
            onChange={setSelectedSecteurs}
            isMulti
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-6">
 
      <AnalyticsPieChart 
    clients={clients}
    countries={countries}
    selectedManufacturers={selectedManufacturers.map(m => m.value)}
    selectedCountries={selectedCountries.map(c => c.value)}
  />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <CountrySection title="Tunis" items={['Maroc', 'Algerie', 'Nigérie']} />
          <CountrySection title="All Cities" items={['Alger', 'Armaba', 'Tunis', 'Bibert']} />
          <CountrySection title="Manufacturers" items={['MMT', 'VMM', 'All Manufacturers']} />
        </div>
      </div>
    </div>
  );
};

const CountrySection = ({ title, items }: { title: string; items: string[] }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
    <h3 className="font-medium mb-2">{title}</h3>
    <div className="space-y-1 text-sm">
      {items.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
    </div>
  </div>
);

export default DashboardBoard;