// Error transformers for consistent error handling across weather components
import type { NoDataCardProps } from "@/components/cards/NoDataCard";

// Weather data types and APIs
export type WeatherDataType = "temperature" | "wind" | "forecast" | "ocean" | "sea-level";
export type WeatherAPI = "OpenWeatherMap" | "WeatherAPI" | "DMI";

// Icon mapping for different data types
const DATA_TYPE_ICONS = {
  temperature: "🌡️",
  wind: "💨",
  forecast: "🔮",
  ocean: "🌊",
  "sea-level": "📏"
} as const;

// Human-readable data type names
const DATA_TYPE_NAMES = {
  temperature: "Temperature",
  wind: "Wind",
  forecast: "Forecast",
  ocean: "Ocean",
  "sea-level": "Sea Level"
} as const;

// Main error transformer that detects error type and returns appropriate NoDataCardProps
export function transformWeatherError(
  error: Error | unknown,
  dataType: WeatherDataType,
  api: WeatherAPI
): NoDataCardProps {
  // Rate limiting detection
  if (error instanceof Error && error.message.includes("429")) {
    console.error(`${api} ${dataType} rate limit error:`, error);
    return {
      icon: DATA_TYPE_ICONS[dataType],
      title: `${api} API Rate Limited`,
      description: `${api} API is currently rate limited. Please try again later.`,
      badge: { text: "Rate Limited", color: "yellow" }
    };
  }

  // Network/API offline detection
  if (error instanceof Error && (
    error.message.includes("fetch") || 
    error.message.includes("network") ||
    error.message.includes("ENOTFOUND") ||
    error.message.includes("timeout")
  )) {
    console.error(`${api} ${dataType} API offline error:`, error);
    return {
      icon: DATA_TYPE_ICONS[dataType],
      title: `No ${api} ${DATA_TYPE_NAMES[dataType]} Data`,
      description: `Unable to fetch ${dataType} data from ${api} API`,
      badge: { text: "API Offline", color: "red" }
    };
  }

  // Default to generic API error
  console.error(`${api} ${dataType} generic API error:`, error);
  return {
    icon: DATA_TYPE_ICONS[dataType],
    title: `No ${api} ${DATA_TYPE_NAMES[dataType]} Data`,
    description: `Unable to fetch ${dataType} data from ${api} API`,
    badge: { text: "API Error", color: "red" }
  };
}
