import { Suspense } from "react";
import WindCard from "@/components/cards/WindCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { getMetObservations } from "@/generated/dmi";
import { Coordinates } from "@/lib/types";
import { transformDMIWind } from "@/lib/transformers";

interface DMIWindCardProps {
  coords: Coordinates;
}

async function DMIWindContent({ coords }: DMIWindCardProps) {
  const { lat, lon } = coords;

  try {
    // Create bounding box around the coordinates
    const margin = 0.5;
    const bbox = `${lon - margin},${lat - margin},${lon + margin},${lat + margin}`;

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

    // Check if we have any wind data
    if (!windSpeedData?.features?.length && !windDirData?.features?.length) {
      return (
        <NoDataCard
          icon="💨"
          title="No DMI Wind Data"
          description="No wind measurements available from DMI"
        />
      );
    }

    // Transform data to normalized format
    const normalizedData = transformDMIWind(windSpeedData, windDirData, coords);

    return (
      <WindCard
        apiName={normalizedData.apiName}
        windSpeed={normalizedData.windSpeed}
        windDirection={normalizedData.windDirection}
        windGust={normalizedData.windGust}
        pressure={normalizedData.pressure}
        location={normalizedData.location}
        timestamp={normalizedData.timestamp}
      />
    );
  } catch (error) {
    console.error("DMI Wind Error:", error);

    // Handle specific error types
    if (error instanceof Error && error.message.includes("429")) {
      return (
        <NoDataCard
          icon="💨"
          title="DMI API Rate Limited"
          description="DMI API is currently rate limited. Please try again later."
          badge={{ text: "Rate Limited", color: "yellow" }}
        />
      );
    }

    return (
      <NoDataCard
        icon="💨"
        title="No DMI Wind Data"
        description="Unable to fetch wind data from DMI API"
        badge={{ text: "API Error", color: "red" }}
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
