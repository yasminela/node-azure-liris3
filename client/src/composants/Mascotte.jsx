import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faSpinner, faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { iconColors } from '../styles/iconColors';

function Mascotte({ isAnalyzing, resultat, onClose }) {
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isAnalyzing) {
      setVisible(true);
      setMessage('🤖 Analyse de votre BMC en cours...');
      
      const timer = setTimeout(() => {
        setMessage('📊 Calcul du score d\'impact...');
      }, 2000);
      
      return () => clearTimeout(timer);
    } else if (resultat) {
      if (resultat.success === false) {
        setMessage(`😕 ${resultat.erreur || 'Erreur lors de l\'analyse'}`);
      } else {
        setMessage(`✨ Analyse terminée ! Score: ${resultat.scoreImpact}/100`);
      }
      // Auto-fermeture après 5 secondes
      setTimeout(() => setVisible(false), 5000);
    }
  }, [isAnalyzing, resultat]);

  if (!visible || (!isAnalyzing && !resultat)) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '10px'
    }}>
      {/* Bulle */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '15px 20px',
        maxWidth: '280px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        border: `1px solid ${iconColors.primary}`,
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          bottom: '-8px',
          right: '20px',
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: `8px solid white`
        }}></div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isAnalyzing ? (
            <FontAwesomeIcon icon={faSpinner} spin color={iconColors.primary} />
          ) : resultat?.success === false ? (
            <FontAwesomeIcon icon={faExclamationTriangle} color={iconColors.danger} />
          ) : (
            <FontAwesomeIcon icon={faCheckCircle} color={iconColors.success} />
          )}
          <span style={{ fontSize: '14px', color: '#333' }}>{message}</span>
        </div>
        
        {isAnalyzing && (
          <div style={{
            marginTop: '10px',
            height: '3px',
            background: '#e2e8f0',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: iconColors.primary,
              animation: 'loading 2s ease-in-out infinite'
            }}></div>
          </div>
        )}
        
        <button onClick={() => setVisible(false)} style={{
          position: 'absolute',
          top: '5px',
          right: '10px',
          background: 'none',
          border: 'none',
          fontSize: '16px',
          cursor: 'pointer',
          color: '#999'
        }}>×</button>
      </div>
      
      {/* Robot */}
      <div style={{
        width: '60px',
        height: '60px',
        background: `linear-gradient(135deg, ${iconColors.primary}, ${iconColors.primaryDark})`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
      }}>
        <FontAwesomeIcon icon={faRobot} size="2x" color="white" />
      </div>
      
      <style>
        {`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
}

export default Mascotte;