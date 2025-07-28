export interface NoDataCardProps {
  icon: string;
  title: string;
  description: string;
  badge?: {
    text: string;
    color: "green" | "blue" | "gray" | "yellow" | "red";
  };
}

export default function NoDataCard({
  icon,
  title,
  description,
  badge
}: NoDataCardProps) {
  const getBadgeColor = (color: string) => {
    const colors = {
      green: "text-green-600 bg-green-50",
      blue: "text-blue-600 bg-blue-50",
      gray: "text-gray-600 bg-gray-50",
      yellow: "text-yellow-600 bg-yellow-50",
      red: "text-red-600 bg-red-50"
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
      <div className="text-center text-gray-500">
        <span className="text-2xl mb-2 block">{icon}</span>
        <p className="font-medium">{title}</p>
        <p className="text-sm mt-1">{description}</p>
        {badge && (
          <div
            className={`mt-2 text-xs px-2 py-1 rounded-full inline-block ${getBadgeColor(
              badge.color
            )}`}
          >
            {badge.text}
          </div>
        )}
      </div>
    </div>
  );
}
