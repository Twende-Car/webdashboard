import React, { useState, useEffect } from 'react';
import { fetchPendingDriversToValidate, fetchDrivers, WEB_URL, approveDriverWithId, creditDriver } from '../services/api';
import { Check, X, FileText, Car, User, Phone, MapPin, Wallet, CreditCard } from 'lucide-react';

const Drivers = () => {
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'all'
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Credit Modal State
    const [showCreditModal, setShowCreditModal] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [creditAmount, setCreditAmount] = useState('');
    const [crediting, setCrediting] = useState(false);

    useEffect(() => {
        loadDrivers();
    }, [activeTab]);

    const loadDrivers = async () => {
        try {
            setLoading(true);
            let data = [];
            if (activeTab === 'pending') {
                data = await fetchPendingDriversToValidate();
            } else {
                data = await fetchDrivers();
            }
            setDrivers(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Erreur lors du chargement des chauffeurs');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await approveDriverWithId(id);
            setDrivers(drivers.filter(d => d.id !== id));
        } catch (err) {
            alert('Erreur lors de l\'approbation');
        }
    };

    const openCreditModal = (driver) => {
        setSelectedDriver(driver);
        setCreditAmount('');
        setShowCreditModal(true);
    };

    const handleCredit = async (e) => {
        e.preventDefault();
        if (!selectedDriver || !creditAmount) return;

        try {
            setCrediting(true);
            await creditDriver(selectedDriver.id, parseFloat(creditAmount));
            setShowCreditModal(false);
            loadDrivers(); // Reload to update balance
            alert('Portefeuille crédité avec succès');
        } catch (err) {
            console.error(err);
            alert('Erreur lors du crédit');
        } finally {
            setCrediting(false);
        }
    };

    return (
        <div className="view-container animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>Gestion des Chauffeurs</h1>
                <p style={{ color: 'var(--muted-foreground)' }}>Validation et gestion des portefeuilles.</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('pending')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: activeTab === 'pending' ? 'var(--primary)' : 'var(--card)',
                        color: activeTab === 'pending' ? 'white' : 'var(--foreground)',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    En Attente
                </button>
                <button
                    onClick={() => setActiveTab('all')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: activeTab === 'all' ? 'var(--primary)' : 'var(--card)',
                        color: activeTab === 'all' ? 'white' : 'var(--foreground)',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Tous les Chauffeurs
                </button>
            </div>

            {loading ? (
                <div className="loading">Chargement...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : drivers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <p style={{ color: 'var(--muted-foreground)' }}>Aucun chauffeur trouvé.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
                    {drivers.map((driver) => (
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
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>{driver.name}</h3>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            background: driver.isApproved ? '#dcfce7' : '#fee2e2',
                                            color: driver.isApproved ? '#166534' : '#991b1b'
                                        }}>
                                            {driver.isApproved ? 'Approuvé' : 'En attente'}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted-foreground)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                        <Phone size={14} />
                                        <span>{driver.phoneNumber}</span>
                                    </div>
                                    {activeTab === 'all' && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 'bold', marginTop: '0.5rem' }}>
                                            <Wallet size={16} />
                                            <span>{driver.walletBalance?.toLocaleString() || 0} Fc</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            {activeTab === 'pending' ? (
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        onClick={() => handleApprove(driver.id)}
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
                                </div>
                            ) : (
                                <button
                                    onClick={() => openCreditModal(driver)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        background: 'var(--card)',
                                        border: '1px solid var(--border)',
                                        color: 'var(--foreground)',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <CreditCard size={18} /> Créditer le compte
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showCreditModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ padding: '2rem', width: '400px', maxWidth: '90%' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Créditer {selectedDriver?.name}</h2>

                        <form onSubmit={handleCredit}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Montant (Fc)</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={creditAmount}
                                    onChange={e => setCreditAmount(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border)',
                                        background: 'var(--background)',
                                        color: 'var(--foreground)'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowCreditModal(false)}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border)',
                                        background: 'transparent',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={crediting}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        fontWeight: '600',
                                        cursor: crediting ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {crediting ? '...' : 'Valider'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Drivers;
