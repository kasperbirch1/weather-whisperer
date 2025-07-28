// Custom fetch configuration
interface FetchConfig {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, any>;
  signal?: AbortSignal;
  responseType?: "json" | "text" | "blob";
}

// Custom mutator function for Orval using fetch
export const customInstance = <T>(
  config: FetchConfig,
  options?: RequestInit
): Promise<T> => {
  console.log("🔥 MUTATOR CALLED - Config:", config);
  const {
    url,
    method = "GET",
    headers = {},
    data,
    params,
    signal,
    responseType = "json"
  } = config;

  // Determine base URL and API key based on the endpoint
  const getBaseURLAndKey = (
    url: string
  ): { baseURL: string; apiKey?: string } => {
    if (url.startsWith("/forecastedr/")) {
      // DMI Forecast EDR API (v1) - needs to come before /forecast check
      return {
        baseURL: "https://dmigw.govcloud.dk/v1",
        apiKey: process.env.NEXT_PUBLIC_FORECASTEDR_API_KEY || ""
      };
    } else if (url.startsWith("/v1/forecastedr/")) {
      // DMI Forecast EDR API (v1)
      return {
        baseURL: "https://dmigw.govcloud.dk",
        apiKey: process.env.NEXT_PUBLIC_FORECASTEDR_API_KEY || ""
      };
    } else if (
      url.startsWith("/weather") ||
      url.startsWith("/forecast") ||
      url.startsWith("/data/") ||
      url.startsWith("/geo/")
    ) {
      // OpenWeatherMap API
      return { baseURL: "https://api.openweathermap.org/data/2.5" };
    } else if (
      url.startsWith("/v1/current.json") ||
      url.startsWith("/v1/forecast.json")
    ) {
      // WeatherAPI
      return { baseURL: "http://api.weatherapi.com" };
    } else if (url.startsWith("/oceanObs/")) {
      // DMI Ocean Observations API (v2)
      return {
        baseURL: "https://dmigw.govcloud.dk/v2",
        apiKey: process.env.NEXT_PUBLIC_OCEAN_OBS_API_KEY || ""
      };
    } else if (url.startsWith("/metObs/")) {
      // DMI Meteorological Observations API (v2)
      return {
        baseURL: "https://dmigw.govcloud.dk/v2",
        apiKey: process.env.NEXT_PUBLIC_MET_OBS_API_KEY || ""
      };
    } else if (url.startsWith("/v1/forecastdata/")) {
      // DMI Forecast API (v1) - remove the /v1 from URL since base already includes it
      return {
        baseURL: "https://dmigw.govcloud.dk",
        apiKey: process.env.NEXT_PUBLIC_MET_OBS_API_KEY || "" // Using met obs key for forecast
      };
    } else if (url.startsWith("/lightningdata/")) {
      // DMI Lightning API (v2)
      return {
        baseURL: "https://dmigw.govcloud.dk/v2",
        apiKey: process.env.NEXT_PUBLIC_LIGHTNING_API_KEY || ""
      };
    } else if (url.startsWith("/climateData/")) {
      // DMI Climate API (v2)
      return {
        baseURL: "https://dmigw.govcloud.dk/v2",
        apiKey: process.env.NEXT_PUBLIC_CLIMATE_API_KEY || ""
      };
    }
    // Default: assume it's already a full URL
    return { baseURL: "" };
  };

  const { baseURL, apiKey } = getBaseURLAndKey(url);

  console.log("Mutator - URL:", url);
  console.log("Mutator - Base URL:", baseURL);
  console.log("Mutator - API Key available:", !!apiKey);

  // Build URL with query parameters
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
  }

  const fullUrl =
    params && searchParams.toString()
      ? `${baseURL}${url}?${searchParams.toString()}`
      : `${baseURL}${url}`;

  console.log("Mutator - Full URL:", fullUrl);

  // Prepare headers with API key if needed
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers
  };

  // Add DMI API key header if provided
  if (apiKey) {
    requestHeaders["X-Gravitee-Api-Key"] = apiKey;
  }

  // Prepare fetch options
  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
    signal,
    ...options
  };

  // Add body for non-GET requests
  if (data && method !== "GET") {
    fetchOptions.body = JSON.stringify(data);
  }

  return fetch(fullUrl, fetchOptions)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle different response types
      switch (responseType) {
        case "blob":
          return response.blob();
        case "text":
          return response.text();
        case "json":
        default:
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return response.json();
          }
          // For DMI Forecast EDR API, try to parse as JSON even if content-type is not set correctly
          if (
            url.startsWith("/forecastedr/") ||
            url.startsWith("/v1/forecastedr/")
          ) {
            const text = await response.text();
            try {
              return JSON.parse(text);
            } catch (parseError) {
              console.warn(
                "Failed to parse DMI forecast response as JSON:",
                parseError
              );
              return text;
            }
          }
          return response.text();
      }
    })
    .catch((error) => {
      throw error;
    });
};

// Type for the custom instance
export type ErrorType<Error = any> = Error;

// Default export for compatibility
export default customInstance;
