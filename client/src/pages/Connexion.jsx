import React, { useState } from 'react';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Connexion({ onLogin }) {
  const { darkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, motDePasse });
      if (response.data && response.data.utilisateur) {
        onLogin(response.data.utilisateur, response.data.token);
      } else {
        setError('Réponse invalide du serveur');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: darkMode 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    card: {
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '24px',
      padding: 'clamp(30px, 5vw, 48px)',
      maxWidth: '450px',
      width: '90%',
      boxShadow: darkMode 
        ? '0 25px 50px -12px rgba(0,0,0,0.5)' 
        : '0 25px 50px -12px rgba(0,0,0,0.25)'
    },
    logoContainer: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    logo: {
      height: '70px',
      width: '70px',
      objectFit: 'contain',
      margin: '0 auto 16px'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: darkMode ? '#ffffff' : '#1e293b',
      textAlign: 'center',
      marginBottom: '8px'
    },
    subtitle: {
      fontSize: '14px',
      color: darkMode ? '#94a3b8' : '#64748b',
      textAlign: 'center',
      marginBottom: '32px'
    },
    formGroup: {
      marginBottom: '24px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '500',
      color: darkMode ? '#cbd5e1' : '#475569'
    },
    inputContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },
    inputIcon: {
      position: 'absolute',
      left: '14px',
      color: darkMode ? '#94a3b8' : '#64748b'
    },
    input: {
      width: '100%',
      padding: '14px 14px 14px 42px',
      border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`,
      borderRadius: '12px',
      fontSize: '15px',
      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
      color: darkMode ? '#ffffff' : '#1e293b',
      transition: 'all 0.3s ease',
      outline: 'none'
    },
    passwordToggle: {
      position: 'absolute',
      right: '14px',
      cursor: 'pointer',
      color: darkMode ? '#94a3b8' : '#64748b'
    },
    errorMsg: {
      background: darkMode ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2',
      color: '#ef4444',
      padding: '12px',
      borderRadius: '12px',
      textAlign: 'center',
      marginBottom: '20px',
      fontSize: '14px'
    },
    button: {
      width: '100%',
      padding: '14px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'transform 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    buttonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed'
    },
    footer: {
      marginTop: '24px',
      textAlign: 'center',
      fontSize: '12px',
      color: darkMode ? '#94a3b8' : '#64748b'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <img src="/logo-incubiny.png" alt="Incubiny" style={styles.logo} />
          <h1 style={styles.title}>Incubiny</h1>
          <p style={styles.subtitle}>Plateforme d'incubation de startups</p>
        </div>

        {error && <div style={styles.errorMsg}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputContainer}>
              <FontAwesomeIcon icon={faEnvelope} size="16px" style={styles.inputIcon} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
                placeholder="admin@incubiny.com"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Mot de passe</label>
            <div style={styles.inputContainer}>
              <FontAwesomeIcon icon={faLock} size="16px" style={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
                style={styles.input}
                placeholder="••••••••"
              />
              <div style={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size="16px" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
            className="btn-shine"
          >
            {loading ? (
              <>⏳ Connexion...</>
            ) : (
              <>🔓 Se connecter</>
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p>© {new Date().getFullYear()} Incubiny - Tous droits réservés</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .btn-shine {
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
          }
          .btn-shine::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s ease;
          }
          .btn-shine:hover::before {
            left: 100%;
          }
          .btn-shine:hover {
            transform: translateY(-2px);
          }
          input:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            outline: none;
          }
        `
      }} />
    </div>
  );
}

export default Connexion;