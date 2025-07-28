import { WeatherData, WeatherObservation, ParameterSummary } from "./types";

export function getParameterDisplayName(parameterId: string): string {
  const parameterNames: Record<string, string> = {
    sea_reg: "Sea Level",
    tw: "Water Temperature",
    wind_speed: "Wind Speed",
    wind_dir: "Wind Direction",
    temp: "Air Temperature",
    temp_dry: "Air Temperature",
    temp_mean_past1h: "Air Temperature (1h avg)",
    humidity: "Humidity",
    pressure: "Atmospheric Pressure",
    visibility: "Visibility",
    precip: "Precipitation",
    cloud: "Cloud Cover",
    uv: "UV Index"
  };
  return parameterNames[parameterId] || parameterId;
}

export function getParameterUnit(parameterId: string): string {
  const parameterUnits: Record<string, string> = {
    sea_reg: "cm",
    tw: "°C",
    wind_speed: "m/s",
    wind_dir: "°",
    temp: "°C",
    temp_dry: "°C",
    temp_mean_past1h: "°C",
    humidity: "%",
    pressure: "hPa",
    visibility: "km",
    precip: "mm",
    cloud: "%",
    uv: ""
  };
  return parameterUnits[parameterId] || "";
}

export function analyzeParameters(
  weatherData: WeatherData
): Record<string, ParameterSummary> {
  if (!weatherData.features) return {};

  const summary: Record<string, ParameterSummary> = {};

  weatherData.features.forEach((feature) => {
    const paramId = feature.properties.parameterId;
    if (!summary[paramId]) {
      summary[paramId] = {
        count: 0,
        latestValue: feature.properties.value,
        latestTime: feature.properties.observed
      };
    }
    summary[paramId].count++;

    if (
      new Date(feature.properties.observed) >
      new Date(summary[paramId].latestTime)
    ) {
      summary[paramId].latestValue = feature.properties.value;
      summary[paramId].latestTime = feature.properties.observed;
    }
  });

  return summary;
}

export function extractWindspeedData(
  weatherData: WeatherData
): WeatherObservation[] {
  const windObservations = weatherData.features.filter(
    (feature) => feature.properties.parameterId === "wind_speed"
  );

  // Group by station ID and keep only the most recent observation from each station
  const stationMap = new Map<string, WeatherObservation>();

  windObservations.forEach((obs) => {
    const stationId = obs.properties.stationId;
    const existing = stationMap.get(stationId);

    if (
      !existing ||
      new Date(obs.properties.observed) > new Date(existing.properties.observed)
    ) {
      stationMap.set(stationId, obs);
    }
  });

  // Return array of unique stations with their latest observations
  return Array.from(stationMap.values());
}
