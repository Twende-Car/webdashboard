import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet + React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const liveTrips = [
    {
        id: 'TR-7822',
        client: 'Marc Lefebvre',
        driver: 'Sophie Bernard',
        pos: [48.835, 2.24], // Boulogne
        dest: [48.825, 2.27], // Issy
        path: [[48.835, 2.24], [48.832, 2.25], [48.828, 2.26], [48.825, 2.27]]
    },
    {
        id: 'TR-7830',
        client: 'Emma Wilson',
        driver: 'Paul Andre',
        pos: [48.858, 2.294], // Eiffel Tower area
        dest: [48.873, 2.295], // Arc de Triomphe
        path: [[48.858, 2.294], [48.865, 2.294], [48.873, 2.295]]
    }
];

const LiveMap = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: 'calc(100vh - 4rem)' }}>
            <header>
                <h1 style={{ fontSize: '1.875rem', fontWeight: '700' }}>Carte en direct</h1>
                <p style={{ color: 'var(--muted-foreground)' }}>Suivez les courses actives en temps réel sur la carte.</p>
            </header>

            <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <MapContainer
                    center={[48.8566, 2.3522]}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    // Dark mode layer alternative if wanted: url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />

                    {liveTrips.map(trip => (
                        <React.Fragment key={trip.id}>
                            <Marker position={trip.pos}>
                                <Popup>
                                    <div style={{ color: '#000' }}>
                                        <strong>Course {trip.id}</strong><br />
                                        Chauffeur: {trip.driver}<br />
                                        Client: {trip.client}
                                    </div>
                                </Popup>
                            </Marker>
                            <Polyline positions={trip.path} color="var(--primary)" weight={4} opacity={0.6} dashArray="10, 10" />
                            <Marker position={trip.dest} opacity={0.6}>
                                <Popup style={{ color: '#000' }}>Destination</Popup>
                            </Marker>
                        </React.Fragment>
                    ))}
                </MapContainer>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {liveTrips.map(trip => (
                    <div key={trip.id} className="glass" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{trip.id}</span>
                            <span className="badge badge-info">En cours</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{trip.driver} ➔ {trip.client}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LiveMap;
