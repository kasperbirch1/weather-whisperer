import { Suspense } from "react";
import TempCard from "@/components/cards/TempCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { getCurrentWeather } from "@/generated/openweather";
import { Coordinates } from "@/lib/types";
import { transformOpenWeatherTemperature } from "./transformers";
import { transformWeatherError } from "@/lib/transformers/error-transformers";

interface OpenWeatherTempCardProps {
  coords: Coordinates;
}

async function OpenWeatherTempContent({ coords }: OpenWeatherTempCardProps) {
  const { lat, lon } = coords;

  try {
    const data = await getCurrentWeather({
      lat,
      lon,
      appid: "placeholder",
      units: "metric"
    });

    // Transform data to normalized format
    const normalizedData = transformOpenWeatherTemperature(data);

    return (
      <TempCard
        apiName={normalizedData.apiName}
        temperature={normalizedData.temperature}
        feelsLike={normalizedData.feelsLike}
        humidity={normalizedData.humidity}
        pressure={normalizedData.pressure}
        visibility={normalizedData.visibility}
        cloudCover={normalizedData.cloudCover}
        location={normalizedData.location}
        timestamp={normalizedData.timestamp}
      />
    );
  } catch (error) {
    const errorProps = transformWeatherError(error, "temperature", "OpenWeatherMap");
    return <NoDataCard {...errorProps} />;
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
