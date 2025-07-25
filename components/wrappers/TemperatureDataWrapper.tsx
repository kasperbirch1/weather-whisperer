import WeatherDataSection from "@/components/WeatherDataSection";
import DMITempCard from "@/components/weather-sources/temp/DMITempCard";
import OpenWeatherTempCard from "@/components/weather-sources/temp/OpenWeatherTempCard";
import WeatherAPITempCard from "@/components/weather-sources/temp/WeatherAPITempCard";

interface TemperatureDataWrapperProps {
  coords: { lat: number; lon: number };
}

export default function TemperatureDataWrapper({
  coords,
}: TemperatureDataWrapperProps) {
  return (
    <WeatherDataSection title="Temperature Data" icon="🌡️" columns="responsive">
      {/* Each component fetches and renders independently */}
      <DMITempCard coords={coords} />
      <OpenWeatherTempCard coords={coords} />
      <WeatherAPITempCard coords={coords} />
    </WeatherDataSection>
  );
}
