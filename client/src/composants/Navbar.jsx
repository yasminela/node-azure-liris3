import React from 'react';
import NotificationPopup from './NotificationPopup';
import Icon from './Icon';
import { iconColors } from '../styles/iconColors';

function Navbar({ user, onLogout }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onLogout) onLogout();
    window.location.href = '/login';
  };

  const styles = {
    navbar: {
      background: iconColors.white,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logo: { display: 'flex', alignItems: 'center', gap: '15px' },
    logoText: { color: iconColors.primary, margin: 0, fontSize: '22px' },
    rightSection: { display: 'flex', alignItems: 'center', gap: '20px' },
    userInfo: { display: 'flex', alignItems: 'center', gap: '8px' },
    userEmail: { color: iconColors.gray },
    logoutBtn: {
      background: iconColors.danger,
      color: iconColors.white,
      border: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <img src="/logo-incubiny.png" alt="Incubiny" style={{ height: '40px' }} />
        <h2 style={styles.logoText}>Incubiny</h2>
      </div>
      <div style={styles.rightSection}>
        <NotificationPopup />
        <div style={styles.userInfo}>
          <Icon name="user" size={20} color={iconColors.primary} />
          <span style={styles.userEmail}>{user?.email}</span>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <Icon name="logout" size={16} color={iconColors.white} />
          Déconnexion
        </button>
      </div>
    </nav>
  );
}

export default Navbar;