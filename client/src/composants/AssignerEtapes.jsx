import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Icon from './Icon';
import { iconColors } from '../styles/iconColors';

function AssignerEtapes({ onClose, onSuccess }) {
  const [porteurs, setPorteurs] = useState([]);
  const [selectedPorteur, setSelectedPorteur] = useState('');
  const [projets, setProjets] = useState([]);
  const [selectedProjet, setSelectedProjet] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    loadPorteurs();
    loadProjets();
  }, []);

  const loadPorteurs = async () => {
    try {
      const res = await api.get('/utilisateurs');
      setPorteurs(res.data.filter(u => u.role === 'porteur'));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const loadProjets = async () => {
    try {
      const res = await api.get('/projets/tous');
      setProjets(res.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const etapesEarlyStage = [
    { numero: 1, titre: "Idéation", description: "Présentez votre idée de projet", mois: 1 },
    { numero: 2, titre: "Business Model Canvas", description: "Complétez votre BMC", mois: 2 },
    { numero: 3, titre: "Étude de marché", description: "Analyse du marché", mois: 2 },
    { numero: 4, titre: "Hypothèses critiques", description: "Listez vos hypothèses critiques", mois: 2 },
    { numero: 5, titre: "Étude financière", description: "Prévisionnel financier", mois: 3 },
    { numero: 6, titre: "Propriété intellectuelle", description: "Protection de l'innovation", mois: 3 },
    { numero: 7, titre: "Branding", description: "Logo et charte graphique", mois: 5 },
    { numero: 8, titre: "Marketing digital", description: "Stratégie marketing", mois: 5 },
    { numero: 9, titre: "Pitch deck", description: "Présentation PowerPoint", mois: 5 },
    { numero: 10, titre: "Dossier incubation", description: "Candidature à l'incubation", mois: 6 },
    { numero: 11, titre: "Soutenance finale", description: "Présentation orale", mois: 6 }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      await api.post('/etapes/assigner-early-stage', {
        porteurId: selectedPorteur,
        projetId: selectedProjet
      });
      
      setMessageType('success');
      setMessage(`✅ ${etapesEarlyStage.length} étapes assignées avec succès !`);
      
      if (onSuccess) onSuccess();
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      console.error('Erreur:', error);
      setMessageType('error');
      setMessage(error.response?.data?.message || '❌ Erreur lors de l\'assignation');
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
      maxWidth: '550px',
      width: '90%',
      maxHeight: '85vh',
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
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '500',
      color: iconColors.black,
      fontSize: '14px'
    },
    select: {
      width: '100%',
      padding: '12px',
      border: `1px solid #e2e8f0`,
      borderRadius: '10px',
      fontSize: '14px',
      fontFamily: 'inherit',
      backgroundColor: iconColors.white
    },
    etapesList: {
      background: iconColors.grayBg,
      padding: '15px',
      borderRadius: '12px',
      marginBottom: '20px'
    },
    etapesTitle: {
      fontWeight: 'bold',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: iconColors.black
    },
    etapeItem: {
      fontSize: '12px',
      marginBottom: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: iconColors.gray
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '20px'
    },
    submitBtn: {
      background: `linear-gradient(135deg, ${iconColors.primary} 0%, ${iconColors.primaryDark} 100%)`,
      color: iconColors.white,
      padding: '12px 20px',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      flex: 1,
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'transform 0.2s'
    },
    cancelBtn: {
      background: '#e2e8f0',
      color: iconColors.gray,
      padding: '12px 20px',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      flex: 1,
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'transform 0.2s'
    },
    messageBox: {
      padding: '12px',
      borderRadius: '10px',
      marginBottom: '20px',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    success: {
      background: '#d1fae5',
      color: iconColors.success
    },
    error: {
      background: '#fee2e2',
      color: iconColors.danger
    },
    loadingState: {
      textAlign: 'center',
      padding: '20px'
    },
    badge: {
      background: iconColors.primary,
      color: iconColors.white,
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '10px',
      marginLeft: '8px'
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <div style={styles.title}>
          <Icon name="assignment" size={24} color={iconColors.primary} />
          Assigner le programme Early-Stage
          <span style={styles.badge}>{etapesEarlyStage.length} étapes</span>
        </div>

        {message && (
          <div style={{ ...styles.messageBox, ...(messageType === 'success' ? styles.success : styles.error) }}>
            <Icon name={messageType === 'success' ? 'check_st' : 'exclamation_point'} size={16} color={messageType === 'success' ? iconColors.success : iconColors.danger} />
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Icon name="user" size={12} color={iconColors.primary} />
              {' '}Sélectionner un porteur
            </label>
            <select
              value={selectedPorteur}
              onChange={(e) => setSelectedPorteur(e.target.value)}
              required
              style={styles.select}
            >
              <option value="">-- Choisir un porteur --</option>
              {porteurs.map(p => (
                <option key={p._id} value={p._id}>
                  {p.firstName} {p.lastName} ({p.email})
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Icon name="business" size={12} color={iconColors.primary} />
              {' '}Sélectionner un projet
            </label>
            <select
              value={selectedProjet}
              onChange={(e) => setSelectedProjet(e.target.value)}
              required
              style={styles.select}
            >
              <option value="">-- Choisir un projet --</option>
              {projets.map(p => (
                <option key={p._id} value={p._id}>
                  {p.titre || p.nomProjet}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.etapesList}>
            <div style={styles.etapesTitle}>
              <Icon name="task_checklist" size={16} color={iconColors.primary} />
              Programme à assigner :
            </div>
            {etapesEarlyStage.map((e, idx) => (
              <div key={idx} style={styles.etapeItem}>
                <Icon name="check" size={10} color={iconColors.success} />
                Mois {e.mois} - {e.titre}
              </div>
            ))}
          </div>

          <div style={styles.buttonGroup}>
            <button 
              type="submit" 
              disabled={loading} 
              style={styles.submitBtn}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {loading ? (
                <><Icon name="pending" size={16} color={iconColors.white} /> Assignation...</>
              ) : (
                <><Icon name="send" size={16} color={iconColors.white} /> Assigner les étapes</>
              )}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              style={styles.cancelBtn}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Icon name="times" size={16} color={iconColors.gray} />
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssignerEtapes;