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
  colorScheme,
}: ParameterCardsProps) {
  if (Object.keys(parameters).length === 0) return null;

  const colorClasses = {
    blue: {
      bg: "bg-gradient-to-r from-blue-50 to-cyan-50",
      border: "border-blue-500",
      text: "text-blue-800",
      value: "text-blue-600",
    },
    yellow: {
      bg: "bg-gradient-to-r from-yellow-50 to-amber-50",
      border: "border-yellow-500",
      text: "text-yellow-800",
      value: "text-yellow-600",
    },
  };

  const colors = colorClasses[colorScheme];

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">{title}</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(parameters).map(([paramId, summary]) => (
          <div
            key={paramId}
            className={`${colors.bg} p-6 rounded-2xl border-l-4 ${colors.border} shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <h4 className={`font-semibold text-lg ${colors.text} mb-3`}>
              {getParameterDisplayName(paramId)}
            </h4>
            <div className={`text-3xl font-bold ${colors.value} mb-4`}>
              {summary.latestValue} {getParameterUnit(paramId)}
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-600">
                📊 {summary.count} observations
              </div>
              <div className="text-xs text-gray-600">
                🕒 {new Date(summary.latestTime).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
