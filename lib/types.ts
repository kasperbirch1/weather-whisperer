// Shared coordinate interface for consistency across components
export interface Coordinates {
  lat: number;
  lon: number;
}

export interface WeatherObservation {
  id: string;
  type: string;
  geometry: {
    coordinates: [number, number];
    type: string;
  };
  properties: {
    created: string;
    observed: string;
    parameterId: string;
    value: number;
    stationId: string;
    qcStatus?: string;
    qcResult?: number;
  };
}

export interface WeatherData {
  type: string;
  features: WeatherObservation[];
}

export interface ParameterSummary {
  count: number;
  latestValue: number;
  latestTime: string;
}

export interface LocationWeatherData {
  location: string;
  coordinates: Coordinates;
  windspeedData: WeatherObservation[];
  oceanData: WeatherData;
  meteoData: WeatherData;
  lightningData: WeatherData;
  temperatureData: WeatherData;
  forecastData: Record<string, unknown> | null; // Forecast data has a different structure (CoverageJSON)
  error?: string;
}

// Enhanced types for improved API handling
export interface EnhancedLocationWeatherData {
  location: string;
  coordinates: Coordinates;
  windspeedData: WeatherObservation[];
  ocean: {
    data: WeatherData | null;
    status: "success" | "error" | "timeout" | "no-data";
    error?: string;
    responseTime: number;
  };
  wind: {
    data: WeatherData | null;
    status: "success" | "error" | "timeout" | "no-data";
    error?: string;
    responseTime: number;
    parametersAttempted: string[];
  };
  lightning: {
    data: WeatherData | null;
    status: "success" | "error" | "timeout" | "no-data";
    error?: string;
    responseTime: number;
  };
  temperature: {
    data: WeatherData | null;
    status: "success" | "error" | "timeout" | "no-data";
    error?: string;
    responseTime: number;
  };
  forecast: {
    data: Record<string, unknown> | null;
    status: "success" | "error" | "timeout" | "no-data";
    error?: string;
    responseTime: number;
    collection?: string;
  };
  performance: {
    totalTime: number;
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
  };
  lastUpdated: string;
}

// Types for external weather APIs
export interface OpenWeatherMapResponse {
  coord: { lon: number; lat: number };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  rain?: {
    "1h"?: number;
    "3h"?: number;
  };
  snow?: {
    "1h"?: number;
    "3h"?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface WeatherAPIResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current: {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
    air_quality?: {
      co: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      "us-epa-index": number;
      "gb-defra-index": number;
    };
  };
}

// Generic external weather data that can be converted to our internal format
export interface ExternalWeatherData {
  source: "openweather" | "weatherapi" | "other";
  temperature?: number;
  windSpeed?: number;
  windDirection?: number;
  humidity?: number;
  pressure?: number;
  visibility?: number;
  cloudCover?: number;
  precipitation?: number;
  timestamp: number;
  location: {
    lat: number;
    lon: number;
    name?: string;
  };
  rawData: Record<string, unknown>; // Store original response for debugging
}
