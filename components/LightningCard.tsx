interface LightningCardProps {
  apiName: string;
  location?: string;
  timestamp?: string;
  // Lightning strike data
  strikeCount?: number;
  lastStrikeTime?: string;
  distance?: number; // Distance to nearest strike in km
  intensity?: number; // Strike intensity/strength
  // Area/regional data
  areaStrikeCount?: number; // Strikes in broader area
  riskLevel?: "low" | "moderate" | "high" | "extreme";
  // Additional data
  electricFieldStrength?: number;
  stormMovement?: {
    direction?: number; // degrees
    speed?: number; // km/h
  };
}

export default function LightningCard({
  apiName,
  location,
  timestamp,
  strikeCount,
  lastStrikeTime,
  distance,
  intensity,
  areaStrikeCount,
  riskLevel,
  electricFieldStrength,
  stormMovement,
}: LightningCardProps) {
  const formatTime = (isoString?: string) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDistance = (dist?: number) => {
    if (dist === undefined || dist === null) return "N/A";
    if (dist < 1) return `${Math.round(dist * 1000)}m`;
    return `${dist.toFixed(1)}km`;
  };

  const formatDirection = (degrees?: number) => {
    if (degrees === undefined || degrees === null) return "N/A";
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case "low":
        return "text-green-700 bg-green-100";
      case "moderate":
        return "text-yellow-700 bg-yellow-100";
      case "high":
        return "text-orange-700 bg-orange-100";
      case "extreme":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const getRiskEmoji = (risk?: string) => {
    switch (risk) {
      case "low":
        return "🟢";
      case "moderate":
        return "🟡";
      case "high":
        return "🟠";
      case "extreme":
        return "🔴";
      default:
        return "⚪";
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-lg p-4 shadow-md border border-purple-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">⚡</span>
          <h3 className="font-semibold text-purple-800">{apiName}</h3>
        </div>
        <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
          Updated: {formatTime(timestamp)}
        </div>
      </div>

      {/* Risk Level */}
      {riskLevel && (
        <div className="mb-4 p-3 bg-white bg-opacity-60 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-purple-700">
              Risk Level:
            </span>
            <div
              className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 ${getRiskColor(
                riskLevel
              )}`}
            >
              <span>{getRiskEmoji(riskLevel)}</span>
              <span className="capitalize">{riskLevel}</span>
            </div>
          </div>
        </div>
      )}

      {/* Strike Data */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {strikeCount !== undefined && (
          <div className="p-3 bg-white bg-opacity-60 rounded-lg">
            <div className="text-xs text-purple-600 mb-1">Local Strikes</div>
            <div className="text-2xl font-bold text-purple-900">
              {strikeCount}
            </div>
            <div className="text-xs text-purple-700">in last hour</div>
          </div>
        )}

        {areaStrikeCount !== undefined && (
          <div className="p-3 bg-white bg-opacity-60 rounded-lg">
            <div className="text-xs text-purple-600 mb-1">Area Strikes</div>
            <div className="text-2xl font-bold text-purple-900">
              {areaStrikeCount}
            </div>
            <div className="text-xs text-purple-700">regional</div>
          </div>
        )}
      </div>

      {/* Distance and Timing */}
      {((distance !== undefined && distance !== null) || lastStrikeTime) && (
        <div className="mb-4 p-3 bg-white bg-opacity-60 rounded-lg">
          <h4 className="text-sm font-medium text-purple-700 mb-2">
            Nearest Strike
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {distance !== undefined && distance !== null && (
              <div>
                <span className="text-purple-600">Distance:</span>
                <span className="font-semibold ml-1">
                  {formatDistance(distance)}
                </span>
              </div>
            )}
            {lastStrikeTime && (
              <div>
                <span className="text-purple-600">Time:</span>
                <span className="font-semibold ml-1">
                  {formatTime(lastStrikeTime)}
                </span>
              </div>
            )}
            {intensity !== undefined && intensity !== null && (
              <div className="col-span-2">
                <span className="text-purple-600">Intensity:</span>
                <span className="font-semibold ml-1">
                  {intensity.toFixed(1)} kA
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Storm Movement */}
      {stormMovement &&
        (stormMovement.direction !== undefined ||
          stormMovement.speed !== undefined) && (
          <div className="mb-4 p-3 bg-white bg-opacity-60 rounded-lg">
            <h4 className="text-sm font-medium text-purple-700 mb-2">
              Storm Movement
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {stormMovement.direction !== undefined && (
                <div>
                  <span className="text-purple-600">Direction:</span>
                  <span className="font-semibold ml-1">
                    {formatDirection(stormMovement.direction)}
                  </span>
                </div>
              )}
              {stormMovement.speed !== undefined && (
                <div>
                  <span className="text-purple-600">Speed:</span>
                  <span className="font-semibold ml-1">
                    {stormMovement.speed.toFixed(1)} km/h
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

      {/* Electric Field */}
      {electricFieldStrength !== undefined && (
        <div className="mb-4 p-3 bg-white bg-opacity-60 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-purple-600">Electric Field:</span>
            <span className="font-semibold text-purple-900">
              {electricFieldStrength.toFixed(1)} V/m
            </span>
          </div>
        </div>
      )}

      {/* Location */}
      {location && (
        <div className="mt-3 pt-2 border-t border-purple-200">
          <div className="text-xs text-purple-600">📍 {location}</div>
        </div>
      )}
    </div>
  );
}
