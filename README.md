# 🌊 Weather Whisperer

A clean, simple weather app that displays wind speed and ocean data from the Danish Meteorological Institute (DMI) APIs.

## 🚀 Features

- **Real-time Wind Speed Data** - Live wind measurements from DMI meteorological stations
- **Ocean Observations** - Sea level and water temperature data
- **Multi-location Support** - Configured for Nivå and Copenhagen Surf School
- **Clean JSON Data Export** - View raw weather data in JSON format

## 📁 Project Structure

```
├── app/
│   └── page.tsx              # Main page component (simplified)
├── components/
│   ├── WindSpeedCard.tsx     # Wind speed display component
│   └── ParameterCards.tsx    # Reusable parameter display component
├── lib/
│   ├── types.ts              # TypeScript type definitions
│   ├── weather-service.ts    # API fetching functions
│   ├── weather-utils.ts      # Data processing utilities
│   ├── location-service.ts   # Location data orchestration
│   └── wether-apis.ts        # API configuration
├── data/
│   └── locations.ts          # Location coordinates configuration
└── .env                      # API keys (5 DMI APIs)
```

## 🔧 Setup

1. **Install dependencies:**

   ```bash
   yarn install
   ```

2. **Environment Variables:**
   The `.env` file contains API keys for:
   - Ocean Observations API
   - Meteorological Observations API
   - Lightning Data API
   - Climate Data API
   - Radar Data API

3. **Run development server:**
   ```bash
   yarn dev
   ```

## 🏗️ Architecture

### Clean Separation of Concerns:

- **Components**: Reusable UI components with single responsibilities
- **Services**: API interaction and data fetching logic
- **Utils**: Pure functions for data processing
- **Types**: Centralized TypeScript definitions

### Key Improvements:

- ✅ **Simplified main component** (80% less code)
- ✅ **Reusable components** for wind and parameter cards
- ✅ **Type safety** with proper TypeScript interfaces
- ✅ **Single responsibility** functions
- ✅ **Easy to test** modular functions
- ✅ **Easy to extend** with new APIs or locations

## 📊 Data Sources

- **OpenWeatherMap API** - Current weather and forecasts with generated React Query hooks
- **DMI Ocean Observations API** - Sea level, water temperature with type-safe clients
- **DMI Meteorological API** - Wind speed, atmospheric data with generated types
- **DMI Lightning API** - Real-time lightning strike data
- **Real-time data** updated every 5-10 minutes
- **Geographic coverage** across Denmark and Greenland

## 🔧 Generated API Clients

The project uses **Orval** to generate type-safe React Query hooks from OpenAPI specifications:

### Available Hooks

**OpenWeather API:**

```typescript
import { useGetCurrentWeather, useGetForecast } from "@/generated/openweather";

// Get current weather with full type safety
const { data, error, isLoading } = useGetCurrentWeather({
  lat: 55.6761,
  lon: 12.5683,
  appid: "your-api-key",
  units: "metric"
});

// Get 5-day forecast
const { data: forecast } = useGetForecast({
  lat: 55.6761,
  lon: 12.5683,
  appid: "your-api-key",
  units: "metric"
});
```

**DMI APIs:**

```typescript
import {
  useGetOceanObservations,
  useGetMetObservations,
  useGetLightningData
} from "@/generated/dmi";

import { useGetDKSSNSBSFeatures } from "@/generated/dmi-forecast";

// Get ocean data with bounding box
const { data: oceanData } = useGetOceanObservations({
  bbox: "12.0,55.0,13.0,56.0",
  limit: 10
});

// Get meteorological observations (wind, temperature, etc.)
const { data: windData } = useGetMetObservations({
  bbox: "12.0,55.0,13.0,56.0",
  parameterId: "wind_speed",
  limit: 10
});

// Get DMI forecast data
const { data: forecastData } = useGetDKSSNSBSFeatures({
  bbox: [12.0, 55.0, 13.0, 56.0],
  limit: 5,
  datetime: `${new Date().toISOString()}/..`
});
```

### Benefits

✅ **Full Type Safety** - All API responses are properly typed  
✅ **Automatic Caching** - React Query handles data caching and invalidation  
✅ **Error Handling** - Built-in error states and retry logic  
✅ **Loading States** - Automatic loading indicators  
✅ **API Contract Validation** - Catch breaking changes at compile time

### Regenerating API Clients

```bash
# Generate all API clients
yarn generate:api

# Generate specific APIs
yarn generate:openweather
yarn generate:dmi
yarn generate:dmi-forecast
```

## 🌍 Locations

Current locations configured:

- **Nivå**: 55.9378, 12.5281
- **Copenhagen Surf School**: 55.6546, 12.6492

Add new locations in `data/locations.ts`.
