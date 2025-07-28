// Temperature data transformers that normalize API responses to TempCard component props

// Import generated API types
import type { CurrentWeatherResponse } from "@/generated/openweather-schemas/currentWeatherResponse";
import type { RealtimeWeather200One } from "@/generated/weatherapi-schemas/realtimeWeather200One";
import type { MetObservationResponse } from "@/generated/dmi-schemas/metObservationResponse";

// Import card component interface
import type { TempCardProps } from "@/components/cards/TempCard";

// OpenWeather temperature transformer
export function transformOpenWeatherTemperature(
  data: CurrentWeatherResponse
): TempCardProps {
  const fallbackLocation =
    data.coord?.lat && data.coord?.lon
      ? `${data.coord.lat.toFixed(3)}°N, ${data.coord.lon.toFixed(3)}°E`
      : "Unknown";

  return {
    apiName: "OpenWeatherMap",
    temperature: data.main?.temp || 0,
    feelsLike: data.main?.feels_like,
    humidity: data.main?.humidity,
    pressure: data.main?.pressure,
    visibility: data.visibility ? data.visibility / 1000 : undefined, // Convert to km
    cloudCover: data.clouds?.all,
    location: data.name || fallbackLocation,
    timestamp: data.dt
      ? new Date(data.dt * 1000).toISOString()
      : new Date().toISOString()
  };
}

// WeatherAPI temperature transformer
export function transformWeatherAPITemperature(
  data: RealtimeWeather200One
): TempCardProps {
  const fallbackLocation =
    data.location?.lat && data.location?.lon
      ? `${data.location.lat.toFixed(3)}°N, ${data.location.lon.toFixed(3)}°E`
      : "Unknown";

  return {
    apiName: "WeatherAPI.com",
    temperature: data.current?.temp_c || 0,
    feelsLike: data.current?.feelslike_c,
    humidity: data.current?.humidity,
    pressure: data.current?.pressure_mb,
    visibility: data.current?.vis_km,
    cloudCover: data.current?.cloud,
    location: data.location?.name || fallbackLocation,
    timestamp: data.current?.last_updated
      ? new Date(data.current.last_updated).toISOString()
      : new Date().toISOString()
  };
}

// DMI temperature transformer
export function transformDMITemperature(
  data: MetObservationResponse
): TempCardProps {
  const feature = data?.features?.[0];
  return {
    apiName: "DMI",
    temperature: feature?.properties?.value || 0,
    location:
      feature?.properties?.stationId || "Unknown DMI Station",
    timestamp: feature?.properties?.observed || new Date().toISOString()
  };
}
