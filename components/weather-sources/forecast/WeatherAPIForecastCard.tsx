import { Suspense } from "react";
import ForecastCard from "@/components/cards/ForecastCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { Coordinates } from "@/lib/types";
import { forecastWeather } from "@/generated/weatherapi";
import { transformWeatherAPIForecast } from "@/lib/transformers";

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

    // Process forecast data
    if (
      !data.forecast ||
      !data.forecast.forecastday ||
      data.forecast.forecastday.length === 0
    ) {
      return (
        <NoDataCard
          icon="🔮"
          title="No WeatherAPI Forecast"
          description="No forecast data available from WeatherAPI.com"
          badge={{ text: "API Offline", color: "red" }}
        />
      );
    }

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
    console.error("WeatherAPI Forecast Error:", error);
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
  coords
}: WeatherAPIForecastCardProps) {
  return (
    <Suspense fallback={<WeatherAPIForecastSkeleton />}>
      <WeatherAPIForecastContent coords={coords} />
    </Suspense>
  );
}
