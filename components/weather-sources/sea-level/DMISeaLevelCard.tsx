import { Suspense } from "react";
import SeaLevelCard from "@/components/SeaLevelCard";
import NoDataCard from "@/components/NoDataCard";
import { fetchDMISeaLevelData } from "@/lib/weather-service";
import { Coordinates } from "@/lib/types";

interface DMISeaLevelCardProps {
  coords: Coordinates;
}

async function DMISeaLevelContent({ coords }: DMISeaLevelCardProps) {
  const { lat, lon } = coords;

  try {
    const dmiSeaLevelData = await fetchDMISeaLevelData(lat, lon);

    if (dmiSeaLevelData) {
      return (
        <SeaLevelCard
          apiName="DMI Sea Level"
          seaLevel={dmiSeaLevelData.seaLevel}
          location={dmiSeaLevelData.location}
          timestamp={dmiSeaLevelData.timestamp}
        />
      );
    }
  } catch (error) {
    console.error("DMI Sea Level data fetch failed:", error);
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
