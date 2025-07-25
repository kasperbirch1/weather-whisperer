import { WeatherData } from "@/lib/types";

interface LightningCardProps {
  lightningData: WeatherData;
}

export default function LightningCard({ lightningData }: LightningCardProps) {
  const lightningCount = lightningData.features?.length || 0;

  return (
    <div
      className={`p-6 rounded-2xl mb-6 border shadow-xl ${
        lightningCount > 0
          ? "bg-gradient-to-r from-red-50 to-rose-50 border-red-200"
          : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
      }`}
    >
      <h3
        className={`text-2xl font-bold mb-6 ${
          lightningCount > 0 ? "text-red-800" : "text-green-800"
        }`}
      >
        ⚡ Lightning Activity (Last 2 Hours)
      </h3>

      {lightningCount > 0 ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-100 to-rose-100 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-lg shadow-lg">
            <strong>⚠️ High Alert:</strong> {lightningCount} lightning strikes
            detected in the area! Consider postponing windsurfing activities for safety.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lightningData.features.slice(0, 6).map((strike, index) => (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border-l-4 border-red-500 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-red-700">
                    Lightning Strike
                  </div>
                  <div className="text-red-500">
                    ⚡
                  </div>
                </div>
                <div className="text-xs text-gray-700 mb-2">
                  {new Date(strike.properties.observed).toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                  📍 {strike.geometry?.coordinates?.[1].toFixed(3)}°N,{" "}
                  {strike.geometry?.coordinates?.[0].toFixed(3)}°E
                </div>
              </div>
            ))}
          </div>

          {lightningCount > 6 && (
            <div className="text-center p-3 bg-red-100 rounded-lg">
              <p className="text-sm font-semibold text-red-700">
                + {lightningCount - 6} more lightning strikes detected
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-l-4 border-green-500 text-green-800 px-6 py-4 rounded-lg shadow-lg">
          <strong>✅ All Clear:</strong> No lightning activity detected in the
          area. Conditions appear safe for windsurfing.
        </div>
      )}
    </div>
  );
}
