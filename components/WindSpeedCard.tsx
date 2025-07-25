import { WeatherObservation } from "@/lib/types";
import WindStationCard from "./WindStationCard";

interface WindSpeedCardProps {
  windspeedData: WeatherObservation[];
}

export default function WindSpeedCard({ windspeedData }: WindSpeedCardProps) {
  if (windspeedData.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 rounded-2xl mb-6 border border-emerald-200 shadow-xl">
      <h3 className="text-2xl font-bold text-emerald-800 mb-6">
        💨 Wind Speed Data
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {windspeedData.slice(0, 6).map((obs, index) => (
          <WindStationCard key={index} observation={obs} />
        ))}
      </div>
      {windspeedData.length > 6 && (
        <div className="mt-4 p-3 bg-emerald-100 rounded-lg text-center">
          <p className="text-sm font-semibold text-emerald-800">
            + {windspeedData.length - 6} more wind observations available
          </p>
        </div>
      )}
    </div>
  );
}
