import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck, faUserPlus, faChartLine, faFile, faCheckCircle, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { iconColors } from '../styles/iconColors';

function ScoreProfil() {
  const [score, setScore] = useState(0);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadScore();
  }, []);

  const loadScore = async () => {
    try {
      const res = await api.get('/profil/details-score');
      setScore(res.data.scoreTotal);
      setDetails(res.data);
    } catch (error) {
      console.error('Erreur chargement score:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = () => {
    if (score >= 80) return '#10b981';
    if (score >= 50) return '#f59e0b';
    if (score >= 20) return '#3b82f6';
    return '#ef4444';
  };

  const getIcone = () => {
    if (score >= 80) return faUserCheck;
    if (score >= 50) return faChartLine;
    if (score >= 20) return faFile;
    return faUserPlus;
  };

  const getMessage = () => {
    if (score >= 80) return 'Excellent ! Votre profil est complet.';
    if (score >= 50) return 'Bien ! Continuez à soumettre vos documents.';
    if (score >= 20) return 'Commencez à soumettre vos documents pour progresser.';
    return 'Soumettez votre premier document pour débuter.';
  };

  if (loading) return null;

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      border: `1px solid ${getScoreColor()}30`
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: getScoreColor() + '15',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FontAwesomeIcon icon={getIcone()} size="2x" color={getScoreColor()} />
          </div>
          <div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Progression du profil</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: getScoreColor() }}>
              {score}%
            </div>
            <div style={{ fontSize: '12px', color: getScoreColor() }}>
              {score >= 80 ? 'Excellent' : score >= 50 ? 'En progression' : score >= 20 ? 'Débutant' : 'Inactif'}
            </div>
          </div>
        </div>
        
        <div style={{ flex: 1, maxWidth: '300px' }}>
          <div style={{
            height: '8px',
            background: '#e2e8f0',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${score}%`,
              height: '100%',
              background: getScoreColor(),
              borderRadius: '4px',
              transition: 'width 0.5s ease'
            }}></div>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
            {getMessage()}
          </p>
          <button 
            onClick={() => setShowDetails(!showDetails)}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              fontSize: '11px',
              cursor: 'pointer',
              marginTop: '5px',
              textDecoration: 'underline'
            }}
          >
            {showDetails ? 'Masquer les détails' : 'Voir les détails'}
          </button>
        </div>
      </div>

      {showDetails && details && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#f8fafc',
          borderRadius: '12px',
          borderTop: `2px solid ${getScoreColor()}`
        }}>
          <h4 style={{ marginBottom: '15px', fontSize: '14px', color: '#1e293b' }}>Détail de la progression</h4>
          
          {/* Informations personnelles */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span><FontAwesomeIcon icon={faUserCheck} /> Informations personnelles</span>
              <span>{details.personnel?.obtenu || 0}/{details.personnel?.total || 20}</span>
            </div>
            <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', marginTop: '4px' }}>
              <div style={{ width: `${((details.personnel?.obtenu || 0) / (details.personnel?.total || 20)) * 100}%`, height: '100%', background: '#3b82f6', borderRadius: '2px' }}></div>
            </div>
          </div>
          
          {/* Documents soumis */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span><FontAwesomeIcon icon={faFile} /> Documents soumis</span>
              <span>{details.documents?.obtenu || 0}/{details.documents?.total || 25}</span>
            </div>
            <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', marginTop: '4px' }}>
              <div style={{ width: `${((details.documents?.obtenu || 0) / (details.documents?.total || 25)) * 100}%`, height: '100%', background: '#10b981', borderRadius: '2px' }}></div>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
              {details.documents?.compteur || 0} / {details.documents?.max || 5} documents soumis (5% chacun)
            </div>
          </div>
          
          {/* Étapes validées */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span><FontAwesomeIcon icon={faGraduationCap} /> Étapes validées</span>
              <span>{details.etapes?.obtenu || 0}/{details.etapes?.total || 20}</span>
            </div>
            <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', marginTop: '4px' }}>
              <div style={{ width: `${((details.etapes?.obtenu || 0) / (details.etapes?.total || 20)) * 100}%`, height: '100%', background: '#8b5cf6', borderRadius: '2px' }}></div>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
              {details.etapes?.compteur || 0} / {details.etapes?.max || 4} étapes validées (5% chacune)
            </div>
          </div>
          
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '10px', textAlign: 'center' }}>
            💡 Soumettez des documents et validez des étapes pour augmenter votre score
          </div>
        </div>
      )}
    </div>
  );
}

export default ScoreProfil;