import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Icon from './Icon';

function NotificationPopup() {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await api.get('/notifications/mes-notifications');
      setNotifications(res.data || []);
      const unread = (res.data || []).filter(n => !n.estLue).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
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
    for (const notif of notifications) {
      if (!notif.estLue) {
        await api.put(`/notifications/${notif._id}/lire`);
      }
    }
    loadNotifications();
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'succes': return <Icon name="check" size={18} color="#10b981" />;
      case 'erreur': return <Icon name="exclamation" size={18} color="#ef4444" />;
      case 'info': return <Icon name="comment_info" size={18} color="#3b82f6" />;
      default: return <Icon name="notification" size={18} color="#667eea" />;
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShow(!show)}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          padding: '8px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Icon name="notification_bell_ranging" size={24} color="#667eea" />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '0',
            right: '0',
            background: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '12px',
            minWidth: '18px'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {show && (
        <div style={{
          position: 'absolute',
          top: '50px',
          right: '0',
          width: '350px',
          maxHeight: '400px',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          zIndex: 1000,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '15px',
            background: '#667eea',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="notification_bell_ranging" size={18} color="white" />
              Notifications
            </h4>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          <div style={{ overflowY: 'auto', maxHeight: '350px' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#666' }}>
                <Icon name="no_notification" size={32} color="#ccc" />
                <p>Aucune notification</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif._id}
                  onClick={() => markAsRead(notif._id)}
                  style={{
                    padding: '12px 15px',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                    background: notif.estLue ? 'white' : '#f0f4ff',
                    transition: 'background 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{ marginTop: '2px' }}>{getTypeIcon(notif.type)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{notif.titre}</div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>{notif.message}</div>
                      <div style={{ fontSize: '10px', color: '#999' }}>{new Date(notif.createdAt).toLocaleString()}</div>
                    </div>
                    {!notif.estLue && <div style={{ width: '8px', height: '8px', background: '#667eea', borderRadius: '50%' }} />}
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