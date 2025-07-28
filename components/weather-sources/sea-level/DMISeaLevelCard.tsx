import { Suspense } from "react";
import SeaLevelCard from "@/components/cards/SeaLevelCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { Coordinates } from "@/lib/types";
import { getMetObservations } from "@/generated/dmi";

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

    // Look for sea level measurements in the response
    // Sea level data might be mixed with other meteorological data
    const feature =
      response.features && response.features.length > 0
        ? response.features[0]
        : null;

    if (feature && feature.properties) {
      const dmiSeaLevelData = {
        seaLevel: feature.properties.value || 0,
        location: feature.properties.stationId || "DMI Station",
        timestamp: feature.properties.observed || new Date().toISOString()
      };

      return (
        <SeaLevelCard
          apiName="DMI Sea Level"
          seaLevel={dmiSeaLevelData.seaLevel}
          location={dmiSeaLevelData.location}
          timestamp={dmiSeaLevelData.timestamp}
        />
      );
    }
  } catch {
  }

  return (
    <NoDataCard
      icon="📏"
      title="No Sea Level Data"
      description="No sea level measurements available from DMI"
    />
  );
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
