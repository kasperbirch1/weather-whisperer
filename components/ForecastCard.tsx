interface ForecastCardProps {
  forecastData: any;
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

function processTimeSeriesData(forecastData: any): ForecastPoint[] {
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
    .filter((point) => point.windSpeed > 0); // Filter out null/invalid data points
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
    <div className="p-6 rounded-lg mb-6 border bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <h3 className="text-xl font-bold mb-4 text-blue-800">
        🔮 Weather Forecast
      </h3>

      <div className="space-y-4">
        {/* Current forecast summary */}
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          <strong>📊 Forecast Available:</strong> {forecastPoints.length} hourly
          forecasts covering the next {Math.ceil(forecastPoints.length / 24)}{" "}
          days.
        </div>

        {/* Current conditions */}
        {currentConditions && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold text-blue-800 mb-2">
              🌊 Current Forecast
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Wind Speed</p>
                <p className="font-bold">
                  {currentConditions.windSpeed.toFixed(1)} m/s
                </p>
              </div>
              <div>
                <p className="text-gray-600">Wind Direction</p>
                <p className="font-bold">
                  {getWindDirectionArrow(currentConditions.windDirection)}{" "}
                  {currentConditions.windDirection.toFixed(0)}°
                </p>
              </div>
              <div>
                <p className="text-gray-600">Water Temp</p>
                <p className="font-bold">
                  {currentConditions.waterTemp.toFixed(1)}°C
                </p>
              </div>
              <div>
                <p className="text-gray-600">Sea Level</p>
                <p className="font-bold">
                  {(currentConditions.seaLevel * 100).toFixed(0)} cm
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 24-hour summary */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-semibold text-blue-800 mb-2">
            📈 Next 24 Hours Summary
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Max Wind Speed</p>
              <p className="font-bold">{maxWindNext24h.toFixed(1)} m/s</p>
            </div>
            <div>
              <p className="text-gray-600">Avg Water Temp</p>
              <p className="font-bold">{avgWaterTemp.toFixed(1)}°C</p>
            </div>
            <div>
              <p className="text-gray-600">Forecast Points</p>
              <p className="font-bold">{next24Hours.length}</p>
            </div>
          </div>
        </div>

        {/* Next 24 hours detailed */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-semibold text-blue-800 mb-2">
            🕐 Next 24 Hours (Every 3 Hours)
          </h4>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-8 gap-2 text-xs min-w-max">
              {next24Hours
                .filter((_, index) => index % 3 === 0)
                .slice(0, 8)
                .map((point, index) => (
                  <div
                    key={index}
                    className="text-center p-2 bg-gray-50 rounded"
                  >
                    <div className="font-medium text-gray-600">
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
                    <div className="text-gray-500">
                      {point.waterTemp.toFixed(1)}°C
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* 5-day outlook */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-semibold text-blue-800 mb-2">📅 5-Day Outlook</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
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
                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <div className="flex-1">
                    <div className="font-medium">
                      {dayName}, {dateStr}
                    </div>
                    <div className="text-xs text-gray-500">
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
                      <div className="text-xs text-gray-500">
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
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded text-sm">
          <strong>ℹ️ About Forecast Data:</strong> This forecast data comes from
          DMI's DKSS North Sea Baltic Sea model, providing hourly predictions
          for wind conditions, water temperature, and sea level. Perfect for
          planning your windsurfing sessions in advance!
        </div>
      </div>
    </div>
  );
}
