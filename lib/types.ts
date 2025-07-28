// Core interfaces used throughout the application
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
