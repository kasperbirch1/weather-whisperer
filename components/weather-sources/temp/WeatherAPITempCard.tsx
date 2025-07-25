import { Suspense } from "react";
import TempCard from "@/components/TempCard";
import NoDataCard from "@/components/NoDataCard";
import { fetchWeatherAPIData } from "@/lib/weather-service";

interface WeatherAPITempCardProps {
  coords: { lat: number; lon: number };
}

async function WeatherAPITempContent({ coords }: WeatherAPITempCardProps) {
  const { lat, lon } = coords;

  try {
    const weatherAPIData = await fetchWeatherAPIData(lat, lon);

    if (weatherAPIData) {
      return (
        <TempCard
          apiName="WeatherAPI.com"
          temperature={weatherAPIData.current?.temp_c || 0}
          feelsLike={weatherAPIData.current?.feelslike_c}
          humidity={weatherAPIData.current?.humidity}
          location={weatherAPIData.location?.name}
          timestamp={new Date(
            weatherAPIData.current?.last_updated_epoch * 1000
          ).toISOString()}
        />
      );
    }
  } catch (error) {
    console.error("WeatherAPI Temp data fetch failed:", error);
  }

  return (
    <NoDataCard
      icon="🌡️"
      title="No WeatherAPI Data"
      description="Unable to fetch data from WeatherAPI.com"
      badge={{ text: "API Offline", color: "red" }}
    />
  );
}

function WeatherAPITempSkeleton() {
  return <div className="animate-pulse bg-gray-200 rounded-lg h-32"></div>;
}

export default function WeatherAPITempCard({
  coords,
}: WeatherAPITempCardProps) {
  return (
    <Suspense fallback={<WeatherAPITempSkeleton />}>
      <WeatherAPITempContent coords={coords} />
    </Suspense>
  );
}
