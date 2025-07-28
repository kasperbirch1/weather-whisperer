// Ocean data transformers that normalize API responses to OceanCard component props

// Import generated API types
import type { MetObservationResponse } from "@/generated/dmi-schemas/metObservationResponse";

// Import card component interface
import type { OceanCardProps } from "@/components/cards/OceanCard";

// DMI Ocean transformer
export function transformDMIOcean(
  data: MetObservationResponse
): OceanCardProps {
  const feature = data?.features?.[0];
  const props = feature?.properties;

  return {
    apiName: "DMI Ocean",
    waveHeight: typeof props?.value === 'number' ? props.value : undefined,
    waterTemperature: typeof props?.temp === 'number' ? props.temp : undefined,
    salinity: typeof props?.salinity === 'number' ? props.salinity : undefined,
    location: props?.stationId || "Unknown DMI Ocean Station",
    timestamp: props?.observed || new Date().toISOString()
  };
}
