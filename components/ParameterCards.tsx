import { ParameterSummary } from "@/lib/types";
import { getParameterDisplayName, getParameterUnit } from "@/lib/weather-utils";

interface ParameterCardsProps {
  title: string;
  parameters: Record<string, ParameterSummary>;
  colorScheme: "blue" | "yellow";
}

export default function ParameterCards({
  title,
  parameters,
  colorScheme
}: ParameterCardsProps) {
  if (Object.keys(parameters).length === 0) return null;

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      value: "text-blue-600"
    },
    yellow: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      value: "text-yellow-600"
    }
  };

  const colors = colorClasses[colorScheme];

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">{title}</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(parameters).map(([paramId, summary]) => (
          <div
            key={paramId}
            className={`${colors.bg} p-4 rounded-lg border ${colors.border}`}
          >
            <h4 className={`font-semibold ${colors.text}`}>
              {getParameterDisplayName(paramId)}
            </h4>
            <div className={`text-2xl font-bold ${colors.value}`}>
              {summary.latestValue} {getParameterUnit(paramId)}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              📊 {summary.count} observations
            </div>
            <div className="text-xs text-gray-600">
              🕒 {new Date(summary.latestTime).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
