/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { PrinterIcon } from '@heroicons/react/24/outline';
import FilterSelect from '@/components/FilterSelect';
import { useAuth } from '@/context/AuthContext';
import { ClientDocument, ClientProduct } from '@/lib/models/Client';
import { RegionDocument } from '@/lib/models/Region';
import { ProductDocument } from '@/lib/models/Product';
import AnalyticsPieChart, { LocationChartData } from './RegionPieChart';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface PopulatedClient extends Omit<ClientDocument, 'region' | 'ville' | 'secteur' | 'products'> {
  region: RegionDocument;
  ville?: { _id: string; name: string };
  secteur?: { _id: string; name: string };
  products: (Omit<ClientProduct, 'product'> & { product: ProductDocument })[];
}

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

const formatFilterList = (items: FilterOption[]) => {
  if (items.length === 0) return 'All';
  if (items.length > 5) return `${items.slice(0, 5).map(i => i.label).join(', ')}... (+${items.length - 5})`;
  return items.map(i => i.label).join(', ');
};

const DashboardBoard = () => {
  const { user } = useAuth();
  const pdfRef = useRef<HTMLDivElement>(null);
  const hasInitializedFilters = useRef(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // State management
  const [countries, setCountries] = useState<RegionDocument[]>([]);
  const [villes, setVilles] = useState<any[]>([]);
  const [clients, setClients] = useState<PopulatedClient[]>([]);
  
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

  // --- DYNAMIC FILTER OPTIONS ---

  // 1. Filter Clients by Location first (Base for other filters)
  const clientsInLocation = useMemo(() => {
    const useCityFilter = selectedCities.length > 0;
    const selectedLocationIds = useCityFilter 
      ? selectedCities.map(c => c.value)
      : selectedCountries.map(c => c.value);

    if (selectedLocationIds.length === 0) return clients; 

    return clients.filter(client => {
      const locationId = useCityFilter 
        ? client.ville?._id?.toString() || client.ville?.toString()
        : client.region?._id?.toString() || client.region?.toString();
      return locationId && selectedLocationIds.includes(locationId);
    });
  }, [clients, selectedCountries, selectedCities]);

  const availableProducts = useMemo(() => {
  
    const validManufacturers = selectedManufacturers.map(m => m.value);

    const relevantProducts = clientsInLocation.flatMap(c => 
      c.products.filter(p => {
        if (validManufacturers.length > 0) {
           return p.fabriquant && validManufacturers.includes(p.fabriquant);
        }
        return true;
      })
    );

    // Deduplicate products by ID
    const uniqueProductsMap = new Map();
    relevantProducts.forEach(p => {
      const prodRef: any = p.product;
      if (!prodRef) return;
      
      let id, name;
      if (prodRef._id) {
        id = prodRef._id.toString();
        name = prodRef.name;
      } else if (typeof prodRef === 'string') {
        id = prodRef;
        name = prodRef; 
      }

      if (id && !uniqueProductsMap.has(id)) {
        uniqueProductsMap.set(id, { value: id, label: name });
      }
    });

    return Array.from(uniqueProductsMap.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [clientsInLocation, selectedManufacturers]);

  // 3. Available Manufacturers (based on Location AND Selected Products)
  const availableManufacturers = useMemo(() => {
    const validProductIds = selectedProducts.map(p => p.value);

    const allMfrs = clientsInLocation.flatMap(c => 
      c.products.filter(p => {
        if (validProductIds.length > 0) {
          const prodRef: any = p.product;
          const pId = prodRef?._id?.toString() || prodRef?.toString();
          return pId && validProductIds.includes(pId);
        }
        return true;
      }).map(p => p.fabriquant).filter(Boolean) as string[]
    );

    return Array.from(new Set(allMfrs))
      .sort()
      .map(m => ({ value: m, label: m }));
  }, [clientsInLocation, selectedProducts]);

  // 4. Available Secteurs (based on Location)
  const availableSecteurs = useMemo(() => {
    const uniqueSecteursMap = new Map();
    clientsInLocation.forEach(client => {
      const secRef: any = client.secteur;
      if (!secRef) return;

      let id, name;
      if (secRef._id) {
        id = secRef._id.toString();
        name = secRef.name;
      } else if (typeof secRef === 'string') {
        id = secRef;
        name = 'Unknown Sector'; 
      }

      if (id && !uniqueSecteursMap.has(id)) {
        uniqueSecteursMap.set(id, { value: id, label: name });
      }
    });

    return Array.from(uniqueSecteursMap.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [clientsInLocation]);


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
        } as Parameters<typeof html2canvas>[1]);

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
        
        // Set default filters - NONE (User request: "nothing to be selected by default")
        // setSelectedCountries(countriesData.map((c: RegionDocument) => ({ 
        //   value: c._id.toString(), 
        //   label: c.name 
        // })));
        setSelectedCountries([]); // Start empty

        // Manufacturers and Sectors start EMPTY
        setSelectedManufacturers([]);
        setSelectedSecteurs([]);

        // Products will be selected in a separate useEffect once clients are loaded
 
       } catch (error) {
        console.error('Data fetch error:', error);
      }
    };
    fetchInitialData();
  }, [user?.token]);

  useEffect(() => {
    if (selectedCountries.length !== 1) setSelectedCities([]);
  }, [selectedCountries]);

  // When Products change, automatically select ALL associated Manufacturers
  useEffect(() => {
    if (selectedProducts.length > 0) {
      const validProductIds = selectedProducts.map(p => p.value);
      
      const relatedManufacturers = clientsInLocation.flatMap(c => 
        c.products.filter(p => {
          const prodRef: any = p.product;
          const pId = prodRef?._id?.toString() || prodRef?.toString();
          return pId && validProductIds.includes(pId);
        }).map(p => p.fabriquant).filter(Boolean) as string[]
      );

      const uniqueManufacturers = Array.from(new Set(relatedManufacturers))
        .sort()
        .map(m => ({ value: m, label: m }));

      setSelectedManufacturers(uniqueManufacturers);
    } else {
      // If no products selected, reset manufacturers? 
      // User said "nothing to be selected by default", so let's clear it.
      setSelectedManufacturers([]);
    }
  }, [selectedProducts, clientsInLocation]); // Depend on clientsInLocation to ensure we have data

  // Initialize Product Selection once clients are loaded
  // REMOVED: User requested "nothing to be selected by default"
  /*
  useEffect(() => {
    if (clients.length > 0 && !hasInitializedFilters.current) {
        // ... (removed auto-select logic)
    }
  }, [clients]);
  */

  // Check if any data exists
  const hasData = useMemo(() => {
    // Show data only if at least one location is selected (as per "nothing selected by default")
    return selectedCountries.length > 0;
  }, [selectedCountries]);

  const getLocationData = (): LocationChartData[] => {
    const useCityFilter = selectedCities.length > 0;
    const selectedLocationIds = useCityFilter 
      ? selectedCities.map(c => c.value)
      : selectedCountries.map(c => c.value);

    if (selectedLocationIds.length === 0) return [];

    const validManufacturers = selectedManufacturers.map(m => m.value);
    const validProducts = selectedProducts.map(p => p.value);
    const validSecteurs = selectedSecteurs.map(s => s.value);

    // Initialize map: LocationID -> ProductName -> ManufacturerName -> Count
    const locationMap = new Map<string, Map<string, Map<string, number>>>(
      selectedLocationIds.map(locationId => [
        locationId,
        new Map<string, Map<string, number>>()
      ])
    );

    clients.forEach(client => {
      // 1. Filter by Location
      const locationId = useCityFilter 
        ? client.ville?._id?.toString() || client.ville?.toString()
        : client.region?._id?.toString() || client.region?.toString();

      if (!locationId || !selectedLocationIds.includes(locationId)) return;

      // 2. Filter by Secteur
      if (validSecteurs.length > 0) {
        const clientSecteurId = client.secteur?._id?.toString() || client.secteur?.toString();
        if (!clientSecteurId || !validSecteurs.includes(clientSecteurId)) return;
      }

      // 3. Process Products
      client.products.forEach(product => {
        const prodRef: any = product.product;
        if (!prodRef) return;

        let productId: string | undefined;
        let productName: string | undefined;

        if (prodRef._id) {
          productId = prodRef._id.toString();
          productName = prodRef.name;
        } else if (typeof prodRef === 'string') {
          productId = prodRef;
          productName = prodRef;
        }

        if (!productId || !productName) return;

        // REQUIRE explicit product selection - if no products selected, skip all
        if (validProducts.length === 0) return;

        // Filter by Product - only include selected products
        if (!validProducts.includes(productId)) return;

        // Filter by Manufacturer if selected
        const manufacturer = product.fabriquant || 'Unknown';
        if (validManufacturers.length > 0 && !validManufacturers.includes(manufacturer)) return;

        // Add to nested map
        const locMap = locationMap.get(locationId)!;
        if (!locMap.has(productName)) {
          locMap.set(productName, new Map<string, number>());
        }
        const prodMap = locMap.get(productName)!;
        prodMap.set(manufacturer, (prodMap.get(manufacturer) || 0) + 1);
      });
    });

    // Convert to chart data format matching LocationChartData interface
    return selectedLocationIds.map(locationId => {
      const locMap = locationMap.get(locationId)!;
      
      const locationName = useCityFilter
        ? villes.find(v => v._id === locationId)?.name || locationId
        : countries.find(c => c._id === locationId)?.name || locationId;

      const products = Array.from(locMap.entries()).map(([pName, mfrMap]) => {
        const totalItems = Array.from(mfrMap.values()).reduce((sum, count) => sum + count, 0);
        
        const data = Array.from(mfrMap.entries())
          .map(([mName, count]) => ({
            name: mName,
            value: totalItems > 0 ? Number(((count / totalItems) * 100).toFixed(2)) : 0
          }))
          .filter(item => item.value > 0)
          .sort((a, b) => b.value - a.value);
          
        return { productName: pName, data };
      }).filter(p => p.data.length > 0);

      return { locationName, products };
    });
  };

  const locationData = getLocationData();

  return (
    <div className="flex flex-col h-full mt-12 md:mt-0 relative">
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
          {/* 1. COUNTRY - Primary */}
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

          {/* 2. PRODUCT - Primary */}
          <FilterSelect
            label="Product"
            options={availableProducts}
            value={selectedProducts}
            onChange={setSelectedProducts}
            isMulti
          />

          {/* 3. MANUFACTURER - Primary */}
          <FilterSelect
            label="Manufacturer"
            options={availableManufacturers}
            value={selectedManufacturers}
            onChange={setSelectedManufacturers}
            isMulti
          />

          {/* 4. CITY - Secondary (optional, only when one country selected) */}
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

          {/* 5. SECTEUR - Secondary (optional) */}
          <FilterSelect
            label="Secteur"
            options={availableSecteurs}
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
            selectedProducts={selectedProducts.map(p => p.value)}
            selectedSecteurs={selectedSecteurs.map(s => s.value)}
            isPDFVersion={false}
          />
        )}
      </div>

      {/* PDF Template - COMPACT VERSION - No wasted space */}
      <div ref={pdfRef} className="absolute left-[-10000px] top-[-10000px]">
        {/* Data Pages - Multiple products per page */}
        {locationData.map((location, locIndex) => (
          <div key={locIndex} className="w-[210mm] h-[297mm] bg-white p-6 flex flex-col">
            {/* Page Header - Compact on first page with filters */}
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <div className="flex items-center gap-3">
                <img src="/logo.jpeg" alt="Logo" className="h-10" />
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Sales Analytics Report</h1>
                  <p className="text-xs text-gray-500">Manufacturer Market Share by Product</p>
                </div>
              </div>
              <div className="text-right text-xs text-gray-400">
                <p>Page {locIndex + 1} of {locationData.length}</p>
                <p>{new Date().toLocaleDateString('fr-FR')}</p>
              </div>
            </div>

            {/* Filters - Only on first page, compact inline */}
            {locIndex === 0 && (
              <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200 text-[10px]">
                <div className="grid grid-cols-2 gap-2">
                  <div><span className="font-bold">Countries:</span> {selectedCountries.map(c => c.label).join(', ') || 'All'}</div>
                  {selectedCities.length > 0 && <div><span className="font-bold">Cities:</span> {selectedCities.map(c => c.label).join(', ')}</div>}
                  <div className="col-span-2"><span className="font-bold">Products:</span> {selectedProducts.map(p => p.label).join(', ') || 'None'}</div>
                  <div><span className="font-bold">Manufacturers:</span> {selectedManufacturers.map(m => m.label).join(', ') || 'All'}</div>
                  {selectedSecteurs.length > 0 && <div><span className="font-bold">Sectors:</span> {selectedSecteurs.map(s => s.label).join(', ')}</div>}
                </div>
              </div>
            )}

            {/* Location Title */}
            <h2 className="text-lg font-bold text-[#ccbeac] border-b pb-2 mb-4">{location.locationName}</h2>

            {/* Products Grid - Compact, auto-sized */}
            <div className="grid grid-cols-3 gap-3 auto-rows-min">
              {location.products.map((product, pIdx) => (
                <div key={pIdx} className="border rounded p-2 bg-gray-50/50">
                  {/* Product Title */}
                  <h3 className="text-[10px] font-bold text-center mb-2 text-gray-800 border-b pb-1">
                    {product.productName}
                  </h3>
                  
                  {/* Chart + Table side by side */}
                  <div className="flex gap-2">
                    {/* Chart - Small and compact */}
                    <div className="w-[60px] h-[60px] flex-shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={product.data}
                            cx="50%"
                            cy="50%"
                            innerRadius={15}
                            outerRadius={28}
                            paddingAngle={1}
                            dataKey="value"
                            nameKey="name"
                            isAnimationActive={false}
                          >
                            {product.data.map((entry, idx) => (
                              <Cell 
                                key={`cell-${idx}`}
                                fill={stringToColor(entry.name)}
                                strokeWidth={0.5}
                                stroke="#fff"
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {/* Table - Show ALL manufacturers, NO truncation */}
                    <div className="flex-1 text-[8px]">
                      {product.data.map((entry, idx) => (
                        <div key={idx} className="flex justify-between py-0.5">
                          <div className="flex items-center gap-1">
                            <div 
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0" 
                              style={{ backgroundColor: stringToColor(entry.name) }} 
                            />
                            <span>{entry.name}</span>
                          </div>
                          <span className="font-medium ml-1">{entry.value.toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Page Footer */}
            <div className="mt-auto pt-4 border-t flex justify-between text-[10px] text-gray-400">
              <span>Houssem Consulting - Confidential</span>
              <span>© {new Date().getFullYear()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardBoard;