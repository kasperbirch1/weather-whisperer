import WeatherDataSection from "@/components/WeatherDataSection";
import DMIWindCard from "@/components/weather-sources/wind/DMIWindCard";
import OpenWeatherWindCard from "@/components/weather-sources/wind/OpenWeatherWindCard";
import WeatherAPIWindCard from "@/components/weather-sources/wind/WeatherAPIWindCard";
import { Coordinates } from "@/lib/types";

interface WindSectionProps {
  coords: Coordinates;
}

export default function WindSection({ coords }: WindSectionProps) {
  return (
    <WeatherDataSection title="Wind Data" icon="💨" columns="responsive">
      {/* Each component fetches and renders independently */}
      <DMIWindCard coords={coords} />
      <OpenWeatherWindCard coords={coords} />
      <WeatherAPIWindCard coords={coords} />
    </WeatherDataSection>
  );
}
