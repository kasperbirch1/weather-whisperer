import WeatherDataSection from "@/components/WeatherDataSection";
import DMIForecastCard from "@/components/weather-sources/forecast/DMIForecastCard";
import OpenWeatherForecastCard from "@/components/weather-sources/forecast/OpenWeatherForecastCard";
import WeatherAPIForecastCard from "@/components/weather-sources/forecast/WeatherAPIForecastCard";
import { Coordinates } from "@/lib/types";

interface ForecastSectionProps {
  coords: Coordinates;
}

export default function ForecastSection({ coords }: ForecastSectionProps) {
  return (
    <WeatherDataSection title="Forecast Data" icon="🔮" columns="responsive">
      {/* Each component fetches and renders independently */}
      <DMIForecastCard coords={coords} />
      <OpenWeatherForecastCard coords={coords} />
      <WeatherAPIForecastCard coords={coords} />
    </WeatherDataSection>
  );
}
