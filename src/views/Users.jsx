import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Mail, Phone } from 'lucide-react';
import { fetchUsers } from '../services/api';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Tous');

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
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</td></tr>
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

export default Users;
