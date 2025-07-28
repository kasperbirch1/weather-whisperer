# Weather API Type Generation with Orval

This directory contains OpenAPI specifications for the weather APIs used in this project. Orval is configured to generate TypeScript types and API clients from these specifications.

## Setup

The project is configured with Orval to generate strongly-typed API clients. The configuration is in `orval.config.js`.

## Available Commands

- `yarn generate:api` - Generate types for all configured APIs
- `yarn generate:openweather` - Generate types for OpenWeatherMap API only
- `yarn generate:weatherapi` - Generate types for WeatherAPI only
- `yarn generate:dmi` - Generate types for DMI custom APIs (meteo/ocean/lightning/climate)
- `yarn generate:dmi-forecast` - Generate types for DMI Forecast Data API (official)
- `yarn generate:dmi-radar` - Generate types for DMI Radar Data API (official)
- `yarn generate:dmi-all` - Generate all DMI API types

## OpenAPI Specifications

### Current Status

- ✅ `openweathermap.yaml` - Example OpenWeatherMap API spec (ready to use)
- ⏳ `weatherapi.yaml` - Placeholder (needs actual spec)
- ✅ `dmi.yaml` - Custom DMI spec for meteo/ocean/lightning/climate APIs
- ✅ `dmi-forecast-official.json` - **Official DMI Forecast Data API spec** (STAC-API)
- ✅ `dmi-radar-official.json` - **Official DMI Radar Data API spec**

## Finding Official OpenAPI Specs

Here are some places to look for official OpenAPI specifications:

### OpenWeatherMap

- Check their official documentation: https://openweathermap.org/api
- Look for community-maintained specs on GitHub
- The example spec in `openweathermap.yaml` covers the main endpoints

### WeatherAPI

- Check their documentation: https://www.weatherapi.com/docs/
- Look for OpenAPI/Swagger documentation links

### DMI (Danish Meteorological Institute)

- **Official Forecast Data API**: https://dmigw.govcloud.dk/v1/forecastdata/api ✅ **Now integrated!**
- **Official Radar Data API**: https://dmigw.govcloud.dk/v1/radardata/api ✅ **Now integrated!**
- Check their API documentation: https://www.dmi.dk/
- Our custom spec covers meteo, ocean, lightning, and climate APIs

## Using Generated Types

Once you run the generation commands, you'll get:

1. **Type definitions** in `src/generated/[api-name]-schemas.ts`
2. **API clients** in `src/generated/[api-name].ts`

Example usage:

```typescript
import { getCurrentWeather } from "../generated/openweather";

// Fully typed API call
const weatherData = await getCurrentWeather({
  lat: 55.6761,
  lon: 12.5683,
  appid: "your-api-key",
  units: "metric"
});

// weatherData is now fully typed based on the OpenAPI spec
console.log(weatherData.main.temp);
```

## Benefits

- **Type Safety**: All API responses are strongly typed
- **Auto-completion**: Full IDE support with IntelliSense
- **API Changes**: Generated types update automatically when specs change
- **Documentation**: Types serve as living documentation
- **Error Prevention**: Catch API contract changes at compile time

## Next Steps

1. Find or create proper OpenAPI specs for WeatherAPI and DMI
2. Run `yarn generate:openweather` to test the OpenWeatherMap generation
3. Replace the example specs with real ones when available
4. Integrate the generated types into your existing weather service functions
