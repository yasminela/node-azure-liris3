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
  faSpinner,
  faEye,
  faComment,
  faRobot,
  faChartLine,
  faDownload,
  faLightbulb
} from '@fortawesome/free-solid-svg-icons';

function SuiviEtapes() {
  const { darkMode } = useTheme();
  const [etapes, setEtapes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [commentaire, setCommentaire] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [analyseResult, setAnalyseResult] = useState(null);
  const [showAnalyseModal, setShowAnalyseModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    loadEtapes();
  }, []);

  const loadEtapes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/etapes/mes-etapes');
      setEtapes(res.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour uploader et analyser le BMC
  const handleBmcUpload = async () => {
    if (!selectedFile) {
      alert('❌ Veuillez sélectionner un fichier PDF');
      return;
    }

    if (selectedFile.type !== 'application/pdf') {
      alert('❌ Le Business Model Canvas doit être au format PDF');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('❌ Le fichier ne doit pas dépasser 10 Mo');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('fichier', selectedFile);
    formData.append('commentaire', commentaire);

    try {
      // Appel à l'API d'analyse BMC
      const response = await api.post('/ai/analyser-bmc', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setAnalyseResult(response.data);
        setShowAnalyseModal(true);
        
        // Réinitialiser le formulaire
        setSelectedFile(null);
        setCommentaire('');
        
        // Recharger les étapes pour mettre à jour le statut
        loadEtapes();
      } else {
        alert('❌ Erreur: ' + (response.data.message || 'Analyse échouée'));
      }
    } catch (error) {
      console.error('Erreur analyse BMC:', error);
      alert('❌ Erreur: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  const handleViewDocument = (documentUrl) => {
    if (documentUrl) {
      window.open(`http://localhost:5001/${documentUrl}`, '_blank');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#10b981';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const styles = {
    container: {
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '20px',
      padding: '24px',
      marginBottom: '24px'
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: darkMode ? '#ffffff' : '#1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      borderLeft: '4px solid #667eea',
      paddingLeft: '16px'
    },
    // Section dédiée à l'upload du BMC
    bmcCard: {
      background: darkMode ? '#0f172a' : '#f8fafc',
      borderRadius: '20px',
      padding: '24px',
      marginBottom: '24px',
      border: `2px solid ${darkMode ? '#475569' : '#e2e8f0'}`,
      backgroundImage: darkMode ? 'none' : 'linear-gradient(135deg, rgba(102,126,234,0.05) 0%, rgba(118,75,162,0.05) 100%)'
    },
    bmcHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px'
    },
    bmcIcon: {
      width: '50px',
      height: '50px',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      borderRadius: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    bmcTitle: {
      fontSize: '22px',
      fontWeight: 'bold',
      color: darkMode ? '#ffffff' : '#1e293b'
    },
    bmcSubtitle: {
      fontSize: '14px',
      color: darkMode ? '#94a3b8' : '#64748b',
      marginTop: '4px'
    },
    fileZone: {
      marginTop: '20px',
      padding: '30px',
      border: `2px dashed ${darkMode ? '#475569' : '#cbd5e1'}`,
      borderRadius: '16px',
      textAlign: 'center',
      background: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    fileInput: {
      display: 'none'
    },
    fileLabel: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px'
    },
    fileIcon: {
      fontSize: '48px',
      color: '#667eea'
    },
    fileText: {
      fontSize: '16px',
      fontWeight: '500',
      color: darkMode ? '#e2e8f0' : '#334155'
    },
    fileHint: {
      fontSize: '12px',
      color: darkMode ? '#64748b' : '#94a3b8'
    },
    selectedFileInfo: {
      marginTop: '16px',
      padding: '12px',
      background: darkMode ? '#1e293b' : '#e2e8f0',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px'
    },
    commentaireInput: {
      width: '100%',
      padding: '12px',
      borderRadius: '12px',
      border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`,
      background: darkMode ? '#1e293b' : 'white',
      color: darkMode ? '#f1f5f9' : '#1e293b',
      marginTop: '16px',
      fontSize: '14px',
      resize: 'vertical'
    },
    uploadBtn: {
      width: '100%',
      marginTop: '20px',
      padding: '14px',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      transition: 'all 0.3s ease'
    },
    uploadBtnDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    },
    infoBox: {
      marginTop: '20px',
      padding: '16px',
      background: darkMode ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
      borderRadius: '12px',
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start'
    },
    infoIcon: {
      fontSize: '20px',
      color: '#667eea'
    },
    infoText: {
      fontSize: '13px',
      color: darkMode ? '#cbd5e1' : '#475569',
      lineHeight: '1.5'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '24px',
      padding: '28px',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '80vh',
      overflowY: 'auto'
    },
    modalTitle: {
      fontSize: '22px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: darkMode ? '#ffffff' : '#1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    scoreContainer: {
      textAlign: 'center',
      padding: '20px',
      borderRadius: '16px',
      marginBottom: '20px'
    },
    scoreValue: {
      fontSize: '48px',
      fontWeight: 'bold'
    },
    recommandationItem: {
      padding: '12px',
      marginBottom: '8px',
      background: darkMode ? '#0f172a' : '#fef3c7',
      borderRadius: '10px',
      borderLeft: `3px solid #f59e0b`,
      fontSize: '13px',
      lineHeight: '1.5'
    },
    closeBtn: {
      width: '100%',
      padding: '12px',
      background: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      marginTop: '20px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px',
      color: darkMode ? '#94a3b8' : '#64748b'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <FontAwesomeIcon icon={faRobot} color="#667eea" />
        Analyse IA de mon Business Model Canvas
      </div>

      {/* Section d'upload du BMC */}
      <div style={styles.bmcCard}>
        <div style={styles.bmcHeader}>
          <div style={styles.bmcIcon}>
            <FontAwesomeIcon icon={faFilePdf} size="2x" color="white" />
          </div>
          <div>
            <div style={styles.bmcTitle}>Business Model Canvas</div>
            <div style={styles.bmcSubtitle}>
              Téléchargez votre BMC pour une analyse IA complète
            </div>
          </div>
        </div>

        {/* Zone de drop/upload */}
        <div 
          style={styles.fileZone}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type === 'application/pdf') {
              setSelectedFile(file);
            } else {
              alert('Veuillez déposer un fichier PDF');
            }
          }}
        >
          <input
            type="file"
            id="bmc-file"
            accept=".pdf"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            style={styles.fileInput}
          />
          <label htmlFor="bmc-file" style={styles.fileLabel}>
            <FontAwesomeIcon icon={faUpload} style={styles.fileIcon} />
            <div style={styles.fileText}>
              {selectedFile ? selectedFile.name : 'Cliquez ou glissez votre fichier PDF ici'}
            </div>
            <div style={styles.fileHint}>Format accepté : PDF (max 10 Mo)</div>
          </label>
        </div>

        {/* Affichage du fichier sélectionné */}
        {selectedFile && (
          <div style={styles.selectedFileInfo}>
            <span>
              <FontAwesomeIcon icon={faFilePdf} style={{ marginRight: '8px', color: '#ef4444' }} />
              {selectedFile.name}
            </span>
            <button
              onClick={() => setSelectedFile(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer'
              }}
            >
              ✕ Supprimer
            </button>
          </div>
        )}

        {/* Commentaire optionnel */}
        <textarea
          placeholder="Ajoutez un commentaire pour l'administrateur (optionnel)..."
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          style={styles.commentaireInput}
          rows="3"
        />

        {/* Bouton d'upload et analyse */}
        <button
          className="btn-shine"
          onClick={handleBmcUpload}
          disabled={!selectedFile || uploading}
          style={{
            ...styles.uploadBtn,
            ...((!selectedFile || uploading) ? styles.uploadBtnDisabled : {})
          }}
        >
          {uploading ? (
            <><FontAwesomeIcon icon={faSpinner} spin /> Analyse en cours...</>
          ) : (
            <><FontAwesomeIcon icon={faRobot} /> Analyser mon BMC</>
          )}
        </button>

        {/* Informations */}
        <div style={styles.infoBox}>
          <FontAwesomeIcon icon={faLightbulb} style={styles.infoIcon} />
          <div style={styles.infoText}>
            <strong>L'analyse IA va :</strong><br />
            • Évaluer votre modèle d'affaires<br />
            • Générer un score d'impact (0-100)<br />
            • Proposer des recommandations personnalisées<br />
            • Suggérer des formations adaptées
          </div>
        </div>
      </div>

      {/* Modal des résultats d'analyse */}
      {showAnalyseModal && analyseResult && (
        <div style={styles.modalOverlay} onClick={() => setShowAnalyseModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>
              <FontAwesomeIcon icon={faRobot} color="#667eea" />
              🤖 Résultat de l'analyse IA
            </div>

            <div style={{ ...styles.scoreContainer, background: getScoreColor(analyseResult.scoreImpact) + '20' }}>
              <div style={{ ...styles.scoreValue, color: getScoreColor(analyseResult.scoreImpact) }}>
                {analyseResult.scoreImpact}/100
              </div>
              <div style={{ fontWeight: 'bold', marginTop: '8px' }}>
                {analyseResult.scoreImpact >= 70 ? '🏆 Excellent potentiel !' : 
                 analyseResult.scoreImpact >= 40 ? '📈 Bonne base, à améliorer' : 
                 '⚠️ Potentiel à développer'}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>📊 Secteur détecté :</strong>{' '}
              <span style={{ 
                padding: '4px 12px', 
                borderRadius: '20px', 
                background: darkMode ? '#334155' : '#e2e8f0' 
              }}>
                {analyseResult.secteur?.icone} {analyseResult.secteur?.nom}
              </span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <strong><FontAwesomeIcon icon={faChartLine} /> Feedback IA :</strong>
              <p style={{ marginTop: '8px', lineHeight: '1.5' }}>{analyseResult.feedback}</p>
            </div>

            {analyseResult.recommandations && analyseResult.recommandations.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <strong><FontAwesomeIcon icon={faLightbulb} color="#f59e0b" /> Recommandations :</strong>
                {analyseResult.recommandations.slice(0, 3).map((rec, idx) => (
                  <div key={idx} style={styles.recommandationItem}>
                    💡 {rec}
                  </div>
                ))}
              </div>
            )}

            <button style={styles.closeBtn} onClick={() => setShowAnalyseModal(false)}>
              Voir tous les détails dans "Analyses IA"
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuiviEtapes;