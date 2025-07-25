import WeatherDataSection from "@/components/WeatherDataSection";
import DMIWindCard from "@/components/weather-sources/wind/DMIWindCard";
import OpenWeatherWindCard from "@/components/weather-sources/wind/OpenWeatherWindCard";
import WeatherAPIWindCard from "@/components/weather-sources/wind/WeatherAPIWindCard";
import { Coordinates } from "@/lib/types";

interface WindDataWrapperProps {
  coords: Coordinates;
}

export default function WindDataWrapper({ coords }: WindDataWrapperProps) {
  return (
    <WeatherDataSection title="Wind Data" icon="💨" columns="responsive">
      {/* Each component fetches and renders independently */}
      <DMIWindCard coords={coords} />
      <OpenWeatherWindCard coords={coords} />
      <WeatherAPIWindCard coords={coords} />
    </WeatherDataSection>
  );
}
