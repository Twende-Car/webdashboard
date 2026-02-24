import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, Clock, MapPin } from 'lucide-react';
import { fetchStats } from '../services/api';
import Loader from '../components/Loader';

const StatCard = ({ title, value, icon: Icon, trend, color, loading }) => (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>{title}</span>
            <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: `rgba(${color}, 0.1)`, color: `rgb(${color})` }}>
                <Icon size={20} />
            </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>{loading ? '...' : value}</span>
            {trend && <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>{trend}</span>}
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getStats = async () => {
            try {
                const data = await fetchStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };
        getStats();
    }, []);

    const chartData = [
        { name: 'Lun', gains: 400 },
        { name: 'Mar', gains: 300 },
        { name: 'Mer', gains: 900 },
        { name: 'Jeu', gains: 1200 },
        { name: 'Ven', gains: 1500 },
        { name: 'Sam', gains: 2100 },
        { name: 'Dim', gains: 1800 },
    ];

    if (loading && !stats) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <header>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '700' }}>Tableau de bord</h1>
                    <p style={{ color: 'var(--muted-foreground)' }}>Bienvenue sur le backoffice de DiVocab.</p>
                </header>
                <Loader label="Chargement des statistiques..." variant="block" />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header>
                <h1 style={{ fontSize: '1.875rem', fontWeight: '700' }}>Tableau de bord</h1>
                <p style={{ color: 'var(--muted-foreground)' }}>Bienvenue sur le backoffice de DiVocab.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <StatCard title="Utilisateurs" value={stats?.users?.total.toLocaleString()} icon={Users} loading={loading} color="59, 130, 246" />
                <StatCard title="Courses" value={stats?.rides?.total.toLocaleString()} icon={MapPin} loading={loading} color="168, 85, 247" />
                <StatCard title="Gains totaux" value={`${stats?.earnings?.toLocaleString() || 0} Fc`} icon={DollarSign} loading={loading} color="34, 197, 94" />
                <StatCard title="Courses terminées" value={stats?.rides?.completed.toLocaleString()} icon={Clock} loading={loading} color="234, 179, 8" />
            </div>

            <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Activité hebdomadaire</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorGains" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}Fc`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                            itemStyle={{ color: 'var(--primary)' }}
                        />
                        <Area type="monotone" dataKey="gains" stroke="var(--primary)" fillOpacity={1} fill="url(#colorGains)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;
