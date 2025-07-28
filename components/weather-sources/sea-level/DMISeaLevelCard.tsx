import { Suspense } from "react";
import SeaLevelCard from "@/components/cards/SeaLevelCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { Coordinates } from "@/lib/types";
import { getMetObservations } from "@/generated/dmi";
import { transformDMISeaLevel, transformWeatherError } from "@/lib/transformers";

interface DMISeaLevelCardProps {
  coords: Coordinates;
}

async function DMISeaLevelContent({ coords }: DMISeaLevelCardProps) {
  const { lat, lon } = coords;

  try {
    // Search for sea level observation stations in a large area
    const margin = 2.0; // Large search radius to find nearby stations
    const bbox = `${lon - margin},${lat - margin},${lon + margin},${lat + margin}`;

    // Get all meteorological observations in the area (without parameterId filter)
    // This returns various measurements including sea level data from available stations
    const response = await getMetObservations({
      bbox: bbox,
      limit: 20 // Get multiple stations to find the best match
    });

    // Transform data to normalized format
    const normalizedData = transformDMISeaLevel(response, coords);

    return (
      <SeaLevelCard
        apiName={normalizedData.apiName}
        seaLevel={normalizedData.seaLevel}
        location={normalizedData.location}
        timestamp={normalizedData.timestamp}
      />
    );
  } catch (error) {
    const errorProps = transformWeatherError(error, "sea-level", "DMI");
    return <NoDataCard {...errorProps} />;
  }
}

function DMISeaLevelSkeleton() {
  return <div className="animate-pulse bg-gray-200 rounded-lg h-32"></div>;
}

export default function DMISeaLevelCard({ coords }: DMISeaLevelCardProps) {
  return (
    <Suspense fallback={<DMISeaLevelSkeleton />}>
      <DMISeaLevelContent coords={coords} />
    </Suspense>
  );
}
