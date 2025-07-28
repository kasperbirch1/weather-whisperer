import { Suspense } from "react";
import TempCard from "@/components/cards/TempCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { getMetObservations } from "@/generated/dmi";
import { Coordinates } from "@/lib/types";
import {
  transformDMITemperature,
  transformWeatherError
} from "@/lib/transformers";

interface DMITempCardProps {
  coords: Coordinates;
}

async function DMITempContent({ coords }: DMITempCardProps) {
  const { lat, lon } = coords;

  try {
    // Create bounding box around the coordinates
    const margin = 0.5;
    const bbox = `${lon - margin},${lat - margin},${lon + margin},${lat + margin}`;

    const data = await getMetObservations({
      bbox,
      parameterId: "temp_dry",
      limit: 10
    });

    // Transform data to normalized format
    const normalizedData = transformDMITemperature(data);

    return (
      <TempCard
        apiName={normalizedData.apiName}
        temperature={normalizedData.temperature}
        feelsLike={normalizedData.feelsLike}
        humidity={normalizedData.humidity}
        pressure={normalizedData.pressure}
        visibility={normalizedData.visibility}
        cloudCover={normalizedData.cloudCover}
        location={normalizedData.location}
        timestamp={normalizedData.timestamp}
      />
    );
  } catch (error) {
    const errorProps = transformWeatherError(error, "temperature", "DMI");
    return <NoDataCard {...errorProps} />;
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
