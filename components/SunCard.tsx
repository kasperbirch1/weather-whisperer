interface SunCardProps {
  apiName: string;
  sunrise?: string; // ISO timestamp
  sunset?: string; // ISO timestamp
  daylight?: number; // hours of daylight
  uvIndex?: number;
  uvRisk?: "low" | "moderate" | "high" | "very-high" | "extreme";
  solarRadiation?: number; // W/m²
  sunPosition?: {
    elevation?: number; // degrees above horizon
    azimuth?: number; // degrees from north
  };
  moonPhase?: number; // 0-1 (0 = new moon, 0.5 = full moon)
  moonIllumination?: number; // percentage
  location?: string;
  timestamp?: string;
}

export default function SunCard({
  apiName,
  sunrise,
  sunset,
  daylight,
  uvIndex,
  uvRisk,
  solarRadiation,
  sunPosition,
  moonPhase,
  moonIllumination,
  location,
  timestamp,
}: SunCardProps) {
  const formatTime = (isoString?: string) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSunColor = (uvIndex?: number): string => {
    if (!uvIndex) return "from-yellow-400 to-orange-400";
    if (uvIndex < 3) return "from-green-400 to-yellow-400"; // Low
    if (uvIndex < 6) return "from-yellow-400 to-orange-400"; // Moderate
    if (uvIndex < 8) return "from-orange-400 to-red-400"; // High
    if (uvIndex < 11) return "from-red-500 to-red-600"; // Very high
    return "from-purple-500 to-red-600"; // Extreme
  };

  const getUVRiskColor = (risk?: string): string => {
    switch (risk) {
      case "low":
        return "text-green-700 bg-green-100";
      case "moderate":
        return "text-yellow-700 bg-yellow-100";
      case "high":
        return "text-orange-700 bg-orange-100";
      case "very-high":
        return "text-red-700 bg-red-100";
      case "extreme":
        return "text-purple-700 bg-purple-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const getUVDescription = (uvIndex?: number): string => {
    if (!uvIndex) return "Unknown";
    if (uvIndex < 3) return "Low - Safe";
    if (uvIndex < 6) return "Moderate - Some protection";
    if (uvIndex < 8) return "High - Protection needed";
    if (uvIndex < 11) return "Very High - Extra protection";
    return "Extreme - Avoid sun";
  };

  const getMoonPhaseIcon = (phase?: number): string => {
    if (phase === undefined) return "🌙";
    if (phase < 0.125) return "🌑"; // New moon
    if (phase < 0.25) return "🌒"; // Waxing crescent
    if (phase < 0.375) return "🌓"; // First quarter
    if (phase < 0.5) return "🌔"; // Waxing gibbous
    if (phase < 0.625) return "🌕"; // Full moon
    if (phase < 0.75) return "🌖"; // Waning gibbous
    if (phase < 0.875) return "🌗"; // Last quarter
    return "🌘"; // Waning crescent
  };

  const getMoonPhaseName = (phase?: number): string => {
    if (phase === undefined) return "Unknown";
    if (phase < 0.125) return "New Moon";
    if (phase < 0.25) return "Waxing Crescent";
    if (phase < 0.375) return "First Quarter";
    if (phase < 0.5) return "Waxing Gibbous";
    if (phase < 0.625) return "Full Moon";
    if (phase < 0.75) return "Waning Gibbous";
    if (phase < 0.875) return "Last Quarter";
    return "Waning Crescent";
  };

  const formatAngle = (angle?: number): string => {
    if (angle === undefined) return "N/A";
    return `${Math.round(angle)}°`;
  };

  const isDaytime = (): boolean => {
    if (!sunrise || !sunset) return true;
    const now = new Date();
    const sunriseTime = new Date(sunrise);
    const sunsetTime = new Date(sunset);
    return now >= sunriseTime && now <= sunsetTime;
  };

  return (
    <div
      className={`bg-gradient-to-r ${getSunColor(
        uvIndex
      )} p-6 rounded-2xl text-white shadow-lg`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">{apiName}</h3>
          {location && <p className="text-sm opacity-90">{location}</p>}
        </div>
        <div className="text-3xl">
          {isDaytime() ? "☀️" : getMoonPhaseIcon(moonPhase)}
        </div>
      </div>

      <div className="space-y-3">
        {/* Sun times */}
        {(sunrise || sunset) && (
          <div className="grid grid-cols-2 gap-3">
            {sunrise && (
              <div>
                <div className="text-lg font-semibold">
                  🌅 {formatTime(sunrise)}
                </div>
                <div className="text-xs opacity-90">Sunrise</div>
              </div>
            )}

            {sunset && (
              <div>
                <div className="text-lg font-semibold">
                  🌇 {formatTime(sunset)}
                </div>
                <div className="text-xs opacity-90">Sunset</div>
              </div>
            )}
          </div>
        )}

        {/* Daylight duration */}
        {daylight !== undefined && (
          <div>
            <div className="text-2xl font-bold">
              {daylight.toFixed(1)} hours
            </div>
            <div className="text-sm opacity-90">Daylight</div>
          </div>
        )}

        {/* UV Index */}
        {uvIndex !== undefined && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">UV {uvIndex.toFixed(0)}</div>
              {uvRisk && (
                <div
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${getUVRiskColor(
                    uvRisk
                  )}`}
                >
                  {uvRisk.toUpperCase()}
                </div>
              )}
            </div>
            <div className="text-sm opacity-90">
              {getUVDescription(uvIndex)}
            </div>
          </div>
        )}

        {/* Sun position */}
        {sunPosition &&
          (sunPosition.elevation !== undefined ||
            sunPosition.azimuth !== undefined) && (
            <div className="grid grid-cols-2 gap-3">
              {sunPosition.elevation !== undefined && (
                <div>
                  <div className="text-lg font-semibold">
                    {formatAngle(sunPosition.elevation)}
                  </div>
                  <div className="text-xs opacity-90">Elevation</div>
                </div>
              )}

              {sunPosition.azimuth !== undefined && (
                <div>
                  <div className="text-lg font-semibold">
                    {formatAngle(sunPosition.azimuth)}
                  </div>
                  <div className="text-xs opacity-90">Azimuth</div>
                </div>
              )}
            </div>
          )}

        {/* Additional data */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {solarRadiation !== undefined && (
            <div>
              <div className="font-semibold">
                {solarRadiation.toFixed(0)} W/m²
              </div>
              <div className="text-xs opacity-75">Solar Radiation</div>
            </div>
          )}

          {moonIllumination !== undefined && (
            <div>
              <div className="font-semibold">
                {Math.round(moonIllumination)}%
              </div>
              <div className="text-xs opacity-75">Moon Illuminated</div>
            </div>
          )}
        </div>

        {/* Moon phase */}
        {moonPhase !== undefined && (
          <div>
            <div className="text-lg font-semibold">
              {getMoonPhaseIcon(moonPhase)} {getMoonPhaseName(moonPhase)}
            </div>
            <div className="text-xs opacity-90">Moon Phase</div>
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
