import { Suspense } from "react";
import ForecastCard from "@/components/cards/ForecastCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { getForecastByPosition } from "@/generated/dmi";
import { Coordinates } from "@/lib/types";
import { transformDMIForecast, transformWeatherError } from "@/lib/transformers";

interface DMIForecastCardProps {
  coords: Coordinates;
}

async function DMIForecastContent({ coords }: DMIForecastCardProps) {
  const { lat, lon } = coords;

  try {
    const data = await getForecastByPosition("dkss_nsbs", {
      coords: `POINT(${lon} ${lat})`,
      "parameter-name": "water-temperature,wind-u,wind-v,sea-mean-deviation"
    });

    // Transform data to normalized format
    const normalizedData = transformDMIForecast(data);

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
    const errorProps = transformWeatherError(error, "forecast", "DMI");
    return <NoDataCard {...errorProps} />;
  }
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
