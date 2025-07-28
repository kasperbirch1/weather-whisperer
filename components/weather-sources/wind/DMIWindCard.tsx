import { Suspense } from "react";
import WindCard from "@/components/cards/WindCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { getMetObservations } from "@/generated/dmi";
import { Coordinates } from "@/lib/types";
import { transformDMIWind, transformWeatherError } from "@/lib/transformers";

interface DMIWindCardProps {
  coords: Coordinates;
}

async function DMIWindContent({ coords }: DMIWindCardProps) {
  const { lat, lon } = coords;

  try {
    // Create bounding box around the coordinates
    const margin = 0.5;
    const bbox = `${lon - margin},${lat - margin},${lon + margin},${lat + margin}`;

    const [windSpeedData, windDirData] = await Promise.all([
      getMetObservations({
        bbox,
        parameterId: "wind_speed",
        limit: 10
      }),
      getMetObservations({
        bbox,
        parameterId: "wind_dir",
        limit: 10
      })
    ]);

    // Transform data to normalized format
    const normalizedData = transformDMIWind(windSpeedData, windDirData, coords);

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
    const errorProps = transformWeatherError(error, "wind", "DMI");
    return <NoDataCard {...errorProps} />;
  }
}

function DMIWindSkeleton() {
  return <div className="animate-pulse bg-gray-200 rounded-lg h-32"></div>;
}

export default function DMIWindCard({ coords }: DMIWindCardProps) {
  return (
    <Suspense fallback={<DMIWindSkeleton />}>
      <DMIWindContent coords={coords} />
    </Suspense>
  );
}
