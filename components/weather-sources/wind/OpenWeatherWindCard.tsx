import { Suspense } from "react";
import WindCard from "@/components/cards/WindCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { getCurrentWeather } from "@/generated/openweather";
import { Coordinates } from "@/lib/types";

interface OpenWeatherWindCardProps {
  coords: Coordinates;
}

async function OpenWeatherWindContent({ coords }: OpenWeatherWindCardProps) {
  const { lat, lon } = coords;

  try {
    // Get API key from environment
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
      return (
        <NoDataCard
          icon="💨"
          title="No OpenWeatherMap Data"
          description="Missing API key"
          badge={{ text: "Config Error", color: "red" }}
        />
      );
    }

    const data = await getCurrentWeather({
      lat,
      lon,
      appid: apiKey,
      units: "metric"
    });

    if (!data || !data.wind) {
      return (
        <NoDataCard
          icon="💨"
          title="No OpenWeatherMap Data"
          description="No wind data available from OpenWeatherMap"
          badge={{ text: "API Offline", color: "red" }}
        />
      );
    }

    // Extract wind data from the response
    const windSpeed = data.wind?.speed || 0;
    const windDirection = data.wind?.deg || 0;
    const windGust = data.wind?.gust;
    const pressure = data.main?.pressure;
    const location = data.name;
    const timestamp = data.dt
      ? new Date(data.dt * 1000).toISOString()
      : new Date().toISOString();

    return (
      <WindCard
        apiName="OpenWeatherMap"
        windSpeed={windSpeed}
        windDirection={windDirection}
        windGust={windGust}
        pressure={pressure}
        location={location}
        timestamp={timestamp}
      />
    );
  } catch {
    return (
      <NoDataCard
        icon="💨"
        title="No OpenWeatherMap Data"
        description="Unable to fetch data from OpenWeatherMap API"
        badge={{ text: "API Offline", color: "red" }}
      />
    );
  }
}

function OpenWeatherWindSkeleton() {
  return <div className="animate-pulse bg-gray-200 rounded-lg h-32"></div>;
}

export default function OpenWeatherWindCard({
  coords
}: OpenWeatherWindCardProps) {
  return (
    <Suspense fallback={<OpenWeatherWindSkeleton />}>
      <OpenWeatherWindContent coords={coords} />
    </Suspense>
  );
}
