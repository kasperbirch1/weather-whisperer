import WeatherDataSection from "@/components/WeatherDataSection";
import DMISeaLevelCard from "@/components/weather-sources/sea-level/DMISeaLevelCard";
import { Coordinates } from "@/lib/types";

interface SeaLevelSectionProps {
  coords: Coordinates;
}

export default function SeaLevelSection({ coords }: SeaLevelSectionProps) {
  return (
    <WeatherDataSection title="Sea Level Data" icon="📏" columns="single">
      {/* Each component fetches and renders independently */}
      <DMISeaLevelCard coords={coords} />
    </WeatherDataSection>
  );
}
