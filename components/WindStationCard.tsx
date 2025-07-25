import { WeatherObservation } from "@/lib/types";
import { getWindSpeedCategory } from "@/lib/wind-utils";

interface WindStationCardProps {
  observation: WeatherObservation;
}

export default function WindStationCard({ observation }: WindStationCardProps) {
  const [lon, lat] = observation.geometry.coordinates;
  const { value: windSpeed, stationId, observed } = observation.properties;
  const windCategory = getWindSpeedCategory(windSpeed);

  // Get color scheme based on wind speed
  const getColorScheme = () => {
    if (windSpeed >= 15)
      return {
        gradient: "from-red-500 to-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-700",
        accent: "bg-red-500",
      };
    if (windSpeed >= 10)
      return {
        gradient: "from-orange-500 to-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-700",
        accent: "bg-orange-500",
      };
    if (windSpeed >= 5)
      return {
        gradient: "from-blue-500 to-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-700",
        accent: "bg-blue-500",
      };
    return {
      gradient: "from-green-500 to-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      accent: "bg-green-500",
    };
  };

  const colors = getColorScheme();

  return (
    <div
      className={`${colors.bg} ${colors.border} border-2 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
    >
      {/* Header with Wind Speed */}
      <div
        className={`bg-gradient-to-r ${colors.gradient} p-6 text-white relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
              💨 {windCategory.text}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold leading-none">{windSpeed}</div>
              <div className="text-sm font-medium opacity-90">m/s</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/90">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Station {stationId}</span>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="p-4">
        <div className="h-32 rounded-xl overflow-hidden shadow-lg border border-gray-200 relative bg-gray-100">
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${
              lon - 0.01
            },${lat - 0.01},${lon + 0.01},${
              lat + 0.01
            }&layer=mapnik&marker=${lat},${lon}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            className="rounded-xl"
          />
          <div
            className={`absolute top-3 left-3 ${colors.accent} text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg backdrop-blur-sm`}
          >
            📍 {windSpeed.toFixed(1)} m/s
          </div>
        </div>
      </div>

      {/* Footer with Details */}
      <div className="px-4 pb-4">
        <div className={`${colors.bg} border ${colors.border} rounded-xl p-3`}>
          <div className="flex items-center justify-between text-xs">
            <div className={`${colors.text} font-semibold`}>
              📅 {new Date(observed).toLocaleDateString()}
            </div>
            <div className={`${colors.text} font-medium`}>
              🕐 {new Date(observed).toLocaleTimeString()}
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-600 flex items-center gap-1">
              <span className="font-medium">📍 Location:</span>
              <span>
                {lat.toFixed(3)}°N, {lon.toFixed(3)}°E
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
