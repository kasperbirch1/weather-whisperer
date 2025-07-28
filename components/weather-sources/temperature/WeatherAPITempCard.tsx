import { Suspense } from "react";
import TempCard from "@/components/cards/TempCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { realtimeWeather } from "@/generated/weatherapi";
import { Coordinates } from "@/lib/types";
import { transformWeatherAPITemperature } from "@/lib/transformers";

interface WeatherAPITempCardProps {
  coords: Coordinates;
}

async function WeatherAPITempContent({ coords }: WeatherAPITempCardProps) {
  const { lat, lon } = coords;

  try {
    const weatherAPIData = await realtimeWeather({
      q: `${lat},${lon}`
    });

    if (!weatherAPIData || !weatherAPIData.current) {
      return (
        <NoDataCard
          icon="🌡️"
          title="No WeatherAPI Data"
          description="No temperature data available from WeatherAPI.com"
          badge={{ text: "API Offline", color: "red" }}
        />
      );
    }

    // Transform data to normalized format
    const normalizedData = transformWeatherAPITemperature(weatherAPIData);

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
    console.error("WeatherAPI Temperature Error:", error);
    return (
      <NoDataCard
        icon="🌡️"
        title="No WeatherAPI Data"
        description="Unable to fetch data from WeatherAPI.com"
        badge={{ text: "API Offline", color: "red" }}
      />
    );
  }
}

function WeatherAPITempSkeleton() {
  return <div className="animate-pulse bg-gray-200 rounded-lg h-32"></div>;
}

export default function WeatherAPITempCard({
  coords
}: WeatherAPITempCardProps) {
  return (
    <Suspense fallback={<WeatherAPITempSkeleton />}>
      <WeatherAPITempContent coords={coords} />
    </Suspense>
  );
}
