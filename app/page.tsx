import { locations } from "@/data/locations";
import HeroSection from "@/components/HeroSection";
import LocationCard from "@/components/LocationCard";
import LocationTagSelector from "@/components/LocationTagSelector";

interface HomeProps {
  searchParams: {
    locations?: string;
  };
}

export default function Home({ searchParams }: HomeProps) {
  // Parse selected locations from URL search params
  const selectedLocationNames = searchParams.locations
    ? searchParams.locations.split(',')
    : [];

  // Filter locations based on selection
  const selectedLocations = Object.entries(locations).filter(([locationName]) =>
    selectedLocationNames.includes(locationName)
  );

  return (
    <main className="container mx-auto p-4 max-w-7xl">
      {/* Hero Section */}
      <HeroSection locationCount={Object.keys(locations).length} />

      {/* Location Tag Selector */}
      <LocationTagSelector 
        availableLocations={Object.keys(locations)}
        selectedLocations={selectedLocationNames}
      />

      {/* Selected Locations Section */}
      {selectedLocations.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            📍 Weather Data for Selected Locations ({selectedLocations.length})
          </h2>
          <ul
            className="grid grid-cols-1 xl:grid-cols-2 gap-12 list-none"
            role="list"
          >
            {selectedLocations.map(([locationName, coords]) => (
              <li key={locationName}>
                <LocationCard locationName={locationName} coords={coords} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Show message when no locations selected */}
      {selectedLocations.length === 0 && (
        <section className="mb-12 text-center py-12">
          <p className="text-gray-600 text-lg">
            Select location tags above to view weather data
          </p>
        </section>
      )}
    </main>
  );
}
