import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import NotificationPopup from './NotificationPopup';
import AvatarManager from './AvatarManager';
import api from '../utils/api';

function Navbar({ user, onLogout }) {
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadUserProfile();
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [location]);

  const loadUserProfile = async () => {
    try {
      const res = await api.get('/utilisateurs/me');
      setCurrentUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleAvatarUpdate = (newAvatar) => {
    setCurrentUser(prev => ({ ...prev, avatar: newAvatar }));
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    storedUser.avatar = newAvatar;
    localStorage.setItem('user', JSON.stringify(storedUser));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onLogout) onLogout();
    navigate('/login');
  };

  const handleDashboardClick = () => {
    navigate('/');
    setProfileMenuOpen(false);
  };

  const styles = {
    nav: {
      background: scrolled 
        ? (darkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)')
        : (darkMode ? '#1e293b' : 'white'),
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      padding: scrolled ? '10px 20px' : '14px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      transition: 'all 0.3s ease'
    },
    navContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer'
    },
    logo: { height: '36px', width: '36px', objectFit: 'contain' },
    logoText: {
      color: darkMode ? '#f1f5f9' : '#667eea',
      margin: 0,
      fontSize: '20px',
      fontWeight: 'bold'
    },
    desktopMenu: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    dashboardBtn: {
      background: 'none',
      color: darkMode ? '#cbd5e1' : '#475569',
      padding: '8px 12px',
      borderRadius: '8px',
      cursor: 'pointer',
      border: 'none',
      fontSize: '14px',
      fontWeight: '500'
    },
    profileContainer: { position: 'relative' },
    profileBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '4px 12px',
      borderRadius: '30px',
      background: darkMode ? '#334155' : '#f1f5f9',
      cursor: 'pointer',
      border: 'none'
    },
    userInfo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginLeft: '8px'
    },
    userName: {
      fontSize: '13px',
      fontWeight: 'bold',
      color: darkMode ? '#f1f5f9' : '#1e293b'
    },
    userRole: {
      fontSize: '10px',
      color: darkMode ? '#94a3b8' : '#64748b'
    },
    chevron: {
      fontSize: '12px',
      color: darkMode ? '#94a3b8' : '#64748b',
      marginLeft: '8px'
    },
    profileMenu: {
      position: 'absolute',
      top: '50px',
      right: '0',
      width: '260px',
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      zIndex: 100,
      overflow: 'hidden',
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
    },
    menuHeader: {
      padding: '16px',
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    menuHeaderInfo: { flex: 1 },
    menuHeaderName: { fontWeight: 'bold', color: darkMode ? '#f1f5f9' : '#1e293b' },
    menuHeaderEmail: { fontSize: '11px', color: darkMode ? '#94a3b8' : '#64748b' },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      cursor: 'pointer',
      transition: 'background 0.2s',
      color: darkMode ? '#f1f5f9' : '#1e293b',
      fontSize: '14px'
    },
    menuDivider: {
      height: '1px',
      background: darkMode ? '#334155' : '#e2e8f0',
      margin: '8px 0'
    },
    logoutItem: { color: '#ef4444' },
    mobileMenuBtn: {
      display: 'none',
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: darkMode ? '#f1f5f9' : '#475569'
    },
    mobileMenu: {
      position: 'fixed',
      top: 0,
      right: 0,
      width: '280px',
      height: '100vh',
      background: darkMode ? '#1e293b' : 'white',
      zIndex: 1000,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      animation: 'slideIn 0.3s ease'
    },
    mobileMenuOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 999
    }
  };

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <div style={styles.logoContainer} onClick={handleDashboardClick}>
            <img src="/logo-incubiny.png" alt="Incubiny" style={styles.logo} />
            <h2 style={styles.logoText}>Incubiny</h2>
          </div>

          <div style={styles.desktopMenu}>
            <button onClick={handleDashboardClick} style={styles.dashboardBtn}>📊 Dashboard</button>
            <NotificationPopup />
            <button onClick={toggleDarkMode} style={styles.dashboardBtn}>{darkMode ? '☀️' : '🌙'}</button>

            <div style={styles.profileContainer} ref={profileMenuRef}>
              <button style={styles.profileBtn} onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
                <AvatarManager user={currentUser} onAvatarUpdate={handleAvatarUpdate} size="small" />
                <div style={styles.userInfo}>
                  <span style={styles.userName}>{currentUser?.firstName || 'User'}</span>
                  <span style={styles.userRole}>{currentUser?.role === 'admin' ? 'Admin' : 'Porteur'}</span>
                </div>
                <span style={styles.chevron}>{profileMenuOpen ? '▲' : '▼'}</span>
              </button>

              {profileMenuOpen && (
                <div style={styles.profileMenu}>
                  <div style={styles.menuHeader}>
                    <AvatarManager user={currentUser} onAvatarUpdate={handleAvatarUpdate} size="medium" />
                    <div style={styles.menuHeaderInfo}>
                      <div style={styles.menuHeaderName}>{currentUser?.firstName} {currentUser?.lastName}</div>
                      <div style={styles.menuHeaderEmail}>{currentUser?.email}</div>
                    </div>
                  </div>
                  <div style={styles.menuDivider} />
                  <div style={styles.menuItem}>
                    <span>👤</span> Mon profil
                  </div>
                  <div style={styles.menuItem}>
                    <span>📷</span> Changer la photo
                    <input type="file" accept="image/*" style={{ display: 'none' }} id="avatar-upload" onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleAvatarUpload(file);
                    }} />
                  </div>
                  <div style={styles.menuDivider} />
                  <div style={{ ...styles.menuItem, ...styles.logoutItem }} onClick={handleLogout}>
                    <span>🚪</span> Déconnexion
                  </div>
                </div>
              )}
            </div>
          </div>

          <button onClick={() => setMobileMenuOpen(true)} style={styles.mobileMenuBtn}>☰</button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <>
          <div style={styles.mobileMenuOverlay} onClick={() => setMobileMenuOpen(false)} />
          <div style={styles.mobileMenu}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <img src="/logo-incubiny.png" alt="Logo" style={{ height: '32px' }} />
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: darkMode ? '#f1f5f9' : '#1e293b' }}>✕</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: darkMode ? '#334155' : '#f1f5f9', borderRadius: '12px' }}>
              <AvatarManager user={currentUser} onAvatarUpdate={handleAvatarUpdate} size="medium" />
              <div>
                <div style={{ fontWeight: 'bold' }}>{currentUser?.firstName} {currentUser?.lastName}</div>
                <div style={{ fontSize: '11px', opacity: 0.7 }}>{currentUser?.email}</div>
              </div>
            </div>
            <div style={styles.menuItem} onClick={handleDashboardClick}>📊 Dashboard</div>
            <div style={styles.menuItem} onClick={toggleDarkMode}>{darkMode ? '☀️ Mode clair' : '🌙 Mode sombre'}</div>
            <div style={{ ...styles.menuItem, marginTop: 'auto', color: '#ef4444' }} onClick={handleLogout}>🚪 Déconnexion</div>
          </div>
        </>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
          @media (max-width: 768px) { .desktop-menu { display: none !important; } }
        `
      }} />
    </>
  );
}

export default Navbar;