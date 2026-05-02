import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faCheck, faTimes, faEye } from '@fortawesome/free-solid-svg-icons';

function ValidationDocument({ onValidate }) {
  const { darkMode } = useTheme();
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
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidation = async (id, estValide) => {
    const commentaire = feedback[id] || '';
    if (!estValide && !commentaire) {
      alert('Veuillez ajouter un commentaire');
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
      alert('Erreur: ' + (error.response?.data?.message || error.message));
    }
  };

  const styles = {
    container: {
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '20px',
      padding: '24px',
      marginBottom: '24px'
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: darkMode ? '#ffffff' : '#1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      borderLeft: '4px solid #667eea',
      paddingLeft: '16px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px',
      color: darkMode ? '#94a3b8' : '#64748b'
    },
    soumissionCard: {
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '16px'
    },
    soumissionTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: darkMode ? '#ffffff' : '#1e293b'
    },
    soumissionMeta: {
      fontSize: '12px',
      color: darkMode ? '#94a3b8' : '#64748b',
      marginTop: '4px'
    },
    commentairePorteur: {
      fontSize: '13px',
      marginTop: '10px',
      padding: '10px',
      background: darkMode ? '#0f172a' : '#f8fafc',
      borderRadius: '10px',
      color: darkMode ? '#cbd5e1' : '#475569'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      borderRadius: '12px',
      border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`,
      background: darkMode ? '#0f172a' : 'white',
      color: darkMode ? '#f1f5f9' : '#1e293b',
      marginBottom: '12px',
      fontSize: '14px'
    },
    buttonGroup: { display: 'flex', gap: '12px' },
    btnValid: {
      background: '#10b981',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '10px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
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
      gap: '8px'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>Chargement...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <FontAwesomeIcon icon={faFileAlt} color="#667eea" />
        Documents à valider
      </div>

      {soumissions.length === 0 ? (
        <div style={styles.emptyState}>
          <FontAwesomeIcon icon={faFileAlt} size="32px" style={{ marginBottom: '12px', opacity: 0.5 }} />
          <p>Aucune soumission en attente</p>
        </div>
      ) : (
        soumissions.map(s => (
          <div key={s._id} style={styles.soumissionCard}>
            <div style={styles.soumissionTitle}>{s.titre}</div>
            <div style={styles.soumissionMeta}>
              Porteur: {s.porteurId?.firstName} {s.porteurId?.lastName}
            </div>
            <div style={styles.soumissionMeta}>
              Soumis le: {new Date(s.dateSoumission).toLocaleDateString()}
            </div>
            {s.commentairePorteur && (
              <div style={styles.commentairePorteur}>
                <strong>💬 Commentaire:</strong> {s.commentairePorteur}
              </div>
            )}

            <textarea
              placeholder="Feedback pour le porteur..."
              value={feedback[s._id] || ''}
              onChange={(e) => setFeedback({ ...feedback, [s._id]: e.target.value })}
              style={styles.textarea}
              rows="2"
            />
            
            <div style={styles.buttonGroup}>
              <button onClick={() => handleValidation(s._id, true)} style={styles.btnValid}>
                <FontAwesomeIcon icon={faCheck} size="sm" /> Valider
              </button>
              <button onClick={() => handleValidation(s._id, false)} style={styles.btnRefuse}>
                <FontAwesomeIcon icon={faTimes} size="sm" /> Refuser
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ValidationDocument;