'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface LocationTagSelectorProps {
  availableLocations: string[];
  selectedLocations: string[];
}

export default function LocationTagSelector({
  availableLocations,
  selectedLocations,
}: LocationTagSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const toggleLocation = useCallback((locationName: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const currentLocations = current.get('locations')?.split(',').filter(Boolean) || [];
    
    let newLocations: string[];
    if (currentLocations.includes(locationName)) {
      // Remove location
      newLocations = currentLocations.filter(loc => loc !== locationName);
    } else {
      // Add location
      newLocations = [...currentLocations, locationName];
    }

    if (newLocations.length > 0) {
      current.set('locations', newLocations.join(','));
    } else {
      current.delete('locations');
    }

    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`/${query}`);
  }, [router, searchParams]);

  const clearAll = useCallback(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete('locations');
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`/${query}`);
  }, [router, searchParams]);

  const selectAll = useCallback(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('locations', availableLocations.join(','));
    const search = current.toString();
    router.push(`/?${search}`);
  }, [router, availableLocations]);

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          🏷️ Select Locations
        </h2>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            disabled={selectedLocations.length === availableLocations.length}
          >
            Select All
          </button>
          <button
            onClick={clearAll}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            disabled={selectedLocations.length === 0}
          >
            Clear All
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {availableLocations.map((locationName) => {
          const isSelected = selectedLocations.includes(locationName);
          const displayName = locationName.replace(/([A-Z])/g, ' $1').trim();
          
          return (
            <button
              key={locationName}
              onClick={() => toggleLocation(locationName)}
              className={`px-4 py-2 rounded-full border-2 transition-all duration-200 ${
                isSelected
                  ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:shadow-sm'
              }`}
              aria-pressed={isSelected}
            >
              {displayName}
              {isSelected && (
                <span className="ml-2 text-blue-200">✓</span>
              )}
            </button>
          );
        })}
      </div>
      
      {selectedLocations.length > 0 && (
        <p className="mt-3 text-sm text-gray-600">
          {selectedLocations.length} location{selectedLocations.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </section>
  );
}
