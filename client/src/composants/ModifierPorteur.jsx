import React, { useState } from 'react';
import api from '../utils/api';
import Icon from './Icon';
import { iconColors } from '../styles/iconColors';

function ModifierPorteur({ porteur, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    firstName: porteur?.firstName || '',
    lastName: porteur?.lastName || '',
    email: porteur?.email || '',
    telephone: porteur?.telephone || '',
    faculte: porteur?.faculte || '',
    residence: porteur?.residence || '',
    nomProjet: porteur?.nomProjet || ''
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
      await api.put(`/utilisateurs/${porteur._id}`, formData);
      alert('✅ Porteur modifié avec succès');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.response?.data?.message || 'Erreur lors de la modification');
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
      background: iconColors.white,
      borderRadius: '20px',
      padding: '30px',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto'
    },
    title: {
      color: iconColors.primary,
      marginBottom: '20px',
      fontSize: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    formGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '500',
      color: iconColors.black
    },
    input: {
      width: '100%',
      padding: '12px',
      border: `1px solid #e2e8f0`,
      borderRadius: '8px',
      fontSize: '14px',
      fontFamily: 'inherit'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '20px'
    },
    submitBtn: {
      background: iconColors.primary,
      color: iconColors.white,
      padding: '12px 20px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      flex: 1,
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    cancelBtn: {
      background: '#e2e8f0',
      color: iconColors.gray,
      padding: '12px 20px',
      border: 'none',
      borderRadius: '8px',
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
      color: iconColors.danger,
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '15px'
    },
    infoText: {
      background: '#e0e7ff',
      color: iconColors.primary,
      padding: '10px',
      borderRadius: '8px',
      marginBottom: '15px',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <div style={styles.title}>
          <Icon name="user_edit" size={24} color={iconColors.primary} />
          Modifier le porteur
        </div>
        
        {error && <div style={styles.errorMsg}>{error}</div>}
        
        <div style={styles.infoText}>
          <Icon name="info" size={14} color={iconColors.primary} />
          {' '}ID: {porteur?._id?.slice(-8) || 'N/A'}
        </div>

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
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? (
                <><Icon name="pending" size={16} color="white" /> Modification...</>
              ) : (
                <><Icon name="save" size={16} color="white" /> Enregistrer</>
              )}
            </button>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              <Icon name="times" size={16} color={iconColors.gray} /> Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModifierPorteur;