"use client";

import { useEffect, useState } from "react";
import LocationCard from "@/components/LocationCard";
import { locations as defaultLocations } from "@/data/locations";
import { Coordinates } from "@/lib/types";

interface LocationMap {
  [name: string]: Coordinates;
}

const STORAGE_KEY = "userLocations";

export default function LocationManager() {
  const [locations, setLocations] = useState<LocationMap>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    const storedLocations: LocationMap = stored ? JSON.parse(stored) : {};
    setLocations({ ...defaultLocations, ...storedLocations });
  }, []);

  useEffect(() => {
    const custom: LocationMap = {};
    Object.entries(locations).forEach(([n, c]) => {
      if (!(n in defaultLocations)) custom[n] = c;
    });
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
    }
  }, [locations]);

  const toggleSelected = (loc: string) => {
    setSelected((prev) =>
      prev.includes(loc) ? prev.filter((n) => n !== loc) : [...prev, loc]
    );
  };

  const addLocation = () => {
    if (!name || !lat || !lon) return;
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    if (Number.isNaN(latNum) || Number.isNaN(lonNum)) return;
    setLocations((prev) => ({ ...prev, [name]: { lat: latNum, lon: lonNum } }));
    setName("");
    setLat("");
    setLon("");
  };

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">📍 Weather Data by Location</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(locations).map((loc) => (
          <button
            key={loc}
            onClick={() => toggleSelected(loc)}
            className={`px-3 py-1 rounded-full border text-sm transition-colors ${selected.includes(loc) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
          >
            {loc.replace(/([A-Z])/g, " $1").trim()}
          </button>
        ))}
      </div>
      <div className="mb-8 space-y-2">
        <h3 className="font-semibold">Add Location</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
          />
          <input
            type="number"
            placeholder="Lat"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
          />
          <input
            type="number"
            placeholder="Lon"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
          />
          <button
            type="button"
            onClick={addLocation}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Add
          </button>
        </div>
      </div>
      <ul className="grid grid-cols-1 xl:grid-cols-2 gap-12 list-none" role="list">
        {selected.map((loc) => {
          const coords = locations[loc];
          if (!coords) return null;
          return (
            <li key={loc}>
              <LocationCard locationName={loc} coords={coords} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
