// Sea level data transformers that normalize API responses to SeaLevelCard component props

// Import generated API types
import type { MetObservationResponse } from "@/generated/dmi-schemas/metObservationResponse";

// Import card component interface
import type { SeaLevelCardProps } from "@/components/cards/SeaLevelCard";

// DMI Sea Level transformer
export function transformDMISeaLevel(
  data: MetObservationResponse
): SeaLevelCardProps {
  const feature = data?.features?.[0];
  const props = feature?.properties;

  return {
    apiName: "DMI Sea Level",
    seaLevel: typeof props?.value === "number" ? props.value : 0,
    location: props?.stationId || "Unknown DMI Station",
    timestamp: props?.observed || new Date().toISOString()
  };
}
