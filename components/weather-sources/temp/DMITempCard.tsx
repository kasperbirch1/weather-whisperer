import { Suspense } from "react";
import TempCard from "@/components/TempCard";
import NoDataCard from "@/components/NoDataCard";
import { fetchDMITempData } from "@/lib/weather-service";
import { Coordinates } from "@/lib/types";

interface DMITempCardProps {
  coords: Coordinates;
}

async function DMITempContent({ coords }: DMITempCardProps) {
  const { lat, lon } = coords;

  try {
    const dmiTempData = await fetchDMITempData(lat, lon);

    if (dmiTempData) {
      return (
        <TempCard
          apiName="DMI"
          temperature={dmiTempData.temperature}
          location={dmiTempData.location}
          timestamp={dmiTempData.timestamp}
        />
      );
    }
  } catch (error) {
    console.error("DMI Temp data fetch failed:", error);
  }

  return (
    <NoDataCard
      icon="🌡️"
      title="No DMI Temperature Data"
      description="No temperature measurements available from DMI"
    />
  );
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
