import React, { useState } from 'react';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faTimes, faSpinner, faEuroSign, faAlignLeft } from '@fortawesome/free-solid-svg-icons';

function CreerProjet({ onClose, onSuccess }) {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    budget: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/projets', formData);
      alert('✅ Projet créé avec succès ! En attente de validation par l\'admin.');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la création');
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
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    },
    modalContent: {
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '24px',
      padding: 'clamp(20px, 5vw, 32px)',
      maxWidth: '500px',
      width: '90%',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: darkMode ? '#ffffff' : '#1e293b',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    subtitle: {
      fontSize: '14px',
      color: darkMode ? '#94a3b8' : '#64748b',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: darkMode ? '#e2e8f0' : '#475569',
      fontSize: '14px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`,
      borderRadius: '12px',
      fontSize: '14px',
      backgroundColor: darkMode ? '#0f172a' : 'white',
      color: darkMode ? '#f1f5f9' : '#1e293b',
      transition: 'all 0.2s ease'
    },
    textarea: {
      width: '100%',
      padding: '12px 16px',
      border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`,
      borderRadius: '12px',
      fontSize: '14px',
      backgroundColor: darkMode ? '#0f172a' : 'white',
      color: darkMode ? '#f1f5f9' : '#1e293b',
      minHeight: '100px',
      fontFamily: 'inherit',
      resize: 'vertical'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px'
    },
    submitBtn: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      flex: 1,
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    cancelBtn: {
      background: darkMode ? '#334155' : '#e2e8f0',
      color: darkMode ? '#f1f5f9' : '#475569',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      flex: 1,
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    errorMsg: {
      background: '#fee2e2',
      color: '#dc2626',
      padding: '12px',
      borderRadius: '12px',
      marginBottom: '20px',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <div style={styles.title}>
          <FontAwesomeIcon icon={faBuilding} color="#667eea" size="24px" />
          Créer un nouveau projet
        </div>
        <div style={styles.subtitle}>
          Remplissez les informations de votre projet d'incubation
        </div>

        {error && <div style={styles.errorMsg}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FontAwesomeIcon icon={faBuilding} style={{ marginRight: '6px' }} />
              Titre du projet *
            </label>
            <input
              type="text"
              placeholder="Ex: Application mobile pour l'éducation"
              value={formData.titre}
              onChange={(e) => setFormData({...formData, titre: e.target.value})}
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FontAwesomeIcon icon={faAlignLeft} style={{ marginRight: '6px' }} />
              Description du projet
            </label>
            <textarea
              placeholder="Décrivez brièvement votre projet, sa mission et ses objectifs..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={styles.textarea}
              rows="4"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FontAwesomeIcon icon={faEuroSign} style={{ marginRight: '6px' }} />
              Budget prévisionnel (€)
            </label>
            <input
              type="number"
              placeholder="Ex: 50000"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              style={styles.input}
            />
          </div>

          <div style={styles.buttonGroup}>
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? (
                <><FontAwesomeIcon icon={faSpinner} spin /> Création...</>
              ) : (
                <><FontAwesomeIcon icon={faBuilding} /> Créer le projet</>
              )}
            </button>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              <FontAwesomeIcon icon={faTimes} /> Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreerProjet;