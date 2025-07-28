import { Suspense } from "react";
import WindCard from "@/components/cards/WindCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { Coordinates } from "@/lib/types";
import { realtimeWeather } from "@/generated/weatherapi";
import { transformWeatherAPIWind, transformWeatherError } from "@/lib/transformers";

interface WeatherAPIWindCardProps {
  coords: Coordinates;
}

async function WeatherAPIWindContent({ coords }: WeatherAPIWindCardProps) {
  const { lat, lon } = coords;

  try {
    const data = await realtimeWeather({
      q: `${lat},${lon}`
    });

    // Transform data to normalized format
    const normalizedData = transformWeatherAPIWind(data);

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
    const errorProps = transformWeatherError(error, "wind", "WeatherAPI");
    return <NoDataCard {...errorProps} />;
  }
}

function WeatherAPIWindSkeleton() {
  return <div className="animate-pulse bg-gray-200 rounded-lg h-32"></div>;
}

export default function WeatherAPIWindCard({
  coords
}: WeatherAPIWindCardProps) {
  return (
    <Suspense fallback={<WeatherAPIWindSkeleton />}>
      <WeatherAPIWindContent coords={coords} />
    </Suspense>
  );
}
