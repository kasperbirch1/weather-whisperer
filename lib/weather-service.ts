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

export async function fetchWindData(): Promise<WeatherData> {
  const url = wetherApis.dmi.meteo.getObservationsUrl(
    "wind_speed",
    undefined,
    50
  );
  const headers = wetherApis.dmi.meteo.getHeaders();
  return fetchWeatherData(url, headers);
}
