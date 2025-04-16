/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useEffect, useState } from 'react';
import { ClientDocument } from '@/lib/models/Client';
import { RegionDocument } from '@/lib/models/Region';

interface ChartData {
  name: string;
  value: number;
}

export interface LocationChartData { // Add export keyword
  locationName: string;
  data: ChartData[];
}

interface AnalyticsPieChartProps {
  clients: ClientDocument[];
  countries: RegionDocument[];
  villes: any[];
  selectedManufacturers: string[];
  selectedCountries: string[];
  selectedCities: string[];
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
  isPDFVersion = false
}: AnalyticsPieChartProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const useCityFilter = selectedCities.length > 0;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getChartData = (): LocationChartData[] => {
    // Get all selected location IDs
    const selectedLocationIds = useCityFilter ? selectedCities : selectedCountries;
    if (selectedLocationIds.length === 0) return [];

    // Use only explicitly selected manufacturers
    const validManufacturers = selectedManufacturers;

    // Initialize location map with all selected locations
    const locationMap = new Map<string, Map<string, number>>(
      selectedLocationIds.map(locationId => [
        locationId,
        new Map<string, number>(validManufacturers.map(m => [m, 0]))
      ])
    );

    // Populate the manufacturer counts
    clients.forEach(client => {
      const locationId = useCityFilter 
        ? client.ville?._id?.toString() || client.ville?.toString()
        : client.region?._id?.toString() || client.region?.toString();

      if (!locationId || !selectedLocationIds.includes(locationId)) return;

      client.products.forEach(product => {
        const manufacturer = product.fabriquant;
        if (!manufacturer || !validManufacturers.includes(manufacturer)) return;

        const locationCounts = locationMap.get(locationId)!;
        locationCounts.set(manufacturer, (locationCounts.get(manufacturer) || 0) + 1);
      });
    });

    // Convert to chart data format
    return selectedLocationIds.map(locationId => {
      const manufacturers = locationMap.get(locationId)!;
      const totalProducts = Array.from(manufacturers.values()).reduce((sum, count) => sum + count, 0);
      
      const locationName = useCityFilter
        ? villes.find(v => v._id === locationId)?.name || locationId
        : countries.find(c => c._id === locationId)?.name || locationId;

      const data = validManufacturers
        .map(manufacturer => ({
          name: manufacturer,
          value: totalProducts > 0 
            ? Number(((manufacturers.get(manufacturer)! / totalProducts) * 100).toFixed(2))
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
  if (selectedManufacturers.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6 h-[400px] flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Please select at least one manufacturer to view the distribution
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
          No data found for selected manufacturers in these locations
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-3">
        {useCityFilter ? 'City Distribution' : 'Regional Distribution'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {locationData.map(({ locationName, data }) => (
          <div key={locationName} className="h-[420px]">
            <h3 className="text-center  text-gray-800 dark:text-gray-200 text-sm">
              {locationName}
            </h3>
            
            <ResponsiveContainer 
        width={isPDFVersion ? "95%" : "100%"} 
        height={isPDFVersion ? 500 : "100%"}
      >
          <PieChart margin={isPDFVersion ? { 
                      top: 20, 
                      right: 30, 
                      left: 30, 
                      bottom: 20 
                    } : (isMobile ? { bottom: 80 } : { right: 120 })}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={isMobile ? 50 : 60}
                  outerRadius={isMobile ? 70 : 80}
                  paddingAngle={1}
                  dataKey="value"
                  nameKey="name"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={stringToColor(entry.name)}
                      stroke="#fff"
                      strokeWidth={0.2}
                    />
                  ))}
                </Pie>

                <Legend
                  layout={isMobile || isPDFVersion ? "horizontal" : "vertical"}
                  verticalAlign={isMobile|| isPDFVersion ? "bottom" : "middle"}
                  align={isMobile || isPDFVersion  ? "center" : "right"}
                  wrapperStyle={{
                    paddingTop: isMobile ? 10 : 0,
                    paddingLeft: isMobile ? 0 : 15,
                    maxWidth: isMobile ? '100%' : 140
                  }}
                  content={({ payload }) => (
                    <div className={isMobile ? 
                      'flex flex-wrap justify-center gap-x-4 gap-y-2' : 
                      'space-y-1 pr-2'
                    }>
                      {payload?.map((entry, index) => (
                        <div
                          key={`legend-${index}`}
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

                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="bg-gray-700 text-white p-2 rounded-md shadow-md text-xs">
                        <p className="font-medium">{payload[0].name}</p>
                        <p>{payload[0].value?.toFixed(2)}% of {locationName}'s total</p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsPieChart;