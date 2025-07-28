import { Suspense } from "react";
import TempCard from "@/components/cards/TempCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { Coordinates } from "@/lib/types";

interface WeatherAPITempCardProps {
  coords: Coordinates;
}

async function WeatherAPITempContent({ coords }: WeatherAPITempCardProps) {
  const { lat, lon } = coords;

  try {
    const apiKey = process.env.NEXT_PUBLIC_WEATHERAPI_KEY;
    if (!apiKey) {
      return (
        <NoDataCard
          icon="🌡️"
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
          icon="🌡️"
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
          icon="🌡️"
          title="No WeatherAPI Data"
          description="No temperature data available from WeatherAPI.com"
          badge={{ text: "API Offline", color: "red" }}
        />
      );
    }

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
  } catch {}

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
  coords
}: WeatherAPITempCardProps) {
  return (
    <Suspense fallback={<WeatherAPITempSkeleton />}>
      <WeatherAPITempContent coords={coords} />
    </Suspense>
  );
}
