import { Suspense } from "react";
import WindCard from "@/components/WindCard";
import NoDataCard from "@/components/NoDataCard";
import { fetchOpenWeatherData } from "@/lib/weather-service";
import { Coordinates } from "@/lib/types";

interface OpenWeatherWindCardProps {
  coords: Coordinates;
}

async function OpenWeatherWindContent({ coords }: OpenWeatherWindCardProps) {
  const { lat, lon } = coords;

  try {
    const openWeatherData = await fetchOpenWeatherData(lat, lon);

    if (openWeatherData) {
      return (
        <WindCard
          apiName="OpenWeatherMap"
          windSpeed={openWeatherData.wind?.speed || 0}
          windDirection={openWeatherData.wind?.deg || 0}
          location={openWeatherData.name}
          timestamp={new Date(openWeatherData.dt * 1000).toISOString()}
        />
      );
    }
  } catch (error) {
    console.error("OpenWeather Wind data fetch failed:", error);
  }

  return (
    <NoDataCard
      icon="💨"
      title="No OpenWeatherMap Data"
      description="Unable to fetch data from OpenWeatherMap API"
      badge={{ text: "API Offline", color: "red" }}
    />
  );
}

function OpenWeatherWindSkeleton() {
  return <div className="animate-pulse bg-gray-200 rounded-lg h-32"></div>;
}

export default function OpenWeatherWindCard({
  coords,
}: OpenWeatherWindCardProps) {
  return (
    <Suspense fallback={<OpenWeatherWindSkeleton />}>
      <OpenWeatherWindContent coords={coords} />
    </Suspense>
  );
}
