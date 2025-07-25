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
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// Wind speed thresholds and colors (consistent with WindStationCard)
const WIND_SPEED_THRESHOLDS = {
  STRONG: 15,
  FRESH: 10,
  MODERATE: 5,
} as const;

const WIND_COLORS = {
  STRONG: "#ef4444",
  FRESH: "#f97316",
  MODERATE: "#3b82f6",
  LIGHT: "#22c55e",
} as const;

// Create a custom wind icon for map markers
const createWindIcon = async (windSpeed: number) => {
  // Return null if running on server side
  if (typeof window === "undefined") return null;

  try {
    // Dynamic import of leaflet on client side
    const L = await import("leaflet");

    // Fix for default markers in React-Leaflet (one-time setup)
    if (
      (L.Icon.Default.prototype as unknown as Record<string, unknown>)
        ._getIconUrl
    ) {
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
        ._getIconUrl;
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
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
          color: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          ${windSpeed.toFixed(0)}
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  } catch (error) {
    console.error("Error loading Leaflet:", error);
    return null;
  }
};

interface WindStationsMapProps {
  windObservations: WeatherObservation[];
  centerLat: number;
  centerLon: number;
}

export default function WindStationsMap({
  windObservations,
  centerLat,
  centerLon,
}: WindStationsMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      // Add a small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setMapReady(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Early returns for loading and empty states
  if (!isClient || !mapReady) {
    return <MapLoadingState />;
  }

  if (windObservations.length === 0) {
    return <EmptyMapState />;
  }

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-300 shadow-lg">
      <MapContainer
        center={[centerLat, centerLon]}
        zoom={9}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        zoomControl={true}
        className="leaflet-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {windObservations.map((observation, index) => (
          <WindStationMarker
            key={`${observation.properties.stationId}-${index}`}
            observation={observation}
          />
        ))}
      </MapContainer>
    </div>
  );
}

// Sub-components for better organization
function MapLoadingState() {
  return (
    <div className="w-full h-64 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border border-gray-300">
      <div className="text-center">
        <div className="animate-pulse text-gray-600 mb-2">📍</div>
        <div className="text-gray-500 text-sm">Loading map...</div>
      </div>
    </div>
  );
}

function EmptyMapState() {
  return (
    <div className="w-full h-64 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border border-gray-300">
      <div className="text-center text-gray-500">
        <div className="text-2xl mb-2">🌊</div>
        <div className="text-sm">No wind stations to display</div>
      </div>
    </div>
  );
}

function WindStationMarker({
  observation,
}: {
  observation: WeatherObservation;
}) {
  const [windIcon, setWindIcon] = useState<LeafletIcon | null>(null);
  const [lon, lat] = observation.geometry.coordinates;
  const { value: windSpeed, stationId, observed } = observation.properties;

  const formattedDate = new Date(observed).toLocaleString();

  useEffect(() => {
    createWindIcon(windSpeed).then(setWindIcon);
  }, [windSpeed]);

  if (windIcon) {
    return (
      <Marker
        position={[lat, lon]}
        icon={windIcon as unknown as import("leaflet").Icon}
      >
        <Popup className="custom-popup">
          <StationPopupContent
            stationId={stationId}
            windSpeed={windSpeed}
            observationDate={formattedDate}
            lat={lat}
            lon={lon}
          />
        </Popup>
      </Marker>
    );
  }

  return (
    <Marker position={[lat, lon]}>
      <Popup className="custom-popup">
        <StationPopupContent
          stationId={stationId}
          windSpeed={windSpeed}
          observationDate={formattedDate}
          lat={lat}
          lon={lon}
        />
      </Popup>
    </Marker>
  );
}

function StationPopupContent({
  stationId,
  windSpeed,
  observationDate,
  lat,
  lon,
}: {
  stationId: string;
  windSpeed: number;
  observationDate: string;
  lat: number;
  lon: number;
}) {
  const getWindSpeedColor = (speed: number): string => {
    if (speed >= WIND_SPEED_THRESHOLDS.STRONG) return "text-red-600";
    if (speed >= WIND_SPEED_THRESHOLDS.FRESH) return "text-orange-600";
    if (speed >= WIND_SPEED_THRESHOLDS.MODERATE) return "text-blue-600";
    return "text-green-600";
  };

  return (
    <div className="text-sm min-w-[200px]">
      <div className="font-semibold text-gray-800 mb-1">
        Station {stationId}
      </div>
      <div
        className={`font-bold text-base mb-2 ${getWindSpeedColor(windSpeed)}`}
      >
        💨 {windSpeed} m/s
      </div>
      <div className="text-xs text-gray-600 mb-1">🕒 {observationDate}</div>
      <div className="text-xs text-gray-600">
        📍 {lat.toFixed(3)}°N, {lon.toFixed(3)}°E
      </div>
    </div>
  );
}
