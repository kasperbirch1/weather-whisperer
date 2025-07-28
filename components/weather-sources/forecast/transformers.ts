// Forecast data transformers that normalize API responses to ForecastCard component props

// Import generated API types
import type { ForecastResponse } from "@/generated/openweather-schemas/forecastResponse";
import type { ForecastWeather200One } from "@/generated/weatherapi-schemas/forecastWeather200One";
import type { ForecastResponse as DMIForecastResponse } from "@/generated/dmi-schemas/forecastResponse";

// Import card component interface
import type { ForecastCardProps } from "@/components/cards/ForecastCard";

// OpenWeather forecast transformer
export function transformOpenWeatherForecast(
  data: ForecastResponse
): ForecastCardProps {
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

// WeatherAPI forecast transformer
export function transformWeatherAPIForecast(
  data: ForecastWeather200One
): ForecastCardProps {
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

// DMI forecast transformer
export function transformDMIForecast(
  data: DMIForecastResponse
): ForecastCardProps {
  // DMI marine forecast doesn't provide traditional daily forecasts,
  // so we'll create a simplified forecast based on current marine conditions
  // Provide fallback values if data or ranges are missing
  const waterTemp = data?.ranges?.["water-temperature"]?.values?.[0];
  const windU = data?.ranges?.["wind-u"]?.values?.[0];
  const windV = data?.ranges?.["wind-v"]?.values?.[0];
  const windSpeed = windU && windV ? Math.sqrt(windU * windU + windV * windV) : undefined;

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
    location: "Unknown Marine Station",
    timestamp: data?.domain?.axes?.t?.values?.[0] || new Date().toISOString()
  };
}
