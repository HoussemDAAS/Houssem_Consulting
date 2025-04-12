/* eslint-disable @typescript-eslint/no-explicit-any */
// components/FilterSelect.tsx
'use client';
import Select from 'react-select';
import useSWR from 'swr';

interface FilterSelectProps {
    label: string;
    endpoint?: string;
    options?: Array<{ value: any; label: string }>;
    value: any;
    onChange: (value: any) => void;
    isMulti?: boolean;
    isDisabled?: boolean;
    defaultOptions?: any[];
    cacheKey?: string; // Add key prop
  }

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function FilterSelect({ 
    label, 
    endpoint, 
    options: localOptions, 
    value, 
    onChange, 
    isMulti = false, 
    isDisabled = false,
    defaultOptions,
    cacheKey
  }: FilterSelectProps) {
    const { data, isLoading } = useSWR(endpoint ? endpoint : null, fetcher, {
        fallbackData: defaultOptions // <-- Add this
      });
    
    const options = localOptions || data?.map((item: any) => ({
      value: item._id,
      label: item.name,
    })) || [];
  
    return (
      <div className="w-full" key={cacheKey}>
        <label className="block text-sm font-medium text-[#0b0b0b] dark:text-[#ccbeac] mb-2">
          {label}
        </label>
        <Select
          options={options}
          value={value}
          onChange={onChange}
          isMulti={isMulti}
          isLoading={isLoading}
          isDisabled={isDisabled}
          isClearable
          className="react-select-container"
          classNamePrefix="react-select"
          styles={{
            control: (base) => ({
              ...base,
              borderColor: '#ccbeac',
              minHeight: '2.5rem',
              fontSize: '14px',
              backgroundColor: 'transparent',
              ':hover': {
                borderColor: '#ccbeac',
              },
            }),
            menuPortal: base => ({ ...base, zIndex: 9999 }),
            option: (base) => ({
              ...base,
              fontSize: '14px',
            }),
          }}
          menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
        />
      </div>
    );
  }