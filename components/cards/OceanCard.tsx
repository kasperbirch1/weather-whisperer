export interface OceanCardProps {
  apiName: string;
  location?: string;
  timestamp?: string;
  // Ocean/marine data
  waveHeight?: number; // meters
  waterTemperature?: number; // Celsius
  salinity?: number; // PSU (Practical Salinity Units)
  // Additional marine parameters
  currentSpeed?: number; // m/s
  currentDirection?: number; // degrees
  tideHeight?: number; // meters
  visibility?: number; // km
}

export default function OceanCard({
  apiName,
  location,
  timestamp,
  waveHeight,
  waterTemperature,
  salinity,
  currentSpeed,
  currentDirection,
  tideHeight,
  visibility
}: OceanCardProps) {
  const formatTime = (isoString?: string) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatDecimal = (
    value?: number,
    unit: string = "",
    decimals: number = 1
  ) => {
    if (value === undefined || value === null) return "N/A";
    return `${value.toFixed(decimals)}${unit}`;
  };

  const formatDirection = (degrees?: number) => {
    if (degrees === undefined || degrees === null) return "N/A";
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degrees / 45) % 8;
    return `${directions[index]} (${Math.round(degrees)}°)`;
  };

  const getWaveCondition = (height?: number) => {
    if (height === undefined || height === null)
      return { text: "Unknown", color: "gray" };
    if (height < 0.5) return { text: "Calm", color: "green" };
    if (height < 1.0) return { text: "Slight", color: "blue" };
    if (height < 2.0) return { text: "Moderate", color: "yellow" };
    if (height < 3.0) return { text: "Rough", color: "orange" };
    return { text: "Very Rough", color: "red" };
  };

  const waveCondition = getWaveCondition(waveHeight);

  return (
    <div className="bg-gradient-to-br from-cyan-50 to-blue-100 rounded-lg p-4 shadow-md border border-cyan-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🌊</span>
          <h3 className="font-semibold text-cyan-800">{apiName}</h3>
        </div>
        <div className="text-xs text-cyan-600 bg-cyan-100 px-2 py-1 rounded">
          Updated: {formatTime(timestamp)}
        </div>
      </div>

      {/* Wave Information */}
      <div className="mb-4 p-3 bg-white bg-opacity-60 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-cyan-700">
            Wave Height:
          </span>
          <div className="text-right">
            <div className="text-2xl font-bold text-cyan-900">
              {formatDecimal(waveHeight, "m")}
            </div>
            <div
              className={`text-xs px-2 py-1 rounded-full bg-${waveCondition.color}-100 text-${waveCondition.color}-700`}
            >
              {waveCondition.text}
            </div>
          </div>
        </div>
      </div>

      {/* Water Properties */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Water Temperature */}
        {waterTemperature !== undefined && (
          <div className="p-3 bg-white bg-opacity-60 rounded-lg">
            <div className="text-xs text-cyan-600 mb-1">Water Temp</div>
            <div className="text-lg font-bold text-cyan-900">
              {formatDecimal(waterTemperature, "°C")}
            </div>
          </div>
        )}

        {/* Salinity */}
        {salinity !== undefined && (
          <div className="p-3 bg-white bg-opacity-60 rounded-lg">
            <div className="text-xs text-cyan-600 mb-1">Salinity</div>
            <div className="text-lg font-bold text-cyan-900">
              {formatDecimal(salinity, " PSU")}
            </div>
          </div>
        )}
      </div>

      {/* Current Information */}
      {(currentSpeed !== undefined || currentDirection !== undefined) && (
        <div className="mb-4 p-3 bg-white bg-opacity-60 rounded-lg">
          <h4 className="text-sm font-medium text-cyan-700 mb-2">Current</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {currentSpeed !== undefined && (
              <div>
                <span className="text-cyan-600">Speed:</span>
                <span className="font-semibold ml-1">
                  {formatDecimal(currentSpeed, " m/s")}
                </span>
              </div>
            )}
            {currentDirection !== undefined && (
              <div>
                <span className="text-cyan-600">Direction:</span>
                <span className="font-semibold ml-1">
                  {formatDirection(currentDirection)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Additional Marine Data */}
      {(tideHeight !== undefined || visibility !== undefined) && (
        <div className="mb-4 p-3 bg-white bg-opacity-60 rounded-lg">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {tideHeight !== undefined && (
              <div>
                <span className="text-cyan-600">Tide:</span>
                <span className="font-semibold ml-1">
                  {formatDecimal(tideHeight, "m")}
                </span>
              </div>
            )}
            {visibility !== undefined && (
              <div>
                <span className="text-cyan-600">Visibility:</span>
                <span className="font-semibold ml-1">
                  {formatDecimal(visibility, "km", 0)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location */}
      {location && (
        <div className="mt-3 pt-2 border-t border-cyan-200">
          <div className="text-xs text-cyan-600">📍 {location}</div>
        </div>
      )}
    </div>
  );
}
