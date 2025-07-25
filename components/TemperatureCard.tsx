import { WeatherData } from "@/lib/types";
import { analyzeParameters } from "@/lib/weather-utils";

interface TemperatureCardProps {
  temperatureData: WeatherData;
}

export default function TemperatureCard({
  temperatureData,
}: TemperatureCardProps) {
  const temperatureSummary = analyzeParameters(temperatureData);

  // Check for different temperature parameter types
  const tempData =
    temperatureSummary.temp_dry ||
    temperatureSummary.temp_mean_past1h ||
    temperatureSummary.temp;

  const latestTemperature = tempData?.latestValue;
  const latestTime = tempData?.latestTime;
  const count = tempData?.count;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl mb-6 border border-amber-200 shadow-xl">
      <h3 className="text-2xl font-bold text-amber-800 mb-6">
        🌡️ Temperature Data
      </h3>

      {latestTemperature !== undefined ? (
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border-l-4 border-amber-500">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl font-bold text-amber-600">
              {latestTemperature}°C
            </div>
            <div className="text-right">
              <div className="bg-amber-100 px-3 py-1 rounded-full text-sm font-semibold text-amber-800">
                Current
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Last Updated</p>
              <p className="font-semibold text-gray-800">
                {latestTime ? new Date(latestTime).toLocaleString() : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Observations</p>
              <p className="font-semibold text-gray-800">{count}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-l-4 border-gray-400 text-gray-700 px-6 py-4 rounded-lg">
          <strong>📡 No Data:</strong> Temperature data unavailable for this location.
        </div>
      )}
    </div>
  );
}
