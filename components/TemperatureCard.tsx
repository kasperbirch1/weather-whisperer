import { WeatherData, ParameterSummary } from "@/lib/types";
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
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg mb-6 border border-yellow-200">
      <h3 className="text-xl font-bold text-yellow-800 mb-4">
        🌡️ Temperature Data
      </h3>

      {latestTemperature !== undefined ? (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">
            {latestTemperature} °C
          </div>
          <div className="text-xs text-gray-500">
            {latestTime ? new Date(latestTime).toLocaleString() : ""}
          </div>
          <p className="text-sm text-gray-600 mt-2">{count} observations</p>
        </div>
      ) : (
        <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded">
          Temperature data unavailable.
        </div>
      )}
    </div>
  );
}
