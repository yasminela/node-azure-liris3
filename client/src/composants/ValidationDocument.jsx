import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Icon from './Icon';
import { iconColors } from '../styles/iconColors';

function ValidationDocument({ onValidate }) {
  const [soumissions, setSoumissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    loadSoumissions();
  }, []);

  const loadSoumissions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/etapes/soumissions');
      setSoumissions(res.data || []);
    } catch (error) {
      console.error('Erreur chargement soumissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidation = async (id, estValide) => {
    const commentaire = feedback[id] || '';

    if (!estValide && !commentaire) {
      alert('❌ Veuillez ajouter un commentaire pour expliquer le refus');
      return;
    }

    try {
      if (estValide) {
        await api.post(`/etapes/valider/${id}`, { feedback: commentaire });
        alert('✅ Document validé');
      } else {
        await api.post(`/etapes/refuser/${id}`, { feedback: commentaire });
        alert('❌ Document refusé');
      }
      loadSoumissions();
      if (onValidate) onValidate();
      setFeedback({ ...feedback, [id]: '' });
    } catch (error) {
      console.error('Erreur validation:', error);
      alert('Erreur: ' + (error.response?.data?.message || error.message));
    }
  };

  const styles = {
    container: {
      background: 'white',
      borderRadius: '20px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: iconColors.black,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      borderLeft: `4px solid ${iconColors.primary}`,
      paddingLeft: '16px'
    },
    soumissionCard: {
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '16px',
      transition: 'box-shadow 0.2s'
    },
    soumissionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '12px',
      flexWrap: 'wrap',
      gap: '10px'
    },
    soumissionTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: iconColors.black
    },
    soumissionMeta: {
      fontSize: '12px',
      color: iconColors.gray,
      marginTop: '4px'
    },
    commentairePorteur: {
      fontSize: '13px',
      marginTop: '10px',
      padding: '10px',
      background: '#f8fafc',
      borderRadius: '10px',
      color: iconColors.gray
    },
    documentLink: {
      marginTop: '8px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      color: iconColors.primary,
      textDecoration: 'none',
      fontSize: '13px'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      marginBottom: '12px',
      fontSize: '14px',
      fontFamily: 'inherit',
      resize: 'vertical'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px'
    },
    btnValid: {
      background: '#10b981',
      color: 'white',
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
    btnRefuse: {
      background: '#ef4444',
      color: 'white',
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
    emptyState: {
      textAlign: 'center',
      padding: '48px',
      color: iconColors.grayLight
    },
    loadingState: {
      textAlign: 'center',
      padding: '48px',
      color: iconColors.gray
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>
          <Icon name="pending" size={32} color={iconColors.grayLight} />
          <p>Chargement des soumissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <Icon name="document" size={22} color={iconColors.primary} />
        Documents à valider
      </div>

      {soumissions.length === 0 ? (
        <div style={styles.emptyState}>
          <Icon name="no_notification" size={48} color={iconColors.grayLight} />
          <p>Aucune soumission en attente</p>
        </div>
      ) : (
        soumissions.map((s) => (
          <div key={s._id} style={styles.soumissionCard}>
            <div style={styles.soumissionHeader}>
              <div>
                <div style={styles.soumissionTitle}>{s.titre}</div>
                <div style={styles.soumissionMeta}>
                  Porteur: {s.porteurId?.firstName} {s.porteurId?.lastName}
                </div>
                <div style={styles.soumissionMeta}>
                  📅 Soumis le: {new Date(s.dateSoumission).toLocaleDateString('fr-FR')}
                </div>
                {s.commentairePorteur && (
                  <div style={styles.commentairePorteur}>
                    <strong>💬 Commentaire du porteur:</strong><br />
                    {s.commentairePorteur}
                  </div>
                )}
                {s.documentUrl && (
                  <a 
                    href={`http://localhost:5001/${s.documentUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={styles.documentLink}
                  >
                    <Icon name="file" size={14} color={iconColors.primary} />
                    📄 Voir le document
                  </a>
                )}
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <textarea
                placeholder="✏️ Feedback pour le porteur (obligatoire pour un refus)..."
                value={feedback[s._id] || ''}
                onChange={(e) => setFeedback({ ...feedback, [s._id]: e.target.value })}
                style={styles.textarea}
                rows="3"
              />
              <div style={styles.buttonGroup}>
                <button 
                  onClick={() => handleValidation(s._id, true)} 
                  style={styles.btnValid}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Icon name="check_st" size={16} color="white" />
                  Valider
                </button>
                <button 
                  onClick={() => handleValidation(s._id, false)} 
                  style={styles.btnRefuse}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Icon name="exclamation_point" size={16} color="white" />
                  Refuser
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ValidationDocument;