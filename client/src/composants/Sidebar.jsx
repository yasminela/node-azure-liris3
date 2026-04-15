import React from 'react';
import Icon from './Icon';

function Sidebar({ activeTab, onTabChange }) {
  const menuItems = [
  { id: 'dashboard', name: 'Tableau de bord', icon: 'dashboard_panel' },
  { id: 'events', name: 'Événements', icon: 'calendar_ar_bold' },
  { id: 'documents', name: 'Documents', icon: 'folder_open' },
  { id: 'users', name: 'Utilisateurs', icon: 'group' },
  { id: 'notifications', name: 'Notifications', icon: 'notification_bell_ranging' },
  { id: 'settings', name: 'Paramètres', icon: 'settings' }
];

  return (
    <div style={{
      width: '250px',
      background: 'white',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 70,
      boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
      padding: '20px 0'
    }}>
      {menuItems.map(item => (
        <div
          key={item.id}
          onClick={() => onTabChange(item.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 20px',
            cursor: 'pointer',
            background: activeTab === item.id ? '#667eea' : 'transparent',
            color: activeTab === item.id ? 'white' : '#333',
            transition: 'all 0.2s'
          }}
        >
          <Icon name={item.icon} size={20} color={activeTab === item.id ? 'white' : '#667eea'} />
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;