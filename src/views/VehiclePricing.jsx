import React, { useState, useEffect } from 'react';
import { Truck, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { fetchVehicleTypes, createVehicleType, updateVehicleType, deleteVehicleType } from '../services/api';
import { useAuth } from '../context/AuthContext';

const VehiclePricing = () => {
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', pricePerKm: '', description: '' });

    const { token } = useAuth();

    useEffect(() => {
        loadVehicleTypes(token);
    }, []);

    const loadVehicleTypes = async (token) => {
        try {
            const data = await fetchVehicleTypes(token);
            setVehicleTypes(data);
        } catch (error) {
            console.error('Error loading vehicle types:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createVehicleType({
                ...formData,
                pricePerKm: parseFloat(formData.pricePerKm)
            }, token);
            setIsAdding(false);
            setFormData({ name: '', pricePerKm: '', description: '' });
            loadVehicleTypes(token);
        } catch (error) {
            console.error('Error creating vehicle type:', error);
        }
    };

    const handleUpdate = async (id) => {
        try {
            await updateVehicleType(id, {
                ...formData,
                pricePerKm: parseFloat(formData.pricePerKm)
            }, token);
            setEditingId(null);
            loadVehicleTypes(token);
        } catch (error) {
            console.error('Error updating vehicle type:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce type de véhicule ?')) {
            try {
                await deleteVehicleType(id, token);
                loadVehicleTypes(token);
            } catch (error) {
                console.error('Error deleting vehicle type:', error);
            }
        }
    };

    const startEdit = (type) => {
        setEditingId(type.id);
        setFormData({ name: type.name, pricePerKm: type.pricePerKm, description: type.description || '' });
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="view-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Tarification des Véhicules</h2>
                    <p style={{ color: 'var(--muted-foreground)' }}>Gérez les types de véhicules et leurs prix au kilomètre</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 1rem',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    <Plus size={18} />
                    Ajouter un type
                </button>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {isAdding && (
                    <div className="card" style={{ border: '2px dashed var(--primary)' }}>
                        <form onSubmit={handleCreate}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Nom du véhicule</label>
                                <input
                                    autoFocus
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--background)' }}
                                    placeholder="Ex: Économie, Premium..."
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Prix au km (Fc)</label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    value={formData.pricePerKm}
                                    onChange={(e) => setFormData({ ...formData, pricePerKm: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--background)' }}
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--background)', minHeight: '60px' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button type="submit" style={{ flex: 1, padding: '0.5rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Enregistrer</button>
                                <button type="button" onClick={() => setIsAdding(false)} style={{ flex: 1, padding: '0.5rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer' }}>Annuler</button>
                            </div>
                        </form>
                    </div>
                )}

                {vehicleTypes.map((type) => (
                    <div key={type.id} className="card">
                        {editingId === type.id ? (
                            <div>
                                <input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', marginBottom: '0.5rem', padding: '0.4rem', border: '1px solid var(--primary)', borderRadius: '4px' }}
                                />
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.pricePerKm}
                                    onChange={(e) => setFormData({ ...formData, pricePerKm: e.target.value })}
                                    style={{ width: '100%', marginBottom: '0.5rem', padding: '0.4rem', border: '1px solid var(--primary)', borderRadius: '4px' }}
                                />
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    style={{ width: '100%', marginBottom: '1rem', padding: '0.4rem', border: '1px solid var(--primary)', borderRadius: '4px' }}
                                />
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleUpdate(type.id)} style={{ padding: '0.4rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', flex: 1 }}><Check size={16} /></button>
                                    <button onClick={() => setEditingId(null)} style={{ padding: '0.4rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', flex: 1 }}><X size={16} /></button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div style={{ width: '48px', height: '48px', background: 'var(--primary-muted)', borderRadius: '12px', display: 'grid', placeItems: 'center', color: 'var(--primary)' }}>
                                        <Truck size={24} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => startEdit(type)} style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer' }}><Edit2 size={18} /></button>
                                        <button onClick={() => handleDelete(type.id)} style={{ background: 'none', border: 'none', color: 'var(--destructive)', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                    </div>
                                </div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>{type.name}</h3>
                                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.5rem' }}>{type.pricePerKm} Fc <span style={{ fontSize: '0.875rem', fontWeight: '400', color: 'var(--muted-foreground)' }}>/ km</span></p>
                                <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>{type.description || 'Aucune description'}</p>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VehiclePricing;
