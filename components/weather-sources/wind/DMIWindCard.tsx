import { Suspense } from "react";
import WindCard from "@/components/WindCard";
import NoDataCard from "@/components/NoDataCard";
import { fetchDMIWindData } from "@/lib/weather-service";
import { Coordinates } from "@/lib/types";

interface DMIWindCardProps {
  coords: Coordinates;
}

async function DMIWindContent({ coords }: DMIWindCardProps) {
  const { lat, lon } = coords;

  try {
    const dmiWindData = await fetchDMIWindData(lat, lon);

    if (dmiWindData) {
      return (
        <WindCard
          apiName="DMI"
          windSpeed={dmiWindData.windSpeed}
          windDirection={dmiWindData.windDirection}
          location={dmiWindData.location}
          timestamp={dmiWindData.timestamp}
        />
      );
    }
  } catch (error) {
    console.error("DMI Wind data fetch failed:", error);
  }

  return (
    <NoDataCard
      icon="💨"
      title="No DMI Wind Data"
      description="No wind measurements available from DMI"
    />
  );
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
