import { ReactNode } from "react";

interface WeatherDataSectionProps {
  title: string;
  icon: string;
  children: ReactNode;
  columns?: "single" | "double" | "responsive";
  className?: string;
}

export default function WeatherDataSection({
  title,
  icon,
  children,
  columns = "responsive",
  className = "mb-12",
}: WeatherDataSectionProps) {
  const getGridClasses = () => {
    switch (columns) {
      case "single":
        return "grid grid-cols-1 gap-6";
      case "double":
        return "grid grid-cols-1 md:grid-cols-2 gap-6";
      case "responsive":
        return "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-6";
      default:
        return "grid grid-cols-1 gap-6";
    }
  };

  return (
    <section className={className}>
      <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        {icon} {title}
      </h4>
      <div className={getGridClasses()}>{children}</div>
    </section>
  );
}
