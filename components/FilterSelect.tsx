/* eslint-disable @typescript-eslint/no-explicit-any */
// components/FilterSelect.tsx
'use client';
import Select from 'react-select';
import useSWR from 'swr';
import { useState } from 'react';

interface FilterSelectProps {
  label: string;
  endpoint?: string;
  options?: Array<{ value: any; label: string }>;
  value: any;
  onChange: (value: any) => void;
  isMulti?: boolean;
  isDisabled?: boolean;
  defaultOptions?: any[];
  cacheKey?: string;
  showRegion?: boolean;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

const ValueContainer = ({ children, ...props }: any) => {
  const values = props.getValue();
  const { menuIsOpen } = props.selectProps;
  
  if (Array.isArray(values) && values.length > 2 && !menuIsOpen) {
    return (
      <div className="react-select__value-container">
        <div className="text-xs text-gray-600 dark:text-gray-400 px-1">
          {values.length} selected
        </div>
      </div>
    );
  }
  return children;
};

export default function FilterSelect({ 
  label, 
  endpoint, 
  options: localOptions, 
  value, 
  onChange, 
  isMulti = false, 
  isDisabled = false,
  defaultOptions,
  cacheKey,
  showRegion = false
}: FilterSelectProps) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const { data, isLoading } = useSWR(endpoint ? endpoint : null, fetcher, {
    fallbackData: defaultOptions
  });

  const options = localOptions || data?.map((item: any) => ({
    value: item._id,
    label: showRegion ? 
      `${item.name}${item.region?.name ? ` (${item.region.name})` : ''}` : 
      item.name,
  })) || [];

  return (
    <div className="w-full" key={cacheKey}>
      <label className="block text-sm font-medium text-[#0b0b0b] dark:text-[#ccbeac] mb-1">
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
        components={{ ValueContainer }}
        onMenuOpen={() => setMenuIsOpen(true)}
        onMenuClose={() => setMenuIsOpen(false)}
        menuShouldScrollIntoView={false}
        styles={{
          control: (base) => ({
            ...base,
            borderColor: '#ccbeac',
            minHeight: '2rem',
            fontSize: '13px',
            backgroundColor: 'transparent',
            boxShadow: 'none',
            ':hover': {
              borderColor: '#ccbeac',
            },
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: '#ccbeac30',
            borderRadius: '4px',
            maxWidth: '100%',
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: '#0b0b0b',
            fontSize: '12px',
            padding: '0 4px',
          }),
          multiValueRemove: (base) => ({
            ...base,
            ':hover': {
              backgroundColor: 'transparent',
            },
          }),
          menu: (base) => ({
            ...base,
            position: 'absolute',
            minWidth: '100%',
            zIndex: 9999,
            marginTop: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }),
          menuPortal: base => ({ ...base, zIndex: 9999 }),
          option: (base) => ({
            ...base,
            fontSize: '13px',
            padding: '4px 8px',
          }),
          valueContainer: (base) => ({
            ...base,
            flexWrap: 'nowrap',
            overflow: 'hidden',
            padding: '0 4px',
          }),
          indicatorsContainer: (base) => ({
            ...base,
            padding: '0 4px',
          }),
        }}
        menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
        selectProps={{ menuIsOpen }}
      />
    </div>
  );
}