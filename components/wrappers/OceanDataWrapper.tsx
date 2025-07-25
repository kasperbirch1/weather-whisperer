import WeatherDataSection from "@/components/WeatherDataSection";
import DMIOceanCard from "@/components/weather-sources/ocean/DMIOceanCard";
import { Coordinates } from "@/lib/types";

interface OceanDataWrapperProps {
  coords: Coordinates;
}

export default function OceanDataWrapper({ coords }: OceanDataWrapperProps) {
  return (
    <WeatherDataSection title="Ocean Data" icon="🌊" columns="single">
      {/* Each component fetches and renders independently */}
      <DMIOceanCard coords={coords} />
    </WeatherDataSection>
  );
}
