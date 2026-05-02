import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Icon from './Icon';
import { iconColors } from '../styles/iconColors';
import { useTheme } from '../context/ThemeContext';

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
      alert(' Étape soumise avec succès !');
      setShowModal(false);
      setSelectedEtape(null);
      setCommentaire('');
      setFichier(null);
      loadEtapes();
    } catch (error) {
      alert(' Erreur: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  const getStatutBadge = (statut) => {
    const badges = {
      en_attente: { icon: 'pending', color: iconColors.status.en_attente, bg: '#fef3c7', text: 'En attente' },
      en_cours: { icon: 'pending', color: iconColors.status.en_cours, bg: '#fef3c7', text: 'En attente' },
      soumise: { icon: 'send', color: iconColors.status.soumise, bg: '#dbeafe', text: 'Soumise' },
      validee: { icon: 'check_st', color: iconColors.status.validee, bg: '#d1fae5', text: 'Validée' },
      refusee: { icon: 'exclamation_point', color: iconColors.status.refusee, bg: '#fee2e2', text: 'Refusée' }
    };
    const b = badges[statut] || badges.en_attente;
    return (
      <span style={{
        background: b.bg,
        color: b.color,
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <Icon name={b.icon} size={12} color={b.color} />
        {b.text}
      </span>
    );
  };

  const styles = {
    container: {
      background: 'white',
      borderRadius: '20px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
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
    table: { width: '100%', borderCollapse: 'collapse', overflowX: 'auto' },
    th: {
  padding: '14px',
  textAlign: 'left',
  background: darkMode ? '#334155' : '#f8fafc',
  color: 'var(--text-secondary)',
  fontWeight: '600',
  fontSize: '14px',
  borderBottom: `2px solid #e2e8f0`,
},
    td: {
  padding: '14px',
  borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
  fontSize: '14px',
  verticalAlign: 'middle',
  color: 'var(--text-primary)',
},
    disabledBtn: {
      background: '#cbd5e1',
      color: iconColors.gray,
      border: 'none',
      padding: '8px 16px',
      borderRadius: '10px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '13px',
      cursor: 'not-allowed'
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
      background: 'white',
      borderRadius: '20px',
      padding: '28px',
      maxWidth: '500px',
      width: '90%'
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: iconColors.black,
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      marginBottom: '16px',
      fontSize: '14px',
      fontFamily: 'inherit'
    },
    fileInput: {
      width: '100%',
      padding: '12px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      marginBottom: '20px',
      fontSize: '14px'
    },
    buttonGroup: { display: 'flex', gap: '12px', marginTop: '8px' },
    submitModalBtn: {
      background: iconColors.secondary,
      color: iconColors.white,
      border: 'none',
      padding: '12px 24px',
      borderRadius: '12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: 'bold',
      flex: 1,
      justifyContent: 'center'
    },
    cancelModalBtn: {
      background: '#e2e8f0',
      color: iconColors.gray,
      border: 'none',
      padding: '12px 24px',
      borderRadius: '12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: 'bold',
      flex: 1,
      justifyContent: 'center'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Icon name="pending" size={32} color={iconColors.primary} />
          <p style={{ marginTop: '12px', color: iconColors.gray }}>Chargement des étapes...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <Icon name="document" size={22} color={iconColors.primary} />
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
                  {(etape.statut === 'en_attente' || etape.statut === 'en_cours' || etape.statut === 'refusee') && (
                    <button onClick={() => { setSelectedEtape(etape); setShowModal(true); }} style={styles.submitBtn}>
                      <Icon name="upload" size={14} color={iconColors.white} />
                      Déposer un document
                    </button>
                  )}
                  {etape.statut === 'soumise' && (
                    <span style={styles.disabledBtn}>
                      <Icon name="pending" size={14} color={iconColors.gray} />
                      En attente de validation
                    </span>
                  )}
                  {etape.statut === 'validee' && (
                    <span style={{ ...styles.disabledBtn, background: '#d1fae5', color: iconColors.status.validee }}>
                      <Icon name="check_st" size={14} color={iconColors.status.validee} />
                      Validée
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
            <div style={styles.modalTitle}>
              <Icon name="upload" size={22} color={iconColors.primary} />
              Soumettre : {selectedEtape.titre}
            </div>
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
                accept=".pdf,.doc,.docx,.jpg,.png,.zip"
              />
              <div style={styles.buttonGroup}>
                <button type="submit" style={styles.submitModalBtn} disabled={uploading}>
                  {uploading ? (
                    <><Icon name="pending" size={16} color={iconColors.white} /> Envoi...</>
                  ) : (
                    <><Icon name="send" size={16} color={iconColors.white} /> Soumettre</>
                  )}
                </button>
                <button type="button" onClick={() => setShowModal(false)} style={styles.cancelModalBtn}>
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