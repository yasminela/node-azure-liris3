import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell, 
  faEnvelope, 
  faCheckCircle, 
  faTimesCircle, 
  faInfoCircle,
  faExclamationTriangle,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

function NotificationPopup() {
  const { darkMode } = useTheme();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setShow(false);
  }, [location]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications/mes-notifications');
      setNotifications(res.data || []);
      const unread = (res.data || []).filter(n => !n.estLue).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'success':
        return <FontAwesomeIcon icon={faCheckCircle} color="#10b981" />;
      case 'error':
        return <FontAwesomeIcon icon={faTimesCircle} color="#ef4444" />;
      case 'warning':
        return <FontAwesomeIcon icon={faExclamationTriangle} color="#f59e0b" />;
      case 'info':
        return <FontAwesomeIcon icon={faInfoCircle} color="#3b82f6" />;
      default:
        return <FontAwesomeIcon icon={faEnvelope} color="#667eea" />;
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/lire`);
      loadNotifications();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/tout-lire');
      loadNotifications();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const styles = {
    container: { position: 'relative', display: 'inline-block' },
    bellBtn: {
      background: darkMode ? '#334155' : '#f1f5f9',
      border: 'none',
      cursor: 'pointer',
      position: 'relative',
      padding: '8px 12px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '500',
      color: darkMode ? '#f1f5f9' : '#475569',
      transition: 'all 0.3s ease'
    },
    badge: {
      position: 'absolute',
      top: '-5px',
      right: '-5px',
      background: '#ef4444',
      color: 'white',
      borderRadius: '50%',
      padding: '2px 6px',
      fontSize: '10px',
      fontWeight: 'bold',
      minWidth: '16px',
      textAlign: 'center'
    },
    panel: {
      position: 'absolute',
      top: '45px',
      right: '0',
      width: '380px',
      maxHeight: '450px',
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      zIndex: 1001,
      overflow: 'hidden',
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
    },
    panelHeader: {
      padding: '15px',
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      background: darkMode ? '#0f172a' : '#f7fafc',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    panelTitle: {
      fontWeight: 'bold',
      color: darkMode ? '#f1f5f9' : '#1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    toutLireBtn: {
      background: 'none',
      border: 'none',
      color: '#667eea',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '500'
    },
    notificationList: {
      maxHeight: '380px',
      overflowY: 'auto'
    },
    notificationItem: (isRead) => ({
      padding: '15px',
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      cursor: 'pointer',
      background: isRead ? (darkMode ? '#1e293b' : 'white') : (darkMode ? '#334155' : '#e0e7ff'),
      transition: 'background 0.2s ease'
    }),
    notificationTitle: {
      fontWeight: 'bold',
      marginBottom: '5px',
      color: darkMode ? '#f1f5f9' : '#1e293b',
      fontSize: '13px'
    },
    notificationMessage: {
      fontSize: '12px',
      color: darkMode ? '#cbd5e1' : '#475569',
      marginBottom: '5px'
    },
    notificationDate: {
      fontSize: '10px',
      color: darkMode ? '#94a3b8' : '#999',
      marginTop: '5px'
    },
    emptyState: {
      padding: '40px',
      textAlign: 'center',
      color: darkMode ? '#94a3b8' : '#999'
    }
  };

  return (
    <div style={styles.container}>
      <button className="btn-shine" onClick={() => setShow(!show)} style={styles.bellBtn}>
        <FontAwesomeIcon icon={faBell} />
        <span>Notifications</span>
        {unreadCount > 0 && <span style={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {show && (
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div style={styles.panelTitle}>
              <FontAwesomeIcon icon={faBell} />
              Notifications ({unreadCount} non lues)
            </div>
            {unreadCount > 0 && (
              <button style={styles.toutLireBtn} onClick={markAllAsRead}>
                Tout marquer comme lu
              </button>
            )}
          </div>
          <div style={styles.notificationList}>
            {loading ? (
              <div style={styles.emptyState}>
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p>Chargement...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div style={styles.emptyState}>
                <FontAwesomeIcon icon={faBell} size="2x" />
                <p>Aucune notification</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif._id}
                  style={styles.notificationItem(notif.estLue)}
                  onClick={() => markAsRead(notif._id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    {getTypeIcon(notif.type)}
                    <span style={styles.notificationTitle}>{notif.titre}</span>
                  </div>
                  <div style={styles.notificationMessage}>{notif.message}</div>
                  <div style={styles.notificationDate}>
                    {new Date(notif.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationPopup;