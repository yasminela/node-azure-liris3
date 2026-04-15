import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Icon from './Icon';
import { iconColors } from '../styles/iconColors';

function Calendrier({ onEventAdded }) {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    lieu: '',
    type: 'formation'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await api.get('/evenements/mes-evenements');
      setEvents(res.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/evenements', formData);
      alert('Événement créé avec succès');
      setShowForm(false);
      setFormData({ 
        titre: '', 
        description: '', 
        dateDebut: '', 
        dateFin: '', 
        lieu: '', 
        type: 'formation' 
      });
      loadEvents();
      if (onEventAdded) onEventAdded();
    } catch (error) {
      alert('Erreur: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Supprimer cet événement ?')) {
      try {
        await api.delete(`/evenements/${id}`);
        loadEvents();
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const getTypeStyle = (type) => {
    const styles = {
      formation: { bg: '#dbeafe', border: iconColors.info, text: '#1e40af', icon: 'learning', label: 'Formation' },
      atelier: { bg: '#d1fae5', border: iconColors.success, text: '#065f46', icon: 'users', label: 'Atelier' },
      webinaire: { bg: '#ede9fe', border: iconColors.primary, text: '#5b21b6', icon: 'development', label: 'Webinaire' },
      reunion: { bg: '#fed7aa', border: iconColors.warning, text: '#92400e', icon: 'group', label: 'Réunion' },
      soutenance: { bg: '#fce7f3', border: iconColors.earlyStage.mois6, text: '#9d174d', icon: 'rocket', label: 'Soutenance' }
    };
    return styles[type] || styles.formation;
  };

  const typeOptions = [
    { value: 'formation', label: 'Formation', icon: 'learning', color: iconColors.info },
    { value: 'atelier', label: 'Atelier', icon: 'users', color: iconColors.success },
    { value: 'webinaire', label: 'Webinaire', icon: 'development', color: iconColors.primary },
    { value: 'reunion', label: 'Réunion', icon: 'group', color: iconColors.warning },
    { value: 'soutenance', label: 'Soutenance', icon: 'rocket', color: iconColors.earlyStage.mois6 }
  ];

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    let startOffset = firstDay.getDay();
    startOffset = startOffset === 0 ? 6 : startOffset - 1;
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    return days;
  };

  const getEventsForDay = (date) => {
    if (!date) return [];
    return events.filter(e => {
      const eventDate = new Date(e.dateDebut);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const monthDays = getDaysInMonth();
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';
  
  const upcomingEvents = [...events]
    .filter(e => new Date(e.dateDebut) >= new Date())
    .sort((a, b) => new Date(a.dateDebut) - new Date(b.dateDebut))
    .slice(0, 5);

  const styles = {
    container: {
      background: iconColors.white,
      borderRadius: '20px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '16px'
    },
    title: {
      margin: 0,
      color: iconColors.black,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      borderLeft: `4px solid ${iconColors.primary}`,
      paddingLeft: '16px',
      fontSize: '20px',
      fontWeight: 'bold'
    },
    addBtn: {
      background: iconColors.primary,
      color: iconColors.white,
      border: 'none',
      padding: '10px 20px',
      borderRadius: '10px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: '500',
      transition: 'transform 0.2s'
    },
    formContainer: {
      background: iconColors.grayBg,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px'
    },
    formTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: iconColors.black,
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '12px',
      marginBottom: '16px'
    },
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '500',
      color: iconColors.black,
      fontSize: '13px'
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '8px',
      border: `1px solid #e2e8f0`,
      fontSize: '14px',
      fontFamily: 'inherit'
    },
    textarea: {
      width: '100%',
      padding: '10px',
      borderRadius: '8px',
      border: `1px solid #e2e8f0`,
      fontSize: '14px',
      fontFamily: 'inherit',
      resize: 'vertical'
    },
    typeButtonsContainer: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      marginTop: '8px'
    },
    typeButton: (isActive, color) => ({
      padding: '8px 16px',
      borderRadius: '20px',
      border: `1px solid ${isActive ? color : '#e2e8f0'}`,
      background: isActive ? color : 'white',
      color: isActive ? 'white' : color,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '13px',
      fontWeight: '500',
      transition: 'all 0.2s'
    }),
    formButtons: {
      display: 'flex',
      gap: '12px',
      marginTop: '8px'
    },
    createBtn: {
      background: iconColors.success,
      color: iconColors.white,
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: '500'
    },
    cancelBtn: {
      background: '#e2e8f0',
      color: iconColors.gray,
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: '500'
    },
    calendarNav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '12px'
    },
    navButtons: {
      display: 'flex',
      gap: '8px'
    },
    navBtn: {
      background: '#e2e8f0',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    todayBtn: {
      background: iconColors.primary,
      color: iconColors.white,
      border: 'none',
      padding: '8px 12px',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    monthTitle: {
      margin: 0,
      fontSize: '20px',
      fontWeight: 'bold',
      color: iconColors.black
    },
    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '1px',
      background: '#e2e8f0',
      border: `1px solid #e2e8f0`,
      borderRadius: '12px',
      overflow: 'hidden'
    },
    weekDay: {
      background: iconColors.grayBg,
      padding: '12px',
      textAlign: 'center',
      fontWeight: 'bold',
      color: iconColors.gray,
      fontSize: '13px'
    },
    dayCell: (isToday) => ({
      minHeight: '100px',
      padding: '8px',
      border: '1px solid #f0f0f0',
      background: isToday ? '#e0e7ff' : iconColors.white
    }),
    dayNumber: (isToday) => ({
      fontWeight: 'bold',
      fontSize: '14px',
      marginBottom: '8px',
      color: isToday ? iconColors.primary : iconColors.black
    }),
    eventItem: (style) => ({
      background: style.bg,
      color: style.text,
      padding: '3px 6px',
      borderRadius: '4px',
      marginBottom: '3px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      fontSize: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    }),
    upcomingSection: {
      marginTop: '24px'
    },
    upcomingTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: iconColors.black,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      borderLeft: `4px solid ${iconColors.primary}`,
      paddingLeft: '12px'
    },
    upcomingEvent: (style) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: style.bg,
      borderRadius: '12px',
      padding: '12px 16px',
      marginBottom: '10px'
    }),
    upcomingEventContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      flexWrap: 'wrap'
    },
    upcomingEventInfo: {
      flex: 1
    },
    upcomingEventTitle: {
      fontWeight: 'bold',
      marginBottom: '4px'
    },
    upcomingEventDate: {
      fontSize: '12px'
    },
    upcomingEventLieu: {
      fontSize: '12px',
      marginTop: '4px'
    },
    deleteEventBtn: {
      background: iconColors.danger,
      color: iconColors.white,
      border: 'none',
      padding: '6px 12px',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px'
    },
    legend: {
      marginTop: '20px',
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
      justifyContent: 'center',
      borderTop: `1px solid #e2e8f0`,
      paddingTop: '16px'
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px'
    },
    legendColor: {
      width: '12px',
      height: '12px',
      borderRadius: '3px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px',
      color: iconColors.grayLight
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          <Icon name="calendar" size={22} color={iconColors.primary} />
          Calendrier des événements
        </h3>
        {isAdmin && (
          <button 
            onClick={() => setShowForm(!showForm)} 
            style={styles.addBtn}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Icon name="add_circle" size={18} color={iconColors.white} />
            Ajouter
          </button>
        )}
      </div>

      {showForm && isAdmin && (
        <div style={styles.formContainer}>
          <div style={styles.formTitle}>
            <Icon name="add_circle" size={16} color={iconColors.primary} />
            Nouvel événement
          </div>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Titre *</label>
                <input
                  type="text"
                  placeholder="Titre de l'événement"
                  value={formData.titre}
                  onChange={e => setFormData({...formData, titre: e.target.value})}
                  required
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Lieu</label>
                <input
                  type="text"
                  placeholder="Lieu de l'événement"
                  value={formData.lieu}
                  onChange={e => setFormData({...formData, lieu: e.target.value})}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Date de début *</label>
                <input
                  type="datetime-local"
                  value={formData.dateDebut}
                  onChange={e => setFormData({...formData, dateDebut: e.target.value})}
                  required
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Date de fin *</label>
                <input
                  type="datetime-local"
                  value={formData.dateFin}
                  onChange={e => setFormData({...formData, dateFin: e.target.value})}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            {/* Type d'événement - Sans émojis, avec icônes FontAwesome */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Icon name="tag" size={12} color={iconColors.primary} />
                {' '}Type d'événement
              </label>
              <div style={styles.typeButtonsContainer}>
                {typeOptions.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({...formData, type: type.value})}
                    style={styles.typeButton(formData.type === type.value, type.color)}
                  >
                    <Icon name={type.icon} size={14} color={formData.type === type.value ? 'white' : type.color} />
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                placeholder="Description de l'événement"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                style={styles.textarea}
                rows="3"
              />
            </div>

            <div style={styles.formButtons}>
              <button type="submit" disabled={loading} style={styles.createBtn}>
                {loading ? (
                  <><Icon name="pending" size={14} color={iconColors.white} /> Création...</>
                ) : (
                  <><Icon name="check_st" size={14} color={iconColors.white} /> Créer</>
                )}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={styles.cancelBtn}>
                <Icon name="times" size={14} color={iconColors.gray} /> Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.calendarNav}>
        <div style={styles.navButtons}>
          <button onClick={prevMonth} style={styles.navBtn}>
            <Icon name="angle_left" size={18} color={iconColors.gray} />
          </button>
          <button onClick={goToToday} style={styles.todayBtn}>
            <Icon name="today" size={14} color={iconColors.white} />
            Aujourd'hui
          </button>
          <button onClick={nextMonth} style={styles.navBtn}>
            <Icon name="angle_right" size={18} color={iconColors.gray} />
          </button>
        </div>
        <h2 style={styles.monthTitle}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
      </div>

      <div style={styles.calendarGrid}>
        {weekDays.map(day => (
          <div key={day} style={styles.weekDay}>{day}</div>
        ))}
        {monthDays.map((date, index) => {
          const dayEvents = date ? getEventsForDay(date) : [];
          const isToday = date && date.toDateString() === new Date().toDateString();
          return (
            <div key={index} style={styles.dayCell(isToday)}>
              {date && (
                <>
                  <div style={styles.dayNumber(isToday)}>{date.getDate()}</div>
                  <div style={{ fontSize: '10px' }}>
                    {dayEvents.slice(0, 3).map(event => {
                      const style = getTypeStyle(event.type);
                      return (
                        <div
                          key={event._id}
                          style={styles.eventItem(style)}
                          title={`${event.titre}\nDu ${new Date(event.dateDebut).toLocaleString()}\nAu ${new Date(event.dateFin).toLocaleString()}\n${event.description || ''}`}
                          onClick={() => alert(`${event.titre}\nDu ${new Date(event.dateDebut).toLocaleString()}\nAu ${new Date(event.dateFin).toLocaleString()}\n${event.description || ''}`)}
                        >
                          <Icon name={style.icon} size={8} color={style.text} />
                          {event.titre}
                        </div>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <div style={{ fontSize: '9px', color: iconColors.gray, marginTop: '3px' }}>
                        +{dayEvents.length - 3}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div style={styles.upcomingSection}>
        <div style={styles.upcomingTitle}>
          <Icon name="calendar_av_en" size={18} color={iconColors.primary} />
          Événements à venir
        </div>
        {upcomingEvents.length === 0 ? (
          <div style={styles.emptyState}>
            <Icon name="no_notification" size={32} color={iconColors.grayLight} />
            <p>Aucun événement à venir</p>
          </div>
        ) : (
          upcomingEvents.map(event => {
            const style = getTypeStyle(event.type);
            return (
              <div key={event._id} style={styles.upcomingEvent(style)}>
                <div style={styles.upcomingEventContent}>
                  <div>
                    <Icon name={style.icon} size={20} color={style.text} />
                  </div>
                  <div style={styles.upcomingEventInfo}>
                    <div style={styles.upcomingEventTitle}>{event.titre}</div>
                    <div style={styles.upcomingEventDate}>
                      <Icon name="calendar" size={10} color={style.text} />
                      {' '}Du {new Date(event.dateDebut).toLocaleDateString('fr-FR')} au {new Date(event.dateFin).toLocaleDateString('fr-FR')}
                    </div>
                    {event.lieu && (
                      <div style={styles.upcomingEventLieu}>
                        <Icon name="marker" size={10} color={style.text} />
                        {' '}{event.lieu}
                      </div>
                    )}
                    {event.description && (
                      <div style={{ fontSize: '11px', marginTop: '5px', color: style.text }}>
                        {event.description}
                      </div>
                    )}
                  </div>
                </div>
                {isAdmin && (
                  <button onClick={() => handleDelete(event._id)} style={styles.deleteEventBtn}>
                    <Icon name="delete" size={12} color={iconColors.white} />
                    Supprimer
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      <div style={styles.legend}>
        {typeOptions.map(type => {
          const style = getTypeStyle(type.value);
          return (
            <div key={type.value} style={styles.legendItem}>
              <div style={{ ...styles.legendColor, background: style.border }}></div>
              <Icon name={type.icon} size={10} color={style.border} />
              <span>{type.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Calendrier;