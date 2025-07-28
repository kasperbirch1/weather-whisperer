import { Suspense } from "react";
import WindCard from "@/components/cards/WindCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { Coordinates } from "@/lib/types";
import { realtimeWeather } from "@/generated/weatherapi";
import { transformWeatherAPIWind } from "@/lib/transformers";

interface WeatherAPIWindCardProps {
  coords: Coordinates;
}

async function WeatherAPIWindContent({ coords }: WeatherAPIWindCardProps) {
  const { lat, lon } = coords;

  try {
    const data = await realtimeWeather({
      q: `${lat},${lon}`
    });

    if (!data?.current) {
      return (
        <NoDataCard
          icon="💨"
          title="No WeatherAPI.com Data"
          description="No wind data available from WeatherAPI.com"
          badge={{ text: "API Offline", color: "red" }}
        />
      );
    }

    // Transform data to normalized format
    const normalizedData = transformWeatherAPIWind(data);

    return (
      <WindCard
        apiName={normalizedData.apiName}
        windSpeed={normalizedData.windSpeed}
        windDirection={normalizedData.windDirection}
        windGust={normalizedData.windGust}
        pressure={normalizedData.pressure}
        location={normalizedData.location}
        timestamp={normalizedData.timestamp}
      />
    );
  } catch (error) {
    console.error("WeatherAPI Wind Error:", error);
    return (
      <NoDataCard
        icon="💨"
        title="No WeatherAPI.com Data"
        description="Unable to fetch data from WeatherAPI.com API"
        badge={{ text: "API Offline", color: "red" }}
      />
    );
  }
}

function WeatherAPIWindSkeleton() {
  return <div className="animate-pulse bg-gray-200 rounded-lg h-32"></div>;
}

export default function WeatherAPIWindCard({
  coords
}: WeatherAPIWindCardProps) {
  return (
    <Suspense fallback={<WeatherAPIWindSkeleton />}>
      <WeatherAPIWindContent coords={coords} />
    </Suspense>
  );
}
