import React, { useState, useEffect } from 'react';
import { getCommission, updateCommission } from '../services/api';
import { Save } from 'lucide-react';

const Settings = () => {
    const [commission, setCommission] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await getCommission();
            setCommission(data.percentage);
        } catch (err) {
            setError('Erreur lors du chargement des paramètres');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError(null);
            setSuccess(null);
            await updateCommission(commission);
            setSuccess('Paramètres mis à jour avec succès');
        } catch (err) {
            setError('Erreur lors de la mise à jour');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading">Chargement...</div>;

    return (
        <div className="view-container animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>Paramètres</h1>
                <p style={{ color: 'var(--muted-foreground)' }}>Configuration générale de l'application.</p>
            </div>

            <div className="card" style={{ padding: '2rem', maxWidth: '600px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Commission</h2>

                {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
                {success && <div className="success-message" style={{ marginBottom: '1rem', color: 'green' }}>{success}</div>}

                <form onSubmit={handleSave}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <label htmlFor="commission" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Pourcentage de commission par course (%)</label>
                        <input
                            id="commission"
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={commission}
                            onChange={(e) => setCommission(e.target.value)}
                            style={{
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                background: 'var(--background)',
                                color: 'var(--foreground)',
                                outline: 'none'
                            }}
                        />
                        <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                            Ce pourcentage sera déduit du portefeuille du chauffeur à chaque course terminée.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            opacity: saving ? 0.7 : 1
                        }}
                    >
                        <Save size={18} />
                        {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Settings;
