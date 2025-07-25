import { WeatherObservation } from "@/lib/types";
import { getWindSpeedCategory } from "@/lib/wind-utils";

interface WindStationsMapProps {
  windObservations: WeatherObservation[];
  centerLat?: number; // Optional since we calculate our own bbox
  centerLon?: number; // Optional since we calculate our own bbox
}

export default function WindStationsMap({
  windObservations,
}: WindStationsMapProps) {
  if (windObservations.length === 0) {
    return (
      <div className="w-full h-64 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border border-gray-300">
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">🌊</div>
          <div className="text-sm">No wind stations to display</div>
        </div>
      </div>
    );
  }

  // Create a simple map with station markers overlay
  const bbox = {
    minLat:
      Math.min(...windObservations.map((obs) => obs.geometry.coordinates[1])) -
      0.05,
    maxLat:
      Math.max(...windObservations.map((obs) => obs.geometry.coordinates[1])) +
      0.05,
    minLon:
      Math.min(...windObservations.map((obs) => obs.geometry.coordinates[0])) -
      0.05,
    maxLon:
      Math.max(...windObservations.map((obs) => obs.geometry.coordinates[0])) +
      0.05,
  };

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-300 shadow-lg relative">
      <iframe
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox.minLon},${bbox.minLat},${bbox.maxLon},${bbox.maxLat}&layer=mapnik`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
      />

      {/* Station markers overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {windObservations.map((observation, index) => {
          const [lon, lat] = observation.geometry.coordinates;
          const windCategory = getWindSpeedCategory(
            observation.properties.value
          );

          // Simple positioning calculation (approximate)
          const x = ((lon - bbox.minLon) / (bbox.maxLon - bbox.minLon)) * 100;
          const y = ((bbox.maxLat - lat) / (bbox.maxLat - bbox.minLat)) * 100;

          return (
            <div
              key={`${observation.properties.stationId}-${index}`}
              className={`absolute ${windCategory.color} text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer hover:scale-110 transition-transform`}
              style={{ left: `${x}%`, top: `${y}%` }}
              title={`Station ${observation.properties.stationId}: ${observation.properties.value} m/s - ${windCategory.text}`}
            >
              {observation.properties.value.toFixed(0)} m/s
            </div>
          );
        })}
      </div>
    </div>
  );
}
