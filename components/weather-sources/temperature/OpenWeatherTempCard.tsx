import { Suspense } from "react";
import TempCard from "@/components/cards/TempCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { getCurrentWeather } from "@/generated/openweather";
import { Coordinates } from "@/lib/types";

interface OpenWeatherTempCardProps {
  coords: Coordinates;
}

async function OpenWeatherTempContent({ coords }: OpenWeatherTempCardProps) {
  const { lat, lon } = coords;

  try {
    // Get API key from environment
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
      return (
        <NoDataCard
          icon="🌡️"
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

    if (!data || !data.main) {
      return (
        <NoDataCard
          icon="🌡️"
          title="No OpenWeatherMap Data"
          description="No temperature data available from OpenWeatherMap"
          badge={{ text: "API Offline", color: "red" }}
        />
      );
    }

    // Extract temperature data from the response
    const temperature = data.main?.temp || 0;
    const feelsLike = data.main?.feels_like;
    const humidity = data.main?.humidity;
    const pressure = data.main?.pressure;
    const visibility = data.visibility ? data.visibility / 1000 : undefined; // Convert to km
    const cloudCover = data.clouds?.all;
    const location = data.name;
    const timestamp = data.dt
      ? new Date(data.dt * 1000).toISOString()
      : new Date().toISOString();

    return (
      <TempCard
        apiName="OpenWeatherMap"
        temperature={temperature}
        feelsLike={feelsLike}
        humidity={humidity}
        pressure={pressure}
        visibility={visibility}
        cloudCover={cloudCover}
        location={location}
        timestamp={timestamp}
      />
    );
  } catch {
    return (
      <NoDataCard
        icon="🌡️"
        title="No OpenWeatherMap Data"
        description="Unable to fetch data from OpenWeatherMap API"
        badge={{ text: "API Offline", color: "red" }}
      />
    );
  }
}

function OpenWeatherTempSkeleton() {
  return <div className="animate-pulse bg-gray-200 rounded-lg h-32"></div>;
}

export default function OpenWeatherTempCard({
  coords
}: OpenWeatherTempCardProps) {
  return (
    <Suspense fallback={<OpenWeatherTempSkeleton />}>
      <OpenWeatherTempContent coords={coords} />
    </Suspense>
  );
}
