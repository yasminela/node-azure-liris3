import React, { useState } from 'react';
import api from '../utils/api';
import Icon from './Icon';

function CreationPorteur({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    telephone: '',
    faculte: '',
    residence: '',
    nomProjet: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/utilisateurs', formData);
      alert(' Porteur créé avec succès');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
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
      maxWidth: '500px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    title: {
      color: '#667eea',
      marginBottom: '20px',
      fontSize: '24px'
    },
    formGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: '500',
      color: '#333'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '14px'
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px',
      marginTop: '20px'
    },
    submitBtn: {
      background: '#667eea',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      flex: 1
    },
    cancelBtn: {
      background: '#e2e8f0',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      flex: 1
    },
    error: {
      background: '#fee2e2',
      color: '#dc2626',
      padding: '10px',
      borderRadius: '8px',
      marginBottom: '15px',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h2 style={styles.title}> Créer un porteur</h2>
        
        {error && <div style={styles.error}> {error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Prénom *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Prénom du porteur"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Nom *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Nom du porteur"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="email@exemple.com"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Mot de passe *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Mot de passe"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Téléphone</label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              style={styles.input}
              placeholder="+216 XX XXX XXX"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Faculté / Établissement</label>
            <input
              type="text"
              name="faculte"
              value={formData.faculte}
              onChange={handleChange}
              style={styles.input}
              placeholder="Nom de l'établissement"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Résidence / Ville</label>
            <input
              type="text"
              name="residence"
              value={formData.residence}
              onChange={handleChange}
              style={styles.input}
              placeholder="Ville de résidence"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Nom du projet</label>
            <input
              type="text"
              name="nomProjet"
              value={formData.nomProjet}
              onChange={handleChange}
              style={styles.input}
              placeholder="Titre du projet"
            />
          </div>

          <div style={styles.buttonGroup}>
           <button type="submit" style={styles.submitBtn}>
  <Icon name="user_add" size={18} color="white" />
  Créer le porteur
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

export default CreationPorteur;