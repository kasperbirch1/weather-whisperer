import { Suspense } from "react";
import ForecastCard from "@/components/cards/ForecastCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { getForecastByPosition } from "@/generated/dmi";
import { Coordinates } from "@/lib/types";
import { transformDMIForecast } from "@/lib/transformers";

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

    if (!data || !data.ranges) {
      return (
        <NoDataCard
          icon="🔮"
          title="No DMI Forecast Data"
          description="No forecast data available from DMI"
        />
      );
    }

    // Transform data to normalized format
    const normalizedData = transformDMIForecast(data, coords);

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
    console.error("DMI Forecast Error:", error);

    // Handle specific error types
    if (error instanceof Error && error.message.includes("429")) {
      return (
        <NoDataCard
          icon="🔮"
          title="DMI API Rate Limited"
          description="DMI API is currently rate limited. Please try again later."
          badge={{ text: "Rate Limited", color: "yellow" }}
        />
      );
    }

    return (
      <NoDataCard
        icon="🔮"
        title="No DMI Forecast Data"
        description="Unable to fetch forecast data from DMI API"
        badge={{ text: "API Error", color: "red" }}
      />
    );
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
