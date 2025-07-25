import { WeatherObservation } from "@/lib/types";
import WindStationCard from "./WindStationCard";

interface WindSpeedCardProps {
  windspeedData: WeatherObservation[];
  locationCoords: { lat: number; lon: number };
}

export default function WindSpeedCard({
  windspeedData,
  locationCoords,
}: WindSpeedCardProps) {
  if (windspeedData.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-6 border border-green-200">
      <h3 className="text-xl font-bold text-green-800 mb-4">
        💨 Wind Speed Data
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {windspeedData.slice(0, 6).map((obs, index) => (
          <WindStationCard key={index} observation={obs} />
        ))}
      </div>
      {windspeedData.length > 6 && (
        <p className="text-sm text-gray-600 mt-2">
          + {windspeedData.length - 6} more wind observations available
        </p>
      )}
    </div>
  );
}
