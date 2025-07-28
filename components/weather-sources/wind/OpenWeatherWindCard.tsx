import { Suspense } from "react";
import WindCard from "@/components/cards/WindCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { getCurrentWeather } from "@/generated/openweather";
import { Coordinates } from "@/lib/types";
import { transformOpenWeatherWind } from "@/lib/transformers";

interface OpenWeatherWindCardProps {
  coords: Coordinates;
}

async function OpenWeatherWindContent({ coords }: OpenWeatherWindCardProps) {
  const { lat, lon } = coords;

  try {
    const data = await getCurrentWeather({
      lat,
      lon,
      appid: "placeholder",
      units: "metric"
    });

    if (!data || !data.wind) {
      return (
        <NoDataCard
          icon="💨"
          title="No OpenWeatherMap Wind Data"
          description="No wind data available from OpenWeatherMap"
          badge={{ text: "API Offline", color: "red" }}
        />
      );
    }

    // Transform data to normalized format
    const normalizedData = transformOpenWeatherWind(data);

    return (
      <WindCard
        apiName={normalizedData.apiName}
        windSpeed={normalizedData.windSpeed}
        windDirection={normalizedData.windDirection}
        windGust={normalizedData.windGust}
        pressure={normalizedData.pressure}
        location={normalizedData.location}
        timestamp={normalizedData.timestamp}
      />
    );
  } catch (error) {
    console.error("OpenWeatherMap Wind Error:", error);
    return (
      <NoDataCard
        icon="💨"
        title="No OpenWeatherMap Wind Data"
        description="Unable to fetch wind data from OpenWeatherMap API"
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
