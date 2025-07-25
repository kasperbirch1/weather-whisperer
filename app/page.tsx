import { locations } from "@/data/locations";
import { fetchLocationData } from "@/lib/location-service";
import { analyzeParameters } from "@/lib/weather-utils";
import WindSpeedCard from "@/components/WindSpeedCard";
import ParameterCards from "@/components/ParameterCards";
import { LocationWeatherData } from "@/lib/types";

export default async function Home() {
  // Fetch data for all locations
  const locationData: LocationWeatherData[] = await Promise.all(
    Object.entries(locations).map(([locationName, coords]) =>
      fetchLocationData(locationName, coords)
    )
  );

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">🌊 Weather Whisperer</h1>

      {locationData.map((data, index) => {
        const oceanSummary = analyzeParameters(data.oceanData);
        const meteoSummary = analyzeParameters(data.meteoData);
        const hasData =
          data.windspeedData.length > 0 || Object.keys(oceanSummary).length > 0;

        return (
          <div key={index} className="mb-8 p-6 border rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 capitalize">
              {data.location.replace(/([A-Z])/g, " $1").trim()}
            </h2>
            <p className="text-gray-600 mb-4">
              📍 Coordinates: {data.coordinates.lat}, {data.coordinates.lon}
            </p>

            {data.error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <strong>⚠️ Error:</strong> {data.error}
              </div>
            )}

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

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-medium mb-2">📈 Data Summary</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Wind Observations</p>
                  <p className="font-bold">{data.windspeedData.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ocean Observations</p>
                  <p className="font-bold">
                    {data.oceanData.features?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Meteo Observations</p>
                  <p className="font-bold">
                    {data.meteoData.features?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            {!hasData && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4">
                <strong>ℹ️ Info:</strong> No weather data available for this
                location.
              </div>
            )}

            <details className="mt-4">
              <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                🔍 Show Raw JSON Data
              </summary>
              <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-96 border">
                {JSON.stringify(data, null, 2)}
              </pre>
            </details>
          </div>
        );
      })}
    </main>
  );
}
