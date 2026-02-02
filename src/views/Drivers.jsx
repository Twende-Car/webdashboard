import React, { useState, useEffect } from 'react';
import { api, WEB_URL } from '../services/api';
import { Check, X, FileText, Car, User, Phone, MapPin } from 'lucide-react';


const Drivers = () => {
    const [pendingDrivers, setPendingDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    useEffect(() => {
        fetchPendingDrivers();

    }, []);

    const fetchPendingDrivers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/pending-drivers');
            console.clear()
            console.log(data);
            setPendingDrivers(data);
            setError(null);
        } catch (err) {
            console.log(err);
            setError('Erreur lors de la récupération des chauffeurs en attente');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const approveDriver = async (id) => {
        try {
            await api.put(`/approve-driver/${id}`);
            setPendingDrivers(pendingDrivers.filter(driver => driver.id !== id));
        } catch (err) {
            alert('Erreur lors de l\'approbation du chauffeur');
            console.error(err);
        }
    };

    if (loading) return <div className="loading">Chargement...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="view-container animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>Approbation des Chauffeurs</h1>
                <p style={{ color: 'var(--muted-foreground)' }}>Gérez les demandes d'inscription des nouveaux chauffeurs.</p>
            </div>

            {pendingDrivers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <p style={{ color: 'var(--muted-foreground)' }}>Aucune demande en attente.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
                    {pendingDrivers.map((driver) => (
                        <div key={driver.id} className="card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', background: 'var(--secondary)' }}>
                                    {driver.driverPhoto ? (
                                        <img src={`${WEB_URL}/${driver.driverPhoto}`} alt={driver.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
                                            <User size={32} color="var(--muted-foreground)" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>{driver.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted-foreground)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                        <Phone size={14} />
                                        <span>{driver.phoneNumber}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                                        <MapPin size={14} />
                                        <span>{driver.address}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: 'var(--secondary)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Car size={16} /> Véhicule
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.875rem' }}>
                                    <div><span style={{ color: 'var(--muted-foreground)' }}>Marque:</span> {driver.vehicleBrand}</div>
                                    <div><span style={{ color: 'var(--muted-foreground)' }}>Modèle:</span> {driver.vehicleModel}</div>
                                    <div><span style={{ color: 'var(--muted-foreground)' }}>Immatriculation:</span> {driver.vehiclePlate}</div>
                                    <div><span style={{ color: 'var(--muted-foreground)' }}>Couleur:</span> {driver.vehicleColor}</div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <FileText size={16} /> Documents & Photos
                                </h4>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {driver.idCardPhoto && (
                                        <div className="document-preview" onClick={() => window.open(`${WEB_URL}/${driver.idCardPhoto}`, '_blank')}>
                                            <img src={`${WEB_URL}/${driver.idCardPhoto}`} alt="ID Card" style={{ width: '60px', height: '60px', borderRadius: '4px', objectFit: 'cover' }} />
                                            <span style={{ fontSize: '0.7rem' }}>Carte ID</span>
                                        </div>
                                    )}
                                    {driver.vehiclePhotos?.map((photo, index) => (
                                        <div key={index} className="document-preview" onClick={() => window.open(`${WEB_URL}/${photo}`, '_blank')}>
                                            <img src={`${WEB_URL}/${photo}`} alt={`Vehicle ${index + 1}`} style={{ width: '60px', height: '60px', borderRadius: '4px', objectFit: 'cover' }} />
                                            <span style={{ fontSize: '0.7rem' }}>Véhicule {index + 1}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => approveDriver(driver.id)}
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Check size={18} /> Approuver
                                </button>
                                <button
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        background: 'none',
                                        color: 'var(--destructive)',
                                        border: '1px solid var(--destructive)',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <X size={18} /> Rejeter
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
        .document-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .document-preview:hover {
          transform: scale(1.05);
        }
      `}} />
        </div>
    );
};

export default Drivers;
