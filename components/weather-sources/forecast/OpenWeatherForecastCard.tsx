import { Suspense } from "react";
import ForecastCard from "@/components/cards/ForecastCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { getForecast } from "@/generated/openweather";
import { Coordinates } from "@/lib/types";
import {
  transformOpenWeatherForecast,
  transformWeatherError
} from "@/lib/transformers";

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
  } catch (error) {
    const errorProps = transformWeatherError(error, "forecast", "OpenWeatherMap");
    return <NoDataCard {...errorProps} />;
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
