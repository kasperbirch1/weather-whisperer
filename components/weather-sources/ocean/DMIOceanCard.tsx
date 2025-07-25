import { Suspense } from "react";
import OceanCard from "@/components/OceanCard";
import NoDataCard from "@/components/NoDataCard";
import { fetchDMIOceanData } from "@/lib/weather-service";
import { Coordinates } from "@/lib/types";

interface DMIOceanCardProps {
  coords: Coordinates;
}

async function DMIOceanContent({ coords }: DMIOceanCardProps) {
  const { lat, lon } = coords;

  try {
    const dmiOceanData = await fetchDMIOceanData(lat, lon);

    if (dmiOceanData) {
      return (
        <OceanCard
          apiName="DMI Ocean"
          waveHeight={dmiOceanData.waveHeight}
          waterTemperature={dmiOceanData.waterTemperature}
          salinity={dmiOceanData.salinity}
          location={dmiOceanData.location}
          timestamp={dmiOceanData.timestamp}
        />
      );
    }
  } catch (error) {
    console.error("DMI Ocean data fetch failed:", error);
  }

  return (
    <NoDataCard
      icon="🌊"
      title="No Ocean Data Available"
      description="No ocean measurements found for this location"
    />
  );
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
