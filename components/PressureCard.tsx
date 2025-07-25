interface PressureCardProps {
  apiName: string;
  pressure: number; // hPa
  seaLevelPressure?: number; // hPa
  pressureTrend?: string; // "rising", "falling", "steady"
  pressureChange?: number; // Change in last 3 hours (hPa)
  station?: string;
  altitude?: number; // meters above sea level
  location?: string;
  timestamp?: string;
}

export default function PressureCard({
  apiName,
  pressure,
  seaLevelPressure,
  pressureTrend,
  pressureChange,
  station,
  altitude,
  location,
  timestamp,
}: PressureCardProps) {
  const formatTime = (isoString?: string) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPressureColor = (pressure: number): string => {
    if (pressure < 980) return "from-red-500 to-red-600"; // Low pressure - storms
    if (pressure < 1000) return "from-orange-400 to-orange-500"; // Below normal
    if (pressure < 1020) return "from-green-400 to-green-500"; // Normal
    if (pressure < 1040) return "from-blue-400 to-blue-500"; // High pressure
    return "from-purple-500 to-purple-600"; // Very high pressure
  };

  const getPressureDescription = (pressure: number): string => {
    if (pressure < 980) return "Very Low (Storm)";
    if (pressure < 1000) return "Low";
    if (pressure < 1020) return "Normal";
    if (pressure < 1040) return "High";
    return "Very High";
  };

  const getTrendIcon = (trend?: string): string => {
    switch (trend?.toLowerCase()) {
      case "rising":
        return "📈";
      case "falling":
        return "📉";
      case "steady":
        return "➡️";
      default:
        return "📊";
    }
  };

  const formatPressureChange = (change?: number): string => {
    if (change === undefined) return "N/A";
    const sign = change > 0 ? "+" : "";
    return `${sign}${change.toFixed(1)} hPa`;
  };

  return (
    <div
      className={`bg-gradient-to-r ${getPressureColor(
        pressure
      )} p-6 rounded-2xl text-white shadow-lg`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">{apiName}</h3>
          {location && <p className="text-sm opacity-90">{location}</p>}
        </div>
        <div className="text-3xl flex items-center space-x-1">
          <span>🌪️</span>
          <span className="text-2xl">{getTrendIcon(pressureTrend)}</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Primary pressure reading */}
        <div>
          <div className="text-3xl font-bold">{pressure.toFixed(1)} hPa</div>
          <div className="text-sm opacity-90">
            {getPressureDescription(pressure)}
          </div>
        </div>

        {/* Sea level pressure */}
        {seaLevelPressure !== undefined && (
          <div>
            <div className="text-lg font-semibold">
              {seaLevelPressure.toFixed(1)} hPa
            </div>
            <div className="text-xs opacity-90">Sea Level Pressure</div>
          </div>
        )}

        {/* Pressure trend and change */}
        <div className="grid grid-cols-2 gap-3">
          {pressureTrend && (
            <div>
              <div className="text-lg font-semibold capitalize">
                {getTrendIcon(pressureTrend)} {pressureTrend}
              </div>
              <div className="text-xs opacity-90">3hr Trend</div>
            </div>
          )}

          {pressureChange !== undefined && (
            <div>
              <div className="text-lg font-semibold">
                {formatPressureChange(pressureChange)}
              </div>
              <div className="text-xs opacity-90">3hr Change</div>
            </div>
          )}
        </div>

        {/* Additional data */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {station && (
            <div>
              <div className="font-semibold">{station}</div>
              <div className="text-xs opacity-75">Station</div>
            </div>
          )}

          {altitude !== undefined && (
            <div>
              <div className="font-semibold">{altitude.toFixed(0)}m</div>
              <div className="text-xs opacity-75">Altitude</div>
            </div>
          )}
        </div>

        {timestamp && (
          <div className="text-xs opacity-75 mt-4 pt-2 border-t border-white/20">
            Updated: {formatTime(timestamp)}
          </div>
        )}
      </div>
    </div>
  );
}
