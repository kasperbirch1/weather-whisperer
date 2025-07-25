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
    radar: {
      name: "DMI Radar",
      url: "https://dmigw.govcloud.dk/v1/radardata",
      apiKey: process.env.NEXT_PUBLIC_RADAR_API_KEY,
      getHeaders: () => {
        return {
          "X-Gravitee-Api-Key": wetherApis.dmi.radar.apiKey || "",
          "Content-Type": "application/json",
        };
      },
    },
  },
};
