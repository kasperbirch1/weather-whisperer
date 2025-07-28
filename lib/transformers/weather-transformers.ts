// Weather data transformers that normalize API responses to card component props
import { Coordinates } from "@/lib/types";

// Import generated API types
import type { CurrentWeatherResponse } from "@/generated/openweather-schemas/currentWeatherResponse";
import type { ForecastResponse } from "@/generated/openweather-schemas/forecastResponse";
import type { RealtimeWeather200One } from "@/generated/weatherapi-schemas/realtimeWeather200One";
import type { ForecastWeather200One } from "@/generated/weatherapi-schemas/forecastWeather200One";
import type { MetObservationResponse } from "@/generated/dmi-schemas/metObservationResponse";
import type { ForecastResponse as DMIForecastResponse } from "@/generated/dmi-schemas/forecastResponse";

// Import card component interfaces to avoid duplication
import type { TempCardProps } from "@/components/cards/TempCard";
import type { WindCardProps } from "@/components/cards/WindCard";
import type { ForecastCardProps } from "@/components/cards/ForecastCard";

// Type aliases for better naming consistency
export type NormalizedTemperatureData = TempCardProps;
export type NormalizedWindData = WindCardProps;
export type NormalizedForecastData = ForecastCardProps;

// OpenWeather transformers
export function transformOpenWeatherTemperature(
  data: CurrentWeatherResponse
): NormalizedTemperatureData {
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

export function transformOpenWeatherWind(
  data: CurrentWeatherResponse
): NormalizedWindData {
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

export function transformOpenWeatherForecast(
  data: ForecastResponse
): NormalizedForecastData {
  const today = data.list?.[0];
  const tomorrow =
    data.list?.find(
      (item, index) =>
        index > 0 &&
        item.dt &&
        today?.dt &&
        new Date(item.dt * 1000).getDate() !==
          new Date(today.dt * 1000).getDate()
    ) || data.list?.[8]; // ~24h later if no date change found

  return {
    apiName: "OpenWeatherMap",
    temperature: today?.main?.temp || 0,
    description: today?.weather?.[0]?.description || "",
    icon: today?.weather?.[0]?.icon
      ? `https://openweathermap.org/img/wn/${today.weather[0].icon}@2x.png`
      : undefined,
    highTemp: today?.main?.temp_max || 0,
    lowTemp: today?.main?.temp_min || 0,
    precipitationChance: (today?.pop || 0) * 100,
    tomorrowHighTemp: tomorrow?.main?.temp_max || 0,
    tomorrowLowTemp: tomorrow?.main?.temp_min || 0,
    tomorrowDescription: tomorrow?.weather?.[0]?.description || "",
    tomorrowPrecipChance: (tomorrow?.pop || 0) * 100,
    location: data.city?.name || "Unknown Location",
    timestamp: today?.dt
      ? new Date(today.dt * 1000).toISOString()
      : new Date().toISOString()
  };
}

// WeatherAPI transformers
export function transformWeatherAPITemperature(
  data: RealtimeWeather200One
): NormalizedTemperatureData {
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

export function transformWeatherAPIWind(
  data: RealtimeWeather200One
): NormalizedWindData {
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

export function transformWeatherAPIForecast(
  data: ForecastWeather200One
): NormalizedForecastData {
  const today = data.forecast?.forecastday?.[0];
  const tomorrow = data.forecast?.forecastday?.[1];
  const fallbackLocation =
    data.location?.lat && data.location?.lon
      ? `${data.location.lat.toFixed(3)}°N, ${data.location.lon.toFixed(3)}°E`
      : "Unknown";

  return {
    apiName: "WeatherAPI.com",
    temperature: data.current?.temp_c || 0,
    description: data.current?.condition?.text || "",
    icon: data.current?.condition?.icon?.startsWith("//")
      ? `https:${data.current.condition.icon}`
      : data.current?.condition?.icon,
    highTemp: today?.day?.maxtemp_c || 0,
    lowTemp: today?.day?.mintemp_c || 0,
    precipitationChance: today?.day?.daily_chance_of_rain || 0,
    tomorrowHighTemp: tomorrow?.day?.maxtemp_c || 0,
    tomorrowLowTemp: tomorrow?.day?.mintemp_c || 0,
    tomorrowDescription: tomorrow?.day?.condition?.text || "",
    tomorrowPrecipChance: tomorrow?.day?.daily_chance_of_rain || 0,
    location: data.location?.name || fallbackLocation,
    timestamp: data.current?.last_updated_epoch
      ? new Date(data.current.last_updated_epoch * 1000).toISOString()
      : new Date().toISOString()
  };
}

// DMI transformers
export function transformDMITemperature(
  data: MetObservationResponse,
  coords: Coordinates
): NormalizedTemperatureData {
  const feature = data.features?.[0];
  return {
    apiName: "DMI",
    temperature: feature?.properties?.value || 0,
    location:
      feature?.properties?.stationId ||
      `DMI Station (${coords.lat.toFixed(3)}°N, ${coords.lon.toFixed(3)}°E)`,
    timestamp: feature?.properties?.observed || new Date().toISOString()
  };
}

export function transformDMIWind(
  windSpeedData: MetObservationResponse,
  windDirData: MetObservationResponse | undefined,
  coords: Coordinates
): NormalizedWindData {
  const windSpeedFeature = windSpeedData.features?.[0];
  const windDirFeature = windDirData?.features?.[0];

  return {
    apiName: "DMI",
    windSpeed: windSpeedFeature?.properties?.value || 0,
    windDirection: windDirFeature?.properties?.value || 0,
    location:
      windSpeedFeature?.properties?.stationId ||
      `DMI Station (${coords.lat.toFixed(3)}°N, ${coords.lon.toFixed(3)}°E)`,
    timestamp:
      windSpeedFeature?.properties?.observed || new Date().toISOString()
  };
}

export function transformDMIForecast(
  data: DMIForecastResponse,
  coords: Coordinates
): NormalizedForecastData {
  // DMI marine forecast doesn't provide traditional daily forecasts,
  // so we'll create a simplified forecast based on current marine conditions
  const waterTemp = data.ranges?.["water-temperature"]?.values?.[0];
  const windU = data.ranges?.["wind-u"]?.values?.[0];
  const windV = data.ranges?.["wind-v"]?.values?.[0];
  const windSpeed =
    windU && windV ? Math.sqrt(windU * windU + windV * windV) : undefined;

  return {
    apiName: "DMI (Danish Meteorological Institute)",
    temperature: waterTemp || 15,
    description: `Marine conditions - ${windSpeed ? `Wind ${Math.round(windSpeed * 10) / 10} m/s` : "Calm"}`,
    highTemp: waterTemp ? Math.round((waterTemp + 2) * 10) / 10 : 17,
    lowTemp: waterTemp ? Math.round((waterTemp - 2) * 10) / 10 : 13,
    precipitationChance: 0, // Not available in marine forecast
    tomorrowHighTemp: waterTemp ? Math.round((waterTemp + 1) * 10) / 10 : 16,
    tomorrowLowTemp: waterTemp ? Math.round((waterTemp - 1) * 10) / 10 : 14,
    tomorrowDescription: `Marine forecast - ${windSpeed ? `Wind ${Math.round(windSpeed * 10) / 10} m/s` : "Calm"}`,
    tomorrowPrecipChance: 0,
    location: `Marine Station (${coords.lat.toFixed(3)}°N, ${coords.lon.toFixed(3)}°E)`,
    timestamp: data.domain?.axes?.t?.values?.[0] || new Date().toISOString()
  };
}
