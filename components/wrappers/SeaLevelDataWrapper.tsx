import WeatherDataSection from "@/components/WeatherDataSection";
import DMISeaLevelCard from "@/components/weather-sources/sea-level/DMISeaLevelCard";

interface SeaLevelDataWrapperProps {
  coords: { lat: number; lon: number };
}

export default function SeaLevelDataWrapper({
  coords,
}: SeaLevelDataWrapperProps) {
  return (
    <WeatherDataSection title="Sea Level Data" icon="📏" columns="single">
      {/* Each component fetches and renders independently */}
      <DMISeaLevelCard coords={coords} />
    </WeatherDataSection>
  );
}
