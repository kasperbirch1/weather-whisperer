// OpenWeatherMap API specific mutator
interface FetchConfig {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, any>;
  signal?: AbortSignal;
  responseType?: "json" | "text" | "blob";
}

export const openWeatherMutator = <T>(
  config: FetchConfig,
  options?: RequestInit
): Promise<T> => {
  console.log("🌤️ OpenWeather Mutator - Config:", config);
  const {
    url,
    method = "GET",
    headers = {},
    data,
    params,
    signal,
    responseType = "json"
  } = config;

  // OpenWeatherMap base URL
  const baseURL = "https://api.openweathermap.org/data/2.5";

  console.log("OpenWeather Mutator - URL:", url);
  console.log("OpenWeather Mutator - Base URL:", baseURL);

  // Build URL with query parameters
  const searchParams = new URLSearchParams();

  // Add API key automatically (override placeholder if present)
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  if (apiKey) {
    searchParams.append("appid", apiKey);
  }

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== "appid") {
        searchParams.append(key, String(value));
      }
    });
  }

  const fullUrl =
    params && searchParams.toString()
      ? `${baseURL}${url}?${searchParams.toString()}`
      : `${baseURL}${url}`;

  console.log("OpenWeather Mutator - Full URL:", fullUrl);

  // Prepare headers
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers
  };

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
export default openWeatherMutator;
