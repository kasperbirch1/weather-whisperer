import { Suspense } from "react";
import ForecastCard from "@/components/cards/ForecastCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { Coordinates } from "@/lib/types";
import { forecastWeather } from "@/generated/weatherapi";
import { transformWeatherAPIForecast } from "./transformers";
import { transformWeatherError } from "@/lib/transformers/error-transformers";

interface WeatherAPIForecastCardProps {
  coords: Coordinates;
}

async function WeatherAPIForecastContent({
  coords
}: WeatherAPIForecastCardProps) {
  const { lat, lon } = coords;

  try {
    const data = await forecastWeather({
      q: `${lat},${lon}`,
      days: 3,
      aqi: "yes",
      alerts: "yes"
    });

    // Transform data to normalized format
    const normalizedData = transformWeatherAPIForecast(data);

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
    const errorProps = transformWeatherError(error, "forecast", "WeatherAPI");
    return <NoDataCard {...errorProps} />;
  }
}

function WeatherAPIForecastSkeleton() {
  return <div className="animate-pulse bg-gray-200 rounded-lg h-32"></div>;
}

export default function WeatherAPIForecastCard({
  coords
}: WeatherAPIForecastCardProps) {
  return (
    <Suspense fallback={<WeatherAPIForecastSkeleton />}>
      <WeatherAPIForecastContent coords={coords} />
    </Suspense>
  );
}
