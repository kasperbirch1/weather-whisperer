/* eslint-disable @typescript-eslint/no-explicit-any */
interface LocationData {
  dmiWindData?: any;
  dmiTempData?: any;
  dmiSeaLevelData?: any;
  dmiMeteoData?: any;
  dmiOceanData?: any;
  dmiLightningData?: any;
  dmiForecast?: any;
  openWeatherData?: any;
  openWeatherForecast?: any;
  weatherAPIData?: any;
  weatherAPIForecast?: any;
}

interface APIStatusSectionProps {
  locationData: LocationData[];
}

export default function APIStatusSection({
  locationData,
}: APIStatusSectionProps) {
  // Check if any DMI APIs have data
  const isDMIOnline = locationData.some(
    (l) =>
      l.dmiWindData ||
      l.dmiTempData ||
      l.dmiSeaLevelData ||
      l.dmiMeteoData ||
      l.dmiOceanData ||
      l.dmiLightningData ||
      l.dmiForecast
  );

  // Check if OpenWeatherMap has data
  const isOpenWeatherOnline = locationData.some(
    (l) => l.openWeatherData || l.openWeatherForecast
  );

  // Check if WeatherAPI has data
  const isWeatherAPIOnline = locationData.some(
    (l) => l.weatherAPIData || l.weatherAPIForecast
  );

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📊 API Status</h2>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4" role="list">
        <li
          className={`p-4 rounded-lg ${
            isDMIOnline
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <div className="font-bold">DMI API</div>
          <div className="text-sm">
            {isDMIOnline ? "✅ Online" : "❌ Offline"}
          </div>
        </li>
        <li
          className={`p-4 rounded-lg ${
            isOpenWeatherOnline
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <div className="font-bold">OpenWeatherMap</div>
          <div className="text-sm">
            {isOpenWeatherOnline ? "✅ Online" : "❌ Offline"}
          </div>
        </li>
        <li
          className={`p-4 rounded-lg ${
            isWeatherAPIOnline
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <div className="font-bold">WeatherAPI.com</div>
          <div className="text-sm">
            {isWeatherAPIOnline ? "✅ Online" : "❌ Offline"}
          </div>
        </li>
      </ul>
    </section>
  );
}
