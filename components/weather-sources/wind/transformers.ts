// Wind data transformers that normalize API responses to WindCard component props

// Import generated API types
import type { CurrentWeatherResponse } from "@/generated/openweather-schemas/currentWeatherResponse";
import type { RealtimeWeather200One } from "@/generated/weatherapi-schemas/realtimeWeather200One";
import type { MetObservationResponse } from "@/generated/dmi-schemas/metObservationResponse";

// Import card component interface
import type { WindCardProps } from "@/components/cards/WindCard";

// OpenWeather wind transformer
export function transformOpenWeatherWind(
  data: CurrentWeatherResponse
): WindCardProps {
  const fallbackLocation =
    data.coord?.lat && data.coord?.lon
      ? `${data.coord.lat.toFixed(3)}°N, ${data.coord.lon.toFixed(3)}°E`
      : "Unknown";

  return {
    apiName: "OpenWeatherMap",
    windSpeed: data.wind?.speed || 0,
    windDirection: data.wind?.deg || 0,
    windGust: data.wind?.gust,
    pressure: data.main?.pressure,
    location: data.name || fallbackLocation,
    timestamp: data.dt
      ? new Date(data.dt * 1000).toISOString()
      : new Date().toISOString()
  };
}

// WeatherAPI wind transformer
export function transformWeatherAPIWind(
  data: RealtimeWeather200One
): WindCardProps {
  const fallbackLocation =
    data.location?.lat && data.location?.lon
      ? `${data.location.lat.toFixed(3)}°N, ${data.location.lon.toFixed(3)}°E`
      : "Unknown";

  return {
    apiName: "WeatherAPI.com",
    windSpeed: data.current?.wind_kph ? data.current.wind_kph / 3.6 : 0, // Convert km/h to m/s
    windDirection: data.current?.wind_degree || 0,
    windGust: data.current?.gust_kph ? data.current.gust_kph / 3.6 : undefined,
    pressure: data.current?.pressure_mb,
    location: data.location?.name || fallbackLocation,
    timestamp: data.current?.last_updated
      ? new Date(data.current.last_updated).toISOString()
      : new Date().toISOString()
  };
}

// DMI wind transformer
export function transformDMIWind(
  windSpeedData: MetObservationResponse,
  windDirData: MetObservationResponse | undefined
): WindCardProps {
  const windSpeedFeature = windSpeedData.features?.[0];
  const windDirFeature = windDirData?.features?.[0];

  return {
    apiName: "DMI",
    windSpeed: windSpeedFeature?.properties?.value || 0,
    windDirection: windDirFeature?.properties?.value || 0,
    location:
      windSpeedFeature?.properties?.stationId || "Unknown DMI Station",
    timestamp:
      windSpeedFeature?.properties?.observed || new Date().toISOString()
  };
}
