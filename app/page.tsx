import { locations } from "@/data/locations";
import HeroSection from "@/components/HeroSection";
import LocationManager from "@/components/LocationManager";

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-7xl">
      {/* Hero Section */}
      <HeroSection locationCount={Object.keys(locations).length} />

      {/* Locations Section */}
      <LocationManager />
    </main>
  );
}
