import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faDownload, faComment, faTrash,
  faSpinner, faEnvelope, faEye
} from '@fortawesome/free-solid-svg-icons';
import { iconColors } from '../styles/iconColors';

function GestionAnalysesIA() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalyse, setSelectedAnalyse] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/ai/toutes-les-analyses');
      console.log('📊 Analyses reçues:', res.data);
      setAnalyses(res.data);
    } catch (error) {
      console.error('Erreur chargement analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const token = localStorage.getItem('token');
console.log('🔑 Token présent:', token ? 'Oui' : 'Non');
console.log('🔑 Token:', token?.substring(0, 50) + '...');

  const generatePDF = (analyse) => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Rapport d'analyse d'impact - ${analyse.porteurId?.firstName} ${analyse.porteurId?.lastName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center; border-radius: 10px; }
          .score { font-size: 48px; font-weight: bold; text-align: center; padding: 20px; border-radius: 10px; margin: 20px 0; }
          .score-faible { background: #fee2e2; color: #ef4444; }
          .score-moyen { background: #fef3c7; color: #f59e0b; }
          .score-fort { background: #d1fae5; color: #10b981; }
          .info { margin: 20px 0; padding: 15px; background: #f8fafc; border-radius: 10px; }
          .secteur { display: inline-block; padding: 8px 16px; border-radius: 20px; margin: 10px 0; }
          .feedback { background: #f0fdf4; padding: 15px; border-radius: 10px; margin: 20px 0; }
          .formation { padding: 10px; background: #f1f5f9; border-radius: 8px; margin: 8px 0; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Rapport d'analyse d'impact</h1>
          <p>Porteur: ${analyse.porteurId?.firstName} ${analyse.porteurId?.lastName}</p>
          <p>Email: ${analyse.porteurId?.email}</p>
          <p>Date: ${new Date(analyse.dateAnalyse).toLocaleDateString('fr-FR')}</p>
        </div>
        <div class="score score-${analyse.niveauImpact === 'faible' ? 'faible' : analyse.niveauImpact === 'moyen' ? 'moyen' : 'fort'}">
          ${analyse.scoreImpact}/100 - ${analyse.niveauImpact === 'faible' ? 'Impact faible' : analyse.niveauImpact === 'moyen' ? 'Impact moyen' : 'Impact fort'}
        </div>
        <div class="info">
          <strong>📎 Fichier BMC :</strong> ${analyse.fichierBMC || 'Non spécifié'}<br>
          <strong>🎯 Secteur :</strong> ${analyse.secteur?.icone || ''} ${analyse.secteur?.nom || 'Non détecté'}
        </div>
        <div class="feedback">
          <strong>🤖 Feedback IA :</strong><br>${analyse.feedback || 'Aucun feedback'}
        </div>
        <h3>📚 Formations recommandées :</h3>
        ${analyse.formations?.map(f => `<div class="formation">✅ ${f}</div>`).join('') || '<p>Aucune formation recommandée</p>'}
        <div class="footer">
          Document généré par Incubiny - Plateforme d'incubation de startups
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

const supprimerAnalyse = async (analyseId) => {
  console.log('🗑️ Suppression de l\'analyse:', analyseId);
  
  if (!confirm('⚠️ Êtes-vous sûr de vouloir supprimer cette analyse ? Cette action est irréversible.')) {
    return;
  }
  
  try {
    const response = await api.delete(`/ai/analyse/${analyseId}`);
    console.log('📥 Réponse:', response.data);
    
    if (response.data.success) {
      alert('✅ Analyse supprimée avec succès');
      loadAnalyses(); // Recharger la liste
    } else {
      alert('❌ ' + (response.data.message || 'Erreur lors de la suppression'));
    }
  } catch (error) {
    console.error('❌ Erreur détaillée:', error);
    
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📄 Message:', error.response.data);
      alert(`❌ Erreur ${error.response.status}: ${error.response.data?.message || 'Erreur serveur'}`);
    } else if (error.request) {
      console.error('📡 Pas de réponse du serveur');
      alert('❌ Le serveur ne répond pas. Vérifiez que le backend est démarré.');
    } else {
      console.error('💥 Erreur de requête:', error.message);
      alert(`❌ Erreur: ${error.message}`);
    }
  }
};

  const voirDetails = (analyse) => {
    setSelectedDetails(analyse);
    setShowDetailsModal(true);
  };

  const sendFeedback = async (analyseId) => {
    if (!feedback.trim()) {
      alert('Veuillez saisir un feedback');
      return;
    }
    
    setSendingFeedback(true);
    try {
      await api.post(`/notifications/analyses/${analyseId}/feedback`, {
        feedback: feedback,
        porteurId: selectedAnalyse.porteurId._id
      });
      alert('✅ Feedback envoyé au porteur');
      setSelectedAnalyse(null);
      setFeedback('');
      loadAnalyses();
    } catch (error) {
      console.error('Erreur envoi feedback:', error);
      alert('❌ Erreur lors de l\'envoi du feedback');
    } finally {
      setSendingFeedback(false);
    }
  };

  const getScoreColor = (score) => {
    if (score < 35) return '#ef4444';
    if (score < 65) return '#f59e0b';
    return '#10b981';
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
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '12px', textAlign: 'left', background: iconColors.grayBg, borderBottom: '2px solid #e2e8f0' },
    td: { padding: '12px', borderBottom: '1px solid #e2e8f0' },
    badge: (score) => ({
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      background: getScoreColor(score) + '20',
      color: getScoreColor(score)
    }),
    actionBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '6px',
      marginRight: '8px',
      borderRadius: '6px',
      transition: 'all 0.2s'
    },
    deleteBtn: {
      background: '#ef4444',
      color: 'white',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '12px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px'
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
      padding: '24px',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto'
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: iconColors.primary,
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    modalCloseBtn: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      float: 'right'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      borderRadius: '10px',
      border: '1px solid #e2e8f0',
      marginBottom: '16px',
      minHeight: '100px',
      fontFamily: 'inherit'
    },
    emptyState: { textAlign: 'center', padding: '40px', color: iconColors.grayLight }
  };

  if (loading) {
    return <div style={styles.container}>Chargement des analyses...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <FontAwesomeIcon icon={faChartLine} color={iconColors.primary} />
        Analyses IA des BMC
      </div>

      {analyses.length === 0 ? (
        <div style={styles.emptyState}>
          <FontAwesomeIcon icon={faChartLine} size={48} color="#cbd5e1" />
          <p>Aucune analyse IA reçue pour le moment</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Porteur</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Fichier</th>
                <th style={styles.th}>Score</th>
                <th style={styles.th}>Secteur</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {analyses.map((analyse) => (
                <tr key={analyse._id}>
                  <td style={styles.td}>
                    <strong>{analyse.porteurId?.firstName} {analyse.porteurId?.lastName}</strong><br />
                    <small style={{ color: iconColors.gray }}>{analyse.porteurId?.email}</small>
                  </td>
                  <td style={styles.td}>{new Date(analyse.dateAnalyse).toLocaleDateString('fr-FR')}</td>
                  <td style={styles.td}>{analyse.fichierBMC?.substring(0, 30)}...</td>
                  <td style={styles.td}>
                    <span style={styles.badge(analyse.scoreImpact)}>
                      {analyse.scoreImpact}/100
                    </span>
                  </td>
                  <td style={styles.td}>{analyse.secteur?.icone} {analyse.secteur?.nom}</td>
                  <td style={styles.td}>
                    <button 
                      onClick={() => voirDetails(analyse)} 
                      style={styles.actionBtn}
                      title="Voir détails"
                    >
                      <FontAwesomeIcon icon={faEye} color={iconColors.info} size="lg" />
                    </button>
                    <button 
                      onClick={() => generatePDF(analyse)} 
                      style={styles.actionBtn}
                      title="Télécharger PDF"
                    >
                      <FontAwesomeIcon icon={faDownload} color={iconColors.primary} size="lg" />
                    </button>
                    <button 
                      onClick={() => setSelectedAnalyse(analyse)} 
                      style={styles.actionBtn}
                      title="Ajouter un feedback"
                    >
                      <FontAwesomeIcon icon={faComment} color={iconColors.warning} size="lg" />
                    </button>
                    <button 
                      onClick={() => supprimerAnalyse(analyse._id)} 
                      style={styles.deleteBtn}
                      title="Supprimer"
                    >
                      <FontAwesomeIcon icon={faTrash} size="sm" /> Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Détails */}
      {showDetailsModal && selectedDetails && (
        <div style={styles.modalOverlay} onClick={() => setShowDetailsModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.modalCloseBtn} onClick={() => setShowDetailsModal(false)}>×</button>
            <div style={styles.modalTitle}>
              <FontAwesomeIcon icon={faChartLine} color={iconColors.primary} />
              Détails de l'analyse
            </div>
            <div><strong>Porteur:</strong> {selectedDetails.porteurId?.firstName} {selectedDetails.porteurId?.lastName}</div>
            <div><strong>Email:</strong> {selectedDetails.porteurId?.email}</div>
            <div><strong>Date:</strong> {new Date(selectedDetails.dateAnalyse).toLocaleString()}</div>
            <div><strong>Fichier:</strong> {selectedDetails.fichierBMC}</div>
            <div style={{ marginTop: '15px', padding: '15px', background: '#f8fafc', borderRadius: '10px' }}>
              <strong>Score:</strong> {selectedDetails.scoreImpact}/100
            </div>
            <div style={{ marginTop: '10px' }}><strong>Secteur:</strong> {selectedDetails.secteur?.icone} {selectedDetails.secteur?.nom}</div>
            <div style={{ marginTop: '10px' }}><strong>Feedback IA:</strong> {selectedDetails.feedback}</div>
            {selectedDetails.formations?.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <strong>Formations recommandées:</strong>
                <ul>{selectedDetails.formations.map((f, i) => <li key={i}>✅ {f}</li>)}</ul>
              </div>
            )}
            <button onClick={() => setShowDetailsModal(false)} style={{ marginTop: '20px', background: '#667eea', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', width: '100%' }}>Fermer</button>
          </div>
        </div>
      )}

      {/* Modal Feedback */}
      {selectedAnalyse && (
        <div style={styles.modalOverlay} onClick={() => setSelectedAnalyse(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.modalCloseBtn} onClick={() => setSelectedAnalyse(null)}>×</button>
            <div style={styles.modalTitle}>
              <FontAwesomeIcon icon={faComment} color={iconColors.primary} />
              Feedback pour {selectedAnalyse.porteurId?.firstName} {selectedAnalyse.porteurId?.lastName}
            </div>
            <div style={{ marginBottom: '16px', padding: '12px', background: '#f8fafc', borderRadius: '10px' }}>
              <p><strong>Score:</strong> {selectedAnalyse.scoreImpact}/100</p>
              <p><strong>Fichier:</strong> {selectedAnalyse.fichierBMC}</p>
            </div>
            <textarea
              placeholder="Ajoutez votre feedback pour le porteur..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              style={styles.textarea}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => sendFeedback(selectedAnalyse._id)} 
                disabled={sendingFeedback}
                style={{
                  background: iconColors.primary,
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {sendingFeedback ? <><FontAwesomeIcon icon={faSpinner} spin /> Envoi...</> : <><FontAwesomeIcon icon={faEnvelope} /> Envoyer le feedback</>}
              </button>
              <button 
                onClick={() => setSelectedAnalyse(null)} 
                style={{
                  background: '#e2e8f0',
                  color: '#475569',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionAnalysesIA;