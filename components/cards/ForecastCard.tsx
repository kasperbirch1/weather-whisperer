interface ForecastCardProps {
  apiName: string;
  location?: string;
  timestamp?: string;
  // Current conditions
  temperature?: number;
  description?: string;
  icon?: string;
  // Today's forecast
  highTemp?: number;
  lowTemp?: number;
  precipitationChance?: number;
  // Tomorrow's forecast
  tomorrowHighTemp?: number;
  tomorrowLowTemp?: number;
  tomorrowDescription?: string;
  tomorrowPrecipChance?: number;
}

export default function ForecastCard({
  apiName,
  location,
  timestamp,
  temperature,
  description,
  icon,
  highTemp,
  lowTemp,
  precipitationChance,
  tomorrowHighTemp,
  tomorrowLowTemp,
  tomorrowDescription,
  tomorrowPrecipChance
}: ForecastCardProps) {
  const formatTime = (isoString?: string) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatTemp = (temp?: number) => {
    if (temp === undefined || temp === null) return "N/A";
    return `${Math.round(temp)}°C`;
  };

  const formatPercent = (percent?: number) => {
    if (percent === undefined || percent === null) return "N/A";
    return `${Math.round(percent)}%`;
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-4 shadow-md border border-blue-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🔮</span>
          <h3 className="font-semibold text-blue-800">{apiName}</h3>
        </div>
        <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
          Updated: {formatTime(timestamp)}
        </div>
      </div>

      {/* Current Weather */}
      {(temperature !== undefined || description) && (
        <div className="mb-4 p-3 bg-white bg-opacity-60 rounded-lg">
          <h4 className="text-sm font-medium text-blue-700 mb-2">Current</h4>
          <div className="flex items-center justify-between">
            <div>
              {temperature !== undefined && (
                <div className="text-2xl font-bold text-blue-900">
                  {formatTemp(temperature)}
                </div>
              )}
              {description && (
                <div className="text-sm text-blue-700 capitalize">
                  {description}
                </div>
              )}
            </div>
            {icon && (
              <div className="text-3xl" title={description}>
                {icon.startsWith("http") ? (
                  <img src={icon} alt={description} className="w-12 h-12" />
                ) : (
                  <span>{icon}</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Today's Forecast */}
      {(highTemp !== undefined ||
        lowTemp !== undefined ||
        precipitationChance !== undefined) && (
        <div className="mb-4 p-3 bg-white bg-opacity-60 rounded-lg">
          <h4 className="text-sm font-medium text-blue-700 mb-2">Today</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-blue-600">High:</span>
              <span className="font-semibold ml-1">{formatTemp(highTemp)}</span>
            </div>
            <div>
              <span className="text-blue-600">Low:</span>
              <span className="font-semibold ml-1">{formatTemp(lowTemp)}</span>
            </div>
            {precipitationChance !== undefined && (
              <div className="col-span-2">
                <span className="text-blue-600">Rain:</span>
                <span className="font-semibold ml-1">
                  {formatPercent(precipitationChance)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tomorrow's Forecast */}
      {(tomorrowHighTemp !== undefined ||
        tomorrowLowTemp !== undefined ||
        tomorrowDescription) && (
        <div className="p-3 bg-white bg-opacity-60 rounded-lg">
          <h4 className="text-sm font-medium text-blue-700 mb-2">Tomorrow</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-blue-600">High:</span>
              <span className="font-semibold ml-1">
                {formatTemp(tomorrowHighTemp)}
              </span>
            </div>
            <div>
              <span className="text-blue-600">Low:</span>
              <span className="font-semibold ml-1">
                {formatTemp(tomorrowLowTemp)}
              </span>
            </div>
            {tomorrowDescription && (
              <div className="col-span-2">
                <span className="text-blue-600">Conditions:</span>
                <span className="font-semibold ml-1 capitalize">
                  {tomorrowDescription}
                </span>
              </div>
            )}
            {tomorrowPrecipChance !== undefined && (
              <div className="col-span-2">
                <span className="text-blue-600">Rain:</span>
                <span className="font-semibold ml-1">
                  {formatPercent(tomorrowPrecipChance)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location */}
      {location && (
        <div className="mt-3 pt-2 border-t border-blue-200">
          <div className="text-xs text-blue-600">📍 {location}</div>
        </div>
      )}
    </div>
  );
}
