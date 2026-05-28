import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

export const displayMap = (locations) => {
    // 1. Initialize map with simple, responsive settings
    const map = L.map('map', {
        scrollWheelZoom: true,
        zoomControl: true,
        dragging: true,
    });

    // 2. Add basic tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const points = [];

    // 3. Add markers with location labels
    locations.forEach((loc, index) => {
        const [lng, lat] = loc.coordinates;
        const currentPoint = [lat, lng];
        points.push(currentPoint);

        const customIcon = L.divIcon({
            className: 'marker',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30],
        });

        // Create marker with location number label
        const marker = L.marker(currentPoint, { icon: customIcon }).addTo(map);

        // Bind popup with location number and description
        marker.bindPopup(
            `<div style="font-weight: bold; margin-bottom: 0.5rem;">Location ${index + 1}</div>
             <p>Day ${loc.day}: ${loc.description}</p>`,
            {
                autoClose: false,
                className: 'leaflet-popup',
            },
        );
        marker.openPopup();

        // Add a small text label above marker
        L.marker(currentPoint, {
            icon: L.divIcon({
                className: 'location-label',
                html: `<span>${index + 1}</span>`,
                iconSize: [24, 24],
                iconAnchor: [12, 24],
            }),
        }).addTo(map);
    });

    // 4. Fit map to show all locations
    if (points.length === 0) {
        map.setView([20, 0], 2);
    } else if (points.length === 1) {
        map.setView(points[0], 10);
    } else {
        map.fitBounds(points, {
            padding: [100, 100],
            maxZoom: 15,
        });
    }

    // 5. Recalculate after render
    setTimeout(() => {
        map.invalidateSize(true);
    }, 300);
};
