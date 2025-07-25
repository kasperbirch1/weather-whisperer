'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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
    ">${windSpeed.toFixed(0)}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

interface WindStationsMapProps {
  windObservations: WeatherObservation[];
  centerLat: number;
  centerLon: number;
}

export default function WindStationsMap({ windObservations, centerLat, centerLon }: WindStationsMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  if (windObservations.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">No wind stations to display</div>
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-300">
      <MapContainer
        center={[centerLat, centerLon]}
        zoom={9}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {windObservations.map((obs, index) => {
          const [lon, lat] = obs.geometry.coordinates;
          return (
            <Marker
              key={index}
              position={[lat, lon]}
              icon={createWindIcon(obs.properties.value)}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">Station {obs.properties.stationId}</div>
                  <div className="text-green-600 font-bold">{obs.properties.value} m/s</div>
                  <div className="text-xs text-gray-500">
                    {new Date(obs.properties.observed).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    📍 {lat.toFixed(3)}°N, {lon.toFixed(3)}°E
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
