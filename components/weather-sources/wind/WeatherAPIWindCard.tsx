import { Suspense } from "react";
import WindCard from "@/components/cards/WindCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { Coordinates } from "@/lib/types";

interface WeatherAPIWindCardProps {
  coords: Coordinates;
}

async function WeatherAPIWindContent({ coords }: WeatherAPIWindCardProps) {
  const { lat, lon } = coords;

  try {
    const apiKey = process.env.NEXT_PUBLIC_WEATHERAPI_KEY;
    if (!apiKey) {
      return (
        <NoDataCard
          icon="💨"
          title="No WeatherAPI Data"
          description="Missing API key"
          badge={{ text: "Config Error", color: "red" }}
        />
      );
    }

    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=yes`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json"
      },
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      return (
        <NoDataCard
          icon="💨"
          title="No WeatherAPI Data"
          description="Unable to fetch data from WeatherAPI.com"
          badge={{ text: "API Offline", color: "red" }}
        />
      );
    }

    const weatherAPIData = await response.json();

    if (!weatherAPIData || !weatherAPIData.current) {
      return (
        <NoDataCard
          icon="💨"
          title="No WeatherAPI Data"
          description="No wind data available from WeatherAPI.com"
          badge={{ text: "API Offline", color: "red" }}
        />
      );
    }

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
  } catch {}

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
  coords
}: WeatherAPIWindCardProps) {
  return (
    <Suspense fallback={<WeatherAPIWindSkeleton />}>
      <WeatherAPIWindContent coords={coords} />
    </Suspense>
  );
}
