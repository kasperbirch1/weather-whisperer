import { weatherApis } from "./weather-apis";

// Type definitions for API responses
interface MeteoResult {
  value: number;
  location: string;
  timestamp: string;
}

interface ForecastDomain {
  axes?: {
    t?: {
      values: string[];
    };
  };
}

interface ForecastRange {
  values?: (number | null)[];
}

interface ForecastRanges {
  [key: string]: ForecastRange;
}

// Helper function to fetch from OpenWeatherMap using existing API config
export async function fetchOpenWeatherData(lat: number, lon: number) {
  try {
    if (!weatherApis.openweather.apiKey) return null;

    const url = weatherApis.openweather.getCurrentWeatherUrl(lat, lon);
    const headers = weatherApis.openweather.getHeaders();

    const response = await fetch(url, {
      headers,
      next: { revalidate: 300 },
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("OpenWeather API error:", error);
    return null;
  }
}

// Helper function to fetch from WeatherAPI using existing API config
export async function fetchWeatherAPIData(lat: number, lon: number) {
  try {
    if (!weatherApis.weatherapi.apiKey) return null;

    const url = weatherApis.weatherapi.getCurrentWeatherUrl(lat, lon);
    const headers = weatherApis.weatherapi.getHeaders();

    const response = await fetch(url, {
      headers,
      next: { revalidate: 300 },
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("WeatherAPI error:", error);
    return null;
  }
}

// Helper function to fetch DMI wind data using existing API config
export async function fetchDMIWindData(lat: number, lon: number) {
  try {
    if (!weatherApis.dmi.meteo.apiKey) return null;

    // Single attempt with moderate radius
    const bbox = `${lon - 0.5},${lat - 0.5},${lon + 0.5},${lat + 0.5}`;
    const headers = weatherApis.dmi.meteo.getHeaders();

    let windSpeed = 0;
    let windDirection = 0;
    let stationId = "DMI Station";
    let timestamp = new Date().toISOString();
    let foundData = false;

    try {
      // Fetch wind speed
      const windSpeedUrl = weatherApis.dmi.meteo.getObservationsUrl(
        "wind_speed",
        bbox,
        10
      );
      const windResponse = await fetch(windSpeedUrl, {
        headers,
        next: { revalidate: 300 },
      });

      if (windResponse.ok) {
        const windData = await windResponse.json();
        if (windData.features && windData.features.length > 0) {
          const feature = windData.features[0];
          windSpeed = feature.properties?.value || 0;
          stationId = feature.properties?.stationId || "DMI Station";
          timestamp = feature.properties?.observed || new Date().toISOString();
          foundData = true;
        }
      }

      // If we got wind speed, also try wind direction
      if (foundData) {
        try {
          const windDirUrl = weatherApis.dmi.meteo.getObservationsUrl(
            "wind_dir",
            bbox,
            10
          );
          const dirResponse = await fetch(windDirUrl, {
            headers,
            next: { revalidate: 300 },
          });

          if (dirResponse.ok) {
            const dirData = await dirResponse.json();
            if (dirData.features && dirData.features.length > 0) {
              windDirection = dirData.features[0].properties?.value || 0;
            }
          }
        } catch (error) {
          console.warn("Failed to fetch wind direction:", error);
          // Keep windDirection as 0 if direction fetch fails
        }

        return {
          windSpeed,
          windDirection,
          location: stationId,
          timestamp,
        };
      }
    } catch (error) {
      console.warn("Failed to fetch wind data:", error);
    }

    return null;
  } catch (error) {
    console.error("DMI wind API error:", error);
    return null;
  }
}

// Helper function to fetch DMI temperature data using existing API config
export async function fetchDMITempData(lat: number, lon: number) {
  try {
    if (!weatherApis.dmi.meteo.apiKey) return null;

    // Single attempt with one parameter
    const bbox = `${lon - 0.5},${lat - 0.5},${lon + 0.5},${lat + 0.5}`;

    try {
      const url = weatherApis.dmi.meteo.getObservationsUrl("temp_dry", bbox, 10);
      const headers = weatherApis.dmi.meteo.getHeaders();

      const response = await fetch(url, {
        headers,
        next: { revalidate: 300 },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          const feature = data.features[0];
          return {
            temperature: feature.properties?.value || 0,
            location: feature.properties?.stationId || "DMI Station",
            timestamp: feature.properties?.observed || new Date().toISOString(),
          };
        }
      }
    } catch (error) {
      console.warn("Failed to fetch temperature data:", error);
    }

    return null;
  } catch (error) {
    console.error("DMI temperature API error:", error);
    return null;
  }
}

// Helper function to fetch DMI sea level (nivå) data using existing API config
export async function fetchDMISeaLevelData(lat: number, lon: number) {
  try {
    if (!weatherApis.dmi.meteo.apiKey) return null;

    // Single attempt for sea level
    const bbox = `${lon - 1.0},${lat - 1.0},${lon + 1.0},${lat + 1.0}`;

    try {
      const url = weatherApis.dmi.meteo.getObservationsUrl("sea_reg", bbox, 10);
      const headers = weatherApis.dmi.meteo.getHeaders();

      const response = await fetch(url, {
        headers,
        next: { revalidate: 300 },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          const feature = data.features[0];
          return {
            seaLevel: feature.properties?.value || 0, // in cm
            location: feature.properties?.stationId || "DMI Sea Level Station",
            timestamp: feature.properties?.observed || new Date().toISOString(),
          };
        }
      }
    } catch (error) {
      console.warn("Failed to fetch sea level data:", error);
    }

    return null;
  } catch (error) {
    console.error("DMI sea level API error:", error);
    return null;
  }
}

// Helper function to fetch comprehensive DMI meteo data
export async function fetchDMIMeteoData(lat: number, lon: number) {
  try {
    if (!weatherApis.dmi.meteo.apiKey) return null;

    const bbox = `${lon - 0.2},${lat - 0.2},${lon + 0.2},${lat + 0.2}`;
    const meteoParams = ["pressure", "humidity", "wind_dir"];
    const results: Record<string, MeteoResult> = {};

    for (const param of meteoParams) {
      try {
        const url = weatherApis.dmi.meteo.getObservationsUrl(param, bbox, 20);
        const headers = weatherApis.dmi.meteo.getHeaders();

        const response = await fetch(url, {
          headers,
          next: { revalidate: 300 },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.features && data.features.length > 0) {
            const feature = data.features[0];
            results[param] = {
              value: feature.properties?.value || 0,
              location: feature.properties?.stationId || "DMI Station",
              timestamp:
                feature.properties?.observed || new Date().toISOString(),
            };
          }
        }
      } catch (error) {
        console.warn(`Failed to fetch meteo data for ${param}:`, error);
      }
    }

    if (Object.keys(results).length > 0) {
      return {
        pressure: results.pressure?.value,
        humidity: results.humidity?.value,
        windDirection: results.wind_dir?.value,
        location:
          results.pressure?.location ||
          results.humidity?.location ||
          "DMI Station",
        timestamp:
          results.pressure?.timestamp ||
          results.humidity?.timestamp ||
          new Date().toISOString(),
      };
    }
    return null;
  } catch (error) {
    console.error("DMI meteo API error:", error);
    return null;
  }
}

// Helper function to fetch DMI ocean data using existing API config
export async function fetchDMIOceanData(lat: number, lon: number) {
  try {
    if (!weatherApis.dmi.ocean.apiKey) return null;

    // Single attempt for ocean data
    try {
      const url = weatherApis.dmi.ocean.getObservationsUrl(lat, lon);
      const headers = weatherApis.dmi.ocean.getHeaders();

      const response = await fetch(url, {
        headers,
        next: { revalidate: 300 },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          const feature = data.features[0];
          const props = feature.properties;

          // Only return data if we have at least one valid measurement
          if (
            props?.value !== undefined ||
            props?.temp !== undefined ||
            props?.salinity !== undefined
          ) {
            return {
              waveHeight: props?.value,
              waterTemperature: props?.temp,
              salinity: props?.salinity,
              location: props?.stationId || "DMI Ocean Station",
              timestamp: props?.observed || new Date().toISOString(),
            };
          }
        }
      }
    } catch (error) {
      console.warn("Failed to fetch ocean data:", error);
    }

    return null; // No valid ocean data found
  } catch (error) {
    console.error("DMI ocean API error:", error);
    return null;
  }
}

// Helper function to try forecast collection (from original working code)
async function tryForecastCollection(
  collection: string,
  lat: number,
  lon: number,
  parameters: string[],
  headers: Record<string, string>
): Promise<Record<string, unknown> | null> {
  const coords = `POINT(${lon}%20${lat})`;
  const parameterNames = parameters.join(",");
  const url = `${weatherApis.dmi.forecast.url}/collections/${collection}/position?coords=${coords}&parameter-name=${parameterNames}`;

  const response = await fetch(url, {
    method: "GET",
    headers,
    next: { revalidate: 1800 },
  });

  if (response.ok) {
    const data = await response.json();

    // Check if the data contains valid (non-null) values
    const hasValidData =
      data.ranges &&
      Object.values(data.ranges).some((range: unknown) => {
        if (typeof range === "object" && range !== null) {
          const rangeObj = range as Record<string, unknown>;
          return (
            rangeObj.values &&
            Array.isArray(rangeObj.values) &&
            rangeObj.values.some((value: unknown) => value !== null)
          );
        }
        return false;
      });

    if (hasValidData) {
      return data;
    }
  }

  return null;
}

// Helper function to fetch DMI forecast data using existing API config (restored original)
export async function fetchDMIForecast(lat: number, lon: number) {
  try {
    if (!weatherApis.dmi.forecast.apiKey) return null;

    // Fetch wind and ocean forecast parameters most relevant to windsurfers (original parameters)
    const parameters = [
      "wind-u",
      "wind-v",
      "sea-mean-deviation",
      "water-temperature",
    ];
    const headers = weatherApis.dmi.forecast.getHeaders();

    // Try both collections - NSBS (North Sea Baltic Sea) and IDW (Inner Danish Waters)
    // IDW is better for coastal/near-shore locations
    const collections = ["dkss_nsbs", "dkss_idw"];

    for (const collection of collections) {
      try {
        const data = await tryForecastCollection(
          collection,
          lat,
          lon,
          parameters,
          headers
        );
        if (data) {
          // Process and return in the format expected by ForecastCard
          const domain = data.domain as ForecastDomain;
          const ranges = data.ranges as ForecastRanges;
          const timeValues = domain?.axes?.t?.values || [];
          const firstTime = timeValues[0];

          // Calculate wind speed and direction from u/v components
          const windU = ranges["wind-u"]?.values?.[0];
          const windV = ranges["wind-v"]?.values?.[0];
          let windSpeed = 0;
          let windDirection = 0;

          if (
            windU !== null &&
            windV !== null &&
            windU !== undefined &&
            windV !== undefined
          ) {
            windSpeed = Math.sqrt(windU * windU + windV * windV);
            windDirection = (Math.atan2(windU, windV) * 180) / Math.PI;
            if (windDirection < 0) windDirection += 360;
          }

          return {
            temperature: ranges["water-temperature"]?.values?.[0] || 10,
            windSpeed: windSpeed,
            windDirection: windDirection,
            waterTemp: ranges["water-temperature"]?.values?.[0] || 10,
            seaLevel: ranges["sea-mean-deviation"]?.values?.[0] || 0,
            description: `Wind: ${windSpeed.toFixed(1)}m/s, Water: ${(
              ranges["water-temperature"]?.values?.[0] || 10
            ).toFixed(1)}°C`,
            validTime: firstTime
              ? new Date(firstTime).toISOString()
              : new Date().toISOString(),
            location: "DMI Forecast",
            timestamp: new Date().toISOString(),
          };
        }
      } catch (error) {
        continue;
      }
    }

    return null;
  } catch (error) {
    console.error("DMI forecast API error:", error);
    return null;
  }
}

// Helper function to fetch DMI lightning data using existing API config
export async function fetchDMILightningData(lat: number, lon: number) {
  try {
    if (!weatherApis.dmi.lightning.apiKey) return null;

    // Create a larger bounding box around the coordinates for lightning data
    const margin = 0.5; // Larger area for lightning detection
    const bbox = `${lon - margin},${lat - margin},${lon + margin},${
      lat + margin
    }`;

    // Get lightning data from the last 2 hours
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const datetime = `${twoHoursAgo}/..`; // From 2 hours ago to now

    const url = weatherApis.dmi.lightning.getObservationsUrl(
      bbox,
      datetime,
      100
    );
    const headers = weatherApis.dmi.lightning.getHeaders();

    const response = await fetch(url, {
      headers,
      next: { revalidate: 300 },
    });

    if (!response.ok) return null;
    const data = await response.json();

    // Process DMI lightning data
    if (data.features && data.features.length > 0) {
      const strikes = data.features;
      const latestStrike = strikes[0];

      return {
        strikeCount: strikes.length,
        areaStrikeCount: strikes.length,
        lastStrikeTime:
          latestStrike.properties?.observed || new Date().toISOString(),
        distance: latestStrike.properties?.distance || null,
        intensity: latestStrike.properties?.value || null,
        riskLevel: (strikes.length > 10
          ? "high"
          : strikes.length > 5
          ? "moderate"
          : "low") as "low" | "moderate" | "high" | "extreme",
        location: `Lightning Area (${strikes.length} strikes)`,
        timestamp: new Date().toISOString(),
      };
    }

    // Return null when no lightning activity is detected
    return null;
  } catch (error) {
    console.error("DMI lightning API error:", error);
    return null;
  }
}

// Helper function to fetch OpenWeatherMap forecast data
export async function fetchOpenWeatherForecast(lat: number, lon: number) {
  try {
    if (!weatherApis.openweather.apiKey) return null;

    const url = weatherApis.openweather.getForecastUrl(lat, lon);
    const headers = weatherApis.openweather.getHeaders();

    const response = await fetch(url, {
      headers,
      next: { revalidate: 300 },
    });

    if (!response.ok) return null;
    const data = await response.json();

    // Process forecast data - get today and tomorrow's forecast
    if (data.list && data.list.length > 0) {
      const today = data.list[0];
      const tomorrow =
        data.list.find(
          (item: { dt: number }, index: number) =>
            index > 0 &&
            new Date(item.dt * 1000).getDate() !==
              new Date(today.dt * 1000).getDate()
        ) || data.list[8]; // ~24h later

      return {
        temperature: today.main?.temp || 0,
        description: today.weather?.[0]?.description || "",
        icon: today.weather?.[0]?.icon
          ? `https://openweathermap.org/img/wn/${today.weather[0].icon}@2x.png`
          : "",
        highTemp: today.main?.temp_max || 0,
        lowTemp: today.main?.temp_min || 0,
        precipitationChance: (today.pop || 0) * 100,
        tomorrowHighTemp: tomorrow?.main?.temp_max || 0,
        tomorrowLowTemp: tomorrow?.main?.temp_min || 0,
        tomorrowDescription: tomorrow?.weather?.[0]?.description || "",
        tomorrowPrecipChance: (tomorrow?.pop || 0) * 100,
        location: data.city?.name || "Unknown",
        timestamp: new Date(today.dt * 1000).toISOString(),
      };
    }
    return null;
  } catch (error) {
    console.error("OpenWeather forecast API error:", error);
    return null;
  }
}

// Helper function to fetch WeatherAPI forecast data
export async function fetchWeatherAPIForecast(lat: number, lon: number) {
  try {
    if (!weatherApis.weatherapi.apiKey) return null;

    const url = weatherApis.weatherapi.getForecastUrl(lat, lon, 3);
    const headers = weatherApis.weatherapi.getHeaders();

    const response = await fetch(url, {
      headers,
      next: { revalidate: 300 },
    });

    if (!response.ok) return null;
    const data = await response.json();

    // Process forecast data
    if (
      data.forecast &&
      data.forecast.forecastday &&
      data.forecast.forecastday.length > 0
    ) {
      const today = data.forecast.forecastday[0];
      const tomorrow = data.forecast.forecastday[1];

      return {
        temperature: data.current?.temp_c || 0,
        description: data.current?.condition?.text || "",
        icon: data.current?.condition?.icon || "",
        highTemp: today.day?.maxtemp_c || 0,
        lowTemp: today.day?.mintemp_c || 0,
        precipitationChance: today.day?.daily_chance_of_rain || 0,
        tomorrowHighTemp: tomorrow?.day?.maxtemp_c || 0,
        tomorrowLowTemp: tomorrow?.day?.mintemp_c || 0,
        tomorrowDescription: tomorrow?.day?.condition?.text || "",
        tomorrowPrecipChance: tomorrow?.day?.daily_chance_of_rain || 0,
        location: data.location?.name || "Unknown",
        timestamp: new Date(
          data.current?.last_updated_epoch * 1000
        ).toISOString(),
      };
    }
    return null;
  } catch (error) {
    console.error("WeatherAPI forecast API error:", error);
    return null;
  }
}
