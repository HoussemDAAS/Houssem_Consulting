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

export interface ProductChartData {
  productName: string;
  data: ChartData[]; // Manufacturers data
}

export interface LocationChartData {
  locationName: string;
  products: ProductChartData[];
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
    // Map: LocationID -> Map<ProductName, Map<ManufacturerName, Count>>
    const locationMap = new Map<string, Map<string, Map<string, number>>>(
      selectedLocationIds.map(locationId => [
        locationId,
        new Map<string, Map<string, number>>()
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
      if (selectedSecteurs.length > 0) {
         const clientSecteurId = client.secteur?._id?.toString() || client.secteur?.toString();
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

        // REQUIRE explicit product selection - don't show anything if no products selected
        if (selectedProducts.length === 0) return;

        // Only include selected products
        if (!selectedProducts.includes(productId)) return;

        // If specific manufacturers are selected, skip if not in list
        const manufacturer = product.fabriquant;
        if (selectedManufacturers.length > 0) {
            if (!manufacturer || !selectedManufacturers.includes(manufacturer)) return;
        }
        
        const finalManufacturer = manufacturer || 'Unknown';

        // Add to map
        const locMap = locationMap.get(locationId)!;
        
        if (!locMap.has(productName)) {
            locMap.set(productName, new Map<string, number>());
        }
        
        const prodMap = locMap.get(productName)!;
        prodMap.set(finalManufacturer, (prodMap.get(finalManufacturer) || 0) + 1);
      });
    });

    // Convert to chart data format
    return selectedLocationIds.map(locationId => {
      const locMap = locationMap.get(locationId)!;
      
      const locationName = useCityFilter
        ? villes.find(v => v._id === locationId)?.name || locationId
        : countries.find(c => c._id === locationId)?.name || locationId;

      const products: ProductChartData[] = Array.from(locMap.entries()).map(([pName, mfrMap]) => {
          const totalItems = Array.from(mfrMap.values()).reduce((sum, count) => sum + count, 0);
          
          const data = Array.from(mfrMap.entries())
            .map(([mName, count]) => ({
              name: mName,
              value: totalItems > 0 
                ? Number(((count / totalItems) * 100).toFixed(2))
                : 0,
            }))
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value);
            
          return { productName: pName, data };
      }).filter(p => p.data.length > 0);

      return { locationName, products };
    });
  };

  const locationData = getChartData();
  const hasLocationSelection = selectedCities.length > 0 || selectedCountries.length > 0;
  const noData = locationData.every(l => l.products.length === 0);

  // Check if products are selected FIRST
  if (selectedProducts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6 h-[400px] flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Please select at least one product to view the chart
        </p>
      </div>
    );
  }

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
          No data available for the selected criteria
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {locationData.map((location) => (
        <div key={location.locationName} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-2">
            {location.locationName}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {location.products.map((product) => (
                <div key={product.productName} className="flex flex-col h-[400px] border rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50">
                    <h3 className="text-center font-semibold text-lg mb-4 text-gray-700 dark:text-gray-200">
                        {product.productName}
                    </h3>
                    
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={product.data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                                nameKey="name"
                            >
                                {product.data.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={stringToColor(entry.name)} 
                                        strokeWidth={0}
                                    />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value: number) => `${value}%`}
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                        </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 justify-center max-h-[100px] overflow-y-auto">
                        {product.data.map((entry, index) => (
                            <div key={index} className="flex items-center gap-1.5 text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-sm">
                                <span 
                                    className="w-2.5 h-2.5 rounded-full" 
                                    style={{ backgroundColor: stringToColor(entry.name) }}
                                />
                                <span className="font-medium text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
                                    {entry.name}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">
                                    {entry.value}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsPieChart;