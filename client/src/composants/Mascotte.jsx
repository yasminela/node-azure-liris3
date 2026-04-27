import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faSpinner, faCheckCircle, faExclamationTriangle, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { iconColors } from '../styles/iconColors';

function Mascotte({ isAnalyzing, resultat, onClose }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState('waiting'); // waiting, analyzing, success, error

  useEffect(() => {
    if (isAnalyzing) {
      setVisible(true);
      setStep('analyzing');
      setMessage(' Je suis en train d\'analyser votre BMC...');
      
      // Simuler la progression des messages
      const timer1 = setTimeout(() => {
        setMessage(' Calcul du score d\'impact...');
      }, 2000);
      
      const timer2 = setTimeout(() => {
        setMessage(' Analyse des mots-clés et du secteur...');
      }, 4000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else if (resultat) {
      setStep(resultat.success === false ? 'error' : 'success');
      if (resultat.success === false) {
        setMessage(` ${resultat.erreur || 'Une erreur est survenue'}`);
      } else {
        setMessage(` Analyse terminée ! Score: ${resultat.scoreImpact}/100`);
      }
    }
  }, [isAnalyzing, resultat]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible && !isAnalyzing && !resultat) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000,
      animation: 'slideIn 0.3s ease-out'
    },
    bubble: {
      background: iconColors.white,
      borderRadius: '20px',
      padding: '16px 20px',
      marginBottom: '12px',
      maxWidth: '280px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      border: `1px solid ${iconColors.primary}30`,
      position: 'relative',
      animation: 'bounce 0.5s ease-out'
    },
    bubbleArrow: {
      position: 'absolute',
      bottom: '-10px',
      right: '20px',
      width: 0,
      height: 0,
      borderLeft: '10px solid transparent',
      borderRight: '10px solid transparent',
      borderTop: `10px solid ${iconColors.white}`,
      filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))'
    },
    mascotte: {
      width: '70px',
      height: '70px',
      background: `linear-gradient(135deg, ${iconColors.primary}, ${iconColors.primaryDark})`,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
      transition: 'transform 0.2s',
      marginLeft: 'auto'
    },
    messageContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '10px'
    },
    progressBar: {
      width: '100%',
      height: '4px',
      background: '#e2e8f0',
      borderRadius: '2px',
      overflow: 'hidden',
      marginTop: '10px'
    },
    progressFill: {
      width: '100%',
      height: '100%',
      background: `linear-gradient(90deg, ${iconColors.primary}, ${iconColors.primaryDark})`,
      animation: 'loading 2s ease-in-out infinite'
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '16px',
      cursor: 'pointer',
      color: iconColors.grayLight,
      position: 'absolute',
      top: '8px',
      right: '12px'
    },
    resultScore: (score) => ({
      fontSize: '24px',
      fontWeight: 'bold',
      color: score < 35 ? '#ef4444' : score < 65 ? '#f59e0b' : '#10b981',
      textAlign: 'center'
    }),
    formationsPreview: {
      marginTop: '10px',
      fontSize: '12px',
      color: iconColors.gray
    }
  };

  const animations = `
    @keyframes slideIn {
      from { transform: translateX(100px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes loading {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `;

  return (
    <>
      <style>{animations}</style>
      <div style={styles.overlay}>
        {/* Bulle de dialogue */}
        <div style={styles.bubble}>
          <button style={styles.closeBtn} onClick={handleClose}>×</button>
          
          <div style={styles.messageContainer}>
            <FontAwesomeIcon 
              icon={step === 'analyzing' ? faSpinner : step === 'success' ? faCheckCircle : faExclamationTriangle} 
              spin={step === 'analyzing'}
              color={step === 'analyzing' ? iconColors.primary : step === 'success' ? iconColors.success : iconColors.danger}
            />
            <span style={{ fontSize: '14px', color: iconColors.black }}>{message}</span>
          </div>

          {step === 'analyzing' && (
            <div style={styles.progressBar}>
              <div style={styles.progressFill}></div>
            </div>
          )}

          {step === 'success' && resultat && (
            <div>
              <div style={styles.resultScore(resultat.scoreImpact)}>
                {resultat.scoreImpact}/100
              </div>
              <div style={styles.formationsPreview}>
                <FontAwesomeIcon icon={faLightbulb} size="12px" color={iconColors.warning} />
                {' '}{resultat.formations?.length || 0} formations recommandées
              </div>
            </div>
          )}

          {step === 'error' && (
            <div style={{ fontSize: '12px', color: iconColors.danger, marginTop: '8px' }}>
              Veuillez réessayer ou contacter l'administrateur
            </div>
          )}

          <div style={styles.bubbleArrow}></div>
        </div>

        {/* Mascotte */}
        <div 
          style={styles.mascotte}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onClick={() => setVisible(true)}
        >
          <FontAwesomeIcon icon={faRobot} size="2x" color="white" />
        </div>
      </div>
    </>
  );
}

export default Mascotte;