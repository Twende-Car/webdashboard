import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Download } from 'lucide-react';
import { fetchTrips } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Trips = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { token } = useAuth()

    useEffect(() => {
        const getTrips = async () => {
            try {
                const data = await fetchTrips(token);
                setTrips(data);
            } catch (error) {
                console.error('Failed to fetch trips:', error);
            } finally {
                setLoading(false);
            }
        };
        getTrips();
    }, []);

    const filteredTrips = trips.filter(trip =>
        trip.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.passenger?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (trip.driver?.name && trip.driver.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case 'COMPLETED': return <span className="badge badge-success">Terminé</span>;
            case 'IN_PROGRESS': return <span className="badge badge-info">En cours</span>;
            case 'CANCELLED': return <span className="badge badge-error">Annulé</span>;
            case 'ACCEPTED': return <span className="badge badge-warning">Accepté</span>;
            case 'REQUESTED': return <span className="badge">Demandé</span>;
            default: return <span className="badge">{status}</span>;
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '700' }}>Courses</h1>
                    <p style={{ color: 'var(--muted-foreground)' }}>Gérez et recherchez toutes les courses effectuées.</p>
                </div>
                <button className="card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--secondary)', border: 'none', color: 'white' }}>
                    <Download size={18} />
                    <span>Exporter CSV</span>
                </button>
            </header>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher par ID, client ou chauffeur..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem 0.75rem 2.5rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                background: 'var(--background)',
                                color: 'var(--foreground)',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID Course</th>
                                <th>Client</th>
                                <th>Chauffeur</th>
                                <th>Statut</th>
                                <th>Montant</th>
                                <th>Date</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</td></tr>
                            ) : filteredTrips.map((trip) => (
                                <tr key={trip.id}>
                                    <td style={{ fontWeight: '600' }}>{trip.id.substring(0, 8)}</td>
                                    <td>{trip.passenger?.name || 'Inconnu'}</td>
                                    <td>{trip.driver?.name || '---'}</td>
                                    <td>{getStatusBadge(trip.status)}</td>
                                    <td style={{ fontWeight: '600' }}>{trip.fare ? `${trip.fare} Fc` : '---'}</td>
                                    <td style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem' }}>
                                        {new Date(trip.createdAt).toLocaleString()}
                                    </td>
                                    <td>
                                        <button style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)' }}>
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Trips;
