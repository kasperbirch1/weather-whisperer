export const wetherApis = {
  dmi: {
    ocean: {
      name: "DMI Ocean",
      url: "https://dmigw.govcloud.dk/v2/oceanObs",
      apiKey: process.env.NEXT_PUBLIC_OCEAN_OBS_API_KEY,
      getObservationsUrl: (lat: number, lon: number) => {
        // Create a small bounding box around the coordinates (±0.1 degrees)
        const bbox = `${lon - 0.1},${lat - 0.1},${lon + 0.1},${lat + 0.1}`;
        return `${wetherApis.dmi.ocean.url}/collections/observation/items?bbox=${bbox}&limit=50`;
      },
      getHeaders: () => {
        return {
          "X-Gravitee-Api-Key": wetherApis.dmi.ocean.apiKey || "",
          "Content-Type": "application/json",
        };
      },
    },
    meteo: {
      name: "DMI Meteorological",
      url: "https://dmigw.govcloud.dk/v2/metObs",
      apiKey: process.env.NEXT_PUBLIC_MET_OBS_API_KEY,
      getObservationsUrl: (
        parameterId?: string,
        bbox?: string,
        limit?: number
      ) => {
        const url = `${wetherApis.dmi.meteo.url}/collections/observation/items`;
        const params = [];
        if (parameterId) params.push(`parameterId=${parameterId}`);
        if (bbox) params.push(`bbox=${bbox}`);
        if (limit) params.push(`limit=${limit}`);
        return params.length > 0 ? `${url}?${params.join("&")}` : url;
      },
      getHeaders: () => {
        return {
          "X-Gravitee-Api-Key": wetherApis.dmi.meteo.apiKey || "",
          "Content-Type": "application/json",
        };
      },
    },
    lightning: {
      name: "DMI Lightning",
      url: "https://dmigw.govcloud.dk/v2/lightningdata",
      apiKey: process.env.NEXT_PUBLIC_LIGHTNING_API_KEY,
      getObservationsUrl: (
        bbox?: string,
        datetime?: string,
        limit?: number
      ) => {
        const url = `${wetherApis.dmi.lightning.url}/collections/observation/items`;
        const params = [];
        if (bbox) params.push(`bbox=${bbox}`);
        if (datetime) params.push(`datetime=${datetime}`);
        if (limit) params.push(`limit=${limit}`);
        return params.length > 0 ? `${url}?${params.join("&")}` : url;
      },
      getHeaders: () => {
        return {
          "X-Gravitee-Api-Key": wetherApis.dmi.lightning.apiKey || "",
          "Content-Type": "application/json",
        };
      },
    },
    climate: {
      name: "DMI Climate",
      url: "https://dmigw.govcloud.dk/v2/climateData",
      apiKey: process.env.NEXT_PUBLIC_CLIMATE_API_KEY,
      getObservationsUrl: (
        parameterId?: string,
        stationId?: string,
        datetime?: string
      ) => {
        const url = `${wetherApis.dmi.climate.url}/collections/observation/items`;
        const params = [];
        if (parameterId) params.push(`parameterId=${parameterId}`);
        if (stationId) params.push(`stationId=${stationId}`);
        if (datetime) params.push(`datetime=${datetime}`);
        return params.length > 0 ? `${url}?${params.join("&")}` : url;
      },
      getHeaders: () => {
        return {
          "X-Gravitee-Api-Key": wetherApis.dmi.climate.apiKey || "",
          "Content-Type": "application/json",
        };
      },
    },
    // radar: {
    //   name: "DMI Radar",
    //   url: "https://dmigw.govcloud.dk/v1/radardata",
    //   apiKey: process.env.NEXT_PUBLIC_RADAR_API_KEY,
    //   getHeaders: () => {
    //     return {
    //       "X-Gravitee-Api-Key": wetherApis.dmi.radar.apiKey || "",
    //       "Content-Type": "application/json",
    //     };
    //   },
    // },
    forecast: {
      name: "DMI Forecast",
      url: "https://dmigw.govcloud.dk/v1/forecastedr",
      apiKey: "e837091e-6812-4c8f-9f3f-11835961e91d",
      getPositionUrl: (lat: number, lon: number, parameters: string[]) => {
        const coords = `POINT(${lon}%20${lat})`;
        const parameterNames = parameters.join(",");
        return `${wetherApis.dmi.forecast.url}/collections/dkss_nsbs/position?coords=${coords}&parameter-name=${parameterNames}`;
      },
      getHeaders: () => {
        return {
          "X-Gravitee-Api-Key": wetherApis.dmi.forecast.apiKey || "",
          "Content-Type": "application/json",
        };
      },
    },
  },
  openweather: {
    name: "OpenWeatherMap",
    url: "https://api.openweathermap.org/data/2.5",
    apiKey: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
    getCurrentWeatherUrl: (lat: number, lon: number) => {
      return `${wetherApis.openweather.url}/weather?lat=${lat}&lon=${lon}&appid=${wetherApis.openweather.apiKey}&units=metric`;
    },
    getForecastUrl: (lat: number, lon: number) => {
      return `${wetherApis.openweather.url}/forecast?lat=${lat}&lon=${lon}&appid=${wetherApis.openweather.apiKey}&units=metric`;
    },
    getOneCallUrl: (lat: number, lon: number) => {
      return `${wetherApis.openweather.url}/onecall?lat=${lat}&lon=${lon}&appid=${wetherApis.openweather.apiKey}&units=metric&exclude=minutely,alerts`;
    },
    getHeaders: () => {
      return {
        "Content-Type": "application/json",
      };
    },
  },
  // Example of another weather API - WeatherAPI.com
  weatherapi: {
    name: "WeatherAPI.com",
    url: "https://api.weatherapi.com/v1",
    apiKey: process.env.NEXT_PUBLIC_WEATHERAPI_KEY,
    getCurrentWeatherUrl: (lat: number, lon: number) => {
      return `${wetherApis.weatherapi.url}/current.json?key=${wetherApis.weatherapi.apiKey}&q=${lat},${lon}&aqi=yes`;
    },
    getForecastUrl: (lat: number, lon: number, days: number = 3) => {
      return `${wetherApis.weatherapi.url}/forecast.json?key=${wetherApis.weatherapi.apiKey}&q=${lat},${lon}&days=${days}&aqi=yes&alerts=yes`;
    },
    getHeaders: () => {
      return {
        "Content-Type": "application/json",
      };
    },
  },
};
