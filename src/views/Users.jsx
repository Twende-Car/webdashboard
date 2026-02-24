import React, { useState, useEffect } from 'react';
import { MoreVertical, Mail, Phone, KeyRound, X } from 'lucide-react';
import { fetchUsers, resetUserPassword } from '../services/api';
import Loader from '../components/Loader';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Tous');
    const [menuOpen, setMenuOpen] = useState(null);
    const [resetModal, setResetModal] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [resetError, setResetError] = useState('');
    const [resetSuccess, setResetSuccess] = useState(false);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const data = await fetchUsers();
                setUsers(data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            } finally {
                setLoading(false);
            }
        };
        getUsers();
    }, []);

    const filteredUsers = filter === 'Tous'
        ? users
        : users.filter(u => (u.role === 'client' && filter === 'Client') || (u.role === 'driver' && filter === 'Chauffeur'));

    const openResetModal = (user) => {
        setMenuOpen(null);
        setResetModal(user);
        setNewPassword('');
        setConfirmPassword('');
        setResetError('');
        setResetSuccess(false);
    };

    const closeResetModal = () => {
        setResetModal(null);
        setNewPassword('');
        setConfirmPassword('');
        setResetError('');
        setResetSuccess(false);
    };

    const handleResetPassword = async () => {
        if (!resetModal) return;
        setResetError('');
        if (!newPassword || newPassword.length < 6) {
            setResetError('Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setResetError('Les deux mots de passe ne correspondent pas.');
            return;
        }
        setResetLoading(true);
        try {
            await resetUserPassword(resetModal.id, newPassword);
            setResetSuccess(true);
            setTimeout(closeResetModal, 1500);
        } catch (err) {
            setResetError(err.response?.data?.message || 'Erreur lors de la réinitialisation.');
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header>
                <h1 style={{ fontSize: '1.875rem', fontWeight: '700' }}>Utilisateurs</h1>
                <p style={{ color: 'var(--muted-foreground)' }}>Gérez les clients et les chauffeurs de la plateforme.</p>
            </header>

            <div style={{ display: 'flex', gap: '1rem' }}>
                {['Tous', 'Client', 'Chauffeur'].map(t => (
                    <button
                        key={t}
                        onClick={() => setFilter(t)}
                        style={{
                            padding: '0.5rem 1.5rem',
                            borderRadius: '9999px',
                            border: '1px solid var(--border)',
                            background: filter === t ? 'var(--primary)' : 'var(--card)',
                            color: filter === t ? 'white' : 'var(--foreground)',
                            fontWeight: '500'
                        }}
                    >
                        {t}s
                    </button>
                ))}
            </div>

            <div className="card" style={{ padding: '0' }}>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Utilisateur</th>
                                <th>Type</th>
                                <th>Contact</th>
                                <th>En ligne</th>
                                <th>Statut</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ padding: 0, verticalAlign: 'middle' }}><Loader label="Chargement des utilisateurs..." variant="block" style={{ minHeight: '180px' }} /></td></tr>
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--secondary)', display: 'grid', placeItems: 'center', fontWeight: 'bold' }}>
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600' }}>{user.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{user.id.substring(0, 8)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            background: user.role === 'driver' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                            color: user.role === 'driver' ? '#a855f7' : '#3b82f6',
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '4px'
                                        }}>
                                            {user.role === 'driver' ? 'Chauffeur' : 'Client'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <div style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Mail size={12} /> {user.email}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Phone size={12} /> {user.phoneNumber}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: user.isOnline ? '#4ade80' : '#94a3b8' }}></div>
                                            <span style={{ fontSize: '0.75rem' }}>{user.isOnline ? 'Oui' : 'Non'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-success">Actif</span>
                                    </td>
                                    <td>
                                        <div style={{ position: 'relative' }}>
                                            <button
                                                onClick={() => setMenuOpen(menuOpen === user.id ? null : user.id)}
                                                style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer' }}
                                                aria-haspopup="true"
                                                aria-expanded={menuOpen === user.id}
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                            {menuOpen === user.id && (
                                                <>
                                                    <div
                                                        style={{ position: 'fixed', inset: 0, zIndex: 10 }}
                                                        onClick={() => setMenuOpen(null)}
                                                        aria-hidden="true"
                                                    />
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            right: 0,
                                                            top: '100%',
                                                            marginTop: '4px',
                                                            background: 'var(--card)',
                                                            border: '1px solid var(--border)',
                                                            borderRadius: '8px',
                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                            minWidth: '200px',
                                                            zIndex: 20
                                                        }}
                                                    >
                                                        <button
                                                            onClick={() => openResetModal(user)}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.5rem',
                                                                width: '100%',
                                                                padding: '0.6rem 1rem',
                                                                background: 'none',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                color: 'var(--foreground)',
                                                                fontSize: '0.875rem',
                                                                textAlign: 'left'
                                                            }}
                                                        >
                                                            <KeyRound size={16} /> Réinitialiser le mot de passe
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {resetModal && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 50
                    }}
                    onClick={closeResetModal}
                >
                    <div
                        className="card"
                        style={{ minWidth: '360px', maxWidth: '90%' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Réinitialiser le mot de passe</h2>
                            <button onClick={closeResetModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                            Nouveau mot de passe pour <strong>{resetModal.name}</strong> ({resetModal.email})
                        </p>
                        {resetError && (
                            <p style={{ color: 'var(--destructive)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{resetError}</p>
                        )}
                        {resetSuccess && (
                            <p style={{ color: '#22c55e', fontSize: '0.875rem', marginBottom: '0.75rem' }}>Mot de passe réinitialisé avec succès.</p>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                            <input
                                type="password"
                                placeholder="Nouveau mot de passe (min. 6 caractères)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{
                                    padding: '0.5rem 0.75rem',
                                    border: '1px solid var(--border)',
                                    borderRadius: '6px',
                                    background: 'var(--background)',
                                    color: 'var(--foreground)'
                                }}
                                disabled={resetLoading}
                            />
                            <input
                                type="password"
                                placeholder="Confirmer le mot de passe"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{
                                    padding: '0.5rem 0.75rem',
                                    border: '1px solid var(--border)',
                                    borderRadius: '6px',
                                    background: 'var(--background)',
                                    color: 'var(--foreground)'
                                }}
                                disabled={resetLoading}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={closeResetModal}
                                style={{
                                    padding: '0.5rem 1rem',
                                    border: '1px solid var(--border)',
                                    borderRadius: '6px',
                                    background: 'var(--card)',
                                    color: 'var(--foreground)',
                                    cursor: 'pointer'
                                }}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleResetPassword}
                                disabled={resetLoading}
                                style={{
                                    padding: '0.5rem 1rem',
                                    border: 'none',
                                    borderRadius: '6px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    cursor: resetLoading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {resetLoading ? 'En cours...' : 'Réinitialiser'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
