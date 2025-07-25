// Shared wind speed categorization utility
export const getWindSpeedCategory = (speed: number) => {
  if (speed >= 15)
    return { level: "STRONG", color: "bg-red-500", text: "Strong" };
  if (speed >= 10)
    return { level: "FRESH", color: "bg-orange-500", text: "Fresh" };
  if (speed >= 5)
    return { level: "MODERATE", color: "bg-blue-500", text: "Moderate" };
  return { level: "LIGHT", color: "bg-green-500", text: "Light" };
};
