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
          scale: 2 as any,
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
        
        // Set default filters
        setSelectedCountries(countriesData.map((c: RegionDocument) => ({ 
          value: c._id.toString(), 
          label: c.name 
        })));

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

  // Initialize Product Selection once clients are loaded
  useEffect(() => {
    if (clients.length > 0 && !hasInitializedFilters.current) {
        const allProducts = new Map();
        clients.forEach((c: any) => {
           c.products.forEach((p: any) => {
             const prodRef = p.product;
             if (!prodRef) return;
             
             let id, name;
             if (prodRef._id) {
               id = prodRef._id.toString();
               name = prodRef.name;
             } else if (typeof prodRef === 'string') {
               id = prodRef;
               name = prodRef;
             }
             
             if (id && !allProducts.has(id)) {
               allProducts.set(id, { value: id, label: name });
             }
           });
        });

        const productsArray = Array.from(allProducts.values()).sort((a: any, b: any) => a.label.localeCompare(b.label));
        
        if (productsArray.length > 0) {
            setSelectedProducts(productsArray);
            hasInitializedFilters.current = true;
        }
    }
  }, [clients]);

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
    const validProducts = selectedProducts.map(p => p.value);
    const validSecteurs = selectedSecteurs.map(s => s.value);

    // Initialize map with Location IDs
    // Map: LocationID -> ProductName -> Count
    const locationMap = new Map<string, Map<string, number>>(
      selectedLocationIds.map(locationId => [
        locationId,
        new Map<string, number>()
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
          productName = prodRef; // Fallback
        }

        if (!productId || !productName) return;

        // --- FILTERING LOGIC ---
        let shouldCount = false;

        // Filter by Product (Primary)
        if (validProducts.length > 0) {
          if (validProducts.includes(productId)) {
            shouldCount = true;
          }
        } else {
          // If no product selected, show all (or filter by manufacturer if selected)
          shouldCount = true;
        }

        // Filter by Manufacturer (Secondary)
        if (shouldCount && validManufacturers.length > 0) {
          const manufacturer = product.fabriquant;
          if (!manufacturer || !validManufacturers.includes(manufacturer)) {
            shouldCount = false;
          }
        }

        if (shouldCount) {
          const counts = locationMap.get(locationId)!;
          // AGGREGATE BY PRODUCT NAME
          counts.set(productName, (counts.get(productName) || 0) + 1);
        }
      });
    });

    return selectedLocationIds.map(locationId => {
      const productsMap = locationMap.get(locationId)!;
      const total = Array.from(productsMap.values()).reduce((a, b) => a + b, 0);
      
      const foundProducts = Array.from(productsMap.keys());

      return {
        locationName: useCityFilter
          ? villes.find(v => v._id === locationId)?.name || locationId
          : countries.find(c => c._id === locationId)?.name || locationId,
        data: foundProducts
          .map(pName => ({
            name: pName,
            value: total > 0 ? Number(((productsMap.get(pName)! / total) * 100).toFixed(2)) : 0
          }))
          .filter(d => d.value > 0)
          .sort((a, b) => b.value - a.value)
      };
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

          {/* SWAPPED: Product before Manufacturer */}
          <FilterSelect
            label="Product"
            options={availableProducts}
            value={selectedProducts}
            onChange={setSelectedProducts}
            isMulti
          />

          <FilterSelect
            label="Manufacturer"
            options={availableManufacturers}
            value={selectedManufacturers}
            onChange={setSelectedManufacturers}
            isMulti
          />

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

      {/* PDF Template */}
      <div ref={pdfRef} className="absolute left-[-10000px] top-[-10000px]">
        {/* We use 2 locations per page to save space */}
        {Array.from({ length: Math.ceil(locationData.length / 2) }).map((_, pageIndex) => {
          const pageLocations = locationData.slice(pageIndex * 2, pageIndex * 2 + 2);
          
          return (
            <div key={pageIndex} className="w-[210mm] h-[297mm] bg-white p-8 flex flex-col">
              {/* Page Header */}
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <div className="flex items-center gap-3">
                  <img src="/logo.jpeg" alt="Company Logo" className="h-12" />
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">Sales Analytics Report</h1>
                    <p className="text-gray-500 text-xs">
                      Generated: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  Page {pageIndex + 1} of {Math.ceil(locationData.length / 2)}
                </div>
              </div>

              {/* Filters - Only on first page, compact */}
              {pageIndex === 0 && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="text-xs font-semibold mb-1 text-gray-700">Filters</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                    <div><span className="font-medium">Countries:</span> {formatFilterList(selectedCountries)}</div>
                    <div><span className="font-medium">Cities:</span> {formatFilterList(selectedCities)}</div>
                    <div className="col-span-2"><span className="font-medium">Products:</span> {formatFilterList(selectedProducts)}</div>
                    <div><span className="font-medium">Manufacturers:</span> {formatFilterList(selectedManufacturers)}</div>
                    <div><span className="font-medium">Sectors:</span> {formatFilterList(selectedSecteurs)}</div>
                  </div>
                </div>
              )}

              {/* Content: 2 Locations per page */}
              <div className="flex-1 flex flex-col gap-6">
                {pageLocations.map((location, locIndex) => (
                  <div key={locIndex} className="flex-1 border-b last:border-0 pb-4 last:pb-0 flex flex-col gap-2">
                    <h2 className="text-lg font-bold text-[#ccbeac]">{location.locationName}</h2>
                    
                    <div className="flex gap-4 h-full">
                      {/* Left: Chart */}
                      <div className="w-[40%] h-[220px] border border-gray-100 rounded-lg bg-gray-50/30 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={location.data}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={70}
                              paddingAngle={2}
                              dataKey="value"
                              nameKey="name"
                              isAnimationActive={false}
                            >
                              {location.data.map((entry, idx) => (
                                <Cell 
                                  key={`cell-${idx}`}
                                  fill={stringToColor(entry.name)}
                                  strokeWidth={1}
                                  stroke="#fff"
                                />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Right: Table */}
                      <div className="w-[60%] overflow-hidden">
                        <table className="w-full text-[10px] text-left">
                          <thead className="bg-gray-100 text-gray-700 font-semibold">
                            <tr>
                              <th className="py-1 px-2 border-b w-8"></th>
                              <th className="py-1 px-2 border-b">Product</th>
                              <th className="py-1 px-2 border-b text-right">Share</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {location.data.map((entry, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="py-1 px-2">
                                  <div 
                                    className="w-2.5 h-2.5 rounded-full border border-gray-200"
                                    style={{ backgroundColor: stringToColor(entry.name) }}
                                  />
                                </td>
                                <td className="py-1 px-2 text-gray-800 truncate max-w-[150px]">
                                  {entry.name}
                                </td>
                                <td className="py-1 px-2 text-right font-mono text-gray-600">
                                  {entry.value.toFixed(1)}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-auto pt-4 border-t flex justify-between text-[10px] text-gray-400">
                <span>Houssem Consulting</span>
                <span>{new Date().getFullYear()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardBoard;