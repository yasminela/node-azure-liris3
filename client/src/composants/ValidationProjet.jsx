import React, { useState } from 'react';
import api from '../utils/api';

function ValidationProjet({ projet, onClose, onSuccess }) {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleValidation = async (estValide) => {
    if (!estValide && !feedback) {
      alert('Veuillez ajouter un feedback pour expliquer le rejet');
      return;
    }
    
    setLoading(true);
    try {
      if (estValide) {
        await api.put(`/api/projets/valider/${projet._id}`, { feedback });
        alert('Projet validé avec succès ! Le porteur a été notifié.');
      } else {
        await api.put(`/api/projets/rejeter/${projet._id}`, { feedback });
        alert(' Projet rejeté. Le porteur a été notifié avec votre feedback.');
      }
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      alert('Erreur: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
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
      zIndex: 1000
    },
    modalContent: {
      background: 'white',
      borderRadius: '20px',
      padding: '30px',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '80vh',
      overflowY: 'auto'
    },
    header: {
      borderBottom: '2px solid #667eea',
      paddingBottom: '15px',
      marginBottom: '20px'
    },
    title: {
      color: '#667eea',
      fontSize: '24px'
    },
    section: {
      marginBottom: '20px'
    },
    label: {
      fontWeight: 'bold',
      color: '#333',
      display: 'block',
      marginBottom: '5px'
    },
    value: {
      background: '#f7fafc',
      padding: '10px',
      borderRadius: '8px',
      color: '#666'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '14px',
      minHeight: '100px',
      marginTop: '10px'
    },
    buttonGroup: {
      display: 'flex',
      gap: '15px',
      marginTop: '20px'
    },
    btnValider: {
      background: '#10b981',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      flex: 1
    },
    btnRejeter: {
      background: '#ef4444',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      flex: 1
    },
    btnAnnuler: {
      background: '#e2e8f0',
      color: '#333',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '16px',
      flex: 1
    },
    statutBadge: {
      display: 'inline-block',
      padding: '5px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold'
    },
    statutEnAttente: { background: '#fef3c7', color: '#d97706' },
    statutValide: { background: '#d1fae5', color: '#059669' },
    statutRejete: { background: '#fee2e2', color: '#dc2626' }
  };

  const getStatutBadge = () => {
    switch(projet.statut) {
      case 'en_attente': return <span style={{...styles.statutBadge, ...styles.statutEnAttente}}> En attente</span>;
      case 'valide': return <span style={{...styles.statutBadge, ...styles.statutValide}}> Validé</span>;
      case 'rejete': return <span style={{...styles.statutBadge, ...styles.statutRejete}}> Rejeté</span>;
      default: return null;
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <div style={styles.header}>
          <h2 style={styles.title}> Validation du projet</h2>
          {getStatutBadge()}
        </div>

        <div style={styles.section}>
          <label style={styles.label}> Titre du projet</label>
          <div style={styles.value}>{projet.titre}</div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}> Description</label>
          <div style={styles.value}>{projet.description}</div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}> Secteur</label>
          <div style={styles.value}>{projet.secteur || 'Non renseigné'}</div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}> Budget</label>
          <div style={styles.value}>{projet.budget ? `${projet.budget} €` : 'Non renseigné'}</div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}> Porteur du projet</label>
          <div style={styles.value}>{projet.porteurId?.firstName} {projet.porteurId?.lastName}</div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
            {projet.porteurId?.email}<br />
            {projet.porteurId?.telephone || 'Non renseigné'}
          </div>
        </div>

        {projet.feedback && (
          <div style={styles.section}>
            <label style={styles.label}> Feedback précédent</label>
            <div style={{...styles.value, background: '#fee2e2'}}>{projet.feedback}</div>
          </div>
        )}

        <div style={styles.section}>
          <label style={styles.label}> Feedback (obligatoire pour un rejet)</label>
          <textarea
            style={styles.textarea}
            placeholder="Ajoutez un commentaire pour le porteur..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        <div style={styles.buttonGroup}>
          <button style={styles.btnValider} onClick={() => handleValidation(true)} disabled={loading}>
            {loading ? 'Traitement...' : ' Valider le projet'}
          </button>
          <button style={styles.btnRejeter} onClick={() => handleValidation(false)} disabled={loading}>
            {loading ? 'Traitement...' : ' Demander des modifications'}
          </button>
          <button style={styles.btnAnnuler} onClick={onClose}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

export default ValidationProjet;