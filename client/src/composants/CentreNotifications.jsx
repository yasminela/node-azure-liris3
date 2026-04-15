import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Icon from './Icon';
import { iconColors } from '../styles/iconColors';
import ValidationEtape from './ValidationEtape';

function CentreNotifications({ user }) {
  const [notificationsList, setNotificationsList] = useState([]);
  const [nonLues, setNonLues] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showValidation, setShowValidation] = useState(false);
  const [etapeToValidate, setEtapeToValidate] = useState(null);
  const [porteurInfo, setPorteurInfo] = useState(null);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await api.get('/notifications/mes-notifications');
      setNotificationsList(res.data || []);
      const unread = (res.data || []).filter(n => !n.estLue).length;
      setNonLues(unread);
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const marquerCommeLue = async (id) => {
    try {
      await api.put(`/notifications/${id}/lire`);
      loadNotifications();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const toutMarquerLu = async () => {
    try {
      for (const notif of notificationsList) {
        if (!notif.estLue) {
          await api.put(`/notifications/${notif._id}/lire`);
        }
      }
      loadNotifications();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const ouvrirValidationEtape = async (notif) => {
    if (notif.data?.etapeId) {
      try {
        const etapeRes = await api.get(`/etapes/${notif.data.etapeId}`);
        setEtapeToValidate(etapeRes.data);
        setPorteurInfo({
          firstName: notif.data?.porteurNom?.split(' ')[0] || 'Porteur',
          lastName: notif.data?.porteurNom?.split(' ')[1] || '',
          email: notif.data?.porteurEmail || ''
        });
        setShowValidation(true);
      } catch (err) {
        console.error('Erreur chargement étape:', err);
      }
      await marquerCommeLue(notif._id);
    }
  };
  
  // Retourne des icônes FontAwesome
  const getIconByType = (type) => {
    switch(type) {
      case 'tache':
        return <Icon name="task_checklist" size={20} color={iconColors.warning} />;
      case 'evenement':
        return <Icon name="calendar" size={20} color={iconColors.info} />;
      case 'validation':
        return <Icon name="check_st" size={20} color={iconColors.success} />;
      case 'refus':
        return <Icon name="times_circle" size={20} color={iconColors.danger} />;
      case 'document':
        return <Icon name="file" size={20} color={iconColors.primary} />;
      case 'succes':
        return <Icon name="check_st" size={20} color={iconColors.success} />;
      case 'erreur':
        return <Icon name="exclamation_circle" size={20} color={iconColors.danger} />;
      case 'info':
        return <Icon name="info_circle" size={20} color={iconColors.info} />;
      default:
        return <Icon name="notification" size={20} color={iconColors.primary} />;
    }
  };

  const styles = {
    container: { position: 'relative' },
    bellIcon: { 
      position: 'relative', 
      cursor: 'pointer', 
      padding: '8px',
      display: 'flex',
      alignItems: 'center'
    },
    badge: { 
      position: 'absolute', 
      top: '-5px', 
      right: '-10px', 
      background: iconColors.danger, 
      color: 'white', 
      borderRadius: '50%', 
      padding: '2px 6px', 
      fontSize: '10px', 
      fontWeight: 'bold', 
      minWidth: '18px', 
      textAlign: 'center' 
    },
    panel: { 
      position: 'absolute', 
      top: '45px', 
      right: '0', 
      width: '380px', 
      maxHeight: '500px', 
      background: 'white', 
      borderRadius: '15px', 
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)', 
      zIndex: 1000, 
      overflow: 'hidden' 
    },
    panelHeader: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '15px', 
      borderBottom: '1px solid #e2e8f0', 
      background: iconColors.grayBg 
    },
    toutLireBtn: { 
      background: 'none', 
      border: 'none', 
      color: iconColors.primary, 
      cursor: 'pointer', 
      fontSize: '12px' 
    },
    notificationList: { maxHeight: '400px', overflowY: 'auto' },
    notificationItem: { 
      padding: '15px', 
      borderBottom: '1px solid #e2e8f0', 
      cursor: 'pointer', 
      transition: 'background 0.2s' 
    },
    notificationItemNonLu: { background: '#f0f4ff' },
    notificationItemLu: { background: 'white' },
    validerBtn: { 
      background: iconColors.success, 
      color: 'white', 
      border: 'none', 
      padding: '5px 10px', 
      borderRadius: '5px', 
      cursor: 'pointer', 
      marginTop: '10px', 
      fontSize: '12px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.bellIcon} onClick={() => setShowPanel(!showPanel)}>
        <Icon name="notification_bell_ranging" size={24} color={iconColors.primary} />
        {nonLues > 0 && <span style={styles.badge}>{nonLues > 9 ? '9+' : nonLues}</span>}
      </div>

      {showPanel && (
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <span style={{ fontWeight: 'bold' }}>
              <Icon name="notification" size={14} color={iconColors.primary} />
              {' '}Notifications
            </span>
            {nonLues > 0 && (
              <button style={styles.toutLireBtn} onClick={toutMarquerLu}>
                Tout marquer comme lu
              </button>
            )}
          </div>

          <div style={styles.notificationList}>
            {loading ? (
              <div style={{ padding: '30px', textAlign: 'center' }}>
                <Icon name="pending" size={24} color={iconColors.gray} />
                <p>Chargement...</p>
              </div>
            ) : notificationsList.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: iconColors.grayLight }}>
                <Icon name="no_notification" size={32} color={iconColors.grayLight} />
                <p>Aucune notification</p>
              </div>
            ) : (
              notificationsList.map(notif => (
                <div 
                  key={notif._id} 
                  style={{
                    ...styles.notificationItem,
                    ...(notif.estLue ? styles.notificationItemLu : styles.notificationItemNonLu)
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    {getIconByType(notif.type)}
                    <span style={{ fontWeight: 'bold' }}>{notif.titre}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: iconColors.gray, marginBottom: '5px', whiteSpace: 'pre-wrap' }}>
                    {notif.message}
                  </div>
                  <div style={{ fontSize: '11px', color: iconColors.grayLight }}>
                    {new Date(notif.createdAt).toLocaleString()}
                  </div>
                  {user?.role === 'admin' && notif.type === 'document' && notif.data?.etapeId && (
                    <button style={styles.validerBtn} onClick={() => ouvrirValidationEtape(notif)}>
                      <Icon name="check_st" size={12} color="white" />
                      Valider cette soumission
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {showValidation && etapeToValidate && (
        <ValidationEtape
          etape={etapeToValidate}
          porteur={porteurInfo}
          onClose={() => {
            setShowValidation(false);
            setEtapeToValidate(null);
            setPorteurInfo(null);
          }}
          onSuccess={() => {
            loadNotifications();
          }}
        />
      )}
    </div>
  );
}

export default CentreNotifications;