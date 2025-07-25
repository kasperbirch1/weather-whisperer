import { locations } from "@/data/locations";
import HeroSection from "@/components/HeroSection";
import LocationCard from "@/components/LocationCard";

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-7xl">
      {/* Hero Section */}
      <HeroSection locationCount={Object.keys(locations).length} />

      {/* Locations Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          📍 Weather Data by Location
        </h2>
        <ul
          className="grid grid-cols-1 xl:grid-cols-2 gap-12 list-none"
          role="list"
        >
          {Object.entries(locations).map(([locationName, coords]) => (
            <li key={locationName}>
              <LocationCard locationName={locationName} coords={coords} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
