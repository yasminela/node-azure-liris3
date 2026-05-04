import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBrain, faUpload, faSpinner, faChartLine, 
  faCheckCircle, faInfoCircle,
  faFilePdf, faTrashAlt, faDownload,
  faCalendarAlt, faGraduationCap
} from '@fortawesome/free-solid-svg-icons';

function GestionAnalysesIA() {
  const { darkMode } = useTheme();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [historique, setHistorique] = useState([]);
  const [loadingHistorique, setLoadingHistorique] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {
    loadHistorique();
  }, []);

  const loadHistorique = async () => {
    setLoadingHistorique(true);
    try {
      const res = await api.get('/ai/mes-analyses');
      setHistorique(res.data || []);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    } finally {
      setLoadingHistorique(false);
    }
  };

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
    formData.append('bmc', file);

    try {
      const response = await api.post('/ai/analyser-bmc', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        setResult(response.data);
        await loadHistorique();
        setFile(null);
        const fileInput = document.getElementById('bmc-file');
        if (fileInput) fileInput.value = '';
        alert('✅ Analyse terminée !');
        
        await telechargerRapportPDF(response.data.analyseId);
      } else {
        setError(response.data.message || 'Erreur lors de l\'analyse');
      }
    } catch (err) {
      console.error('Erreur analyse:', err);
      setError(err.response?.data?.message || 'Erreur lors de l\'analyse');
    } finally {
      setUploading(false);
    }
  };

  const telechargerRapportPDF = async (analyseId) => {
    setGeneratingPdf(true);
    try {
      const res = await api.get(`/ai/analyse/${analyseId}/rapport`);
      const data = res.data.analyse;
      
      const rapportHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Rapport d'analyse - ${data.porteur.firstName} ${data.porteur.lastName}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center; border-radius: 15px; }
            .score { font-size: 48px; font-weight: bold; text-align: center; padding: 20px; border-radius: 15px; margin: 20px 0; }
            .score-faible { background: #fee2e2; color: #ef4444; }
            .score-moyen { background: #fef3c7; color: #f59e0b; }
            .score-fort { background: #d1fae5; color: #10b981; }
            .section { margin: 25px 0; padding: 20px; background: #f8fafc; border-radius: 12px; }
            .section-title { font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #1e293b; border-left: 4px solid #667eea; padding-left: 12px; }
            .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📊 Rapport d'analyse d'impact</h1>
            <p><strong>Porteur:</strong> ${data.porteur.firstName} ${data.porteur.lastName}</p>
            <p><strong>Email:</strong> ${data.porteur.email}</p>
            <p><strong>Date d'analyse:</strong> ${new Date(data.date).toLocaleDateString('fr-FR')}</p>
          </div>
          <div class="score score-${data.niveau}">
            ${data.score}/100 - Niveau d'impact ${data.niveau === 'faible' ? 'Faible' : data.niveau === 'moyen' ? 'Moyen' : 'Fort'}
          </div>
          <div class="section">
            <div class="section-title">🤖 Feedback de l'IA</div>
            <p>${data.feedbackIA || 'Analyse terminée avec succès.'}</p>
          </div>
          ${data.feedbackAdmin ? `
          <div class="section">
            <div class="section-title">💬 Feedback de l'administrateur</div>
            <p>${data.feedbackAdmin}</p>
          </div>
          ` : ''}
          <div class="section">
            <div class="section-title">📚 Formations recommandées</div>
            <ul>${data.formations.map(f => `<li>${f}</li>`).join('')}</ul>
          </div>
          <div class="footer">
            <p>Document généré par Incubiny - Plateforme d'incubation de startups</p>
            <p>© ${new Date().getFullYear()} Incubiny - Tous droits réservés</p>
          </div>
        </body>
        </html>
      `;
      
      const blob = new Blob([rapportHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport_analyse_${data.porteur.firstName}_${data.porteur.lastName}_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('✅ Rapport téléchargé avec succès !');
    } catch (error) {
      console.error('Erreur génération rapport:', error);
      alert('❌ Erreur lors de la génération du rapport');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const supprimerAnalyse = async (analyseId) => {
    if (!window.confirm('⚠️ Êtes-vous sûr de vouloir supprimer cette analyse ?')) return;

    try {
      await api.delete(`/ai/analyse/${analyseId}`);
      await loadHistorique();
      alert('✅ Analyse supprimée avec succès');
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('❌ Erreur lors de la suppression');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#10b981';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return 'Excellent';
    if (score >= 40) return 'Bon';
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
    uploadSection: {
      background: darkMode ? '#0f172a' : '#f8fafc',
      borderRadius: '20px',
      padding: '30px',
      textAlign: 'center',
      border: dragActive ? '2px dashed #667eea' : `2px dashed ${darkMode ? '#475569' : '#cbd5e1'}`,
      marginBottom: '24px'
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
      gap: '8px'
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
    resultSection: {
      marginTop: '24px',
      padding: '20px',
      background: darkMode ? '#0f172a' : '#f8fafc',
      borderRadius: '20px',
      animation: 'fadeIn 0.3s ease'
    },
    scoreCircle: {
      width: '120px',
      height: '120px',
      margin: '0 auto 16px'
    },
    scoreOuter: (score) => ({
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      background: `conic-gradient(${getScoreColor(score)} ${score * 3.6}deg, ${darkMode ? '#334155' : '#e2e8f0'} 0deg)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }),
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
    scoreValue: (score) => ({ 
      fontSize: '28px', 
      fontWeight: 'bold', 
      color: getScoreColor(score) 
    }),
    scoreLabel: { 
      fontSize: '12px', 
      color: darkMode ? '#94a3b8' : '#64748b' 
    },
    feedbackText: {
      fontSize: '14px',
      lineHeight: '1.6',
      color: darkMode ? '#cbd5e1' : '#475569',
      marginTop: '16px',
      padding: '16px',
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '12px'
    },
    formationsList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginTop: '12px'
    },
    formationTag: {
      background: darkMode ? '#334155' : '#e2e8f0',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      color: darkMode ? '#e2e8f0' : '#475569'
    },
    historiqueSection: {
      marginTop: '24px',
      borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      paddingTop: '20px'
    },
    historiqueTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: darkMode ? '#ffffff' : '#1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    historiqueItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px',
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      flexWrap: 'wrap',
      gap: '10px'
    },
    historiqueScore: (score) => ({
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      background: getScoreColor(score) + '20',
      color: getScoreColor(score)
    }),
    deleteBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '6px 10px',
      borderRadius: '6px',
      transition: 'background 0.2s'
    },
    emptyState: {
      textAlign: 'center',
      padding: '30px',
      color: darkMode ? '#94a3b8' : '#64748b'
    },
    fileInfo: {
      marginTop: '12px',
      padding: '8px 12px',
      background: darkMode ? '#334155' : '#e2e8f0',
      borderRadius: '10px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '13px',
      color: darkMode ? '#e2e8f0' : '#475569'
    },
    removeFileBtn: {
      background: '#ef4444',
      color: 'white',
      border: 'none',
      padding: '4px 8px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '11px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <FontAwesomeIcon icon={faBrain} color="#667eea" size="24px" />
        Analyse d'impact par IA
      </div>

      {/* Section upload */}
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
          Analyse instantanée - Téléchargement automatique du rapport
        </div>
        
        <input type="file" id="bmc-file" accept=".pdf" onChange={handleFileChange} style={styles.fileInput} />
        <label htmlFor="bmc-file" style={styles.fileLabel}>
          <FontAwesomeIcon icon={faUpload} /> Choisir un fichier
        </label>
        
        {file && (
          <div style={styles.fileInfo}>
            <FontAwesomeIcon icon={faFilePdf} color="#ef4444" />
            <span>{file.name}</span>
            <button onClick={() => setFile(null)} style={styles.removeFileBtn}>
              <FontAwesomeIcon icon={faTrashAlt} size="sm" /> Supprimer
            </button>
          </div>
        )}
        
        {!file && (
          <div style={{ marginTop: '12px', fontSize: '12px', color: darkMode ? '#64748b' : '#94a3b8' }}>
            ou glissez-déposez votre fichier ici
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
          {uploading ? (
            <><FontAwesomeIcon icon={faSpinner} spin /> Analyse en cours...</>
          ) : (
            <><FontAwesomeIcon icon={faChartLine} /> Analyser mon impact</>
          )}
        </button>
        
        {error && <div style={{ marginTop: '12px', color: '#ef4444', fontSize: '13px' }}>{error}</div>}
      </div>

      {/* Résultat de l'analyse */}
      {result && (
        <div style={styles.resultSection}>
          <div style={styles.scoreCircle}>
            <div style={styles.scoreOuter(result.scoreImpact)}>
              <div style={styles.scoreInner}>
                <div style={styles.scoreValue(result.scoreImpact)}>{result.scoreImpact}%</div>
                <div style={styles.scoreLabel}>{getScoreLabel(result.scoreImpact)}</div>
              </div>
            </div>
          </div>

          <div style={styles.feedbackText}>
            <strong><FontAwesomeIcon icon={faInfoCircle} /> Feedback IA :</strong><br />
            {result.feedback || 'Analyse terminée avec succès.'}
          </div>

          {result.secteur && (
            <div style={{ marginTop: '16px' }}>
              <strong>🎯 Secteur détecté :</strong> {result.secteur.icone} {result.secteur.nom}
            </div>
          )}

          {result.formations && result.formations.length > 0 && (
            <>
              <div style={{ marginTop: '20px' }}>
                <strong>📚 Formations recommandées :</strong>
              </div>
              <div style={styles.formationsList}>
                {result.formations.map((formation, idx) => (
                  <span key={idx} style={styles.formationTag}>
                    <FontAwesomeIcon icon={faCheckCircle} size="10px" style={{ marginRight: '4px', color: '#10b981' }} />
                    {formation}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Historique des analyses */}
      <div style={styles.historiqueSection}>
        <div style={styles.historiqueTitle}>
          <FontAwesomeIcon icon={faChartLine} color="#667eea" />
          Historique des analyses
        </div>
        
        {loadingHistorique ? (
          <div style={styles.emptyState}>Chargement...</div>
        ) : historique.length === 0 ? (
          <div style={styles.emptyState}>
            Aucune analyse effectuée pour le moment
          </div>
        ) : (
          historique.map(analyse => (
            <div key={analyse._id} style={styles.historiqueItem}>
              <div>
                <div style={{ fontWeight: 'bold', color: darkMode ? '#ffffff' : '#1e293b' }}>
                  {analyse.fichierBMC || 'Analyse BMC'}
                </div>
                <div style={{ fontSize: '11px', color: darkMode ? '#94a3b8' : '#64748b' }}>
                  {new Date(analyse.dateAnalyse).toLocaleDateString('fr-FR')}
                  {analyse.feedbackAdmin && <span style={{ marginLeft: '8px', color: '#10b981' }}>📝 Feedback reçu</span>}
                </div>
              </div>
              <div style={styles.historiqueScore(analyse.scoreImpact)}>
                {analyse.scoreImpact}/100
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => telechargerRapportPDF(analyse._id)}
                  style={styles.deleteBtn}
                  title="Télécharger rapport"
                  disabled={generatingPdf}
                >
                  <FontAwesomeIcon icon={faDownload} color="#667eea" />
                </button>
                <button 
                  onClick={() => supprimerAnalyse(analyse._id)}
                  style={styles.deleteBtn}
                  title="Supprimer"
                >
                  <FontAwesomeIcon icon={faTrashAlt} color="#ef4444" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `
      }} />
    </div>
  );
}

export default GestionAnalysesIA;