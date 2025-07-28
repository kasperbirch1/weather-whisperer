interface PrecipitationCardProps {
  apiName: string;
  precipitation: number; // mm
  precipitationType?: "rain" | "snow" | "sleet" | "mixed";
  precipitationIntensity?: "light" | "moderate" | "heavy" | "extreme";
  precipitationRate?: number; // mm/h
  precipitationChance?: number; // percentage
  snowDepth?: number; // cm
  rainfall1h?: number; // mm in last hour
  rainfall3h?: number; // mm in last 3 hours
  rainfall24h?: number; // mm in last 24 hours
  location?: string;
  timestamp?: string;
}

export default function PrecipitationCard({
  apiName,
  precipitation,
  precipitationType = "rain",
  precipitationIntensity,
  precipitationRate,
  precipitationChance,
  snowDepth,
  rainfall1h,
  rainfall3h,
  rainfall24h,
  location,
  timestamp,
}: PrecipitationCardProps) {
  const formatTime = (isoString?: string) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPrecipitationColor = (amount: number, type: string): string => {
    if (type === "snow") {
      if (amount < 1) return "from-blue-100 to-blue-200"; // Light snow
      if (amount < 5) return "from-blue-300 to-blue-400"; // Moderate snow
      return "from-blue-500 to-blue-600"; // Heavy snow
    }

    // Rain colors
    if (amount < 0.1) return "from-gray-300 to-gray-400"; // No rain
    if (amount < 1) return "from-blue-300 to-cyan-400"; // Light rain
    if (amount < 5) return "from-blue-500 to-blue-600"; // Moderate rain
    if (amount < 15) return "from-indigo-500 to-purple-500"; // Heavy rain
    return "from-purple-600 to-red-500"; // Extreme rain
  };

  const getPrecipitationIcon = (type?: string, intensity?: string): string => {
    switch (type) {
      case "snow":
        return "❄️";
      case "sleet":
        return "🌨️";
      case "mixed":
        return "🌧️❄️";
      default: // rain
        switch (intensity) {
          case "light":
            return "🌦️";
          case "moderate":
            return "🌧️";
          case "heavy":
            return "⛈️";
          case "extreme":
            return "🌪️";
          default:
            return "🌧️";
        }
    }
  };

  const getPrecipitationDescription = (
    amount: number,
    type: string
  ): string => {
    if (amount < 0.1) return `No ${type}`;

    if (type === "snow") {
      if (amount < 1) return "Light snow";
      if (amount < 5) return "Moderate snow";
      return "Heavy snow";
    }

    // Rain descriptions
    if (amount < 0.5) return "Light rain";
    if (amount < 2) return "Moderate rain";
    if (amount < 10) return "Heavy rain";
    return "Extreme rain";
  };

  const formatAmount = (amount?: number, unit: string = "mm"): string => {
    if (amount === undefined || amount === null) return "N/A";
    return `${amount.toFixed(1)} ${unit}`;
  };

  const formatPercentage = (percent?: number): string => {
    if (percent === undefined || percent === null) return "N/A";
    return `${Math.round(percent)}%`;
  };

  return (
    <div
      className={`bg-gradient-to-r ${getPrecipitationColor(
        precipitation,
        precipitationType
      )} p-6 rounded-2xl text-white shadow-lg`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">{apiName}</h3>
          {location && <p className="text-sm opacity-90">{location}</p>}
        </div>
        <div className="text-3xl">
          {getPrecipitationIcon(precipitationType, precipitationIntensity)}
        </div>
      </div>

      <div className="space-y-3">
        {/* Primary precipitation amount */}
        <div>
          <div className="text-3xl font-bold">
            {formatAmount(precipitation)}
          </div>
          <div className="text-sm opacity-90">
            {getPrecipitationDescription(precipitation, precipitationType)}
          </div>
        </div>

        {/* Rate and chance */}
        <div className="grid grid-cols-2 gap-3">
          {precipitationRate !== undefined && precipitationRate > 0 && (
            <div>
              <div className="text-lg font-semibold">
                {formatAmount(precipitationRate, "mm/h")}
              </div>
              <div className="text-xs opacity-90">Current Rate</div>
            </div>
          )}

          {precipitationChance !== undefined && (
            <div>
              <div className="text-lg font-semibold">
                {formatPercentage(precipitationChance)}
              </div>
              <div className="text-xs opacity-90">Chance</div>
            </div>
          )}
        </div>

        {/* Time-based amounts */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          {rainfall1h !== undefined && (
            <div>
              <div className="font-semibold">{formatAmount(rainfall1h)}</div>
              <div className="text-xs opacity-75">1h</div>
            </div>
          )}

          {rainfall3h !== undefined && (
            <div>
              <div className="font-semibold">{formatAmount(rainfall3h)}</div>
              <div className="text-xs opacity-75">3h</div>
            </div>
          )}

          {rainfall24h !== undefined && (
            <div>
              <div className="font-semibold">{formatAmount(rainfall24h)}</div>
              <div className="text-xs opacity-75">24h</div>
            </div>
          )}
        </div>

        {/* Snow depth */}
        {snowDepth !== undefined && snowDepth > 0 && (
          <div>
            <div className="text-lg font-semibold">
              {formatAmount(snowDepth, "cm")}
            </div>
            <div className="text-xs opacity-90">Snow Depth</div>
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
