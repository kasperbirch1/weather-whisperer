# 🌊 Weather Whisperer Architecture

A Next.js 15 application that displays weather data from multiple APIs organized by location, using a component-based architecture with independent data fetching.

## Technology Stack

- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Build Tool**: Turbopack
- **Data Sources**: DMI APIs, OpenWeatherMap, WeatherAPI.com

## Actual Project Structure

```
weather-whisperer/
├── app/                              # Next.js App Router
│   ├── layout.tsx                   # Root layout with fonts and metadata
│   └── page.tsx                     # Home page - renders LocationCards
├── components/                       # All React components
│   ├── HeroSection.tsx              # App title and location count
│   ├── WeatherDataSection.tsx       # Generic section wrapper with grid layout
│   ├── APIStatusSection.tsx         # API health monitoring
│   ├── ParameterCards.tsx           # Generic parameter display
│   ├── QueryProvider.tsx            # React Query provider setup
│   │
│   ├── cards/                       # All card components
│   │   ├── LocationCard.tsx         # Container for one location's weather data
│   │   ├── NoDataCard.tsx           # Fallback UI for missing data
│   │   ├── WindCard.tsx             # Displays wind data with Beaufort scale
│   │   ├── TempCard.tsx             # Displays temperature data
│   │   ├── ForecastCard.tsx         # Displays forecast data
│   │   ├── OceanCard.tsx            # Displays ocean data
│   │   ├── SeaLevelCard.tsx         # Displays sea level data
│   │   ├── LightningCard.tsx        # Displays lightning activity
│   │   ├── PrecipitationCard.tsx    # Displays precipitation data
│   │   ├── PressureCard.tsx         # Displays atmospheric pressure
│   │   └── SunCard.tsx              # Displays sunrise/sunset times
│   │
│   ├── sections/                    # Section components
│   │   ├── WindSection.tsx          # Groups wind API sources
│   │   ├── TemperatureSection.tsx   # Groups temperature API sources
│   │   ├── ForecastSection.tsx      # Groups forecast API sources
│   │   ├── SeaLevelSection.tsx      # Groups sea level API sources
│   │   └── OceanSection.tsx         # Groups ocean API sources
│   │
│   └── weather-sources/             # Individual API source components
│       ├── wind/
│       │   ├── DMIWindCard.tsx      # DMI wind data with suspense
│       │   ├── OpenWeatherWindCard.tsx # OpenWeather wind data
│       │   └── WeatherAPIWindCard.tsx  # WeatherAPI wind data
│       ├── temperature/
│       │   ├── DMITempCard.tsx      # DMI temperature data
│       │   ├── OpenWeatherTempCard.tsx # OpenWeather temperature data
│       │   └── WeatherAPITempCard.tsx  # WeatherAPI temperature data
│       ├── forecast/
│       │   ├── DMIForecastCard.tsx  # DMI forecast data
│       │   ├── OpenWeatherForecastCard.tsx # OpenWeather forecast data
│       │   └── WeatherAPIForecastCard.tsx  # WeatherAPI forecast data
│       ├── ocean/
│       │   └── DMIOceanCard.tsx     # DMI ocean data
│       └── sea-level/
│           └── DMISeaLevelCard.tsx  # DMI sea level data
├── generated/                        # Generated API clients from OpenAPI specs
│   ├── dmi.ts                       # DMI API client and types
│   └── openweather-schemas.ts/      # OpenWeatherMap API client and types
├── lib/                             # Core business logic
│   ├── weather-utils.ts             # Data processing utilities
│   └── types.ts                     # Essential TypeScript type definitions
├── mutator/
│   └── custom-instance.ts           # Custom API request configuration
├── data/
│   └── locations.ts                 # Static location coordinates
├── specs/                           # OpenAPI specifications
│   ├── dmi-openapi.json            # DMI API OpenAPI spec
│   └── openweather-openapi.json    # OpenWeatherMap API OpenAPI spec
├── hooks/                           # Custom React hooks
├── orval.config.js                  # Orval configuration for API generation
└── next.config.ts                   # Next.js configuration
```

## Core Architecture Components

### 1. Data Layer (`lib/`)

#### Generated API Clients (`lib/generated/`)

**Responsibility**: Type-safe API clients generated from OpenAPI specifications

**Key Features**:

- **DMI API Client**: Generated from DMI's OpenAPI specification with full type safety
- **OpenWeatherMap API Client**: Generated client with comprehensive TypeScript types
- **Type Safety**: Compile-time validation of API requests and responses
- **Auto-generated Documentation**: IntelliSense support for all API endpoints
- **Consistent Interface**: Standardized API calling patterns across all services

**Generated Client Benefits**:

```typescript
// Type-safe API calls with generated clients
import { meteoObsApi } from "../lib/generated/dmi";
import { currentWeatherApi } from "../lib/generated/openweathermap";

// Full TypeScript support with auto-completion
const dmiData = await meteoObsApi.getMeteoObs({
  parameterId: "wind_speed",
  bbox: `${lon - 0.1},${lat - 0.1},${lon + 0.1},${lat + 0.1}`,
  limit: 1
});
```

#### Manual API Integration (WeatherAPI.com)

**Responsibility**: Direct fetch calls for APIs without OpenAPI specifications

**Features**:

- Direct fetch implementation for WeatherAPI.com
- Manual type definitions and error handling
- Consistent error handling patterns
- Environment-based API key management

#### Type Definitions (`types.ts`)

**Responsibility**: Type safety and data structure definitions

**Key Types**:

- `WeatherObservation`: DMI API response structure
- `OpenWeatherMapResponse`: OpenWeatherMap API response
- `WeatherAPIResponse`: WeatherAPI.com response
- `LocationWeatherData`: Aggregated location data structure

#### Utilities (`weather-utils.ts`)

**Responsibility**: Data processing and formatting utilities

**Functions**:

- Parameter display name mapping
- Unit conversion and formatting
- Data analysis and summarization
- Wind speed calculations and Beaufort scale conversion

### 2. Presentation Layer (`components/`)

#### Component Architecture

All weather components follow a consistent design pattern:

**Common Props Structure**:

```typescript
interface WeatherCardProps {
  apiName: string; // Data source identifier
  location?: string; // Station/location name
  timestamp?: string; // Data collection time
  // ... specific weather parameters
}
```

#### Key Components

**WindCard.tsx**

- **Purpose**: Wind speed and direction visualization
- **Features**: Beaufort scale integration, wind direction arrows, gust detection
- **Color Coding**: Speed-based gradient backgrounds

**TempCard.tsx**

- **Purpose**: Temperature data with additional metrics
- **Features**: Feels-like temperature, humidity, pressure display
- **Adaptive Design**: Temperature-based color gradients

**ForecastCard.tsx**

- **Purpose**: Multi-day weather forecasting
- **Features**: Hourly and daily forecast aggregation
- **Data Sources**: Combines DMI, OpenWeatherMap, and WeatherAPI forecasts

**LightningCard.tsx**

- **Purpose**: Lightning activity monitoring
- **Features**: Strike count, risk assessment, real-time strike detection
- **Safety Focus**: Shows actual lightning activity or clear "No Activity" status
- **Data Integrity**: Only displays real data, never mocked values

#### Independent Weather Source Components (`components/weather-sources/`)

**Purpose**: Atomic components that fetch and render data from individual API sources independently

**Architecture Philosophy**: Maximum performance through true parallel rendering - each API source renders immediately when its data becomes available, without waiting for other sources.

**Individual Source Component Pattern**:

```typescript
interface APISourceCardProps {
  coords: Coordinates;
}

// Each API source has its own independent component
async function APISourceContent({ coords }: APISourceCardProps) {
  const { lat, lon } = coords;

  try {
    const apiData = await fetchSpecificAPI(lat, lon);

    if (apiData) {
      return <WeatherCard apiName="API Name" {...apiData} />;
    }
  } catch (error) {
    console.error("API fetch failed:", error);
  }

  return (
    <NoDataCard
      icon="🌊"
      title="No API Data"
      description="Unable to fetch data from API"
    />
  );
}

export default function APISourceCard({ coords }: APISourceCardProps) {
  return (
    <Suspense fallback={<APISkeleton />}>
      <APISourceContent coords={coords} />
    </Suspense>
  );
}
```

**Organized by Data Type**:

**Wind Sources** (`components/weather-sources/wind/`):

- `DMIWindCard.tsx` - DMI wind measurements
- `OpenWeatherWindCard.tsx` - OpenWeatherMap wind data
- `WeatherAPIWindCard.tsx` - WeatherAPI.com wind data

**Temperature Sources** (`components/weather-sources/temperature/`):

- `DMITempCard.tsx` - DMI temperature measurements
- `OpenWeatherTempCard.tsx` - OpenWeatherMap temperature data
- `WeatherAPITempCard.tsx` - WeatherAPI.com temperature data

**Forecast Sources** (`components/weather-sources/forecast/`):

- `DMIForecastCard.tsx` - DMI weather forecasts
- `OpenWeatherForecastCard.tsx` - OpenWeatherMap forecasts
- `WeatherAPIForecastCard.tsx` - WeatherAPI.com forecasts

**Ocean Sources** (`components/weather-sources/ocean/`):

- `DMIOceanCard.tsx` - DMI oceanographic data

**Sea Level Sources** (`components/weather-sources/sea-level/`):

- `DMISeaLevelCard.tsx` - DMI sea level measurements

#### Section Component Architecture (`components/sections/`)

**Purpose**: Section components that organize related API source components into logical visual sections

**Actual Implementation Pattern**:

```typescript
export default function WindSection({ coords }: WindSectionProps) {
  return (
    <WeatherDataSection title="Wind Data" icon="💨" columns="responsive">
      {/* Each component fetches and renders independently */}
      <DMIWindCard coords={coords} />
      <OpenWeatherWindCard coords={coords} />
      <WeatherAPIWindCard coords={coords} />
    </WeatherDataSection>
  );
}
```

**Key Design Features**:

- **Simple Composition**: Sections are simple containers that organize related API source components
- **No Direct API Calls**: Sections don't fetch data themselves, they delegate to source components
- **Visual Organization**: Each section creates a titled section with appropriate icon and layout
- **Type Organization**: Each section groups components by data type (wind, temperature, forecast, etc.)

**Key Section Components**:

**WindSection**

- **APIs**: DMI Wind, OpenWeatherMap, WeatherAPI.com
- **Features**: Independent error handling, loading states, fallback cards
- **Resilience**: One API failure doesn't block others

**TemperatureSection**

- **APIs**: DMI Temperature, OpenWeatherMap, WeatherAPI.com
- **Features**: Parallel data fetching, graceful degradation
- **Performance**: Uses React Suspense for optimal loading

**ForecastSection**

- **APIs**: DMI Forecast, OpenWeatherMap Forecast, WeatherAPI Forecast
- **Features**: Multi-source forecast aggregation
- **UX**: Shows loading skeletons while fetching

**SeaLevelSection & OceanSection**

- **APIs**: DMI-specific data sources
- **Features**: Specialized error handling for marine data
- **Data Integrity**: Only displays real measurements

#### Component Design Principles

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Graceful Degradation**: Components handle missing data elegantly
- **Consistent Styling**: Unified gradient-based design system
- **Accessibility**: Semantic HTML and ARIA compliance
- **Independent Operation**: Each wrapper operates autonomously
- **Progressive Loading**: Data appears as it becomes available
- **Error Isolation**: Individual API failures don't cascade

### 3. Application Layer (`app/`)

#### Main Page (`page.tsx`)

**Responsibility**: Application structure and LocationCard coordination

**Actual Architecture**:

```typescript
export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-7xl">
      {/* Hero Section */}
      <HeroSection locationCount={Object.keys(locations).length} />

      {/* Locations Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          📍 Weather Data by Location
        </h2>
        <ul className="grid grid-cols-1 xl:grid-cols-2 gap-12 list-none" role="list">
          {Object.entries(locations).map(([locationName, coords]) => (
            <li key={locationName}>
              <LocationCard locationName={locationName} coords={coords} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
```

#### LocationCard Component (`LocationCard.tsx`)

**Responsibility**: Container for all weather data for a specific location

**Architecture**:

```typescript
export default function LocationCard({ locationName, coords }: LocationCardProps) {
  return (
    <article className="p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Location Header */}
      <header className="mb-10 text-center border-b border-gray-200 pb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {locationName.replace(/([A-Z])/g, " $1").trim()}
        </h3>
        <p className="text-gray-600">📍 {coords.lat}°N, {coords.lon}°E</p>
      </header>

      {/* Section components organize API sources by data type */}
      <WindSection coords={coords} />
      <TemperatureSection coords={coords} />
      <SeaLevelSection coords={coords} />
      <OceanSection coords={coords} />
      <ForecastSection coords={coords} />
    </article>
  );
}
```

**Benefits**:

- **Independent Data Fetching**: Each wrapper handles its own API calls
- **Better Error Isolation**: API failures don't block other data sections
- **Improved Performance**: Page loads immediately, data populates progressively
- **Enhanced Maintainability**: Each data type is self-contained
- **Resilient Architecture**: Individual wrapper failures don't crash the app

### 4. Configuration Layer (`data/`)

#### Locations (`locations.ts`)

**Responsibility**: Define monitored locations with precise coordinates

```typescript
export const locations = {
  nivå: {
    lat: 55.9378,
    lon: 12.5281
  },
  copenhagenSurfSchool: {
    lat: 55.6546,
    lon: 12.6492
  }
};
```

## Actual Data Flow

### 1. User Request Flow

```
User visits / → Home component renders → HeroSection + LocationCard grid
```

### 2. Location-Based Component Tree

```
Home
├── HeroSection (location count)
└── LocationCard (for each location)
    ├── Location header (name + coordinates)
    ├── WindSection
    │   ├── DMIWindCard (with Suspense)
    │   ├── OpenWeatherWindCard (with Suspense)
    │   └── WeatherAPIWindCard (with Suspense)
    ├── TemperatureSection
    │   ├── DMITempCard (with Suspense)
    │   ├── OpenWeatherTempCard (with Suspense)
    │   └── WeatherAPITempCard (with Suspense)
    ├── SeaLevelSection
    │   └── DMISeaLevelCard (with Suspense)
    ├── OceanSection
    │   └── DMIOceanCard (with Suspense)
    └── ForecastSection
        ├── DMIForecastCard (with Suspense)
        ├── OpenWeatherForecastCard (with Suspense)
        └── WeatherAPIForecastCard (with Suspense)
```

### 3. Individual API Source Component Pattern

```
DMIWindCard
├── Suspense boundary with skeleton
└── DMIWindContent (async server component)
    ├── fetchDMIWindData(coords)
    ├── Success: renders WindCard
    └── Failure: renders NoDataCard
```

### 4. API Call Pattern

```
Generated API Clients + Direct Fetch → External APIs

// DMI API (Generated Client)
DMIWindCard → meteoObsApi.getMeteoObs() → DMI API
DMIOceanCard → oceanObsApi.getOceanObs() → DMI API
DMIForecastCard → forecastApi.getForecast() → DMI API

// OpenWeatherMap API (Generated Client)
OpenWeatherWindCard → currentWeatherApi.getCurrentWeather() → OpenWeatherMap API
OpenWeatherForecastCard → forecastApi.getForecast() → OpenWeatherMap API

// WeatherAPI.com (Direct Fetch)
WeatherAPIWindCard → fetch() → WeatherAPI.com
WeatherAPIForecastCard → fetch() → WeatherAPI.com
```

## Performance Optimizations

### 1. API Call Optimization

- **Reduced Call Volume**: From ~34 to ~8 calls per location
- **Strategic Bounding Boxes**: Optimized search areas for better hit rates
- **Independent API Calls**: Each wrapper makes separate, non-blocking requests
- **Error Isolation**: Failed API calls don't prevent other data from loading

### 2. Wrapper-Based Architecture Benefits

- **Progressive Loading**: Page loads immediately, data populates as available
- **Parallel Processing**: All data wrappers fetch concurrently
- **Resilient Design**: Individual failures don't crash the entire page
- **Better UX**: Users see content incrementally rather than all-or-nothing

### 3. Caching Strategy

- **Next.js Revalidation**: 300-second cache for API responses
- **React Server Components**: Efficient server-side rendering in wrappers
- **Suspense Integration**: Optimal loading state management

### 4. Component Optimization

- **Conditional Rendering**: Components only render when data is available
- **Loading Skeletons**: Immediate visual feedback during data fetching
- **Independent Error Handling**: Each wrapper handles its own failures
- **Reduced Bundle Size**: Simplified main page with delegated complexity

## API Integration Details

### DMI (Danish Meteorological Institute)

- **Observation APIs**: Meteorological, Ocean, Lightning data
- **Forecast API**: Coverage JSON format with spatial-temporal data
- **Authentication**: API key-based with Gravitee gateway

### OpenWeatherMap

- **Current Weather**: Real-time conditions
- **Forecast**: 5-day/3-hour forecast data
- **One Call API**: Comprehensive weather data

### WeatherAPI.com

- **Current Conditions**: Real-time weather with air quality
- **Forecast**: Multi-day predictions with alerts
- **Historical Data**: Past weather information

## Error Handling Strategy

### 1. API Level

- Timeout handling with graceful fallbacks
- HTTP status code validation
- JSON parsing error recovery

### 2. Application Level

- Partial data rendering capability
- User-friendly error messaging
- Logging for debugging and monitoring

### 3. Component Level

- Null/undefined data handling
- "No Data Available" messaging for missing information
- Progressive enhancement approach

## Data Integrity Philosophy

### 1. No Mocked Data Policy

- **Real Data Only**: The application never displays mocked or fake data
- **Honest Representation**: When no data is available, the UI clearly communicates this
- **User Trust**: Users can rely on all displayed information being genuine

### 2. Graceful No-Data Handling

- **Lightning Data**: Returns `null` when no strikes are detected, UI shows "Safe Conditions"
- **Ocean Data**: Returns `null` when no measurements are available, UI shows informative message
- **Sea Level Data**: Only shown when actual measurements exist
- **Consistent Messaging**: All "No Data" states use consistent, user-friendly messaging

### 3. Data Validation

- **API Response Validation**: Checks for valid data before processing
- **Null Safety**: All components handle `null`/`undefined` values gracefully
- **Type Safety**: TypeScript ensures compile-time data structure validation

## Security Considerations

### 1. API Key Management

- Environment variable storage
- Server-side API key usage
- No client-side exposure of sensitive credentials

### 2. Data Validation

- TypeScript compile-time checking
- Runtime data validation
- Sanitized data rendering

## Scalability Design

### 1. Modular Architecture

- Pluggable API services
- Reusable component library
- Configurable location management

### 2. Performance Monitoring

- API response time tracking
- Error rate monitoring
- User experience metrics

### 3. Future Extensions

- Additional weather API integration
- Real-time data updates via WebSockets
- User location preferences
- Historical data analysis

## Development Workflow

### 1. Local Development

```bash
yarn dev  # Fast development server with turbopack
```

### 2. Type Safety

- Strict TypeScript configuration
- Comprehensive type definitions
- Compile-time error detection

### 3. Code Quality

- ESLint configuration for Next.js
- Consistent formatting standards
- Component-driven development

## Deployment Architecture

### 1. Static Site Generation

- Pre-built pages for optimal performance
- CDN-friendly static assets
- Minimal server requirements

### 2. Environment Configuration

- Production API endpoints
- Optimized build settings
- Environment-specific configurations

This architecture ensures a robust, scalable, and maintainable weather application that efficiently aggregates data from multiple sources while providing an excellent user experience through optimized performance and responsive design.
