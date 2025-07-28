import { Suspense } from "react";
import ForecastCard from "@/components/cards/ForecastCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { getForecast } from "@/generated/openweather";
import { Coordinates } from "@/lib/types";

interface OpenWeatherForecastCardProps {
  coords: Coordinates;
}

async function OpenWeatherForecastContent({
  coords
}: OpenWeatherForecastCardProps) {
  const { lat, lon } = coords;

  try {
    // Get API key from environment
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
      return (
        <NoDataCard
          icon="🔮"
          title="No OpenWeatherMap Forecast"
          description="Missing API key"
          badge={{ text: "Config Error", color: "red" }}
        />
      );
    }

    const data = await getForecast({
      lat,
      lon,
      appid: apiKey,
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

    // Process forecast data - get today and tomorrow's forecast
    const today = data.list[0];
    const tomorrow =
      data.list.find(
        (item, index) =>
          index > 0 &&
          item.dt &&
          today.dt &&
          new Date(item.dt * 1000).getDate() !==
            new Date(today.dt * 1000).getDate()
      ) || data.list[8]; // ~24h later if no date change found

    const temperature = today.main?.temp || 0;
    const description = today.weather?.[0]?.description || "";
    const icon = today.weather?.[0]?.icon
      ? `https://openweathermap.org/img/wn/${today.weather[0].icon}@2x.png`
      : "";
    const highTemp = today.main?.temp_max || 0;
    const lowTemp = today.main?.temp_min || 0;
    const precipitationChance = (today.pop || 0) * 100;
    const tomorrowHighTemp = tomorrow?.main?.temp_max || 0;
    const tomorrowLowTemp = tomorrow?.main?.temp_min || 0;
    const tomorrowDescription = tomorrow?.weather?.[0]?.description || "";
    const tomorrowPrecipChance = (tomorrow?.pop || 0) * 100;
    const location = data.city?.name || "Unknown";
    const timestamp = today.dt
      ? new Date(today.dt * 1000).toISOString()
      : new Date().toISOString();

    return (
      <ForecastCard
        apiName="OpenWeatherMap"
        temperature={temperature}
        description={description}
        icon={icon}
        highTemp={highTemp}
        lowTemp={lowTemp}
        precipitationChance={precipitationChance}
        tomorrowHighTemp={tomorrowHighTemp}
        tomorrowLowTemp={tomorrowLowTemp}
        tomorrowDescription={tomorrowDescription}
        tomorrowPrecipChance={tomorrowPrecipChance}
        location={location}
        timestamp={timestamp}
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
