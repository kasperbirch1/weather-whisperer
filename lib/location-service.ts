import { LocationWeatherData, WeatherData } from "./types";
import { fetchOceanData, fetchWindData } from "./weather-service";
import { extractWindspeedData } from "./weather-utils";

export async function fetchLocationData(
  locationName: string,
  coords: { lat: number; lon: number }
): Promise<LocationWeatherData> {
  let oceanData: WeatherData = { type: "FeatureCollection", features: [] };
  let meteoData: WeatherData = { type: "FeatureCollection", features: [] };
  let error: string | undefined;

  // Fetch ocean data
  try {
    oceanData = await fetchOceanData(coords.lat, coords.lon);
  } catch (oceanError) {
    console.warn(`Failed to fetch ocean data for ${locationName}:`, oceanError);
    error = `Ocean data unavailable: ${String(oceanError)}`;
  }

  // Fetch wind data
  try {
    meteoData = await fetchWindData();
  } catch (meteoError) {
    console.warn(`Failed to fetch wind data for ${locationName}:`, meteoError);
    if (!error) error = `Wind data unavailable: ${String(meteoError)}`;
  }

  return {
    location: locationName,
    coordinates: coords,
    windspeedData: extractWindspeedData(meteoData),
    oceanData,
    meteoData,
    error,
  };
}
