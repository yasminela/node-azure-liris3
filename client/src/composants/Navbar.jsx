import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import NotificationPopup from './NotificationPopup';
import api from '../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faSun, 
  faMoon, 
  faCamera,
  faTrashAlt,
  faSignOutAlt,
  faBars,
  faTimes,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';

function Navbar({ user, onLogout }) {
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [uploading, setUploading] = useState(false);
  const profileMenuRef = useRef(null);
  const fileInputRef = useRef(null);
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
      console.error('Erreur chargement profil:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onLogout) onLogout();
    window.location.href = '/login';
  };

  // SOLUTION : Utiliser window.location.href au lieu de navigate
  const handleDashboardClick = () => {
    console.log('Dashboard clicked - redirecting to /');
    window.location.href = '/';
  };

  const handleChangePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    setProfileMenuOpen(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('❌ Veuillez sélectionner une image');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('❌ L\'image ne doit pas dépasser 2 Mo');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await api.put('/utilisateurs/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCurrentUser(prev => ({ ...prev, avatar: res.data.avatar }));
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      storedUser.avatar = res.data.avatar;
      localStorage.setItem('user', JSON.stringify(storedUser));
      alert('✅ Photo mise à jour !');
    } catch (error) {
      alert('❌ Erreur lors de l\'upload');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeletePhoto = async () => {
    if (!confirm('⚠️ Supprimer votre photo ?')) return;

    setUploading(true);
    try {
      await api.delete('/utilisateurs/avatar');
      setCurrentUser(prev => ({ ...prev, avatar: null }));
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      storedUser.avatar = null;
      localStorage.setItem('user', JSON.stringify(storedUser));
      alert('✅ Photo supprimée');
    } catch (error) {
      alert('❌ Erreur lors de la suppression');
    } finally {
      setUploading(false);
      setProfileMenuOpen(false);
    }
  };

  const getInitials = () => {
    if (currentUser?.firstName && currentUser?.lastName) {
      return `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase();
    }
    if (currentUser?.firstName) return currentUser.firstName[0].toUpperCase();
    if (currentUser?.email) return currentUser.email[0].toUpperCase();
    return 'U';
  };

  const getAvatarUrl = () => {
    if (currentUser?.avatar) {
      if (currentUser.avatar.startsWith('http')) return currentUser.avatar;
      return `http://localhost:5001${currentUser.avatar}`;
    }
    return null;
  };

  const isActive = (path) => location.pathname === path;

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
      background: isActive('/') ? '#667eea' : 'transparent',
      color: isActive('/') ? 'white' : (darkMode ? '#cbd5e1' : '#475569'),
      padding: '8px 16px',
      borderRadius: '10px',
      cursor: 'pointer',
      border: 'none',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s ease'
    },
    themeBtn: {
      background: 'none',
      color: darkMode ? '#f1f5f9' : '#475569',
      padding: '8px 12px',
      borderRadius: '10px',
      cursor: 'pointer',
      border: 'none',
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center'
    },
    profileContainer: { position: 'relative' },
    profileBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '4px 12px',
      borderRadius: '40px',
      background: darkMode ? '#334155' : '#f1f5f9',
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.2s ease'
    },
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: `2px solid ${darkMode ? '#475569' : '#cbd5e1'}`
    },
    avatarPlaceholder: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '14px'
    },
    userName: {
      fontSize: '13px',
      fontWeight: '500',
      color: darkMode ? '#f1f5f9' : '#1e293b'
    },
    profileMenu: {
      position: 'absolute',
      top: '50px',
      right: '0',
      width: '220px',
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      zIndex: 100,
      overflow: 'hidden',
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      cursor: 'pointer',
      transition: 'background 0.2s ease',
      color: darkMode ? '#f1f5f9' : '#1e293b',
      fontSize: '14px'
    },
    menuDivider: {
      height: '1px',
      background: darkMode ? '#334155' : '#e2e8f0',
      margin: '4px 0'
    },
    dangerItem: { color: '#ef4444' },
    mobileMenuBtn: {
      display: 'none',
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: darkMode ? '#f1f5f9' : '#475569'
    },
    mobileMenuOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 999,
      animation: 'fadeIn 0.3s ease'
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
    mobileMenuHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: '16px',
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
    },
    mobileMenuItem: {
      padding: '12px 16px',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '500',
      color: darkMode ? '#f1f5f9' : '#1e293b',
      transition: 'background 0.2s ease'
    }
  };

  const avatarUrl = getAvatarUrl();
  const hasAvatar = !!avatarUrl;

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <div style={styles.logoContainer} onClick={handleDashboardClick}>
            <img src="/logo-incubiny.png" alt="Incubiny" style={styles.logo} />
            <h2 style={styles.logoText}>Incubiny</h2>
          </div>

          <div style={styles.desktopMenu}>
            <button onClick={handleDashboardClick} style={styles.dashboardBtn}>
              <FontAwesomeIcon icon={faTachometerAlt} />
              Dashboard
            </button>

            <NotificationPopup />

            <button onClick={toggleDarkMode} style={styles.themeBtn}>
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            </button>

            <div style={styles.profileContainer} ref={profileMenuRef}>
              <button style={styles.profileBtn} onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
                {hasAvatar ? (
                  <img src={avatarUrl} alt="Avatar" style={styles.avatar} />
                ) : (
                  <div style={styles.avatarPlaceholder}>{getInitials()}</div>
                )}
                <span style={styles.userName}>{currentUser?.firstName || 'User'}</span>
                <FontAwesomeIcon icon={profileMenuOpen ? faChevronUp : faChevronDown} style={{ fontSize: '12px' }} />
              </button>

              {profileMenuOpen && (
                <div style={styles.profileMenu}>
                  <div style={styles.menuItem} onClick={handleChangePhoto}>
                    <FontAwesomeIcon icon={faCamera} />
                    Changer la photo
                  </div>
                  
                  {hasAvatar && (
                    <div style={styles.menuItem} onClick={handleDeletePhoto}>
                      <FontAwesomeIcon icon={faTrashAlt} />
                      Supprimer la photo
                    </div>
                  )}
                  
                  <div style={styles.menuDivider} />
                  
                  <div style={{ ...styles.menuItem, ...styles.dangerItem }} onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Déconnexion
                  </div>
                </div>
              )}
            </div>
          </div>

          <button onClick={() => setMobileMenuOpen(true)} style={styles.mobileMenuBtn}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </nav>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileChange}
      />

      {mobileMenuOpen && (
        <>
          <div style={styles.mobileMenuOverlay} onClick={() => setMobileMenuOpen(false)} />
          <div style={styles.mobileMenu}>
            <div style={styles.mobileMenuHeader}>
              <img src="/logo-incubiny.png" alt="Logo" style={{ height: '32px' }} />
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div style={{ ...styles.mobileMenuItem, display: 'flex', alignItems: 'center', gap: '12px', background: darkMode ? '#334155' : '#f1f5f9' }}>
              {hasAvatar ? (
                <img src={avatarUrl} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              ) : (
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>{getInitials()}</div>
              )}
              <div>
                <div style={{ fontWeight: 'bold' }}>{currentUser?.firstName} {currentUser?.lastName}</div>
                <div style={{ fontSize: '11px', opacity: 0.7 }}>{currentUser?.email}</div>
              </div>
            </div>
            
            <div style={styles.mobileMenuItem} onClick={handleDashboardClick}>
              <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
            </div>
            <div style={styles.mobileMenuItem} onClick={handleChangePhoto}>
              <FontAwesomeIcon icon={faCamera} /> Changer la photo
            </div>
            {hasAvatar && (
              <div style={styles.mobileMenuItem} onClick={handleDeletePhoto}>
                <FontAwesomeIcon icon={faTrashAlt} /> Supprimer la photo
              </div>
            )}
            <div style={styles.mobileMenuItem} onClick={toggleDarkMode}>
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} /> {darkMode ? 'Mode clair' : 'Mode sombre'}
            </div>
            <div style={{ ...styles.mobileMenuItem, marginTop: 'auto', color: '#ef4444' }} onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Déconnexion
            </div>
          </div>
        </>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @media (max-width: 768px) {
            .desktop-menu {
              display: none !important;
            }
          }
        `
      }} />
    </>
  );
}

export default Navbar;