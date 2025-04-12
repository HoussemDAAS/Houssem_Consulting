'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useEffect, useState } from 'react';
import { ClientDocument } from '@/lib/models/Client';
import { RegionDocument } from '@/lib/models/Region';

interface ChartData {
  name: string;
  value: number;
}

interface CountryChartData {
  countryName: string;
  data: ChartData[];
}

interface AnalyticsPieChartProps {
  clients: ClientDocument[];
  countries: RegionDocument[];
  selectedManufacturers: string[];
  selectedCountries: string[];
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
  selectedManufacturers,
  selectedCountries
}: AnalyticsPieChartProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getChartData = (): CountryChartData[] => {
    const countryMap = new Map<string, Map<string, number>>();

    clients.forEach(client => {
      const regionId = client.region?._id?.toString() || client.region?.toString();
      if (!regionId || !selectedCountries.includes(regionId)) return;

      client.products.forEach(product => {
        const manufacturer = product.fabriquant;
        if (!manufacturer || (selectedManufacturers.length > 0 && !selectedManufacturers.includes(manufacturer))) return;

        const manufacturerCount = countryMap.get(regionId) || new Map<string, number>();
        manufacturerCount.set(manufacturer, (manufacturerCount.get(manufacturer) || 0) + 1);
        countryMap.set(regionId, manufacturerCount);
      });
    });

    return Array.from(countryMap.entries()).map(([countryId, manufacturers]) => {
      const total = Array.from(manufacturers.values()).reduce((sum, count) => sum + count, 0);
      const countryName = countries.find(c => c._id === countryId)?.name || countryId;

      return {
        countryName,
        data: Array.from(manufacturers.entries())
          .map(([name, count]) => ({
            name,
            value: total > 0 ? Number(((count / total) * 100).toFixed(2)) : 0,
          }))
          .sort((a, b) => b.value - a.value)
      };
    });
  };

  const countryData = getChartData();

  if (!selectedCountries.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6 h-[400px] flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Please select at least one country to view the chart
        </p>
      </div>
    );
  }

  if (countryData.every(c => c.data.length === 0)) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6 h-[400px] flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          No manufacturers found in selected countries
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-3">Analyses par région</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {countryData
          .filter(({ data }) => data.length > 0)
          .map(({ countryName, data }) => (
            <div key={countryName} className="h-[420px]">
              <h3 className="text-center mb-1 text-gray-800 dark:text-gray-200 text-sm">
                {countryName}
              </h3>
              
              <ResponsiveContainer width="100%" height="90%">
                <PieChart margin={isMobile ? { bottom: 80 } : { right: 120 }}>
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
                    layout={isMobile ? "horizontal" : "vertical"}
                    verticalAlign={isMobile ? "bottom" : "middle"}
                    align={isMobile ? "center" : "right"}
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
                          <p>{payload[0].value?.toFixed(2)}%</p>
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