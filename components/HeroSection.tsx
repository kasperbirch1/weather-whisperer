interface HeroSectionProps {
  locationCount: number;
}

export default function HeroSection({ locationCount }: HeroSectionProps) {
  return (
    <header className="mb-12 text-center">
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
        🌊 Weather Whisperer
      </h1>
      <p className="text-xl text-gray-600 mb-2">
        Multi-API Weather Data for All Locations
      </p>
      <p className="text-gray-500">📍 {locationCount} locations monitored</p>
    </header>
  );
}
