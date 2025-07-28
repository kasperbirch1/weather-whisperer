import { Suspense } from "react";
import WindCard from "@/components/cards/WindCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { getMetObservations } from "@/generated/dmi";
import { Coordinates } from "@/lib/types";

interface DMIWindCardProps {
  coords: Coordinates;
}

async function DMIWindContent({ coords }: DMIWindCardProps) {
  const { lat, lon } = coords;

  // Create bounding box around the coordinates
  const margin = 0.5;
  const bbox = `${lon - margin},${lat - margin},${lon + margin},${lat + margin}`;

  try {
    // Get wind speed and direction data from DMI meteorological observations
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

    if (
      !windSpeedData ||
      !windSpeedData.features ||
      windSpeedData.features.length === 0
    ) {
      return (
        <NoDataCard
          icon="💨"
          title="No DMI Wind Data"
          description="No wind measurements available from DMI"
        />
      );
    }

    // Extract wind data from the first feature
    const windSpeedFeature = windSpeedData.features[0];
    const windDirFeature = windDirData?.features?.[0];

    const windSpeed = windSpeedFeature.properties?.value || 0;
    const windDirection = windDirFeature?.properties?.value || 0;
    const location = windSpeedFeature.properties?.stationId || "DMI Station";
    const timestamp =
      windSpeedFeature.properties?.observed || new Date().toISOString();

    return (
      <WindCard
        apiName="DMI"
        windSpeed={windSpeed}
        windDirection={windDirection}
        location={location}
        timestamp={timestamp}
      />
    );
  } catch {
    return (
      <NoDataCard
        icon="💨"
        title="No DMI Wind Data"
        description="Unable to fetch data from DMI API"
      />
    );
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
