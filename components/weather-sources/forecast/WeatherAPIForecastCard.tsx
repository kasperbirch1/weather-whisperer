import { Suspense } from "react";
import ForecastCard from "@/components/ForecastCard";
import NoDataCard from "@/components/NoDataCard";
import { fetchWeatherAPIForecast } from "@/lib/weather-service";

interface WeatherAPIForecastCardProps {
  coords: { lat: number; lon: number };
}

async function WeatherAPIForecastContent({
  coords,
}: WeatherAPIForecastCardProps) {
  const { lat, lon } = coords;

  try {
    const weatherAPIForecast = await fetchWeatherAPIForecast(lat, lon);

    if (weatherAPIForecast) {
      return (
        <ForecastCard
          apiName="WeatherAPI.com"
          temperature={weatherAPIForecast.temperature}
          description={weatherAPIForecast.description}
          icon={weatherAPIForecast.icon}
          highTemp={weatherAPIForecast.highTemp}
          lowTemp={weatherAPIForecast.lowTemp}
          precipitationChance={weatherAPIForecast.precipitationChance}
          tomorrowHighTemp={weatherAPIForecast.tomorrowHighTemp}
          tomorrowLowTemp={weatherAPIForecast.tomorrowLowTemp}
          tomorrowDescription={weatherAPIForecast.tomorrowDescription}
          tomorrowPrecipChance={weatherAPIForecast.tomorrowPrecipChance}
          location={weatherAPIForecast.location}
          timestamp={weatherAPIForecast.timestamp}
        />
      );
    }
  } catch (error) {
    console.error("WeatherAPI Forecast data fetch failed:", error);
  }

  return (
    <NoDataCard
      icon="🔮"
      title="No WeatherAPI Forecast"
      description="Unable to fetch forecast from WeatherAPI.com"
      badge={{ text: "API Offline", color: "red" }}
    />
  );
}

function WeatherAPIForecastSkeleton() {
  return <div className="animate-pulse bg-gray-200 rounded-lg h-32"></div>;
}

export default function WeatherAPIForecastCard({
  coords,
}: WeatherAPIForecastCardProps) {
  return (
    <Suspense fallback={<WeatherAPIForecastSkeleton />}>
      <WeatherAPIForecastContent coords={coords} />
    </Suspense>
  );
}
