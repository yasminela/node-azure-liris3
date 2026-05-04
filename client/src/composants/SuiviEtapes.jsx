import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faClock, 
  faUpload, 
  faTimesCircle,
  faFilePdf,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

function SuiviEtapes() {
  const { darkMode } = useTheme();
  const [etapes, setEtapes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEtape, setSelectedEtape] = useState(null);
  const [commentaire, setCommentaire] = useState('');
  const [fichier, setFichier] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadEtapes();
  }, []);

  const loadEtapes = async () => {
    try {
      const res = await api.get('/etapes/mes-etapes');
      setEtapes(res.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fichier) {
      alert('Veuillez sélectionner un fichier');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('fichier', fichier);
    formData.append('etapeId', selectedEtape._id);
    formData.append('commentaire', commentaire);

    try {
      await api.post('/etapes/soumettre', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('✅ Étape soumise avec succès !');
      setShowModal(false);
      setSelectedEtape(null);
      setCommentaire('');
      setFichier(null);
      loadEtapes();
    } catch (error) {
      alert('❌ Erreur: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  const getStatutBadge = (statut) => {
    switch(statut) {
      case 'validee':
        return <span style={{ background: '#d1fae5', color: '#059669', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <FontAwesomeIcon icon={faCheckCircle} size="sm" /> Validée
        </span>;
      case 'soumise':
        return <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <FontAwesomeIcon icon={faClock} size="sm" /> En attente
        </span>;
      case 'refusee':
        return <span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <FontAwesomeIcon icon={faTimesCircle} size="sm" /> À reprendre
        </span>;
      default:
        return <span style={{ background: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#94a3b8' : '#64748b', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <FontAwesomeIcon icon={faClock} size="sm" /> En attente
        </span>;
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
      gap: '8px',
      borderLeft: '4px solid #667eea',
      paddingLeft: '16px'
    },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: {
      padding: '12px',
      textAlign: 'left',
      background: darkMode ? '#334155' : '#f1f5f9',
      color: darkMode ? '#cbd5e1' : '#64748b',
      fontWeight: '600',
      fontSize: '13px',
      borderBottom: `2px solid ${darkMode ? '#475569' : '#e2e8f0'}`
    },
    td: {
      padding: '12px',
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      fontSize: '14px',
      color: darkMode ? '#e2e8f0' : '#475569'
    },
    submitBtn: {
      background: '#667eea',
      color: 'white',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '20px',
      padding: '24px',
      maxWidth: '500px',
      width: '90%'
    },
    textarea: {
      width: '100%',
      padding: '10px',
      borderRadius: '8px',
      border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`,
      background: darkMode ? '#0f172a' : 'white',
      color: darkMode ? '#f1f5f9' : '#1e293b',
      marginBottom: '16px',
      fontSize: '14px'
    },
    fileInput: {
      width: '100%',
      padding: '10px',
      borderRadius: '8px',
      border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`,
      background: darkMode ? '#0f172a' : 'white',
      color: darkMode ? '#f1f5f9' : '#1e293b',
      marginBottom: '20px'
    },
    buttonGroup: { display: 'flex', gap: '12px' }
  };

  if (loading) {
    return <div style={styles.container}>Chargement...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <FontAwesomeIcon icon={faFilePdf} color="#667eea" />
        Programme Early Stage - Mes étapes
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Étape</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Statut</th>
              <th style={styles.th}>Feedback</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {etapes.map((etape) => (
              <tr key={etape._id}>
                <td style={styles.td}><strong>{etape.titre}</strong></td>
                <td style={styles.td}>{etape.description || '—'}</td>
                <td style={styles.td}>{getStatutBadge(etape.statut)}</td>
                <td style={styles.td}>{etape.commentaireAdmin || '—'}</td>
                <td style={styles.td}>
                  {(etape.statut === 'en_attente' || etape.statut === 'refusee') && (
                    <button className="btn-shine" onClick={() => { setSelectedEtape(etape); setShowModal(true); }} style={styles.submitBtn}>
                      <FontAwesomeIcon icon={faUpload} size="sm" /> Déposer
                    </button>
                  )}
                  {etape.statut === 'soumise' && (
                    <span style={{ color: '#f59e0b', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <FontAwesomeIcon icon={faSpinner} spin /> En cours...
                    </span>
                  )}
                  {etape.statut === 'validee' && (
                    <span style={{ color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <FontAwesomeIcon icon={faCheckCircle} /> Validée
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedEtape && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '20px', color: darkMode ? '#ffffff' : '#1e293b' }}>
              Soumettre : {selectedEtape.titre}
            </h3>
            <form onSubmit={handleSubmit}>
              <textarea
                placeholder="Commentaire (optionnel)"
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                style={styles.textarea}
                rows="3"
              />
              <input
                type="file"
                onChange={(e) => setFichier(e.target.files[0])}
                required
                style={styles.fileInput}
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
              <div style={styles.buttonGroup}>
                <button type="submit" className="btn-shine" style={{ ...styles.submitBtn, flex: 1, justifyContent: 'center' }} disabled={uploading}>
                  {uploading ? <><FontAwesomeIcon icon={faSpinner} spin /> Envoi...</> : <><FontAwesomeIcon icon={faUpload} /> Soumettre</>}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-shine" style={{ background: '#e2e8f0', color: darkMode ? '#1e293b' : '#475569', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuiviEtapes;