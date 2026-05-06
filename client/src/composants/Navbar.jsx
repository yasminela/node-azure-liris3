import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSun, 
  faMoon, 
  faCamera,
  faTrashAlt,
  faSignOutAlt,
  faBars,
  faTimes,
  faChevronDown,
  faChevronUp,
  faBell,
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

function Navbar({ user, onLogout }) {
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsMenuOpen, setNotificationsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [uploading, setUploading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const profileMenuRef = useRef(null);
  const notificationsMenuRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadUserProfile();
    loadNotifications();
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    const interval = setInterval(loadNotifications, 30000);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
      if (notificationsMenuRef.current && !notificationsMenuRef.current.contains(event.target)) {
        setNotificationsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
    setNotificationsMenuOpen(false);
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

  const loadNotifications = async () => {
    try {
      const res = await api.get('/notifications/mes-notifications');
      const notifs = res.data || [];
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.estLue).length);
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    }
  };

  const marquerCommeLue = async (id) => {
    try {
      await api.put(`/notifications/${id}/lire`);
      setNotifications(prev => prev.map(n => 
        n._id === id ? { ...n, estLue: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const marquerToutCommeLu = async () => {
    try {
      await api.put('/notifications/marquer-tout-lu');
      setNotifications(prev => prev.map(n => ({ ...n, estLue: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onLogout) onLogout();
    navigate('/login');
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

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'succes': return '✅';
      case 'warning': return '⚠️';
      case 'erreur': return '❌';
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return notifDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
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
      transition: 'all 0.3s ease',
      borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
      boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.1)' : 'none'
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
    logo: {
      height: '36px',
      width: '36px',
      objectFit: 'contain'
    },
    logoFallback: {
      width: '36px',
      height: '36px',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    logoText: {
      margin: 0,
      fontSize: '20px',
      fontWeight: 'bold',
      color: darkMode ? '#f1f5f9' : '#667eea'
    },
    desktopMenu: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    themeBtn: {
      background: darkMode ? '#334155' : '#f1f5f9',
      color: darkMode ? '#f1f5f9' : '#475569',
      padding: '8px 12px',
      borderRadius: '10px',
      cursor: 'pointer',
      border: 'none',
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      transition: 'all 0.3s ease'
    },
    notificationContainer: { position: 'relative' },
    notificationPanel: {
      position: 'absolute',
      top: '50px',
      right: '0',
      width: '400px',
      maxWidth: 'calc(100vw - 20px)',
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      zIndex: 100,
      overflow: 'hidden',
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
    },
    notificationHeader: {
      padding: '16px 20px',
      background: darkMode ? '#0f172a' : '#f8fafc',
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    notificationTitle: {
      fontWeight: 'bold',
      fontSize: '16px',
      color: darkMode ? '#ffffff' : '#1e293b'
    },
    markAllRead: {
      background: 'none',
      border: 'none',
      color: '#667eea',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '500',
      padding: '4px 8px',
      borderRadius: '6px',
      transition: 'all 0.2s'
    },
    notificationList: {
      maxHeight: '450px',
      overflowY: 'auto'
    },
    notificationItem: (estLue) => ({
      padding: '14px 20px',
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      background: estLue ? 'transparent' : (darkMode ? 'rgba(147, 51, 234, 0.1)' : 'rgba(147, 51, 234, 0.05)'),
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }),
    notificationItemContent: {
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start'
    },
    notificationIcon: {
      fontSize: '20px',
      minWidth: '32px',
      textAlign: 'center'
    },
    notificationText: {
      flex: 1,
      wordBreak: 'break-word'
    },
    notificationMessage: {
      fontSize: '13px',
      color: darkMode ? '#e2e8f0' : '#334155',
      marginBottom: '6px',
      lineHeight: '1.4'
    },
    notificationDate: {
      fontSize: '10px',
      color: darkMode ? '#64748b' : '#94a3b8',
      marginTop: '4px'
    },
    emptyNotifications: {
      textAlign: 'center',
      padding: '40px 20px',
      color: darkMode ? '#94a3b8' : '#64748b'
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
      transition: 'all 0.3s ease'
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
      transition: 'all 0.3s ease',
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
      zIndex: 999
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
      gap: '16px'
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
      color: darkMode ? '#f1f5f9' : '#1e293b'
    },
    mobileNotificationBadge: {
      background: '#ef4444',
      color: 'white',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      fontSize: '11px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: '8px'
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '22px',
      cursor: 'pointer',
      color: darkMode ? '#f1f5f9' : '#475569'
    }
  };

  const avatarUrl = getAvatarUrl();
  const hasAvatar = !!avatarUrl;
  const [logoError, setLogoError] = useState(false);

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <div style={styles.logoContainer} onClick={() => navigate('/')}>
            {!logoError ? (
              <img 
                src="/logo-incubiny.png" 
                alt="Incubiny" 
                style={styles.logo}
                onError={() => setLogoError(true)}
              />
            ) : (
              <div style={styles.logoFallback}>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>I</span>
              </div>
            )}
            <h2 style={styles.logoText}>Incubiny</h2>
          </div>

          <div style={styles.desktopMenu}>
            <button className="btn-shine" onClick={toggleDarkMode} style={styles.themeBtn}>
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            </button>

            {/* NOTIFICATIONS AVEC COMPTEUR VISIBLE */}
            <div style={styles.notificationContainer}>
              <button 
                className="btn-shine" 
                style={{
                  position: 'relative',
                  background: unreadCount > 0 
                    ? (darkMode ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.15)')
                    : (darkMode ? '#334155' : '#f1f5f9'),
                  border: unreadCount > 0 ? `2px solid #f59e0b` : 'none',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }} 
                onClick={() => setNotificationsMenuOpen(!notificationsMenuOpen)}
              >
                <FontAwesomeIcon 
                  icon={faBell} 
                  size="lg"
                  style={{ 
                    color: unreadCount > 0 ? '#f59e0b' : (darkMode ? '#94a3b8' : '#64748b'),
                    transition: 'all 0.3s ease',
                    animation: unreadCount > 0 ? 'bellShake 0.5s ease-in-out' : 'none'
                  }} 
                />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    minWidth: '24px',
                    height: '24px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    fontFamily: 'monospace',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 6px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3), 0 0 0 2px ' + (darkMode ? '#1e293b' : 'white'),
                    zIndex: 10,
                    letterSpacing: '0.5px'
                  }}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {notificationsMenuOpen && (
                <div style={styles.notificationPanel}>
                  <div style={styles.notificationHeader}>
                    <span style={styles.notificationTitle}>
                      <FontAwesomeIcon icon={faBell} style={{ marginRight: '8px', fontSize: '14px', color: unreadCount > 0 ? '#f59e0b' : '#667eea' }} />
                      Notifications
                      {unreadCount > 0 && (
                        <span style={{ 
                          marginLeft: '8px', 
                          fontSize: '12px', 
                          fontWeight: 'bold',
                          color: 'white',
                          background: '#ef4444',
                          padding: '2px 10px',
                          borderRadius: '20px',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }}>
                          {unreadCount}
                        </span>
                      )}
                    </span>
                    {unreadCount > 0 && (
                      <button 
                        style={styles.markAllRead} 
                        onClick={marquerToutCommeLu}
                        onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? '#334155' : '#e2e8f0'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                      >
                        Tout marquer comme lu
                      </button>
                    )}
                  </div>
                  <div style={styles.notificationList}>
                    {notifications.length === 0 ? (
                      <div style={styles.emptyNotifications}>
                        <FontAwesomeIcon icon={faBell} size="2x" style={{ opacity: 0.3, marginBottom: '12px' }} />
                        <p>Aucune notification</p>
                        <p style={{ fontSize: '11px', marginTop: '8px' }}>Vous serez notifié des mises à jour importantes</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif._id} 
                          style={styles.notificationItem(notif.estLue)}
                          onClick={() => marquerCommeLue(notif._id)}
                        >
                          <div style={styles.notificationItemContent}>
                            <div style={styles.notificationIcon}>
                              {getNotificationIcon(notif.type)}
                            </div>
                            <div style={styles.notificationText}>
                              <div style={styles.notificationMessage}>
                                {notif.message}
                              </div>
                              <div style={styles.notificationDate}>
                                {formatDate(notif.createdAt)}
                              </div>
                            </div>
                            {!notif.estLue && (
                              <div style={{
                                width: '10px',
                                height: '10px',
                                background: '#ef4444',
                                borderRadius: '50%',
                                marginTop: '8px',
                                flexShrink: 0,
                                boxShadow: '0 0 0 2px ' + (darkMode ? '#1e293b' : 'white')
                              }} />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div style={styles.profileContainer} ref={profileMenuRef}>
              <button className="btn-shine" style={styles.profileBtn} onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
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
                  <div className="btn-shine" style={styles.menuItem} onClick={handleChangePhoto}>
                    <FontAwesomeIcon icon={faCamera} />
                    Changer la photo
                  </div>
                  
                  {hasAvatar && (
                    <div className="btn-shine" style={styles.menuItem} onClick={handleDeletePhoto}>
                      <FontAwesomeIcon icon={faTrashAlt} />
                      Supprimer la photo
                    </div>
                  )}
                  
                  <div style={styles.menuDivider} />
                  
                  <div className="btn-shine" style={{ ...styles.menuItem, ...styles.dangerItem }} onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Déconnexion
                  </div>
                </div>
              )}
            </div>
          </div>

          <button className="btn-shine" onClick={() => setMobileMenuOpen(true)} style={styles.mobileMenuBtn}>
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
              <button onClick={() => setMobileMenuOpen(false)} style={styles.closeBtn}>
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
            
            <div className="btn-shine" style={styles.mobileMenuItem} onClick={() => {
              setMobileMenuOpen(false);
              setNotificationsMenuOpen(true);
            }}>
              <FontAwesomeIcon icon={faBell} /> Notifications
              {unreadCount > 0 && <span style={styles.mobileNotificationBadge}>{unreadCount}</span>}
            </div>
            
            <div className="btn-shine" style={styles.mobileMenuItem} onClick={handleChangePhoto}>
              <FontAwesomeIcon icon={faCamera} /> Changer la photo
            </div>
            {hasAvatar && (
              <div className="btn-shine" style={styles.mobileMenuItem} onClick={handleDeletePhoto}>
                <FontAwesomeIcon icon={faTrashAlt} /> Supprimer la photo
              </div>
            )}
            <div className="btn-shine" style={styles.mobileMenuItem} onClick={toggleDarkMode}>
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} /> {darkMode ? 'Mode clair' : 'Mode sombre'}
            </div>
            <div className="btn-shine" style={{ ...styles.mobileMenuItem, marginTop: 'auto', color: '#ef4444' }} onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Déconnexion
            </div>
          </div>
        </>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          .btn-shine {
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
          }
          .btn-shine::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s ease;
          }
          .btn-shine:hover::before {
            left: 100%;
          }
          .btn-shine:hover {
            transform: translateY(-2px);
          }
          @keyframes bellShake {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(15deg); }
            50% { transform: rotate(-15deg); }
            75% { transform: rotate(5deg); }
            100% { transform: rotate(0deg); }
          }
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