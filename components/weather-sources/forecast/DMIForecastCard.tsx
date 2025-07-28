import { Suspense } from "react";
import ForecastCard from "@/components/cards/ForecastCard";
import NoDataCard from "@/components/cards/NoDataCard";
import { getForecastByPosition } from "@/generated/dmi";
import { Coordinates } from "@/lib/types";

interface DMIForecastCardProps {
  coords: Coordinates;
}

async function DMIForecastContent({ coords }: DMIForecastCardProps) {
  const { lat, lon } = coords;

  try {
    // Get current forecast data from DKSS North Sea Baltic Sea using position query
    const data = await getForecastByPosition("dkss_nsbs", {
      coords: `POINT(${lon} ${lat})`,
      "parameter-name": "water-temperature,wind-u,wind-v,sea-mean-deviation"
    });

    if (!data || !data.ranges) {
      return (
        <NoDataCard
          icon="🔮"
          title="No DMI Forecast Data"
          description="No forecast data available from DMI"
        />
      );
    }

    // Extract the current forecast values (first value in each time series)
    const waterTemp = data.ranges["water-temperature"]?.values?.[0];
    const windU = data.ranges["wind-u"]?.values?.[0];
    const windV = data.ranges["wind-v"]?.values?.[0];
    const seaLevel = data.ranges["sea-mean-deviation"]?.values?.[0];

    // Skip if all values are null (no data available for this location)
    if (
      waterTemp === null &&
      windU === null &&
      windV === null &&
      seaLevel === null
    ) {
      return (
        <NoDataCard
          icon="🌊"
          title="No Marine Data Available"
          description="No forecast data available for this marine location"
        />
      );
    }

    // Calculate wind speed and direction from U/V components
    const windSpeed =
      windU && windV ? Math.sqrt(windU * windU + windV * windV) : undefined;

    // Get the forecast time from the response using generated types
    const forecastTime =
      data.domain?.axes?.t?.values?.[0] || new Date().toISOString();

    // Process and extract all data first
    const temperature = waterTemp !== null && waterTemp !== undefined
      ? Math.round(waterTemp * 10) / 10
      : undefined;
    const highTemp = temperature; // Use water temp as current high
    const lowTemp = temperature !== undefined
      ? Math.round((temperature - 1) * 10) / 10
      : undefined;
    const location = `Danish Waters (${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E)`;

    // Format description with available data
    const windInfo = windSpeed
      ? ` - Wind: ${Math.round(windSpeed * 10) / 10} m/s`
      : "";
    const seaLevelInfo =
      seaLevel !== null && seaLevel !== undefined
        ? ` - Sea level: ${seaLevel > 0 ? "+" : ""}${Math.round(seaLevel * 100) / 100}m`
        : "";
    const description = `Marine forecast for Danish waters${windInfo}${seaLevelInfo}`;

    return (
      <ForecastCard
        apiName="DMI Forecast EDR"
        temperature={temperature}
        description={description}
        highTemp={highTemp}
        lowTemp={lowTemp}
        precipitationChance={undefined} // Not available in marine forecast
        tomorrowHighTemp={undefined} // Would need separate API call
        tomorrowLowTemp={undefined}
        tomorrowDescription="Extended marine forecast available"
        tomorrowPrecipChance={undefined}
        location={location}
        timestamp={forecastTime}
      />
    );
  } catch {
    return (
      <NoDataCard
        icon="🔮"
        title="No DMI Forecast Data"
        description="Unable to fetch forecast data from DMI API"
      />
    );
  }
}

function DMIForecastSkeleton() {
  return <div className="animate-pulse bg-gray-200 rounded-lg h-32"></div>;
}

export default function DMIForecastCard({ coords }: DMIForecastCardProps) {
  return (
    <Suspense fallback={<DMIForecastSkeleton />}>
      <DMIForecastContent coords={coords} />
    </Suspense>
  );
}
