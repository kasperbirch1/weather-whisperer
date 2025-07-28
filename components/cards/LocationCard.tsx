import WindSection from "@/components/sections/WindSection";
import TemperatureSection from "@/components/sections/TemperatureSection";
import SeaLevelSection from "@/components/sections/SeaLevelSection";
import OceanSection from "@/components/sections/OceanSection";
import ForecastSection from "@/components/sections/ForecastSection";
import { Coordinates } from "@/lib/types";

interface LocationCardProps {
  locationName: string;
  coords: Coordinates;
}

export default function LocationCard({
  locationName,
  coords
}: LocationCardProps) {
  return (
    <article className="p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Location Header */}
      <header className="mb-10 text-center border-b border-gray-200 pb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {locationName.replace(/([A-Z])/g, " $1").trim()}
        </h3>
        <p className="text-gray-600">
          📍 {coords.lat}°N, {coords.lon}°E
        </p>
      </header>

      {/* Wind Data for this location */}
      <WindSection coords={coords} />

      {/* Temperature Data for this location */}
      <TemperatureSection coords={coords} />

      {/* Sea Level Data for this location */}
      <SeaLevelSection coords={coords} />

      {/* Ocean Data for this location */}
      <OceanSection coords={coords} />

      {/* Forecast Data for this location */}
      <ForecastSection coords={coords} />
    </article>
  );
}
