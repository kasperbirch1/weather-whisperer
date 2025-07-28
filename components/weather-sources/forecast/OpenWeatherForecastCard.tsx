import { Suspense } from "react";
import ForecastCard from "@/components/cards/ForecastCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { fetchOpenWeatherForecast } from "@/lib/weather-service";
import { Coordinates } from "@/lib/types";

interface OpenWeatherForecastCardProps {
  coords: Coordinates;
}

async function OpenWeatherForecastContent({
  coords,
}: OpenWeatherForecastCardProps) {
  const { lat, lon } = coords;

  try {
    const openWeatherForecast = await fetchOpenWeatherForecast(lat, lon);

    if (openWeatherForecast) {
      return (
        <ForecastCard
          apiName="OpenWeatherMap"
          temperature={openWeatherForecast.temperature}
          description={openWeatherForecast.description}
          icon={openWeatherForecast.icon}
          highTemp={openWeatherForecast.highTemp}
          lowTemp={openWeatherForecast.lowTemp}
          precipitationChance={openWeatherForecast.precipitationChance}
          tomorrowHighTemp={openWeatherForecast.tomorrowHighTemp}
          tomorrowLowTemp={openWeatherForecast.tomorrowLowTemp}
          tomorrowDescription={openWeatherForecast.tomorrowDescription}
          tomorrowPrecipChance={openWeatherForecast.tomorrowPrecipChance}
          location={openWeatherForecast.location}
          timestamp={openWeatherForecast.timestamp}
        />
      );
    }
  } catch (error) {
    console.error("OpenWeather Forecast data fetch failed:", error);
  }

  return (
    <NoDataCard
      icon="🔮"
      title="No OpenWeatherMap Forecast"
      description="Unable to fetch forecast from OpenWeatherMap API"
      badge={{ text: "API Offline", color: "red" }}
    />
  );
}

function OpenWeatherForecastSkeleton() {
  return <div className="animate-pulse bg-gray-200 rounded-lg h-32"></div>;
}

export default function OpenWeatherForecastCard({
  coords,
}: OpenWeatherForecastCardProps) {
  return (
    <Suspense fallback={<OpenWeatherForecastSkeleton />}>
      <OpenWeatherForecastContent coords={coords} />
    </Suspense>
  );
}
