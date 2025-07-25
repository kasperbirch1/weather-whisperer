'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { WeatherObservation } from '@/lib/types';

// Fix for default markers in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create a custom wind icon
const createWindIcon = (windSpeed: number) => {
  const color = windSpeed >= 10 ? '#ef4444' : windSpeed >= 5 ? '#f97316' : '#22c55e';
  return L.divIcon({
    className: 'custom-wind-marker',
    html: `<div style="
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
    ">${windSpeed.toFixed(0)}</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

interface WindStationCardProps {
  observation: WeatherObservation;
}

export default function WindStationCard({ observation }: WindStationCardProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [lon, lat] = observation.geometry.coordinates;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="text-2xl font-bold text-green-600 mb-2">
        {observation.properties.value} m/s
      </div>
      <div className="text-sm text-gray-600 mb-1">
        Station: {observation.properties.stationId}
      </div>
      <div className="text-xs text-gray-500 mb-3">
        {new Date(observation.properties.observed).toLocaleString()}
      </div>
      
      {/* Small map for this station */}
      <div className="mb-3">
        {isClient ? (
          <div className="h-24 rounded border border-gray-200 overflow-hidden">
            <MapContainer
              center={[lat, lon]}
              zoom={12}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
              zoomControl={false}
              dragging={false}
              touchZoom={false}
              doubleClickZoom={false}
              boxZoom={false}
              keyboard={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution=""
              />
              <Marker
                position={[lat, lon]}
                icon={createWindIcon(observation.properties.value)}
              />
            </MapContainer>
          </div>
        ) : (
          <div className="h-24 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-500">Loading map...</span>
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-500">
        📍 {lat.toFixed(3)}°N, {lon.toFixed(3)}°E
      </div>
    </div>
  );
}
