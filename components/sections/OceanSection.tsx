import WeatherDataSection from "@/components/WeatherDataSection";
import DMIOceanCard from "@/components/weather-sources/ocean/DMIOceanCard";
import { Coordinates } from "@/lib/types";

interface OceanSectionProps {
  coords: Coordinates;
}

export default function OceanSection({ coords }: OceanSectionProps) {
  return (
    <WeatherDataSection title="Ocean Data" icon="🌊" columns="single">
      {/* Each component fetches and renders independently */}
      <DMIOceanCard coords={coords} />
    </WeatherDataSection>
  );
}
