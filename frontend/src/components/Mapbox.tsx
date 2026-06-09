import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Location } from '../types';

interface MapboxProps {
  locations: Location[];
}

const Mapbox = ({ locations }: MapboxProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // 1. Initialize map
    mapInstance.current = L.map(mapRef.current, {
      scrollWheelZoom: false,
      zoomControl: true,
      dragging: true,
    });

    // 2. Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapInstance.current);

    const points: [number, number][] = [];

    // 3. Add markers
    locations.forEach((loc) => {
      const [lng, lat] = loc.coordinates;
      const currentPoint: [number, number] = [lat, lng];
      points.push(currentPoint);

      const customIcon = L.divIcon({
        className: 'marker',
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -30],
      });

      // Create marker and popup
      L.marker(currentPoint, { icon: customIcon })
        .addTo(mapInstance.current!)
        .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
          autoClose: false,
          closeOnClick: false,
          className: 'leaflet-popup',
        })
        .openPopup();
    });

    // 4. Fit map to bounds
    if (points.length) {
      mapInstance.current.fitBounds(points, {
        padding: [100, 100],
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, [locations]);

  return <div ref={mapRef} id="map" />;
};

export default Mapbox;
