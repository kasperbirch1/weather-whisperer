import { WeatherObservation } from "@/lib/types";
import WindStationCard from "./WindStationCard";

interface WindSpeedCardProps {
  windspeedData: WeatherObservation[];
}

export default function WindSpeedCard({ windspeedData }: WindSpeedCardProps) {
  if (windspeedData.length === 0) return null;

  // Calculate average wind speed for the header
  const avgWindSpeed =
    windspeedData.reduce((sum, obs) => sum + obs.properties.value, 0) /
    windspeedData.length;
  const maxWindSpeed = Math.max(
    ...windspeedData.map((obs) => obs.properties.value)
  );
  const minWindSpeed = Math.min(
    ...windspeedData.map((obs) => obs.properties.value)
  );

  return (
    <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 rounded-3xl mb-8 border-2 border-cyan-200 shadow-2xl overflow-hidden">
      {/* Beautiful Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <span className="text-4xl">💨</span>
                Wind Speed Data
              </h3>
              <p className="text-cyan-100 text-lg">
                Live measurements from {windspeedData.length} weather stations
              </p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-2xl font-bold">
                  {avgWindSpeed.toFixed(1)}
                </div>
                <div className="text-sm font-medium opacity-90">avg m/s</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-white/90">
            <div className="bg-white/10 rounded-full px-4 py-2 text-sm font-medium">
              📊 Range: {minWindSpeed.toFixed(1)} - {maxWindSpeed.toFixed(1)}{" "}
              m/s
            </div>
            <div className="bg-white/10 rounded-full px-4 py-2 text-sm font-medium">
              🔄 Updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Station Cards */}
      <div className="px-8 pb-8">
        {/* Section Header for Cards */}
        <div className="mb-6">
          <h4 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></span>
            Active Weather Stations
          </h4>
          <p className="text-gray-600 text-sm">
            Real-time wind measurements from meteorological stations
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {windspeedData.slice(0, 6).map((obs, index) => (
            <div
              key={`${obs.properties.stationId}-${index}`}
              className="transform transition-all duration-300 hover:-translate-y-2"
            >
              <WindStationCard observation={obs} />
            </div>
          ))}
        </div>

        {/* More Observations Section */}
        {windspeedData.length > 6 && (
          <div className="mt-10">
            <div className="relative">
              {/* Decorative line */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gradient-to-r from-transparent via-cyan-300 to-transparent"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-3 rounded-full border-2 border-cyan-200 shadow-lg">
                  <div className="flex items-center gap-3 text-cyan-700 font-semibold">
                    <div className="flex -space-x-1">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                    <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                      + {windspeedData.length - 6} more stations
                    </span>
                    <div className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-xs font-bold">
                      Additional Data Available
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-cyan-100 shadow-lg text-center">
                <div className="text-2xl font-bold text-cyan-600">
                  {windspeedData.length}
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  Total Stations
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100 shadow-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {
                    windspeedData.filter((obs) => obs.properties.value >= 10)
                      .length
                  }
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  Strong Winds
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-green-100 shadow-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {
                    windspeedData.filter((obs) => obs.properties.value < 5)
                      .length
                  }
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  Light Winds
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-100 shadow-lg text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Date(
                    Math.max(
                      ...windspeedData.map((obs) =>
                        new Date(obs.properties.observed).getTime()
                      )
                    )
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  Latest Update
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
