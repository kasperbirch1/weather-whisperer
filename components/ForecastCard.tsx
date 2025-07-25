// Forecast data interfaces
interface ForecastDomain {
  axes: {
    t: {
      values: string[];
    };
  };
}

interface ForecastRanges {
  'wind-u'?: {
    values: (number | null)[];
  };
  'wind-v'?: {
    values: (number | null)[];
  };
  'water-temperature'?: {
    values: (number | null)[];
  };
  'sea-mean-deviation'?: {
    values: (number | null)[];
  };
}

interface ForecastData {
  domain?: ForecastDomain;
  ranges?: ForecastRanges;
}

interface ForecastCardProps {
  forecastData: ForecastData | null;
}

interface ForecastPoint {
  time: string;
  windSpeed: number;
  windDirection: number;
  waterTemp: number;
  seaLevel: number;
}

function calculateWindSpeed(u: number, v: number): number {
  return Math.sqrt(u * u + v * v);
}

function calculateWindDirection(u: number, v: number): number {
  // Calculate wind direction in degrees (0° = North, 90° = East, etc.)
  let direction = (Math.atan2(u, v) * 180) / Math.PI;
  if (direction < 0) direction += 360;
  return direction;
}

function getWindDirectionArrow(degrees: number): string {
  const directions = ["↓", "↙", "←", "↖", "↑", "↗", "→", "↘"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

function getWindDirectionName(degrees: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

function getWindSpeedColor(speed: number): string {
  if (speed >= 15) return "text-red-600 bg-red-50";
  if (speed >= 10) return "text-orange-600 bg-orange-50";
  if (speed >= 5) return "text-blue-600 bg-blue-50";
  return "text-green-600 bg-green-50";
}

function getWindSpeedDescription(speed: number): string {
  if (speed >= 15) return "Strong";
  if (speed >= 10) return "Fresh";
  if (speed >= 5) return "Moderate";
  return "Light";
}

function processTimeSeriesData(forecastData: ForecastData | null): ForecastPoint[] {
  if (!forecastData?.domain?.axes?.t?.values || !forecastData?.ranges) {
    return [];
  }

  const times = forecastData.domain.axes.t.values;
  const windU = forecastData.ranges["wind-u"]?.values || [];
  const windV = forecastData.ranges["wind-v"]?.values || [];
  const waterTemp = forecastData.ranges["water-temperature"]?.values || [];
  const seaLevel = forecastData.ranges["sea-mean-deviation"]?.values || [];

  return times
    .map((time: string, index: number) => {
      const u = windU[index];
      const v = windV[index];

      return {
        time,
        windSpeed: u !== null && v !== null ? calculateWindSpeed(u, v) : 0,
        windDirection:
          u !== null && v !== null ? calculateWindDirection(u, v) : 0,
        waterTemp: waterTemp[index] || 0,
        seaLevel: seaLevel[index] || 0,
      };
    })
    .filter((point: ForecastPoint) => point.windSpeed > 0); // Filter out null/invalid data points
}

export default function ForecastCard({ forecastData }: ForecastCardProps) {
  if (!forecastData) {
    return (
      <div className="p-6 rounded-lg mb-6 border bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
        <h3 className="text-xl font-bold mb-4 text-gray-600">
          🔮 Weather Forecast
        </h3>
        <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded">
          <strong>📡 No Forecast Data:</strong> Forecast data is not available
          for this location.
        </div>
      </div>
    );
  }

  const forecastPoints = processTimeSeriesData(forecastData);

  if (forecastPoints.length === 0) {
    return (
      <div className="p-6 rounded-lg mb-6 border bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
        <h3 className="text-xl font-bold mb-4 text-gray-600">
          🔮 Weather Forecast
        </h3>
        <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded">
          <strong>📡 No Valid Forecast Data:</strong> Unable to process forecast
          information for this location.
        </div>
      </div>
    );
  }

  // Get next 24 hours and next 5 days for different views
  const now = new Date();
  const next24Hours = forecastPoints.filter((point) => {
    const pointTime = new Date(point.time);
    const hoursFromNow =
      (pointTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursFromNow >= 0 && hoursFromNow <= 24;
  });

  const next5Days = forecastPoints.filter((point, index) => {
    const pointTime = new Date(point.time);
    const hoursFromNow =
      (pointTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursFromNow >= 0 && hoursFromNow <= 120 && index % 6 === 0; // Every 6 hours for 5 days
  });

  const currentConditions = forecastPoints[0];
  const maxWindNext24h = Math.max(...next24Hours.map((p) => p.windSpeed));
  const avgWaterTemp =
    next24Hours.reduce((sum, p) => sum + p.waterTemp, 0) / next24Hours.length;

  return (
    <div className="p-6 rounded-lg mb-6 border bg-gradient-to-r from-cyan-50 to-indigo-50 border-cyan-200 shadow-xl">
      <h3 className="text-2xl font-bold mb-6 text-cyan-900">
        🔮 Weather Forecast
      </h3>

      <div className="space-y-6">
        {/* Current forecast summary */}
        <div className="bg-cyan-100 border border-cyan-300 text-cyan-800 px-6 py-4 rounded-md">
          <strong>📊 Forecast Available:</strong> {forecastPoints.length} hourly
          forecasts covering the next {Math.ceil(forecastPoints.length / 24)}{" "}
          days.
        </div>

        {/* Current conditions */}
        {currentConditions && (
          <div className="p-6 rounded-lg shadow-lg border-l-4 border-cyan-500">
            <h4 className="font-semibold text-cyan-800 text-lg mb-4">
              🌊 Current Forecast
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-base">
              <div>
                <p className="text-gray-700">Wind Speed</p>
                <p className={getWindSpeedColor(currentConditions.windSpeed)}>
                  {currentConditions.windSpeed.toFixed(1)} m/s
                  <span className="font-light">
                    {getWindSpeedDescription(currentConditions.windSpeed)}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-gray-700">Wind Direction</p>
                <p className="font-bold">
                  {getWindDirectionName(currentConditions.windDirection)}{" "}
                  {getWindDirectionArrow(currentConditions.windDirection)}{" "}
                  {currentConditions.windDirection.toFixed(0)}°
                </p>
              </div>
              <div>
                <p className="text-gray-700">Water Temp</p>
                <p className="font-bold">
                  {currentConditions.waterTemp.toFixed(1)}°C
                </p>
              </div>
              <div>
                <p className="text-gray-700">Sea Level</p>
                <p className="font-bold">
                  {(currentConditions.seaLevel * 100).toFixed(0)} cm
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 24-hour summary */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-cyan-500">
          <h4 className="font-semibold text-cyan-800 text-lg mb-4">
            📈 Next 24 Hours Summary
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-base">
            <div>
              <p className="text-gray-700">Max Wind Speed</p>
              <p className="font-bold">{maxWindNext24h.toFixed(1)} m/s</p>
            </div>
            <div>
              <p className="text-gray-700">Avg Water Temp</p>
              <p className="font-bold">{avgWaterTemp.toFixed(1)}°C</p>
            </div>
            <div>
              <p className="text-gray-700">Forecast Points</p>
              <p className="font-bold">{next24Hours.length}</p>
            </div>
          </div>
        </div>

        {/* Next 24 hours detailed */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-cyan-500">
          <h4 className="font-semibold text-cyan-800 text-lg mb-4">
            🕐 Next 24 Hours (Every 3 Hours)
          </h4>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-8 gap-2 text-sm min-w-max">
              {next24Hours
                .filter((_, index) => index % 3 === 0)
                .slice(0, 8)
                .map((point, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-center text-center p-3 rounded bg-cyan-50 border border-cyan-200"
                  >
                    <div className="font-medium text-cyan-700">
                      {new Date(point.time).toLocaleTimeString("en-DK", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="text-lg my-1">
                      {getWindDirectionArrow(point.windDirection)}
                    </div>
                    <div className="font-bold">
                      {point.windSpeed.toFixed(1)} m/s
                    </div>
                    <div className="text-cyan-600">
                      {point.waterTemp.toFixed(1)}°C
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* 5-day outlook */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-cyan-500">
          <h4 className="font-semibold text-cyan-800 text-lg mb-4">
            📅 5-Day Outlook
          </h4>
          <div className="grid grid-cols-1 gap-4 text-base">
            {next5Days.slice(0, 5).map((point, index) => {
              const date = new Date(point.time);
              const dayName = date.toLocaleDateString("en-DK", {
                weekday: "short",
              });
              const dateStr = date.toLocaleDateString("en-DK", {
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-cyan-50 rounded-md border border-cyan-200"
                >
                  <div className="flex-1">
                    <div className="font-medium">
                      {dayName}, {dateStr}
                    </div>
                    <div className="text-xs text-gray-600">
                      {date.toLocaleTimeString("en-DK", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-lg">
                        {getWindDirectionArrow(point.windDirection)}
                      </div>
                      <div className="text-xs">
                        {point.windSpeed.toFixed(1)} m/s
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {point.waterTemp.toFixed(1)}°C
                      </div>
                      <div className="text-xs text-gray-600">
                        {(point.seaLevel * 100).toFixed(0)} cm
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Information about forecast data */}
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-900 px-5 py-4 rounded-md text-base">
          <strong>ℹ️ About Forecast Data:</strong> This forecast data comes from
          DMI&apos;s DKSS North Sea Baltic Sea model, providing hourly predictions
          for wind conditions, water temperature, and sea level. Perfect for
          planning your windsurfing sessions in advance!
        </div>
      </div>
    </div>
  );
}
