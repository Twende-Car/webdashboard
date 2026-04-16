import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Download, X, User, Car, MapPin, Calendar, DollarSign, Navigation, RefreshCw } from 'lucide-react';
import { fetchTrips, fetchTripDetails } from '../services/api';
import Loader from '../components/Loader';

const Trips = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [detailModal, setDetailModal] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState(null);

    const loadTrips = async () => {
        try {
            setLoading(true);
            const data = await fetchTrips();
            setTrips(data);
        } catch (error) {
            console.error('Failed to fetch trips:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTrips();
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

    const openDetailModal = async (trip) => {
        setDetailModal({ id: trip.id });
        setDetailError(null);
        setDetailLoading(true);
        try {
            const data = await fetchTripDetails(trip.id);
            setDetailModal(data);
        } catch (err) {
            setDetailError(err.response?.data?.message || 'Impossible de charger les détails');
        } finally {
            setDetailLoading(false);
        }
    };

    const closeDetailModal = () => {
        setDetailModal(null);
        setDetailError(null);
    };

    const formatDate = (d) => d ? new Date(d).toLocaleString('fr-FR') : '---';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '700' }}>Courses</h1>
                    <p style={{ color: 'var(--muted-foreground)' }}>Gérez et recherchez toutes les courses effectuées.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={loadTrips}
                        disabled={loading}
                        className="card"
                        style={{
                            padding: '0.5rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            border: '1px solid var(--border)',
                            background: 'var(--card)',
                            color: 'var(--foreground)',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1
                        }}
                        title="Rafraîchir la liste"
                    >
                        <RefreshCw size={18} className={loading ? 'loader-spin' : ''} />
                        <span>Rafraîchir</span>
                    </button>
                    <button className="card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--secondary)', border: 'none', color: 'white' }}>
                        <Download size={18} />
                        <span>Exporter CSV</span>
                    </button>
                </div>
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
                                <tr><td colSpan="7" style={{ padding: 0, verticalAlign: 'middle' }}><Loader label="Chargement des courses..." variant="block" style={{ minHeight: '180px' }} /></td></tr>
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
                                        <button
                                            onClick={() => openDetailModal(trip)}
                                            style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer' }}
                                            title="Voir les détails"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {detailModal && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 50,
                        padding: '1rem'
                    }}
                    onClick={closeDetailModal}
                >
                    <div
                        className="card"
                        style={{
                            maxWidth: '520px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflow: 'auto'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Détails de la course</h2>
                            <button onClick={closeDetailModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {detailLoading ? (
                            <Loader label="Chargement des détails..." variant="block" style={{ minHeight: '160px' }} />
                        ) : detailError ? (
                            <p style={{ color: 'var(--destructive)' }}>{detailError}</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <span style={{ fontWeight: '600', fontFamily: 'monospace' }}>{detailModal.id}</span>
                                    {getStatusBadge(detailModal.status)}
                                </div>

                                {detailModal.fare != null && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <DollarSign size={18} color="var(--primary)" />
                                        <span style={{ fontWeight: '700', fontSize: '1.125rem' }}>{detailModal.fare} Fc</span>
                                        {detailModal.distance != null && (
                                            <span style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                                                ({detailModal.distance} km)
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <MapPin size={12} /> Départ
                                    </div>
                                    <p style={{ margin: 0 }}>{detailModal.pickupAddress || `${detailModal.pickupLat?.toFixed(5)}, ${detailModal.pickupLng?.toFixed(5)}`}</p>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <Navigation size={12} /> Arrivée
                                    </div>
                                    <p style={{ margin: 0 }}>{detailModal.dropoffAddress || `${detailModal.dropoffLat?.toFixed(5)}, ${detailModal.dropoffLng?.toFixed(5)}`}</p>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    <div style={{ flex: '1 1 200px' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                            <User size={12} /> Client
                                        </div>
                                        <p style={{ margin: 0, fontWeight: '500' }}>{detailModal.passenger?.name || '---'}</p>
                                        {detailModal.passenger?.phoneNumber && (
                                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{detailModal.passenger.phoneNumber}</p>
                                        )}
                                    </div>
                                    <div style={{ flex: '1 1 200px' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                            <Car size={12} /> Chauffeur
                                        </div>
                                        <p style={{ margin: 0, fontWeight: '500' }}>{detailModal.driver?.name || '---'}</p>
                                        {(detailModal.driver?.vehicleModel || detailModal.vehicleModel) && (
                                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                                                {detailModal.driver?.vehicleModel || detailModal.vehicleModel}
                                                {(detailModal.driver?.vehicleColor || detailModal.vehicleColor) && ` • ${detailModal.driver?.vehicleColor || detailModal.vehicleColor}`}
                                                {(detailModal.driver?.vehiclePlate || detailModal.vehicleRegistration) && ` • ${detailModal.driver?.vehiclePlate || detailModal.vehicleRegistration}`}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {detailModal.vehicleType && (
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>Type de véhicule</div>
                                        <p style={{ margin: 0 }}>{detailModal.vehicleType.name} {detailModal.vehicleType.pricePerKm != null && `(${detailModal.vehicleType.pricePerKm} Fc/km)`}</p>
                                    </div>
                                )}

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <Calendar size={16} color="var(--muted-foreground)" />
                                    <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                                        Créée le {formatDate(detailModal.createdAt)}
                                    </span>
                                </div>
                                {(detailModal.startTime || detailModal.endTime) && (
                                    <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                                        {detailModal.startTime && <>Début : {formatDate(detailModal.startTime)}</>}
                                        {detailModal.startTime && detailModal.endTime && ' — '}
                                        {detailModal.endTime && <>Fin : {formatDate(detailModal.endTime)}</>}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Trips;
