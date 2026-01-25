import { LayoutDashboard, Users, MapPin, Search as SearchIcon, LogOut, ChevronRight, TrendingUp, DollarSign, Clock, Truck } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'trips', label: 'Courses', icon: SearchIcon },
    { id: 'live-map', label: 'Carte en direct', icon: MapPin },
    { id: 'vehicle-pricing', label: 'Tarification', icon: Truck },
  ];

  return (
    <aside className="sidebar">
      <div style={{ paddingBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px', display: 'grid', placeItems: 'center' }}>
          <MapPin size={20} color="white" />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.025em' }}>DiVocab Admin</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius)',
              border: 'none',
              background: activeTab === item.id ? 'var(--primary)' : 'transparent',
              color: activeTab === item.id ? 'white' : 'var(--muted-foreground)',
              transition: 'all 0.2s ease',
              textAlign: 'left',
              fontWeight: '500'
            }}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius)',
            border: 'none',
            background: 'transparent',
            color: 'var(--destructive)',
            transition: 'all 0.2s ease',
            textAlign: 'left',
            fontWeight: '500'
          }}
        >
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
