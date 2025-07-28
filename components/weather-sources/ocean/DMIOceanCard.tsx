import { Suspense } from "react";
import OceanCard from "@/components/cards/OceanCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { getOceanObservations } from "@/generated/dmi";
import { Coordinates } from "@/lib/types";

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

    if (!data || !data.features || data.features.length === 0) {
      return (
        <NoDataCard
          icon="🌊"
          title="No Ocean Data Available"
          description="No ocean measurements found for this location"
        />
      );
    }

    // Extract data from the first feature
    const feature = data.features[0];
    const props = feature.properties;

    // Only return data if we have at least one valid measurement
    if (!props || (!props.value && !props.temp && !props.salinity)) {
      return (
        <NoDataCard
          icon="🌊"
          title="No Ocean Data Available"
          description="No ocean measurements found for this location"
        />
      );
    }

    const waveHeight = props.value;
    const waterTemperature = props.temp;
    const salinity = props.salinity;
    const location = props.stationId || "DMI Ocean Station";
    const timestamp = props.observed || new Date().toISOString();

    return (
      <OceanCard
        apiName="DMI Ocean"
        waveHeight={waveHeight}
        waterTemperature={waterTemperature}
        salinity={salinity}
        location={location}
        timestamp={timestamp}
      />
    );
  } catch (error) {
    console.error("DMI Ocean Error:", error);

    // Handle specific error types
    if (error instanceof Error && error.message.includes("429")) {
      return (
        <NoDataCard
          icon="🌊"
          title="DMI API Rate Limited"
          description="DMI API is currently rate limited. Please try again later."
          badge={{ text: "Rate Limited", color: "yellow" }}
        />
      );
    }

    return (
      <NoDataCard
        icon="🌊"
        title="No Ocean Data Available"
        description="Unable to fetch ocean data from DMI API"
        badge={{ text: "API Error", color: "red" }}
      />
    );
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
