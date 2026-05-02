import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { useLocation } from 'react-router-dom';

function NotificationPopup() {
  const { darkMode } = useTheme();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setShow(false);
  }, [location]);

  const loadNotifications = async () => {
    try {
      const res = await api.get('/notifications/mes-notifications');
      setNotifications(res.data || []);
      const unread = (res.data || []).filter(n => !n.estLue).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Erreur:', error);
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
      gap: '6px',
      fontSize: '14px',
      fontWeight: '500',
      color: darkMode ? '#f1f5f9' : '#475569'
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
      fontWeight: 'bold'
    },
    panel: {
      position: 'absolute',
      top: '45px',
      right: '0',
      width: '320px',
      maxHeight: '400px',
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      zIndex: 1001,
      overflow: 'hidden',
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
    },
    panelHeader: {
      padding: '12px 15px',
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      background: darkMode ? '#0f172a' : '#f7fafc',
      fontWeight: 'bold',
      color: darkMode ? '#f1f5f9' : '#1e293b'
    },
    notificationList: {
      maxHeight: '350px',
      overflowY: 'auto'
    },
    notificationItem: (isRead) => ({
      padding: '12px 15px',
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      cursor: 'pointer',
      background: isRead ? (darkMode ? '#1e293b' : 'white') : (darkMode ? '#334155' : '#e0e7ff'),
      color: darkMode ? '#cbd5e1' : '#333'
    }),
    emptyState: {
      padding: '30px',
      textAlign: 'center',
      color: darkMode ? '#94a3b8' : '#999'
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={() => setShow(!show)} style={styles.bellBtn}>
        🔔
        {unreadCount > 0 && <span style={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>}
        <span>Notif</span>
      </button>

      {show && (
        <div style={styles.panel}>
          <div style={styles.panelHeader}>🔔 Notifications ({unreadCount} non lues)</div>
          <div style={styles.notificationList}>
            {notifications.length === 0 ? (
              <div style={styles.emptyState}>Aucune notification</div>
            ) : (
              notifications.map(notif => (
                <div key={notif._id} style={styles.notificationItem(notif.estLue)} onClick={() => markAsRead(notif._id)}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{notif.titre}</div>
                  <div style={{ fontSize: '12px' }}>{notif.message}</div>
                  <div style={{ fontSize: '10px', marginTop: '5px', opacity: 0.7 }}>{new Date(notif.createdAt).toLocaleString()}</div>
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