import { wetherApis } from "./wether-apis";
import { WeatherData } from "./types";

export async function fetchWeatherData(
  url: string,
  headers: Record<string, string>
): Promise<WeatherData> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

export async function fetchOceanData(
  lat: number,
  lon: number
): Promise<WeatherData> {
  const url = wetherApis.dmi.ocean.getObservationsUrl(lat, lon);
  const headers = wetherApis.dmi.ocean.getHeaders();
  return fetchWeatherData(url, headers);
}

export async function fetchWindData(
  lat?: number,
  lon?: number
): Promise<WeatherData> {
  let bbox: string | undefined;

  // If coordinates are provided, create a bounding box around the location
  if (lat !== undefined && lon !== undefined) {
    // Create a larger bounding box (±0.2 degrees, ~22km) around the coordinates
    // This should capture nearby coastal weather stations
    const margin = 0.2;
    bbox = `${lon - margin},${lat - margin},${lon + margin},${lat + margin}`;
  }

  const url = wetherApis.dmi.meteo.getObservationsUrl("wind_speed", bbox, 50);
  const headers = wetherApis.dmi.meteo.getHeaders();
  return fetchWeatherData(url, headers);
}

export async function fetchLightningData(
  lat: number,
  lon: number
): Promise<WeatherData> {
  // Create a bounding box around the coordinates for lightning data
  const margin = 0.5; // Larger area for lightning detection
  const bbox = `${lon - margin},${lat - margin},${lon + margin},${
    lat + margin
  }`;

  // Get lightning data from the last 2 hours
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  const datetime = `${twoHoursAgo}/..`; // From 2 hours ago to now

  const url = wetherApis.dmi.lightning.getObservationsUrl(bbox, datetime, 50);
  const headers = wetherApis.dmi.lightning.getHeaders();
  return fetchWeatherData(url, headers);
}

export async function fetchTemperatureData(
  lat?: number,
  lon?: number
): Promise<WeatherData> {
  let bbox: string | undefined;

  if (lat !== undefined && lon !== undefined) {
    const margin = 0.2;
    bbox = `${lon - margin},${lat - margin},${lon + margin},${lat + margin}`;
  }

  // Try different temperature parameter IDs
  const tempParams = ["temp_dry", "temp_mean_past1h", "temp"];

  for (const param of tempParams) {
    try {
      const url = wetherApis.dmi.meteo.getObservationsUrl(param, bbox, 20);
      const headers = wetherApis.dmi.meteo.getHeaders();
      const data = await fetchWeatherData(url, headers);
      if (data.features && data.features.length > 0) {
        return data;
      }
    } catch (error) {
      console.warn(
        `Failed to fetch temperature data with parameter ${param}:`,
        error
      );
    }
  }

  // Return empty data if none of the parameters work
  return { type: "FeatureCollection", features: [] };
}
