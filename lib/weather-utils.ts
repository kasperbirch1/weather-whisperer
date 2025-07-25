import { WeatherData, WeatherObservation, ParameterSummary } from "./types";

export function getParameterDisplayName(parameterId: string): string {
  const parameterNames: Record<string, string> = {
    sea_reg: "Sea Level",
    tw: "Water Temperature",
    wind_speed: "Wind Speed",
    wind_dir: "Wind Direction",
    temp: "Air Temperature",
    humidity: "Humidity",
    pressure: "Atmospheric Pressure",
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
    humidity: "%",
    pressure: "hPa",
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
        latestTime: feature.properties.observed,
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
  return weatherData.features.filter(
    (feature) => feature.properties.parameterId === "wind_speed"
  );
}
