import { Suspense } from "react";
import WindCard from "@/components/WindCard";
import NoDataCard from "@/components/NoDataCard";
import { fetchWeatherAPIData } from "@/lib/weather-service";

interface WeatherAPIWindCardProps {
  coords: { lat: number; lon: number };
}

async function WeatherAPIWindContent({ coords }: WeatherAPIWindCardProps) {
  const { lat, lon } = coords;

  try {
    const weatherAPIData = await fetchWeatherAPIData(lat, lon);

    if (weatherAPIData) {
      return (
        <WindCard
          apiName="WeatherAPI.com"
          windSpeed={(weatherAPIData.current?.wind_kph || 0) / 3.6}
          windDirection={weatherAPIData.current?.wind_degree || 0}
          location={weatherAPIData.location?.name}
          timestamp={new Date(
            weatherAPIData.current?.last_updated_epoch * 1000
          ).toISOString()}
        />
      );
    }
  } catch (error) {
    console.error("WeatherAPI Wind data fetch failed:", error);
  }

  return (
    <NoDataCard
      icon="💨"
      title="No WeatherAPI Data"
      description="Unable to fetch data from WeatherAPI.com"
      badge={{ text: "API Offline", color: "red" }}
    />
  );
}

function WeatherAPIWindSkeleton() {
  return <div className="animate-pulse bg-gray-200 rounded-lg h-32"></div>;
}

export default function WeatherAPIWindCard({
  coords,
}: WeatherAPIWindCardProps) {
  return (
    <Suspense fallback={<WeatherAPIWindSkeleton />}>
      <WeatherAPIWindContent coords={coords} />
    </Suspense>
  );
}
