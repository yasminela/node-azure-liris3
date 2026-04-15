import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Icon from './Icon';
import { iconColors } from '../styles/iconColors';

function GestionEtapesAdmin({ porteur, onClose }) {
  const [etapes, setEtapes] = useState([]);
  const [progression, setProgression] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, [porteur]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/etapes/progression/${porteur._id}`);
      setProgression(res.data);
      setEtapes(res.data.etapes || []);
    } catch (error) {
      console.error('Erreur chargement!', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenererEtapes = async () => {
    if (!window.confirm(`Générer les 6 étapes pour ${porteur.firstName} ${porteur.lastName} ?`)) return;

    setGenerating(true);
    try {
      await api.post(`/etapes/generer/${porteur._id}`);
      alert(' 6 étapes générées avec succès !');
      loadData();
    } catch (error) {
      console.error('Erreur: ', error);
      alert(' Erreur: ' + (error.response?.data?.message || 'Les étapes existent déjà'));
    } finally {
      setGenerating(false);
    }
  };

  const getStatusBadge = (statut) => {
    const statuses = {
      en_attente: { label: ' En attente', color: '#e2e8f0', textColor: '#666', icon: 'lock' },
      en_cours: { label: ' En cours', color: '#e0e7ff', textColor: '#4338ca', icon: 'pending' },
      terminee: { label: ' Soumise', color: '#fef3c7', textColor: '#d97706', icon: 'send' },
      soumise: { label: ' Soumise', color: '#fef3c7', textColor: '#d97706', icon: 'send' },
      validee: { label: ' Validée', color: '#d1fae5', textColor: '#059669', icon: 'check_st' },
      bloquee: { label: ' À reprendre', color: '#fee2e2', textColor: '#dc2626', icon: 'exclamation_point' },
      refusee: { label: ' À reprendre', color: '#fee2e2', textColor: '#dc2626', icon: 'exclamation_point' }
    };
    const s = statuses[statut] || { label: statut, color: '#e2e8f0', textColor: '#666', icon: 'info' };
    return (
      <span style={{
        background: s.color,
        color: s.textColor,
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <Icon name={s.icon} size={12} color={s.textColor} />
        {s.label}
      </span>
    );
  };

  const styles = {
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    modalContent: {
      background: 'white',
      borderRadius: '20px',
      padding: '30px',
      maxWidth: '700px',
      width: '100%',
      maxHeight: '85vh',
      overflowY: 'auto'
    },
    title: {
      color: iconColors.primary,
      marginBottom: '5px',
      fontSize: '24px'
    },
    subtitle: {
      color: iconColors.gray,
      marginBottom: '20px',
      fontSize: '16px'
    },
    progressSection: {
      background: iconColors.grayBg,
      padding: '15px',
      borderRadius: '10px',
      marginBottom: '20px',
      textAlign: 'center'
    },
    progressBar: {
      background: '#e2e8f0',
      borderRadius: '10px',
      height: '8px',
      overflow: 'hidden'
    },
    progressFill: {
      background: `linear-gradient(135deg, ${iconColors.primary} 0%, ${iconColors.primaryDark} 100%)`,
      height: '100%',
      transition: 'width 0.5s ease'
    },
    timeline: {
      marginTop: '20px'
    },
    timelineItem: {
      display: 'flex',
      marginBottom: '20px',
      position: 'relative'
    },
    timelineDot: (statut, numero) => ({
      width: '36px',
      height: '36px',
      background: statut === 'validee' ? iconColors.status.validee : iconColors.primary,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      marginRight: '15px',
      flexShrink: 0
    }),
    timelineContent: {
      flex: 1,
      background: iconColors.grayBg,
      padding: '15px',
      borderRadius: '10px'
    },
    timelineHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
      flexWrap: 'wrap',
      gap: '10px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px',
      background: iconColors.grayBg,
      borderRadius: '15px'
    },
    generateBtn: {
      background: iconColors.secondary,
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '16px',
      marginTop: '15px'
    },
    closeBtn: {
      marginTop: '20px',
      background: '#e2e8f0',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      width: '100%'
    },
    loadingText: {
      textAlign: 'center',
      padding: '40px'
    }
  };

  if (loading) {
    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.loadingText}>
            <Icon name="pending" size={32} color={iconColors.primary} />
            <p>Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  const aDesEtapes = etapes.length > 0;

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h2 style={styles.title}> Programme d'incubation</h2>
        <h3 style={styles.subtitle}>{porteur.firstName} {porteur.lastName}</h3>

        {progression && (
          <div style={styles.progressSection}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Progression</span>
              <span>{Math.round(progression.progression)}%</span>
            </div>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${progression.progression}%` }}></div>
            </div>
            <p>{progression.validees} / {progression.total} étapes validées</p>
          </div>
        )}

        {!aDesEtapes ? (
          <div style={styles.emptyState}>
            <Icon name="no_notification" size={48} color={iconColors.grayLight} />
            <p>Aucune étape générée pour ce porteur.</p>
            <button 
              style={styles.generateBtn} 
              onClick={handleGenererEtapes} 
              disabled={generating}
            >
              {generating ? (
                <><Icon name="pending" size={16} color="white" /> Génération en cours...</>
              ) : (
                <><Icon name="add_circle" size={16} color="white" /> Générer les 6 étapes du programme</>
              )}
            </button>
          </div>
        ) : (
          <div style={styles.timeline}>
            {etapes.map((etape, index) => (
              <div key={etape.id || index} style={styles.timelineItem}>
                <div style={styles.timelineDot(etape.statut, etape.numero)}>
                  {/*  REMPLACEMENT DE L'EMOJI PAR L'ICÔNE FONTAWESOME */}
                  {etape.statut === 'validee' ? (
                    <Icon name="check_st" size={18} color={iconColors.white} />
                  ) : (
                    etape.numero
                  )}
                </div>
                <div style={styles.timelineContent}>
                  <div style={styles.timelineHeader}>
                    <h4>Étape {etape.numero} : {etape.titre}</h4>
                    {getStatusBadge(etape.statut)}
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: iconColors.gray }}>
                    {etape.description}
                  </p>
                  {etape.commentaireAdmin && (
                    <p style={{ marginTop: '10px', fontSize: '12px', color: iconColors.danger }}>
                      <Icon name="comment_info" size={12} color={iconColors.danger} />
                      {' '}{etape.commentaireAdmin}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <button style={styles.closeBtn} onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  );
}

export default GestionEtapesAdmin;