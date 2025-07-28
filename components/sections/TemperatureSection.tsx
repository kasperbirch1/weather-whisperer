import WeatherDataSection from "@/components/WeatherDataSection";
import DMITempCard from "@/components/weather-sources/temperature/DMITempCard";
import OpenWeatherTempCard from "@/components/weather-sources/temperature/OpenWeatherTempCard";
import WeatherAPITempCard from "@/components/weather-sources/temperature/WeatherAPITempCard";
import { Coordinates } from "@/lib/types";

interface TemperatureSectionProps {
  coords: Coordinates;
}

export default function TemperatureSection({
  coords,
}: TemperatureSectionProps) {
  return (
    <WeatherDataSection title="Temperature Data" icon="🌡️" columns="responsive">
      {/* Each component fetches and renders independently */}
      <DMITempCard coords={coords} />
      <OpenWeatherTempCard coords={coords} />
      <WeatherAPITempCard coords={coords} />
    </WeatherDataSection>
  );
}
