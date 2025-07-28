interface TempCardProps {
  apiName: string;
  temperature: number;
  feelsLike?: number;
  humidity?: number;
  pressure?: number;
  dewPoint?: number;
  heatIndex?: number;
  windChill?: number;
  visibility?: number;
  uvIndex?: number;
  cloudCover?: number;
  location?: string;
  timestamp?: string;
}

export default function TempCard({
  apiName,
  temperature,
  feelsLike,
  humidity,
  pressure,
  dewPoint,
  heatIndex,
  windChill,
  visibility,
  uvIndex,
  cloudCover,
  location,
  timestamp
}: TempCardProps) {
  const formatValue = (
    value: number | undefined,
    unit: string,
    decimals: number = 1
  ): string => {
    if (value === undefined || value === null) return "N/A";
    return `${value.toFixed(decimals)}${unit}`;
  };

  const getTempColor = (temp: number): string => {
    if (temp < 0) return "from-blue-600 to-indigo-600"; // Very cold
    if (temp < 10) return "from-blue-500 to-cyan-500"; // Cold
    if (temp < 20) return "from-orange-400 to-yellow-500"; // Mild
    if (temp < 30) return "from-orange-500 to-red-500"; // Warm
    return "from-red-600 to-red-700"; // Hot
  };

  return (
    <div
      className={`bg-gradient-to-r ${getTempColor(
        temperature
      )} p-6 rounded-2xl text-white shadow-lg`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">{apiName}</h3>
          {location && <p className="text-sm opacity-90">{location}</p>}
        </div>
        <div className="text-3xl">🌡️</div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="text-3xl font-bold">{temperature.toFixed(1)}°C</div>
          <div className="text-sm opacity-90">Temperature</div>
        </div>

        {/* Primary temperature data */}
        <div className="grid grid-cols-2 gap-3">
          {feelsLike !== undefined && (
            <div>
              <div className="text-lg font-semibold">
                {feelsLike.toFixed(1)}°C
              </div>
              <div className="text-xs opacity-90">Feels Like</div>
            </div>
          )}

          {humidity !== undefined && (
            <div>
              <div className="text-lg font-semibold">{humidity}%</div>
              <div className="text-xs opacity-90">Humidity</div>
            </div>
          )}
        </div>

        {/* Secondary data in smaller grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {pressure !== undefined && (
            <div>
              <div className="font-semibold">
                {formatValue(pressure, " hPa", 0)}
              </div>
              <div className="text-xs opacity-75">Pressure</div>
            </div>
          )}

          {dewPoint !== undefined && (
            <div>
              <div className="font-semibold">{formatValue(dewPoint, "°C")}</div>
              <div className="text-xs opacity-75">Dew Point</div>
            </div>
          )}

          {visibility !== undefined && (
            <div>
              <div className="font-semibold">
                {formatValue(visibility, "km", 0)}
              </div>
              <div className="text-xs opacity-75">Visibility</div>
            </div>
          )}

          {uvIndex !== undefined && (
            <div>
              <div className="font-semibold">{formatValue(uvIndex, "", 0)}</div>
              <div className="text-xs opacity-75">UV Index</div>
            </div>
          )}

          {cloudCover !== undefined && (
            <div>
              <div className="font-semibold">
                {formatValue(cloudCover, "%", 0)}
              </div>
              <div className="text-xs opacity-75">Clouds</div>
            </div>
          )}

          {heatIndex !== undefined && (
            <div>
              <div className="font-semibold">
                {formatValue(heatIndex, "°C")}
              </div>
              <div className="text-xs opacity-75">Heat Index</div>
            </div>
          )}

          {windChill !== undefined && (
            <div>
              <div className="font-semibold">
                {formatValue(windChill, "°C")}
              </div>
              <div className="text-xs opacity-75">Wind Chill</div>
            </div>
          )}
        </div>

        {timestamp && (
          <div className="text-xs opacity-75 mt-4 pt-2 border-t border-white/20">
            Updated: {new Date(timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}
