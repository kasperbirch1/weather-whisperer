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
  coordinates: { lat: number; lon: number };
  windspeedData: WeatherObservation[];
  oceanData: WeatherData;
  meteoData: WeatherData;
  lightningData: WeatherData;
  temperatureData: WeatherData;
  forecastData: Record<string, unknown> | null; // Forecast data has a different structure (CoverageJSON)
  error?: string;
}
