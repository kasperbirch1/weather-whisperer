import { Suspense } from "react";
import ForecastCard from "@/components/cards/ForecastCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { fetchDMIForecast } from "@/lib/weather-service";
import { Coordinates } from "@/lib/types";

interface DMIForecastCardProps {
  coords: Coordinates;
}

async function DMIForecastContent({ coords }: DMIForecastCardProps) {
  const { lat, lon } = coords;

  try {
    const dmiForecast = await fetchDMIForecast(lat, lon);

    if (dmiForecast) {
      return (
        <ForecastCard
          apiName="DMI Forecast"
          temperature={dmiForecast.waterTemp || dmiForecast.temperature}
          description={dmiForecast.description}
          highTemp={dmiForecast.waterTemp || dmiForecast.temperature}
          lowTemp={(dmiForecast.waterTemp || dmiForecast.temperature) - 2}
          location={dmiForecast.location}
          timestamp={dmiForecast.timestamp}
        />
      );
    }
  } catch (error) {
    console.error("DMI Forecast data fetch failed:", error);
  }

  return (
    <NoDataCard
      icon="🔮"
      title="No DMI Forecast Data"
      description="No forecast data available from DMI"
    />
  );
}

function DMIForecastSkeleton() {
  return <div className="animate-pulse bg-gray-200 rounded-lg h-32"></div>;
}

export default function DMIForecastCard({ coords }: DMIForecastCardProps) {
  return (
    <Suspense fallback={<DMIForecastSkeleton />}>
      <DMIForecastContent coords={coords} />
    </Suspense>
  );
}
