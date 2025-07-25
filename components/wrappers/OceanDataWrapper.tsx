import WeatherDataSection from "@/components/WeatherDataSection";
import DMIOceanCard from "@/components/weather-sources/ocean/DMIOceanCard";

interface OceanDataWrapperProps {
  coords: { lat: number; lon: number };
}

export default function OceanDataWrapper({ coords }: OceanDataWrapperProps) {
  return (
    <WeatherDataSection title="Ocean Data" icon="🌊" columns="single">
      {/* Each component fetches and renders independently */}
      <DMIOceanCard coords={coords} />
    </WeatherDataSection>
  );
}
