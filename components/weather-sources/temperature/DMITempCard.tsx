import { Suspense } from "react";
import TempCard from "@/components/cards/TempCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { getMetObservations } from "@/generated/dmi";
import { Coordinates } from "@/lib/types";

interface DMITempCardProps {
  coords: Coordinates;
}

async function DMITempContent({ coords }: DMITempCardProps) {
  const { lat, lon } = coords;

  // Create bounding box around the coordinates
  const margin = 0.5;
  const bbox = `${lon - margin},${lat - margin},${lon + margin},${lat + margin}`;

  try {
    // Get temperature data from DMI meteorological observations
    const data = await getMetObservations({
      bbox,
      parameterId: "temp_dry",
      limit: 10
    });

    if (!data || !data.features || data.features.length === 0) {
      return (
        <NoDataCard
          icon="🌡️"
          title="No DMI Temperature Data"
          description="No temperature measurements available from DMI"
        />
      );
    }

    // Extract temperature data from the first feature
    const feature = data.features[0];
    const temperature = feature.properties?.value || 0;
    const location = feature.properties?.stationId || "DMI Station";
    const timestamp = feature.properties?.observed || new Date().toISOString();

    return (
      <TempCard
        apiName="DMI"
        temperature={temperature}
        location={location}
        timestamp={timestamp}
      />
    );
  } catch {
    return (
      <NoDataCard
        icon="🌡️"
        title="No DMI Temperature Data"
        description="Unable to fetch data from DMI API"
      />
    );
  }
}

function DMITempSkeleton() {
  return <div className="animate-pulse bg-gray-200 rounded-lg h-32"></div>;
}

export default function DMITempCard({ coords }: DMITempCardProps) {
  return (
    <Suspense fallback={<DMITempSkeleton />}>
      <DMITempContent coords={coords} />
    </Suspense>
  );
}
