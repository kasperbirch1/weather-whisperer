import { Suspense } from "react";
import OceanCard from "@/components/cards/OceanCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { getOceanObservations } from "@/generated/dmi";
import { Coordinates } from "@/lib/types";
import { transformDMIOcean, transformWeatherError } from "@/lib/transformers";

interface DMIOceanCardProps {
  coords: Coordinates;
}

async function DMIOceanContent({ coords }: DMIOceanCardProps) {
  const { lat, lon } = coords;

  try {
    // Create bounding box around the coordinates
    const margin = 1.0; // Larger area for ocean data
    const bbox = `${lon - margin},${lat - margin},${lon + margin},${lat + margin}`;

    const data = await getOceanObservations({
      bbox,
      limit: 10
    });

    // Transform data to normalized format
    const normalizedData = transformDMIOcean(data);

    return (
      <OceanCard
        apiName={normalizedData.apiName}
        waveHeight={normalizedData.waveHeight}
        waterTemperature={normalizedData.waterTemperature}
        salinity={normalizedData.salinity}
        location={normalizedData.location}
        timestamp={normalizedData.timestamp}
      />
    );
  } catch (error) {
    const errorProps = transformWeatherError(error, "ocean", "DMI");
    return <NoDataCard {...errorProps} />;
  }
}

function DMIOceanSkeleton() {
  return <div className="animate-pulse bg-gray-200 rounded-lg h-32"></div>;
}

export default function DMIOceanCard({ coords }: DMIOceanCardProps) {
  return (
    <Suspense fallback={<DMIOceanSkeleton />}>
      <DMIOceanContent coords={coords} />
    </Suspense>
  );
}
