import React, { useState } from 'react';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';

function GestionAnalysesIA() {
  const { darkMode } = useTheme();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setError(null);
      } else {
        setError('Veuillez déposer un fichier PDF uniquement');
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Veuillez sélectionner un fichier PDF');
        e.target.value = '';
      }
    }
  };

  const handleAnalyse = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier BMC');
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('bmcFile', file);

    try {
      const response = await api.post('/ai/analyser-bmc', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
      alert('✅ Analyse terminée avec succès !');
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'analyse');
    } finally {
      setUploading(false);
    }
  };

  // Fonctions avec paramètre explicite
  const getScoreColor = (scoreValue) => {
    if (scoreValue >= 70) return '#10b981';
    if (scoreValue >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (scoreValue) => {
    if (scoreValue >= 70) return 'Excellent';
    if (scoreValue >= 40) return 'Bon';
    return 'À améliorer';
  };

  const styles = {
    container: {
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '24px',
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
    imageSection: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '24px'
    },
    imageCard: {
      background: darkMode ? '#0f172a' : '#f8fafc',
      borderRadius: '20px',
      padding: '20px',
      textAlign: 'center',
      maxWidth: '400px',
      width: '100%'
    },
    image: {
      width: '100%',
      maxHeight: '180px',
      objectFit: 'contain',
      marginBottom: '12px'
    },
    uploadSection: {
      background: darkMode ? '#0f172a' : '#f8fafc',
      borderRadius: '20px',
      padding: '30px',
      textAlign: 'center',
      border: dragActive ? '2px dashed #667eea' : `2px dashed ${darkMode ? '#475569' : '#cbd5e1'}`
    },
    fileInput: { display: 'none' },
    fileLabel: {
      background: '#667eea',
      color: 'white',
      padding: '10px 24px',
      borderRadius: '30px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      border: 'none',
      fontSize: '14px'
    },
    analyseBtn: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      padding: '12px 28px',
      borderRadius: '40px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      marginTop: '20px'
    },
    errorMsg: {
      background: '#fee2e2',
      color: '#dc2626',
      padding: '12px',
      borderRadius: '12px',
      marginTop: '16px',
      textAlign: 'center'
    },
    resultSection: {
      marginTop: '24px',
      padding: '20px',
      background: darkMode ? '#0f172a' : '#f8fafc',
      borderRadius: '20px'
    },
    scoreCircle: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px'
    },
    scoreInner: {
      width: '90px',
      height: '90px',
      borderRadius: '50%',
      background: darkMode ? '#1e293b' : 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    scoreValue: {
      fontSize: '28px',
      fontWeight: 'bold'
    },
    scoreLabel: {
      fontSize: '12px'
    },
    feedbackText: {
      fontSize: '14px',
      lineHeight: '1.6',
      color: darkMode ? '#cbd5e1' : '#475569',
      marginTop: '16px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <span style={{ fontSize: '24px' }}>🤖</span>
        Analyse d'impact par IA
      </div>

      <div style={styles.imageSection}>
        <div style={styles.imageCard}>
          <img 
            src="/aiincubiny.png" 
            alt="IA Incubiny" 
            style={styles.image} 
            onError={(e) => { e.target.style.display = 'none'; }} 
          />
          <div style={{ marginTop: '8px', color: darkMode ? '#94a3b8' : '#64748b' }}>
            🤖 Notre IA analyse votre Business Model Canvas (BMC)
          </div>
        </div>
      </div>

      <div 
        style={styles.uploadSection} 
        onDragEnter={handleDrag} 
        onDragLeave={handleDrag} 
        onDragOver={handleDrag} 
        onDrop={handleDrop}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: darkMode ? '#ffffff' : '#1e293b' }}>
          Déposez votre Business Model Canvas (PDF)
        </div>
        <div style={{ fontSize: '14px', marginBottom: '16px', color: darkMode ? '#94a3b8' : '#64748b' }}>
          Analyse instantanée - Découvrez votre score d'impact
        </div>
        
        <input type="file" id="bmc-file" accept=".pdf" onChange={handleFileChange} style={styles.fileInput} />
        <label htmlFor="bmc-file" style={styles.fileLabel}>
          📎 Choisir un fichier
        </label>
        
        {file && (
          <div style={{ marginTop: '12px', fontSize: '13px', color: '#667eea' }}>
            📄 {file.name}
          </div>
        )}
        
        <button 
          onClick={handleAnalyse} 
          disabled={uploading || !file}
          style={{
            ...styles.analyseBtn,
            opacity: (uploading || !file) ? 0.6 : 1,
            cursor: (uploading || !file) ? 'not-allowed' : 'pointer'
          }}
        >
          {uploading ? '⏳ Analyse en cours...' : '🔍 Analyser mon impact'}
        </button>
        
        {error && <div style={styles.errorMsg}>{error}</div>}
      </div>

      {/* Affichage des résultats - CORRECTION ICI */}
      {result && result.scoreImpact !== undefined && (
        <div style={styles.resultSection}>
          <div style={styles.scoreCircle}>
            <div style={styles.scoreInner}>
              <div style={{ ...styles.scoreValue, color: getScoreColor(result.scoreImpact) }}>
                {result.scoreImpact}%
              </div>
              <div style={styles.scoreLabel}>{getScoreLabel(result.scoreImpact)}</div>
            </div>
          </div>
          <div style={styles.feedbackText}>
            <strong>🤖 Feedback IA :</strong><br />
            {result.feedback || 'Analyse terminée avec succès.'}
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionAnalysesIA;