import { Suspense } from "react";
import ForecastCard from "@/components/cards/ForecastCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { getForecast } from "@/generated/openweather";
import { Coordinates } from "@/lib/types";
import { transformOpenWeatherForecast } from "@/lib/transformers";

interface OpenWeatherForecastCardProps {
  coords: Coordinates;
}

async function OpenWeatherForecastContent({
  coords
}: OpenWeatherForecastCardProps) {
  const { lat, lon } = coords;

  try {
    const data = await getForecast({
      lat,
      lon,
      appid: "placeholder",
      units: "metric"
    });

    if (!data || !data.list || data.list.length === 0) {
      return (
        <NoDataCard
          icon="🔮"
          title="No OpenWeatherMap Forecast"
          description="No forecast data available from OpenWeatherMap"
          badge={{ text: "API Offline", color: "red" }}
        />
      );
    }

    // Transform data to normalized format
    const normalizedData = transformOpenWeatherForecast(data);

    return (
      <ForecastCard
        apiName={normalizedData.apiName}
        temperature={normalizedData.temperature}
        description={normalizedData.description}
        icon={normalizedData.icon}
        highTemp={normalizedData.highTemp}
        lowTemp={normalizedData.lowTemp}
        precipitationChance={normalizedData.precipitationChance}
        tomorrowHighTemp={normalizedData.tomorrowHighTemp}
        tomorrowLowTemp={normalizedData.tomorrowLowTemp}
        tomorrowDescription={normalizedData.tomorrowDescription}
        tomorrowPrecipChance={normalizedData.tomorrowPrecipChance}
        location={normalizedData.location}
        timestamp={normalizedData.timestamp}
      />
    );
  } catch {
    return (
      <NoDataCard
        icon="🔮"
        title="No OpenWeatherMap Forecast"
        description="Unable to fetch forecast from OpenWeatherMap API"
        badge={{ text: "API Offline", color: "red" }}
      />
    );
  }
}

function OpenWeatherForecastSkeleton() {
  return <div className="animate-pulse bg-gray-200 rounded-lg h-32"></div>;
}

export default function OpenWeatherForecastCard({
  coords
}: OpenWeatherForecastCardProps) {
  return (
    <Suspense fallback={<OpenWeatherForecastSkeleton />}>
      <OpenWeatherForecastContent coords={coords} />
    </Suspense>
  );
}
