import { locations } from "@/data/locations";
import WindCard from "@/components/WindCard";
import TempCard from "@/components/TempCard";
import ForecastCard from "@/components/ForecastCard";
import LightningCard from "@/components/LightningCard";
import OceanCard from "@/components/OceanCard";
import SeaLevelCard from "@/components/SeaLevelCard";
import ParameterCards from "@/components/ParameterCards";
import {
  fetchOpenWeatherData,
  fetchWeatherAPIData,
  fetchDMIWindData,
  fetchDMITempData,
  fetchDMISeaLevelData,
  fetchDMIMeteoData,
  fetchDMIOceanData,
  fetchDMILightningData,
  fetchDMIForecast,
  fetchOpenWeatherForecast,
  fetchWeatherAPIForecast,
} from "@/lib/weather-service";

export default async function Home() {
  // Fetch data for all locations
  const locationData = await Promise.all(
    Object.entries(locations).map(async ([locationName, coords]) => {
      // Fetch data from all APIs in parallel for each location
      const [
        openWeatherData,
        weatherAPIData,
        dmiWindData,
        dmiTempData,
        dmiSeaLevelData,
        dmiMeteoData,
        dmiOceanData,
        dmiLightningData,
        dmiForecast,
        openWeatherForecast,
        weatherAPIForecast,
      ] = await Promise.all([
        fetchOpenWeatherData(coords.lat, coords.lon),
        fetchWeatherAPIData(coords.lat, coords.lon),
        fetchDMIWindData(coords.lat, coords.lon),
        fetchDMITempData(coords.lat, coords.lon),
        fetchDMISeaLevelData(coords.lat, coords.lon),
        fetchDMIMeteoData(coords.lat, coords.lon),
        fetchDMIOceanData(coords.lat, coords.lon),
        fetchDMILightningData(coords.lat, coords.lon),
        fetchDMIForecast(coords.lat, coords.lon),
        fetchOpenWeatherForecast(coords.lat, coords.lon),
        fetchWeatherAPIForecast(coords.lat, coords.lon),
      ]);

      return {
        locationName,
        coords,
        openWeatherData,
        weatherAPIData,
        dmiWindData,
        dmiTempData,
        dmiSeaLevelData,
        dmiMeteoData,
        dmiOceanData,
        dmiLightningData,
        dmiForecast,
        openWeatherForecast,
        weatherAPIForecast,
      };
    })
  );
  return (
    <main className="container mx-auto p-4 max-w-7xl">
      {/* Hero Section */}
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          🌊 Weather Whisperer
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Multi-API Weather Data for All Locations
        </p>
        <p className="text-gray-500">
          📍 {Object.keys(locations).length} locations monitored
        </p>
      </header>

      {/* Locations Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          📍 Weather Data by Location
        </h2>
        <ul
          className="grid grid-cols-1 xl:grid-cols-2 gap-12 list-none"
          role="list"
        >
          {locationData.map((location) => (
            <li key={location.locationName}>
              <article className="p-8 bg-white rounded-xl shadow-lg border border-gray-200">
                {/* Location Header */}
                <header className="mb-10 text-center border-b border-gray-200 pb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {location.locationName.replace(/([A-Z])/g, " $1").trim()}
                  </h3>
                  <p className="text-gray-600">
                    📍 {location.coords.lat}°N, {location.coords.lon}°E
                  </p>
                </header>

                {/* Wind Data for this location */}
                <section className="mb-12">
                  <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                    💨 Wind Data
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-6">
                    {/* DMI Wind */}
                    {location.dmiWindData && (
                      <WindCard
                        apiName="DMI"
                        windSpeed={location.dmiWindData.windSpeed}
                        windDirection={location.dmiWindData.windDirection}
                        location={location.dmiWindData.location}
                        timestamp={location.dmiWindData.timestamp}
                      />
                    )}

                    {/* OpenWeatherMap Wind */}
                    {location.openWeatherData && (
                      <WindCard
                        apiName="OpenWeatherMap"
                        windSpeed={location.openWeatherData.wind?.speed || 0}
                        windDirection={location.openWeatherData.wind?.deg || 0}
                        location={location.openWeatherData.name}
                        timestamp={new Date(
                          location.openWeatherData.dt * 1000
                        ).toISOString()}
                      />
                    )}

                    {/* WeatherAPI Wind */}
                    {location.weatherAPIData && (
                      <WindCard
                        apiName="WeatherAPI.com"
                        windSpeed={
                          (location.weatherAPIData.current?.wind_kph || 0) / 3.6
                        }
                        windDirection={
                          location.weatherAPIData.current?.wind_degree || 0
                        }
                        location={location.weatherAPIData.location?.name}
                        timestamp={new Date(
                          location.weatherAPIData.current?.last_updated_epoch *
                            1000
                        ).toISOString()}
                      />
                    )}
                  </div>
                </section>

                {/* Temperature Data for this location */}
                <section className="mb-12">
                  <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                    🌡️ Temperature Data
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-6">
                    {/* DMI Temperature */}
                    {location.dmiTempData && (
                      <TempCard
                        apiName="DMI"
                        temperature={location.dmiTempData.temperature}
                        location={location.dmiTempData.location}
                        timestamp={location.dmiTempData.timestamp}
                      />
                    )}

                    {/* OpenWeatherMap Temperature */}
                    {location.openWeatherData && (
                      <TempCard
                        apiName="OpenWeatherMap"
                        temperature={location.openWeatherData.main?.temp || 0}
                        feelsLike={location.openWeatherData.main?.feels_like}
                        humidity={location.openWeatherData.main?.humidity}
                        location={location.openWeatherData.name}
                        timestamp={new Date(
                          location.openWeatherData.dt * 1000
                        ).toISOString()}
                      />
                    )}

                    {/* WeatherAPI Temperature */}
                    {location.weatherAPIData && (
                      <TempCard
                        apiName="WeatherAPI.com"
                        temperature={
                          location.weatherAPIData.current?.temp_c || 0
                        }
                        feelsLike={location.weatherAPIData.current?.feelslike_c}
                        humidity={location.weatherAPIData.current?.humidity}
                        location={location.weatherAPIData.location?.name}
                        timestamp={new Date(
                          location.weatherAPIData.current?.last_updated_epoch *
                            1000
                        ).toISOString()}
                      />
                    )}
                  </div>
                </section>

                {/* Sea Level Data for this location - only show if data exists */}
                {location.dmiSeaLevelData && (
                  <section className="mb-12">
                    <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                      📏 Sea Level (Nivå) Data
                    </h4>
                    <div className="grid grid-cols-1 gap-6">
                      <SeaLevelCard
                        apiName="DMI Sea Level"
                        seaLevel={location.dmiSeaLevelData.seaLevel}
                        location={location.dmiSeaLevelData.location}
                        timestamp={location.dmiSeaLevelData.timestamp}
                      />
                    </div>
                  </section>
                )}

                {/* Additional Meteorological Data */}
                <section className="mb-12">
                  <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                    🌤️ Meteorological Data
                  </h4>
                  <div className="grid grid-cols-1 gap-8">
                    {/* DMI Meteo Data */}
                    {location.dmiMeteoData && (
                      <ParameterCards
                        title="🌬️ DMI Meteorological Data"
                        parameters={{
                          ...(location.dmiMeteoData.pressure && {
                            pressure: {
                              count: 1,
                              latestValue: location.dmiMeteoData.pressure,
                              latestTime: location.dmiMeteoData.timestamp,
                            },
                          }),
                          ...(location.dmiMeteoData.humidity && {
                            humidity: {
                              count: 1,
                              latestValue: location.dmiMeteoData.humidity,
                              latestTime: location.dmiMeteoData.timestamp,
                            },
                          }),
                          ...(location.dmiMeteoData.windDirection && {
                            wind_dir: {
                              count: 1,
                              latestValue: location.dmiMeteoData.windDirection,
                              latestTime: location.dmiMeteoData.timestamp,
                            },
                          }),
                        }}
                        colorScheme="yellow"
                      />
                    )}

                    {/* OpenWeatherMap Additional Data */}
                    {location.openWeatherData && (
                      <ParameterCards
                        title="🌐 OpenWeatherMap Extended Data"
                        parameters={{
                          pressure: {
                            count: 1,
                            latestValue:
                              location.openWeatherData.main?.pressure || 0,
                            latestTime: new Date(
                              location.openWeatherData.dt * 1000
                            ).toISOString(),
                          },
                          humidity: {
                            count: 1,
                            latestValue:
                              location.openWeatherData.main?.humidity || 0,
                            latestTime: new Date(
                              location.openWeatherData.dt * 1000
                            ).toISOString(),
                          },
                          visibility: {
                            count: 1,
                            latestValue:
                              (location.openWeatherData.visibility || 0) / 1000, // Convert to km
                            latestTime: new Date(
                              location.openWeatherData.dt * 1000
                            ).toISOString(),
                          },
                          cloud: {
                            count: 1,
                            latestValue:
                              location.openWeatherData.clouds?.all || 0,
                            latestTime: new Date(
                              location.openWeatherData.dt * 1000
                            ).toISOString(),
                          },
                        }}
                        colorScheme="yellow"
                      />
                    )}

                    {/* WeatherAPI Additional Data */}
                    {location.weatherAPIData && (
                      <ParameterCards
                        title="🌈 WeatherAPI Extended Data"
                        parameters={{
                          pressure: {
                            count: 1,
                            latestValue:
                              location.weatherAPIData.current?.pressure_mb || 0,
                            latestTime: new Date(
                              location.weatherAPIData.current
                                ?.last_updated_epoch * 1000
                            ).toISOString(),
                          },
                          humidity: {
                            count: 1,
                            latestValue:
                              location.weatherAPIData.current?.humidity || 0,
                            latestTime: new Date(
                              location.weatherAPIData.current
                                ?.last_updated_epoch * 1000
                            ).toISOString(),
                          },
                          visibility: {
                            count: 1,
                            latestValue:
                              location.weatherAPIData.current?.vis_km || 0,
                            latestTime: new Date(
                              location.weatherAPIData.current
                                ?.last_updated_epoch * 1000
                            ).toISOString(),
                          },
                          cloud: {
                            count: 1,
                            latestValue:
                              location.weatherAPIData.current?.cloud || 0,
                            latestTime: new Date(
                              location.weatherAPIData.current
                                ?.last_updated_epoch * 1000
                            ).toISOString(),
                          },
                          uv: {
                            count: 1,
                            latestValue:
                              location.weatherAPIData.current?.uv || 0,
                            latestTime: new Date(
                              location.weatherAPIData.current
                                ?.last_updated_epoch * 1000
                            ).toISOString(),
                          },
                          precip: {
                            count: 1,
                            latestValue:
                              location.weatherAPIData.current?.precip_mm || 0,
                            latestTime: new Date(
                              location.weatherAPIData.current
                                ?.last_updated_epoch * 1000
                            ).toISOString(),
                          },
                        }}
                        colorScheme="yellow"
                      />
                    )}
                  </div>
                </section>

                {/* Ocean Data for this location */}
                <section className="mb-12">
                  <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                    🌊 Ocean Data
                  </h4>
                  <div className="grid grid-cols-1 gap-6">
                    {/* DMI Ocean */}
                    {location.dmiOceanData && (
                      <OceanCard
                        apiName="DMI Ocean"
                        waveHeight={location.dmiOceanData.waveHeight}
                        waterTemperature={
                          location.dmiOceanData.waterTemperature
                        }
                        salinity={location.dmiOceanData.salinity}
                        location={location.dmiOceanData.location}
                        timestamp={location.dmiOceanData.timestamp}
                      />
                    )}
                  </div>
                </section>

                {/* Forecast Data for this location */}
                <section className="mb-12">
                  <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                    🔮 Forecast Data
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-6">
                    {/* DMI Forecast */}
                    {location.dmiForecast && (
                      <ForecastCard
                        apiName="DMI Forecast"
                        temperature={
                          location.dmiForecast.waterTemp ||
                          location.dmiForecast.temperature
                        }
                        description={location.dmiForecast.description}
                        highTemp={
                          location.dmiForecast.waterTemp ||
                          location.dmiForecast.temperature
                        }
                        lowTemp={
                          (location.dmiForecast.waterTemp ||
                            location.dmiForecast.temperature) - 2
                        }
                        location={location.dmiForecast.location}
                        timestamp={location.dmiForecast.timestamp}
                      />
                    )}

                    {/* OpenWeatherMap Forecast */}
                    {location.openWeatherForecast && (
                      <ForecastCard
                        apiName="OpenWeatherMap"
                        temperature={location.openWeatherForecast.temperature}
                        description={location.openWeatherForecast.description}
                        icon={location.openWeatherForecast.icon}
                        highTemp={location.openWeatherForecast.highTemp}
                        lowTemp={location.openWeatherForecast.lowTemp}
                        precipitationChance={
                          location.openWeatherForecast.precipitationChance
                        }
                        tomorrowHighTemp={
                          location.openWeatherForecast.tomorrowHighTemp
                        }
                        tomorrowLowTemp={
                          location.openWeatherForecast.tomorrowLowTemp
                        }
                        tomorrowDescription={
                          location.openWeatherForecast.tomorrowDescription
                        }
                        tomorrowPrecipChance={
                          location.openWeatherForecast.tomorrowPrecipChance
                        }
                        location={location.openWeatherForecast.location}
                        timestamp={location.openWeatherForecast.timestamp}
                      />
                    )}

                    {/* WeatherAPI Forecast */}
                    {location.weatherAPIForecast && (
                      <ForecastCard
                        apiName="WeatherAPI.com"
                        temperature={location.weatherAPIForecast.temperature}
                        description={location.weatherAPIForecast.description}
                        icon={location.weatherAPIForecast.icon}
                        highTemp={location.weatherAPIForecast.highTemp}
                        lowTemp={location.weatherAPIForecast.lowTemp}
                        precipitationChance={
                          location.weatherAPIForecast.precipitationChance
                        }
                        tomorrowHighTemp={
                          location.weatherAPIForecast.tomorrowHighTemp
                        }
                        tomorrowLowTemp={
                          location.weatherAPIForecast.tomorrowLowTemp
                        }
                        tomorrowDescription={
                          location.weatherAPIForecast.tomorrowDescription
                        }
                        tomorrowPrecipChance={
                          location.weatherAPIForecast.tomorrowPrecipChance
                        }
                        location={location.weatherAPIForecast.location}
                        timestamp={location.weatherAPIForecast.timestamp}
                      />
                    )}
                  </div>
                </section>

                {/* Lightning Data for this location */}
                <section className="mb-8">
                  <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                    ⚡ Lightning Data
                  </h4>
                  <div className="grid grid-cols-1 gap-6">
                    {/* DMI Lightning */}
                    {location.dmiLightningData && (
                      <LightningCard
                        apiName="DMI"
                        strikeCount={location.dmiLightningData.strikeCount}
                        lastStrikeTime={
                          location.dmiLightningData.lastStrikeTime
                        }
                        distance={location.dmiLightningData.distance}
                        intensity={location.dmiLightningData.intensity}
                        areaStrikeCount={
                          location.dmiLightningData.areaStrikeCount
                        }
                        riskLevel={location.dmiLightningData.riskLevel}
                        location={location.dmiLightningData.location}
                        timestamp={location.dmiLightningData.timestamp}
                      />
                    )}
                  </div>
                </section>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* API Status Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">📊 API Status</h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4" role="list">
          <li
            className={`p-4 rounded-lg ${
              locationData.some((l) => l.dmiWindData || l.dmiTempData)
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <div className="font-bold">DMI API</div>
            <div className="text-sm">
              {locationData.some((l) => l.dmiWindData || l.dmiTempData)
                ? "✅ Online"
                : "❌ Offline"}
            </div>
          </li>
          <li
            className={`p-4 rounded-lg ${
              locationData.some((l) => l.openWeatherData)
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <div className="font-bold">OpenWeatherMap</div>
            <div className="text-sm">
              {locationData.some((l) => l.openWeatherData)
                ? "✅ Online"
                : "❌ Offline"}
            </div>
          </li>
          <li
            className={`p-4 rounded-lg ${
              locationData.some((l) => l.weatherAPIData)
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <div className="font-bold">WeatherAPI.com</div>
            <div className="text-sm">
              {locationData.some((l) => l.weatherAPIData)
                ? "✅ Online"
                : "❌ Offline"}
            </div>
          </li>
        </ul>
      </section>
    </main>
  );
}
