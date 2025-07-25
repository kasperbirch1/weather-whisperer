import { Suspense } from "react";
import TempCard from "@/components/TempCard";
import NoDataCard from "@/components/NoDataCard";
import { fetchOpenWeatherData } from "@/lib/weather-service";
import { Coordinates } from "@/lib/types";

interface OpenWeatherTempCardProps {
  coords: Coordinates;
}

async function OpenWeatherTempContent({ coords }: OpenWeatherTempCardProps) {
  const { lat, lon } = coords;

  try {
    const openWeatherData = await fetchOpenWeatherData(lat, lon);

    if (openWeatherData) {
      return (
        <TempCard
          apiName="OpenWeatherMap"
          temperature={openWeatherData.main?.temp || 0}
          feelsLike={openWeatherData.main?.feels_like}
          humidity={openWeatherData.main?.humidity}
          location={openWeatherData.name}
          timestamp={new Date(openWeatherData.dt * 1000).toISOString()}
        />
      );
    }
  } catch (error) {
    console.error("OpenWeather Temp data fetch failed:", error);
  }

  return (
    <NoDataCard
      icon="🌡️"
      title="No OpenWeatherMap Data"
      description="Unable to fetch data from OpenWeatherMap API"
      badge={{ text: "API Offline", color: "red" }}
    />
  );
}

function OpenWeatherTempSkeleton() {
  return <div className="animate-pulse bg-gray-200 rounded-lg h-32"></div>;
}

export default function OpenWeatherTempCard({
  coords,
}: OpenWeatherTempCardProps) {
  return (
    <Suspense fallback={<OpenWeatherTempSkeleton />}>
      <OpenWeatherTempContent coords={coords} />
    </Suspense>
  );
}
