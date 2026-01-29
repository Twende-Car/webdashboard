import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import Dashboard from './views/Dashboard';
import Users from './views/Users';
import Drivers from './views/Drivers';
import Trips from './views/Trips';
import LiveMap from './views/LiveMap';
import VehiclePricing from './views/VehiclePricing';
import Login from './views/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { Search, Bell, User } from 'lucide-react';

function DashboardLayout({ activeTab, setActiveTab }) {
  const { user } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'users': return <Users />;
      case 'drivers': return <Drivers />;
      case 'trips': return <Trips />;
      case 'live-map': return <LiveMap />;
      case 'vehicle-pricing': return <VehiclePricing />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          padding: '1rem 0',
          borderBottom: '1px solid var(--border)'
        }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} size={18} />
            <input
              type="text"
              placeholder="Recherche globale..."
              style={{
                padding: '0.6rem 1rem 0.6rem 2.5rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--card)',
                color: 'var(--foreground)',
                width: '300px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', position: 'relative' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--destructive)' }}></span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.4rem 0.8rem', borderRadius: '9999px', background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', display: 'grid', placeItems: 'center' }}>
                <User size={14} color="white" />
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{user?.name || 'Admin'}</span>
            </div>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
