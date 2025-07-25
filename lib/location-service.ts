import { LocationWeatherData, WeatherData } from "./types";
import {
  fetchOceanData,
  fetchWindData,
  fetchLightningData,
  fetchTemperatureData,
  fetchForecastData,
} from "./weather-service";
import { extractWindspeedData } from "./weather-utils";

export async function fetchLocationData(
  locationName: string,
  coords: { lat: number; lon: number }
): Promise<LocationWeatherData> {
  let oceanData: WeatherData = { type: "FeatureCollection", features: [] };
  let meteoData: WeatherData = { type: "FeatureCollection", features: [] };
  let lightningData: WeatherData = { type: "FeatureCollection", features: [] };
  let temperatureData: WeatherData = {
    type: "FeatureCollection",
    features: [],
  };
  let forecastData: Record<string, unknown> | null = null;
  let error: string | undefined;

  // Fetch all data in parallel for better performance
  try {
    const [ocean, wind, lightning, temperature, forecast] = await Promise.all([
      fetchOceanData(coords.lat, coords.lon).catch(() => ({
        type: "FeatureCollection",
        features: [],
      })),
      fetchWindData(coords.lat, coords.lon).catch(() => ({
        type: "FeatureCollection",
        features: [],
      })),
      fetchLightningData(coords.lat, coords.lon).catch(() => ({
        type: "FeatureCollection",
        features: [],
      })),
      fetchTemperatureData(coords.lat, coords.lon).catch(() => ({
        type: "FeatureCollection",
        features: [],
      })),
      fetchForecastData(coords.lat, coords.lon).catch(() => null),
    ]);

    oceanData = ocean;
    meteoData = wind;
    lightningData = lightning;
    temperatureData = temperature;
    forecastData = forecast;
  } catch (fetchError) {
    console.warn(`Failed to fetch data for ${locationName}:`, fetchError);
    error = `Data unavailable: ${String(fetchError)}`;
  }

  return {
    location: locationName,
    coordinates: coords,
    windspeedData: extractWindspeedData(meteoData),
    oceanData,
    meteoData,
    lightningData,
    temperatureData,
    forecastData,
    error,
  };
}
