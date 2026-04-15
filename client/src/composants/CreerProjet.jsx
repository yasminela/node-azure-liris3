import React, { useState } from 'react';
import api from '../utils/api';

function CreerProjet({ onClose, onSuccess }) {
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
      alert(' Projet créé avec succès ! En attente de validation par l\'admin.');
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
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    },
    modalContent: {
      background: 'white', borderRadius: '20px', padding: '30px',
      maxWidth: '500px', width: '90%'
    },
    title: { color: '#667eea', marginBottom: '20px' },
    input: {
      width: '100%', padding: '10px', border: '1px solid #ddd',
      borderRadius: '8px', marginBottom: '15px'
    },
    textarea: {
      width: '100%', padding: '10px', border: '1px solid #ddd',
      borderRadius: '8px', marginBottom: '15px', minHeight: '100px'
    },
    buttonGroup: { display: 'flex', gap: '10px', marginTop: '20px' },
    submitBtn: { background: '#10b981', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', flex: 1 },
    cancelBtn: { background: '#e2e8f0', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', flex: 1 },
    error: { background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '15px' }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h2 style={styles.title}> Créer un nouveau projet</h2>
        
        {error && <div style={styles.error}> {error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Titre du projet *"
            value={formData.titre}
            onChange={(e) => setFormData({...formData, titre: e.target.value})}
            required
            style={styles.input}
          />
          
          <textarea
            placeholder="Description du projet"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            style={styles.textarea}
          />
          
          <input
            type="number"
            placeholder="Budget prévisionnel (€)"
            value={formData.budget}
            onChange={(e) => setFormData({...formData, budget: e.target.value})}
            style={styles.input}
          />

          <div style={styles.buttonGroup}>
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Création...' : ' Créer le projet'}
            </button>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreerProjet;