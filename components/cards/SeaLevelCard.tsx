export interface SeaLevelCardProps {
  apiName: string;
  seaLevel: number; // in cm
  location?: string;
  timestamp?: string;
  // Additional tide/sea level data
  prediction?: number; // predicted level
  residual?: number; // difference from prediction
  trend?: "rising" | "falling" | "stable";
  highTide?: {
    time?: string;
    level?: number;
  };
  lowTide?: {
    time?: string;
    level?: number;
  };
}

export default function SeaLevelCard({
  apiName,
  seaLevel,
  location,
  timestamp,
  prediction,
  residual,
  trend,
  highTide,
  lowTide
}: SeaLevelCardProps) {
  const formatTime = (isoString?: string) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatLevel = (level?: number): string => {
    if (level === undefined || level === null) return "N/A";
    const sign = level >= 0 ? "+" : "";
    return `${sign}${level.toFixed(1)} cm`;
  };

  const getSeaLevelColor = (level: number): string => {
    const absLevel = Math.abs(level);
    if (absLevel < 10) return "from-green-400 to-green-500"; // Normal
    if (absLevel < 25) return "from-yellow-400 to-yellow-500"; // Slightly elevated
    if (absLevel < 50) return "from-orange-400 to-orange-500"; // Elevated
    return "from-red-500 to-red-600"; // Very high/low
  };

  const getSeaLevelDescription = (level: number): string => {
    if (level > 50) return "Very High";
    if (level > 25) return "High";
    if (level > 10) return "Slightly High";
    if (level > -10) return "Normal";
    if (level > -25) return "Slightly Low";
    if (level > -50) return "Low";
    return "Very Low";
  };

  const getTrendIcon = (trend?: string): string => {
    switch (trend) {
      case "rising":
        return "📈";
      case "falling":
        return "📉";
      case "stable":
        return "➡️";
      default:
        return "🌊";
    }
  };

  const getTrendColor = (trend?: string): string => {
    switch (trend) {
      case "rising":
        return "text-blue-600";
      case "falling":
        return "text-cyan-600";
      case "stable":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div
      className={`bg-gradient-to-r ${getSeaLevelColor(
        seaLevel
      )} p-6 rounded-2xl text-white shadow-lg`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">{apiName}</h3>
          {location && <p className="text-sm opacity-90">{location}</p>}
        </div>
        <div className="text-3xl flex items-center space-x-1">
          <span>🌊</span>
          <span className="text-2xl">{getTrendIcon(trend)}</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Primary sea level reading */}
        <div>
          <div className="text-3xl font-bold">{formatLevel(seaLevel)}</div>
          <div className="text-sm opacity-90">
            {getSeaLevelDescription(seaLevel)} Sea Level
          </div>
        </div>

        {/* Trend information */}
        {trend && (
          <div>
            <div
              className={`text-lg font-semibold flex items-center space-x-2 ${getTrendColor(
                trend
              )}`}
            >
              <span>{getTrendIcon(trend)}</span>
              <span className="capitalize">{trend}</span>
            </div>
            <div className="text-xs opacity-90">Current Trend</div>
          </div>
        )}

        {/* Prediction vs actual */}
        {(prediction !== undefined || residual !== undefined) && (
          <div className="grid grid-cols-2 gap-3">
            {prediction !== undefined && (
              <div>
                <div className="text-lg font-semibold">
                  {formatLevel(prediction)}
                </div>
                <div className="text-xs opacity-90">Predicted</div>
              </div>
            )}

            {residual !== undefined && (
              <div>
                <div className="text-lg font-semibold">
                  {formatLevel(residual)}
                </div>
                <div className="text-xs opacity-90">Difference</div>
              </div>
            )}
          </div>
        )}

        {/* Tide information */}
        {(highTide || lowTide) && (
          <div className="grid grid-cols-2 gap-2 text-sm">
            {highTide && (
              <div>
                <div className="font-semibold">
                  {highTide.level ? formatLevel(highTide.level) : "N/A"}
                </div>
                <div className="text-xs opacity-75">
                  High Tide {highTide.time ? formatTime(highTide.time) : ""}
                </div>
              </div>
            )}

            {lowTide && (
              <div>
                <div className="font-semibold">
                  {lowTide.level ? formatLevel(lowTide.level) : "N/A"}
                </div>
                <div className="text-xs opacity-75">
                  Low Tide {lowTide.time ? formatTime(lowTide.time) : ""}
                </div>
              </div>
            )}
          </div>
        )}

        {timestamp && (
          <div className="text-xs opacity-75 mt-4 pt-2 border-t border-white/20">
            Updated: {formatTime(timestamp)}
          </div>
        )}
      </div>
    </div>
  );
}
