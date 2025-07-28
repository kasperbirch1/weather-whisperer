module.exports = {
  // OpenWeatherMap API configuration
  openweather: {
    input: "./specs/openweathermap.yaml",
    output: {
      target: "./generated/openweather.ts",
      schemas: "./generated/openweather-schemas",
      client: 'react-query',
      mode: "single",
      override: {
        mutator: {
          path: "./mutator/mutator.ts",
          name: "customInstance",
        },
      },
    },
  },

  // WeatherAPI configuration
  weatherapi: {
    input: "./specs/weatherapi.yaml",
    output: {
      target: "./generated/weatherapi.ts",
      schemas: "./generated/weatherapi-schemas",
      client: "react-query",
      mode: "single",
      override: {
        mutator: {
          path: "./mutator/mutator.ts",
          name: "customInstance",
        },
      },
    },
  },

  // DMI Forecast Data API (official OpenAPI spec - fetched directly)
  "dmi-forecast": {
    input: "/tmp/dmi-forecast.json",
    output: {
      target: "./generated/dmi-forecast.ts",
      schemas: "./generated/dmi-forecast-schemas",
      client: "react-query",
      mode: "single",
      override: {
        mutator: {
          path: "./mutator/mutator.ts",
          name: "customInstance",
        },
      },
    },
  },

  // DMI Radar Data API (official OpenAPI spec - fetched directly)
  "dmi-radar": {
    input: "/tmp/dmi-radar.json",
    output: {
      target: "./generated/dmi-radar.ts",
      schemas: "./generated/dmi-radar-schemas",
      client: "react-query",
      mode: "single",
      override: {
        mutator: {
          path: "./mutator/mutator.ts",
          name: "customInstance",
        },
      },
    },
  },

  // DMI Custom APIs (our custom spec for meteo/ocean/lightning/climate)
  dmi: {
    input: "./specs/dmi.yaml",
    output: {
      target: "./generated/dmi.ts",
      schemas: "./generated/dmi-schemas",
      client: "react-query",
      mode: "single",
      override: {
        mutator: {
          path: "./mutator/mutator.ts",
          name: "customInstance",
        },
      },
    },
  },
};
