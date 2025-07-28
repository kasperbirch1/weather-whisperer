import { Suspense } from "react";
import ForecastCard from "@/components/cards/ForecastCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { Coordinates } from "@/lib/types";

interface WeatherAPIForecastCardProps {
  coords: Coordinates;
}

async function WeatherAPIForecastContent({
  coords
}: WeatherAPIForecastCardProps) {
  const { lat, lon } = coords;

  try {
    const apiKey = process.env.NEXT_PUBLIC_WEATHERAPI_KEY;
    if (!apiKey) {
      return (
        <NoDataCard
          icon="🔮"
          title="No WeatherAPI Forecast"
          description="Missing API key"
          badge={{ text: "Config Error", color: "red" }}
        />
      );
    }

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=3&aqi=yes&alerts=yes`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json"
      },
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      return (
        <NoDataCard
          icon="🔮"
          title="No WeatherAPI Forecast"
          description="Unable to fetch forecast from WeatherAPI.com"
          badge={{ text: "API Offline", color: "red" }}
        />
      );
    }
    
    const data = await response.json();

    // Process forecast data
    if (
      !data.forecast ||
      !data.forecast.forecastday ||
      data.forecast.forecastday.length === 0
    ) {
      return (
        <NoDataCard
          icon="🔮"
          title="No WeatherAPI Forecast"
          description="No forecast data available from WeatherAPI.com"
          badge={{ text: "API Offline", color: "red" }}
        />
      );
    }

    const weatherAPIForecast = {
      temperature: data.current?.temp_c || 0,
      description: data.current?.condition?.text || "",
      icon: data.current?.condition?.icon || "",
      highTemp: data.forecast.forecastday[0].day?.maxtemp_c || 0,
      lowTemp: data.forecast.forecastday[0].day?.mintemp_c || 0,
      precipitationChance:
        data.forecast.forecastday[0].day?.daily_chance_of_rain || 0,
      tomorrowHighTemp: data.forecast.forecastday[1]?.day?.maxtemp_c || 0,
      tomorrowLowTemp: data.forecast.forecastday[1]?.day?.mintemp_c || 0,
      tomorrowDescription:
        data.forecast.forecastday[1]?.day?.condition?.text || "",
      tomorrowPrecipChance:
        data.forecast.forecastday[1]?.day?.daily_chance_of_rain || 0,
      location: data.location?.name || "Unknown",
      timestamp: new Date(
        data.current?.last_updated_epoch
          ? data.current.last_updated_epoch * 1000
          : Date.now()
      ).toISOString()
    };

    return (
      <ForecastCard
        apiName="WeatherAPI.com"
        temperature={weatherAPIForecast.temperature}
        description={weatherAPIForecast.description}
        icon={weatherAPIForecast.icon}
        highTemp={weatherAPIForecast.highTemp}
        lowTemp={weatherAPIForecast.lowTemp}
        precipitationChance={weatherAPIForecast.precipitationChance}
        tomorrowHighTemp={weatherAPIForecast.tomorrowHighTemp}
        tomorrowLowTemp={weatherAPIForecast.tomorrowLowTemp}
        tomorrowDescription={weatherAPIForecast.tomorrowDescription}
        tomorrowPrecipChance={weatherAPIForecast.tomorrowPrecipChance}
        location={weatherAPIForecast.location}
        timestamp={weatherAPIForecast.timestamp}
      />
    );
  } catch {
  }

  return (
    <NoDataCard
      icon="🔮"
      title="No WeatherAPI Forecast"
      description="Unable to fetch forecast from WeatherAPI.com"
      badge={{ text: "API Offline", color: "red" }}
    />
  );
}

function WeatherAPIForecastSkeleton() {
  return <div className="animate-pulse bg-gray-200 rounded-lg h-32"></div>;
}

export default function WeatherAPIForecastCard({
  coords
}: WeatherAPIForecastCardProps) {
  return (
    <Suspense fallback={<WeatherAPIForecastSkeleton />}>
      <WeatherAPIForecastContent coords={coords} />
    </Suspense>
  );
}
