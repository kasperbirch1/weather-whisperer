import { WeatherObservation } from "@/lib/types";

interface WindSpeedCardProps {
  windspeedData: WeatherObservation[];
}

export default function WindSpeedCard({ windspeedData }: WindSpeedCardProps) {
  if (windspeedData.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-6 border border-green-200">
      <h3 className="text-xl font-bold text-green-800 mb-4">
        💨 Wind Speed Data
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {windspeedData.slice(0, 6).map((obs, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {obs.properties.value} m/s
            </div>
            <div className="text-sm text-gray-600">
              Station: {obs.properties.stationId}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(obs.properties.observed).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              📍 {obs.geometry?.coordinates?.[1].toFixed(2)},{" "}
              {obs.geometry?.coordinates?.[0].toFixed(2)}
            </div>
          </div>
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
