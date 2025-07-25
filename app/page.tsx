import { locations } from "@/data/locations";
import { fetchLocationData } from "@/lib/location-service";
import { analyzeParameters } from "@/lib/weather-utils";
import WindSpeedCard from "@/components/WindSpeedCard";
import ParameterCards from "@/components/ParameterCards";
import LightningCard from "@/components/LightningCard";
import TemperatureCard from "@/components/TemperatureCard";
import ForecastCard from "@/components/ForecastCard";
import { LocationWeatherData } from "@/lib/types";

export default async function Home() {
  // Fetch data for all locations
  const locationData: LocationWeatherData[] = await Promise.all(
    Object.entries(locations).map(([locationName, coords]) =>
      fetchLocationData(locationName, coords)
    )
  );

  return (
    <main className="container mx-auto p-4 max-w-7xl">
      {/* Modern Hero Section */}
      <div className="mb-12 text-center relative">
        <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white p-8 rounded-2xl shadow-2xl">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
            🌊 Weather Whisperer
          </h1>
          <p className="text-xl text-cyan-100 mb-2">
            Professional Windsurfing Weather Intelligence
          </p>
          <p className="text-cyan-200">
            Real-time wind and ocean conditions for Danish waters
          </p>
          <div className="mt-4 inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-cyan-100">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></span>
            Live data from Danish Meteorological Institute (DMI) • Updated every
            5 minutes
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {locationData.map((data, index) => {
          const oceanSummary = analyzeParameters(data.oceanData);
          const meteoSummary = analyzeParameters(data.meteoData);
          const hasData =
            data.windspeedData.length > 0 ||
            Object.keys(oceanSummary).length > 0;

          return (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300"
            >
              {/* Location Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    🏄‍♂️ {data.location.replace(/([A-Z])/g, " $1").trim()}
                  </h2>
                  <p className="text-gray-600 flex items-center">
                    📍 {data.coordinates.lat}°N, {data.coordinates.lon}°E
                  </p>
                </div>
                <div className="text-right">
                  {data.windspeedData.length > 0 && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      ✅ Live Data
                    </div>
                  )}
                  {data.windspeedData.length === 0 && (
                    <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      📡 Checking...
                    </div>
                  )}
                </div>
              </div>

              {data.error && (
                <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-lg mb-6 shadow-lg">
                  <strong>⚠️ Error:</strong> {data.error}
                </div>
              )}

              <ForecastCard forecastData={data.forecastData} />

              <LightningCard lightningData={data.lightningData} />

              <TemperatureCard temperatureData={data.temperatureData} />

              <WindSpeedCard windspeedData={data.windspeedData} />

              <ParameterCards
                title="🌤️ Meteorological Data"
                parameters={meteoSummary}
                colorScheme="yellow"
              />

              <ParameterCards
                title="🌊 Ocean Data"
                parameters={oceanSummary}
                colorScheme="blue"
              />

              <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-6 rounded-xl mb-6 border border-gray-200 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  📈 Data Summary
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-sm text-gray-600 mb-1">
                        Wind Observations
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {data.windspeedData.length}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-sm text-gray-600 mb-1">
                        Ocean Observations
                      </p>
                      <p className="text-2xl font-bold text-cyan-600">
                        {data.oceanData.features?.length || 0}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-sm text-gray-600 mb-1">
                        Meteo Observations
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {data.meteoData.features?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {!hasData && (
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-500 text-yellow-800 px-6 py-4 rounded-lg mb-6">
                  <strong>ℹ️ Info:</strong> No weather data available for this
                  location.
                </div>
              )}

              <details className="mt-6">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium py-2 px-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  🔍 Show Raw JSON Data
                </summary>
                <pre className="mt-4 p-4 bg-gray-900 text-green-400 rounded-lg text-xs overflow-auto max-h-96 border shadow-inner">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </details>
            </div>
          );
        })}
      </div>
    </main>
  );
}
