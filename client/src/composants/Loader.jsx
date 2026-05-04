import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faSpinner } from '@fortawesome/free-solid-svg-icons';

function Loader({ message = "Chargement de votre espace..." }) {
  const { darkMode } = useTheme();

  const styles = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: darkMode ? '#0f172a' : '#f8fafc',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(4px)'
    },
    loaderCard: {
      background: darkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      borderRadius: '32px',
      padding: '40px 60px',
      textAlign: 'center',
      border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(147, 51, 234, 0.2)'}`,
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
      animation: 'fadeInUp 0.5s ease-out'
    },
    logoContainer: {
      width: '80px',
      height: '80px',
      margin: '0 auto 24px',
      background: 'linear-gradient(135deg, #9333ea, #ec4899, #06b6d4)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'pulse 2s ease-in-out infinite'
    },
    logo: {
      width: '50px',
      height: '50px',
      objectFit: 'contain',
      filter: 'brightness(0) invert(1)'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #9333ea, #ec4899, #06b6d4)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '16px'
    },
    message: {
      color: darkMode ? '#cbd5e1' : '#64748b',
      fontSize: '14px',
      marginTop: '8px'
    },
    spinnerContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '12px',
      marginTop: '24px'
    },
    dot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: '#9333ea',
      animation: 'bounce 1.4s ease-in-out infinite'
    },
    progressBar: {
      width: '200px',
      height: '3px',
      background: darkMode ? '#334155' : '#e2e8f0',
      borderRadius: '10px',
      marginTop: '24px',
      overflow: 'hidden'
    },
    progressFill: {
      width: '60%',
      height: '100%',
      background: 'linear-gradient(90deg, #9333ea, #ec4899, #06b6d4)',
      borderRadius: '10px',
      animation: 'loading 1.5s ease-in-out infinite'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loaderCard}>
        <div style={styles.logoContainer}>
          <img src="/logo-incubiny.png" alt="Incubiny" style={styles.logo} />
        </div>
        <h2 style={styles.title}>Incubiny</h2>
        <div style={styles.spinnerContainer}>
          <FontAwesomeIcon icon={faSpinner} spin size="lg" color="#9333ea" />
          <span style={{ color: darkMode ? '#cbd5e1' : '#64748b' }}>{message}</span>
        </div>
        <div style={styles.progressBar}>
          <div style={styles.progressFill} />
        </div>
        <p style={styles.message}>Préparation de votre tableau de bord...</p>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.4);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 0 0 20px rgba(147, 51, 234, 0);
            }
          }
          @keyframes bounce {
            0%, 60%, 100% {
              transform: translateY(0);
            }
            30% {
              transform: translateY(-10px);
            }
          }
          @keyframes loading {
            0% {
              width: 0%;
            }
            50% {
              width: 80%;
            }
            100% {
              width: 100%;
            }
          }
        `
      }} />
    </div>
  );
}

export default Loader;