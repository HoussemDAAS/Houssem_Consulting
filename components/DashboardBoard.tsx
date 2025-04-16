/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { PrinterIcon } from '@heroicons/react/24/outline';
import FilterSelect from '@/components/FilterSelect';
import { useAuth } from '@/context/AuthContext';
import { ClientDocument } from '@/lib/models/Client';
import { RegionDocument } from '@/lib/models/Region';
import AnalyticsPieChart, { LocationChartData } from './RegionPieChart';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface FilterOption {
  value: string;
  label: string;
}

const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 65%, 45%)`;
};

const DashboardBoard = () => {
  const { user } = useAuth();
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // State management
  const [countries, setCountries] = useState<RegionDocument[]>([]);
  const [villes, setVilles] = useState<any[]>([]);
  const [clients, setClients] = useState<ClientDocument[]>([]);
  
  // Filter states
  const [selectedCountries, setSelectedCountries] = useState<FilterOption[]>([]);
  const [selectedCities, setSelectedCities] = useState<FilterOption[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<FilterOption[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<FilterOption[]>([]);
  const [selectedSecteurs, setSelectedSecteurs] = useState<FilterOption[]>([]);

  // Derived values
  const selectedRegionId = useMemo(() => 
    selectedCountries.length === 1 ? selectedCountries[0].value : null,
    [selectedCountries]
  );

  const filteredVilles = useMemo(() => {
    if (!selectedRegionId) return [];
    return villes.filter(v => 
      v.region?._id?.toString() === selectedRegionId || 
      v.region?.toString() === selectedRegionId
    );
  }, [selectedRegionId, villes]);

  const manufacturers = useMemo(() => {
    const allMfrs = clients.flatMap(c => 
      c.products.map(p => p.fabriquant).filter(Boolean) as string[]
    );
    return Array.from(new Set(allMfrs)).map(m => ({ value: m, label: m }));
  }, [clients]);

  // PDF Generation
  const handleExportPDF = async () => {
    if (!pdfRef.current) return;
    
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pages = pdfRef.current.children;
  
      for (let i = 0; i < pages.length; i++) {
        if (i > 0) pdf.addPage();
        
        const canvas = await html2canvas(pages[i] as HTMLElement, {
          scale: 2,
          useCORS: true,
          windowWidth: 210 * 3.78,
          windowHeight: 297 * 3.78
        });

        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      }

      pdf.save('analytics-report.pdf');
    } catch (error) {
      console.error('PDF generation error:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

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
        setVilles(villesData);
        setSelectedCountries(countriesData.map((c: RegionDocument) => ({ 
          value: c._id.toString(), 
          label: c.name 
        })));
      } catch (error) {
        console.error('Data fetch error:', error);
      }
    };
    fetchInitialData();
  }, [user?.token]);

  useEffect(() => {
    if (selectedCountries.length !== 1) setSelectedCities([]);
  }, [selectedCountries]);

  // Check if any data exists
  const hasData = useMemo(() => {
    return clients.some(client => client.products.length > 0);
  }, [clients]);

  const getLocationData = (): LocationChartData[] => {
    const useCityFilter = selectedCities.length > 0;
    const selectedLocationIds = useCityFilter 
      ? selectedCities.map(c => c.value)
      : selectedCountries.map(c => c.value);

    if (selectedLocationIds.length === 0) return [];

    const validManufacturers = selectedManufacturers.map(m => m.value);
    const locationMap = new Map<string, Map<string, number>>(
      selectedLocationIds.map(locationId => [
        locationId,
        new Map(validManufacturers.map(m => [m, 0]))
  ]));

    clients.forEach(client => {
      const locationId = useCityFilter 
        ? client.ville?._id?.toString() || client.ville?.toString()
        : client.region?._id?.toString() || client.region?.toString();

      if (locationId && selectedLocationIds.includes(locationId)) {
        client.products.forEach(product => {
          const manufacturer = product.fabriquant;
          if (manufacturer && validManufacturers.includes(manufacturer)) {
            const counts = locationMap.get(locationId)!;
            counts.set(manufacturer, (counts.get(manufacturer) || 0) + 1);
          }
        });
      }
    });

    return selectedLocationIds.map(locationId => {
      const manufacturers = locationMap.get(locationId)!;
      const total = Array.from(manufacturers.values()).reduce((a, b) => a + b, 0);
      
      return {
        locationName: useCityFilter
          ? villes.find(v => v._id === locationId)?.name || locationId
          : countries.find(c => c._id === locationId)?.name || locationId,
        data: validManufacturers
          .map(m => ({
            name: m,
            value: total > 0 ? Number(((manufacturers.get(m)! / total) * 100).toFixed(2)) : 0
          }))
          .filter(d => d.value > 0)
          .sort((a, b) => b.value - a.value)
      };
    });
  };

  const locationData = getLocationData();

  return (
    <div className="flex flex-col h-full mt-12 md:mt-0">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-[#1a1a1a] z-40 border-b border-[#ccbeac]/30 md:left-64">
        <div className="p-4 md:p-6 ml-14 md:ml-0">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-xl md:text-2xl font-bold text-[#0b0b0b] dark:text-[#f9f9f4] truncate">
              Sales Analytics Dashboard
            </h1>
            <button 
              onClick={handleExportPDF}
              disabled={isGeneratingPDF}
              className="bg-[#ccbeac] hover:bg-[#ccbeac]/90 text-[#0b0b0b] px-4 py-2 rounded-lg flex items-center gap-2 w-full md:w-auto justify-center text-sm md:text-base transition-all disabled:opacity-50"
            >
              <PrinterIcon className="h-5 w-5" />
              {isGeneratingPDF ? 'Generating...' : 'Export PDF'}
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
            defaultOptions={countries.map(c => ({ 
              value: c._id.toString(), 
              label: c.name 
            }))}
          />

          {selectedRegionId && (
            <FilterSelect
              label="City"
              options={filteredVilles.map(v => ({ 
                value: v._id.toString(), 
                label: v.name 
              }))}
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

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-6">
        {!hasData ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            No data available in the system
          </div>
        ) : (
          <AnalyticsPieChart 
            clients={clients}
            countries={countries}
            villes={villes}
            selectedManufacturers={selectedManufacturers.map(m => m.value)}
            selectedCountries={selectedCountries.map(c => c.value)}
            selectedCities={selectedCities.map(c => c.value)}
            isPDFVersion={false}
          />
        )}
      </div>

      {/* PDF Template */}
      <div ref={pdfRef} className="absolute left-[-10000px] top-[-10000px]">
  {Array.from({ length: Math.ceil(locationData.length / 2) }).map((_, index) => {
    const start = index * 2;
    const end = start + 2;
    const pageData = locationData.slice(start, end);

    return (
      <div key={index} className="w-[210mm] h-[297mm] bg-white p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/logo.jpeg" alt="Company Logo" className="h-24 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Sales Analytics Report</h1>
          <p className="text-gray-500 text-sm mt-2">
            Generated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Filters - Only on first page */}
        {index === 0 && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Selected Filters</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Countries:</strong> {selectedCountries.map(c => c.label).join(', ') || 'All'}</div>
              <div><strong>Cities:</strong> {selectedCities.map(c => c.label).join(', ') || 'All'}</div>
              <div><strong>Manufacturers:</strong> {selectedManufacturers.map(m => m.label).join(', ') || 'All'}</div>
              <div><strong>Products:</strong> {selectedProducts.map(p => p.label).join(', ') || 'All'}</div>
              <div><strong>Sectors:</strong> {selectedSecteurs.map(s => s.label).join(', ') || 'All'}</div>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-2 gap-4 h-[190mm]">
          {pageData.map(({ locationName, data }) => (
            <div key={locationName} className="h-full">
              <div className="h-[420px]">
                <h3 className="text-center text-gray-800 text-sm mb-1">
                  {locationName}
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                          <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            dataKey="value"
                            nameKey="name"
                          >
                            {data.map((entry, idx) => (
                              <Cell 
                                key={`cell-${idx}`}
                                fill={stringToColor(entry.name)}
                                stroke="#fff"
                              />
                            ))}
                          </Pie>
                          <Legend
                            layout="horizontal"
                            verticalAlign="bottom"
                            wrapperStyle={{ paddingTop: 10 }}
                            content={({ payload }) => (
                              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                                {payload?.map((entry, idx) => (
                                  <div
                                    key={`legend-${idx}`}
                                    className="flex items-center text-xs"
                                    style={{ color: entry.color }}
                                  >
                                    <span 
                                      className="inline-block w-3 h-3 mr-2 rounded-full"
                                      style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="whitespace-normal">
                                      {entry.value} • {entry.payload?.value.toFixed(1)}%
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          />
                        </PieChart>
                      </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>

        {/* Page number */}
        <div className="mt-4 text-center text-sm text-gray-500">
          Page {index + 1} of {Math.ceil(locationData.length / 2)}
        </div>
      </div>
    );
  })}
</div>
    </div>
  );
};

export default DashboardBoard;