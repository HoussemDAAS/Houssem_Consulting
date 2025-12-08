/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';
import { ClientDocument, ClientProduct } from '@/lib/models/Client';
import { RegionDocument } from '@/lib/models/Region';
import { ProductDocument } from '@/lib/models/Product';

interface PopulatedClient extends Omit<ClientDocument, 'region' | 'ville' | 'secteur' | 'products'> {
  region: RegionDocument;
  ville?: { _id: string; name: string };
  secteur?: { _id: string; name: string };
  products: (Omit<ClientProduct, 'product'> & { product: ProductDocument })[];
}

interface ChartData {
  name: string;
  value: number;
}

export interface LocationChartData {
  locationName: string;
  data: ChartData[];
}

interface AnalyticsPieChartProps {
  clients: PopulatedClient[];
  countries: RegionDocument[];
  villes: any[];
  selectedManufacturers: string[];
  selectedCountries: string[];
  selectedCities: string[];
  selectedProducts: string[];
  selectedSecteurs: string[];
  isPDFVersion: boolean
}

const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 65%, 45%)`;
};

const AnalyticsPieChart = ({
  clients,
  countries,
  villes,
  selectedManufacturers,
  selectedCountries,
  selectedCities,
  selectedProducts = [],
  selectedSecteurs = [],
  isPDFVersion = false
}: AnalyticsPieChartProps) => {
  const useCityFilter = selectedCities.length > 0;

  const getChartData = (): LocationChartData[] => {
    // Get all selected location IDs
    const selectedLocationIds = useCityFilter ? selectedCities : selectedCountries;
    if (selectedLocationIds.length === 0) return [];

    // Initialize location map with all selected locations
    // Map: LocationID -> Map<ItemName, Count>
    const locationMap = new Map<string, Map<string, number>>(
      selectedLocationIds.map(locationId => [
        locationId,
        new Map<string, number>()
      ])
    );

    // Populate the counts
    clients.forEach(client => {
      // 1. Filter by Location
      const locationId = useCityFilter 
        ? client.ville?._id?.toString() || client.ville?.toString()
        : client.region?._id?.toString() || client.region?.toString();

      if (!locationId || !selectedLocationIds.includes(locationId)) return;

      // 2. Filter by Secteur
      // If products are selected, we IGNORE the sector filter to ensure the product is shown
      // Otherwise, we respect the sector filter
      if (selectedProducts.length === 0 && selectedSecteurs.length > 0) {
        const clientSecteurId = client.secteur?._id?.toString() || client.secteur?.toString();
        // If client has no sector or sector not selected, skip
        if (!clientSecteurId || !selectedSecteurs.includes(clientSecteurId)) return;
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

        // --- FILTERING LOGIC ---
        let shouldCount = false;

        // 1. If Manufacturer is Selected: Filter by it
        if (selectedManufacturers.length > 0) {
           const manufacturer = product.fabriquant;
           if (manufacturer && selectedManufacturers.includes(manufacturer)) {
              // If manufacturer matches, we consider showing it
              // BUT if specific products are ALSO selected, we need to respect that intersection
              if (selectedProducts.length > 0) {
                 if (selectedProducts.includes(productId)) {
                    shouldCount = true;
                 }
              } else {
                 shouldCount = true;
              }
           }
        } 
        // 2. If Secteur is Selected (and no Manufacturer selected): Filter by it
        else if (selectedSecteurs.length > 0) {
             // We already filtered by Sector at the client level (Step 2 above)
             // So here we just need to check if product matches selected products (if any)
             if (selectedProducts.length > 0) {
                 if (selectedProducts.includes(productId)) {
                    shouldCount = true;
                 }
             } else {
                 shouldCount = true;
             }
        }
        // 3. If ONLY Products are Selected (Default State): Show selected products
        else if (selectedProducts.length > 0) {
           if (selectedProducts.includes(productId)) {
             shouldCount = true;
           }
        }
        // 4. Fallback: No filters selected (Shouldn't happen with default All Products)
        else {
           shouldCount = true;
        }

        if (shouldCount) {
           const locationCounts = locationMap.get(locationId)!;
           locationCounts.set(productName, (locationCounts.get(productName) || 0) + 1);
        }
      });
    });

    // Convert to chart data format
    return selectedLocationIds.map(locationId => {
      const itemsMap = locationMap.get(locationId)!;
      const totalItems = Array.from(itemsMap.values()).reduce((sum, count) => sum + count, 0);
      
      const locationName = useCityFilter
        ? villes.find(v => v._id === locationId)?.name || locationId
        : countries.find(c => c._id === locationId)?.name || locationId;

      const data = Array.from(itemsMap.entries())
        .map(([name, count]) => ({
          name: name,
          value: totalItems > 0 
            ? Number(((count / totalItems) * 100).toFixed(2))
            : 0,
        }))
        .filter(item => item.value > 0)
        .sort((a, b) => b.value - a.value);

      return { locationName, data };
    });
  };

  const locationData = getChartData();
  const hasLocationSelection = selectedCities.length > 0 || selectedCountries.length > 0;
  const noData = locationData.every(l => l.data.length === 0);

  // First check if manufacturers are selected
  // REMOVED CHECK: if (selectedManufacturers.length === 0)
  
  if (!hasLocationSelection) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6 h-[400px] flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Please select at least one location to view the chart
        </p>
      </div>
    );
  }

  if (noData) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6 h-[400px] flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          No data found for selected manufacturers in these locations
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-6">
        {useCityFilter ? 'City Distribution' : 'Regional Distribution'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {locationData.map(({ locationName, data }) => (
          <div key={locationName} className="flex flex-col h-full border border-gray-100 dark:border-gray-700 rounded-xl p-4">
            <h3 className="text-center font-medium text-gray-800 dark:text-gray-200 mb-4">
              {locationName}
            </h3>
            
            <div className={`flex ${isPDFVersion ? 'flex-col items-center' : 'flex-col lg:flex-row items-center'} gap-4 h-full`}>
              {/* Chart Section */}
              <div className={`${isPDFVersion ? 'w-full h-[300px]' : 'w-full lg:w-1/2 h-[250px] lg:h-[300px]'}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                    >
                      {data.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`}
                          fill={stringToColor(entry.name)}
                          strokeWidth={0}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        return (
                          <div className="bg-gray-800/95 backdrop-blur-sm text-white p-3 rounded-lg shadow-xl text-xs border border-gray-700">
                            <p className="font-medium mb-1">{payload[0].name}</p>
                            <div className="flex justify-between gap-4">
                              <span className="text-gray-300">Share:</span>
                              <span className="font-bold">{payload[0].value?.toFixed(1)}%</span>
                            </div>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom Legend Section */}
              <div className={`${
                isPDFVersion 
                  ? 'w-full' 
                  : 'w-full lg:w-1/2 max-h-[200px] lg:max-h-[300px] overflow-y-auto pr-2 custom-scrollbar'
              }`}>
                <div className={`flex flex-wrap gap-2 ${isPDFVersion ? 'justify-center' : 'lg:flex-col lg:justify-start'}`}>
                  {data.map((entry, index) => (
                    <div
                      key={`legend-${index}`}
                      className={`flex items-center gap-2 text-xs p-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        isPDFVersion ? 'border border-gray-100' : ''
                      }`}
                      title={entry.name}
                    >
                      <span 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: stringToColor(entry.name) }}
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium truncate max-w-[150px] text-gray-700 dark:text-gray-300">
                          {entry.name}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {entry.value.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsPieChart;