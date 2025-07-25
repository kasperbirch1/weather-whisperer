"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { WeatherObservation } from "@/lib/types";

// Type for Leaflet icon - using unknown since we're dynamically importing Leaflet
type LeafletIcon = unknown;

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

// Wind speed thresholds for color coding
const WIND_SPEED_THRESHOLDS = {
  STRONG: 15,
  FRESH: 10,
  MODERATE: 5,
} as const;

// Wind speed colors for markers
const WIND_COLORS = {
  STRONG: "#ef4444",
  FRESH: "#f97316",
  MODERATE: "#3b82f6",
  LIGHT: "#22c55e",
} as const;

// Create a custom wind icon for the map marker
const createWindIcon = async (windSpeed: number) => {
  // Return null if running on server side
  if (typeof window === "undefined") return null;

  try {
    // Dynamic import of leaflet on client side
    const L = await import("leaflet");

    // Fix for default markers in React-Leaflet (one-time setup)
    if ((L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl) {
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
    }

    // Determine color based on wind speed
    const getWindColor = (speed: number): string => {
      if (speed >= WIND_SPEED_THRESHOLDS.STRONG) return WIND_COLORS.STRONG;
      if (speed >= WIND_SPEED_THRESHOLDS.FRESH) return WIND_COLORS.FRESH;
      if (speed >= WIND_SPEED_THRESHOLDS.MODERATE) return WIND_COLORS.MODERATE;
      return WIND_COLORS.LIGHT;
    };

    const color = getWindColor(windSpeed);

    return L.divIcon({
      className: "custom-wind-marker",
      html: `
        <div style="
          background-color: ${color};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: bold;
          color: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          ${windSpeed.toFixed(0)}
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  } catch (error) {
    console.error("Error loading Leaflet:", error);
    return null;
  }
};

// Wind speed gradient classes for badges
const WIND_GRADIENTS = {
  STRONG: "from-red-500 to-red-600",
  FRESH: "from-orange-500 to-orange-600",
  MODERATE: "from-blue-500 to-blue-600",
  LIGHT: "from-green-500 to-green-600",
} as const;

// Wind speed descriptions
const WIND_DESCRIPTIONS = {
  STRONG: "Strong",
  FRESH: "Fresh",
  MODERATE: "Moderate",
  LIGHT: "Light",
} as const;

// Utility functions for wind speed classification
const getWindSpeedCategory = (speed: number) => {
  if (speed >= WIND_SPEED_THRESHOLDS.STRONG) return "STRONG";
  if (speed >= WIND_SPEED_THRESHOLDS.FRESH) return "FRESH";
  if (speed >= WIND_SPEED_THRESHOLDS.MODERATE) return "MODERATE";
  return "LIGHT";
};

const getWindSpeedGradient = (speed: number): string => {
  const category = getWindSpeedCategory(speed);
  return WIND_GRADIENTS[category];
};

const getWindSpeedDescription = (speed: number): string => {
  const category = getWindSpeedCategory(speed);
  return WIND_DESCRIPTIONS[category];
};

interface WindStationCardProps {
  observation: WeatherObservation;
}

export default function WindStationCard({ observation }: WindStationCardProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Extract coordinates and observation data
  const [lon, lat] = observation.geometry.coordinates;
  const { value: windSpeed, stationId, observed } = observation.properties;

  // Format the observation date
  const formattedDate = new Date(observed).toLocaleString();

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
      {/* Wind Speed Header */}
      <WindSpeedHeader windSpeed={windSpeed} />

      {/* Station Information */}
      <StationInfo stationId={stationId} observationDate={formattedDate} />

      {/* Interactive Map */}
      <StationMap
        isClient={isClient}
        lat={lat}
        lon={lon}
        windSpeed={windSpeed}
      />

      {/* Location Coordinates */}
      <LocationCoordinates lat={lat} lon={lon} />
    </div>
  );
}

// Sub-components for better organization
function WindSpeedHeader({ windSpeed }: { windSpeed: number }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div
        className={`bg-gradient-to-r ${getWindSpeedGradient(
          windSpeed
        )} text-white px-4 py-2 rounded-full text-sm font-semibold`}
      >
        {getWindSpeedDescription(windSpeed)}
      </div>
      <div className="text-3xl font-bold text-gray-800">{windSpeed} m/s</div>
    </div>
  );
}

function StationInfo({
  stationId,
  observationDate,
}: {
  stationId: string;
  observationDate: string;
}) {
  return (
    <div className="mb-4">
      <div className="text-sm font-semibold text-gray-700 mb-1">
        Station: {stationId}
      </div>
      <div className="text-xs text-gray-600">{observationDate}</div>
    </div>
  );
}

function StationMap({
  isClient,
  lat,
  lon,
  windSpeed,
}: {
  isClient: boolean;
  lat: number;
  lon: number;
  windSpeed: number;
}) {
  const [windIcon, setWindIcon] = useState<LeafletIcon | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      // Add a small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setMapReady(true);
        createWindIcon(windSpeed).then(setWindIcon);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isClient, windSpeed]);

  const mapConfig = {
    center: [lat, lon] as [number, number],
    zoom: 12,
    style: { height: "100%", width: "100%" },
    scrollWheelZoom: false,
    zoomControl: false,
    dragging: false,
    touchZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
  };

  return (
    <div className="mb-4">
      {isClient && mapReady ? (
        <div className="h-28 rounded-lg border border-gray-300 overflow-hidden shadow-inner">
          <MapContainer {...mapConfig}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution=""
            />
            {windIcon ? (
              <Marker position={[lat, lon]} icon={windIcon as unknown as import('leaflet').Icon} />
            ) : (
              <Marker position={[lat, lon]} />
            )}
          </MapContainer>
        </div>
      ) : (
        <MapLoadingPlaceholder />
      )}
    </div>
  );
}

function MapLoadingPlaceholder() {
  return (
    <div className="h-28 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg border border-gray-300 flex items-center justify-center">
      <span className="text-sm text-gray-600">Loading map...</span>
    </div>
  );
}

function LocationCoordinates({ lat, lon }: { lat: number; lon: number }) {
  return (
    <div className="text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
      📍 {lat.toFixed(3)}°N, {lon.toFixed(3)}°E
    </div>
  );
}
