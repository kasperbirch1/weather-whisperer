interface WindCardProps {
  apiName: string;
  windSpeed: number;
  windDirection: number;
  windGust?: number;
  windDegree?: number;
  beaufortScale?: number;
  windDescription?: string;
  pressure?: number;
  pressureTrend?: string;
  location?: string;
  timestamp?: string;
}

export default function WindCard({
  apiName,
  windSpeed,
  windDirection,
  windGust,
  beaufortScale,
  windDescription,
  pressure,
  pressureTrend,
  location,
  timestamp,
}: WindCardProps) {
  const getWindDirectionName = (degrees: number): string => {
    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const getWindDirectionArrow = (degrees: number): string => {
    const arrows = ["↓", "↙", "←", "↖", "↑", "↗", "→", "↘"];
    const index = Math.round(degrees / 45) % 8;
    return arrows[index];
  };

  const getWindSpeedColor = (speed: number): string => {
    if (speed < 1) return "from-gray-400 to-gray-500"; // Calm
    if (speed < 3) return "from-green-400 to-green-500"; // Light air
    if (speed < 7) return "from-blue-400 to-blue-500"; // Light breeze
    if (speed < 12) return "from-cyan-500 to-blue-500"; // Gentle breeze
    if (speed < 18) return "from-yellow-500 to-orange-500"; // Moderate breeze
    if (speed < 25) return "from-orange-500 to-red-500"; // Fresh breeze
    return "from-red-600 to-red-700"; // Strong breeze+
  };

  const getBeaufortDescription = (scale?: number): string => {
    if (scale === undefined) return "";
    const descriptions = [
      "Calm",
      "Light air",
      "Light breeze",
      "Gentle breeze",
      "Moderate breeze",
      "Fresh breeze",
      "Strong breeze",
      "Near gale",
      "Gale",
      "Strong gale",
      "Storm",
      "Violent storm",
      "Hurricane",
    ];
    return descriptions[Math.min(scale, 12)] || "Extreme";
  };
  return (
    <div
      className={`bg-gradient-to-r ${getWindSpeedColor(
        windSpeed
      )} p-6 rounded-2xl text-white shadow-lg`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">{apiName}</h3>
          {location && <p className="text-sm opacity-90">{location}</p>}
        </div>
        <div className="text-3xl flex items-center space-x-1">
          <span>💨</span>
          <span className="text-2xl">
            {getWindDirectionArrow(windDirection)}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Primary wind data */}
        <div>
          <div className="text-3xl font-bold">{windSpeed.toFixed(1)} m/s</div>
          <div className="text-sm opacity-90">
            {windDescription ||
              getBeaufortDescription(beaufortScale) ||
              "Wind Speed"}
          </div>
        </div>

        {/* Direction and additional wind info */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-lg font-semibold">
              {getWindDirectionName(windDirection)} ({windDirection}°)
            </div>
            <div className="text-xs opacity-90">Direction</div>
          </div>

          {windGust !== undefined && windGust > windSpeed && (
            <div>
              <div className="text-lg font-semibold">
                {windGust.toFixed(1)} m/s
              </div>
              <div className="text-xs opacity-90">Gusts</div>
            </div>
          )}
        </div>

        {/* Secondary data */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {beaufortScale !== undefined && (
            <div>
              <div className="font-semibold">Force {beaufortScale}</div>
              <div className="text-xs opacity-75">Beaufort</div>
            </div>
          )}

          {pressure !== undefined && (
            <div>
              <div className="font-semibold">{pressure.toFixed(0)} hPa</div>
              <div className="text-xs opacity-75">
                Pressure {pressureTrend ? `(${pressureTrend})` : ""}
              </div>
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
