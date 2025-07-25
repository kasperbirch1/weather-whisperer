import { WeatherData } from "@/lib/types";

interface LightningCardProps {
  lightningData: WeatherData;
}

export default function LightningCard({ lightningData }: LightningCardProps) {
  const lightningCount = lightningData.features?.length || 0;

  return (
    <div
      className={`p-6 rounded-lg mb-6 border ${
        lightningCount > 0
          ? "bg-gradient-to-r from-red-50 to-orange-50 border-red-200"
          : "bg-gradient-to-r from-green-50 to-blue-50 border-green-200"
      }`}
    >
      <h3
        className={`text-xl font-bold mb-4 ${
          lightningCount > 0 ? "text-red-800" : "text-green-800"
        }`}
      >
        ⚡ Lightning Activity (Last 2 Hours)
      </h3>

      {lightningCount > 0 ? (
        <div className="space-y-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>⚠️ Warning:</strong> {lightningCount} lightning strikes
            detected in the area! Consider postponing windsurfing activities.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lightningData.features.slice(0, 6).map((strike, index) => (
              <div
                key={index}
                className="bg-white p-3 rounded-lg shadow border-l-4 border-red-500"
              >
                <div className="text-sm font-semibold text-red-700">
                  Lightning Strike
                </div>
                <div className="text-xs text-gray-600">
                  {new Date(strike.properties.observed).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  📍 {strike.geometry?.coordinates?.[1].toFixed(3)}°N,{" "}
                  {strike.geometry?.coordinates?.[0].toFixed(3)}°E
                </div>
              </div>
            ))}
          </div>

          {lightningCount > 6 && (
            <p className="text-sm text-red-600">
              + {lightningCount - 6} more lightning strikes detected
            </p>
          )}
        </div>
      ) : (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <strong>✅ All Clear:</strong> No lightning activity detected in the
          area. Conditions appear safe for windsurfing.
        </div>
      )}
    </div>
  );
}
