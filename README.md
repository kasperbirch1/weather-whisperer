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
   npm install
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
   npm run dev
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

- **DMI Ocean Observations API** - Sea level, water temperature
- **DMI Meteorological API** - Wind speed, atmospheric data
- **Real-time data** updated every 5-10 minutes
- **Geographic coverage** across Denmark and Greenland

## 🌍 Locations

Current locations configured:
- **Nivå**: 55.9378, 12.5281
- **Copenhagen Surf School**: 55.6546, 12.6492

Add new locations in `data/locations.ts`.
