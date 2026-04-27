import React, { useState } from 'react';
import api from '../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBrain, faSpinner, faExclamationTriangle, faCheckCircle, 
  faGraduationCap, faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { iconColors } from '../styles/iconColors';

function AnalyseBMC({ projetId, onAnalyseComplete }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultat, setResultat] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResultat(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Veuillez sélectionner un fichier BMC (PDF)');
      return;
    }

    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('bmc', file);

    try {
      const response = await api.post('/ai/analyser-bmc', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResultat(response.data);
      if (onAnalyseComplete) onAnalyseComplete(response.data);
    } catch (err) {
      console.error('Erreur analyse:', err);
      setError(err.response?.data?.erreur || 'Erreur lors de l\'analyse');
      setResultat(null);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score < 35) return '#ef4444';
    if (score < 65) return '#f59e0b';
    return '#10b981';
  };

  const getScoreText = (score) => {
    if (score < 35) return 'Impact faible';
    if (score < 65) return 'Impact moyen';
    return 'Impact fort';
  };

  const styles = {
    container: {
      background: iconColors.white,
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
    formGroup: { marginBottom: '20px' },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '500',
      color: iconColors.black
    },
    fileInput: {
      width: '100%',
      padding: '12px',
      border: `1px solid #e2e8f0`,
      borderRadius: '12px',
      fontSize: '14px'
    },
    submitBtn: {
      background: iconColors.primary,
      color: iconColors.white,
      border: 'none',
      padding: '12px 24px',
      borderRadius: '12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: 'bold',
      transition: 'transform 0.2s'
    },
    buttonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed'
    },
    loadingState: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      padding: '20px',
      color: iconColors.gray
    },
    scoreContainer: {
      textAlign: 'center',
      padding: '20px',
      background: iconColors.grayBg,
      borderRadius: '16px',
      marginBottom: '20px'
    },
    scoreValue: (score) => ({
      fontSize: '48px',
      fontWeight: 'bold',
      color: getScoreColor(score),
      marginBottom: '8px'
    }),
    scoreLabel: (score) => ({
      fontSize: '16px',
      color: getScoreColor(score),
      fontWeight: '500'
    }),
    secteurBadge: (secteur) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: secteur.couleur + '20',
      color: secteur.couleur,
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '16px'
    }),
    feedbackBox: {
      background: '#f0fdf4',
      color: '#166534',
      padding: '12px',
      borderRadius: '12px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    formationsList: { marginTop: '16px' },
    formationItem: {
      padding: '12px',
      background: iconColors.grayBg,
      borderRadius: '10px',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    errorMsg: {
      background: '#fee2e2',
      color: iconColors.danger,
      padding: '12px',
      borderRadius: '12px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    alertBox: {
      background: '#fef3c7',
      color: '#92400e',
      padding: '12px',
      borderRadius: '12px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <FontAwesomeIcon icon={faBrain} color={iconColors.primary} />
        Analyse d'impact par IA
      </div>

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>📄 Déposez votre Business Model Canvas (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={loading}
            style={styles.fileInput}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          style={{
            ...styles.submitBtn,
            ...(loading ? styles.buttonDisabled : {})
          }}
          onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
        >
          {loading ? (
            <><FontAwesomeIcon icon={faSpinner} spin /> Analyse en cours...</>
          ) : (
            <><FontAwesomeIcon icon={faBrain} /> Analyser mon impact</>
          )}
        </button>
      </form>

      {loading && (
        <div style={styles.loadingState}>
          <FontAwesomeIcon icon={faSpinner} spin />
          <span>Analyse du document en cours...</span>
        </div>
      )}

      {error && (
        <div style={styles.errorMsg}>
          <FontAwesomeIcon icon={faExclamationTriangle} color={iconColors.danger} />
          {' '}{error}
        </div>
      )}

      {resultat && !loading && (
        <div>
          <div style={styles.scoreContainer}>
            <div style={styles.scoreValue(resultat.scoreImpact)}>
              {resultat.scoreImpact}/100
            </div>
            <div style={styles.scoreLabel(resultat.scoreImpact)}>
              {getScoreText(resultat.scoreImpact)}
            </div>
          </div>

          <div style={styles.secteurBadge(resultat.secteur)}>
            {resultat.secteur.icone} {resultat.secteur.nom}
          </div>

          <div style={styles.feedbackBox}>
            <FontAwesomeIcon icon={faInfoCircle} color="#166534" />
            {' '}{resultat.feedback}
          </div>

          {resultat.scoreImpact < 35 && (
            <div style={styles.alertBox}>
              <FontAwesomeIcon icon={faExclamationTriangle} color="#92400e" />
              ⚠️ Impact insuffisant – formations obligatoires recommandées
            </div>
          )}

          <div style={styles.formationsList}>
            <h4 style={{ marginBottom: '12px' }}>
              <FontAwesomeIcon icon={faGraduationCap} color={iconColors.primary} />
              {' '}Formations recommandées :
            </h4>
            {resultat.formations.map((formation, idx) => (
              <div key={idx} style={styles.formationItem}>
                <FontAwesomeIcon icon={faCheckCircle} color={iconColors.success} />
                {formation}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyseBMC;