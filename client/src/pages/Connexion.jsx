import React, { useState } from 'react';
import api from '../utils/api';
import Icon from '../composants/Icon';
import { iconColors } from '../styles/iconColors';

function Connexion({ onLogin }) {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
  
  // Liste des icônes pour l'arrière-plan - OPACITÉ AUGMENTÉE
  const backgroundIcons = [
    { name: 'globe', color: '#c7d2fe', size: 54, top: '10%', left: '50%', opacity: 0.18, rotation: 10 },
    { name: 'rocket', color: '#ffffff', size: 55, top: '5%', left: '5%', opacity: 0.25, rotation: -15 },
    { name: 'lightbulb', color: '#fef08a', size: 45, top: '12%', left: '85%', opacity: 0.22, rotation: 10 },
    { name: 'users', color: '#ffffff', size: 60, top: '20%', left: '8%', opacity: 0.2, rotation: 5 },
    { name: 'business', color: '#c7d2fe', size: 50, top: '28%', left: '78%', opacity: 0.25, rotation: -20 },
    { name: 'development', color: '#bfdbfe', size: 48, top: '35%', left: '15%', opacity: 0.22, rotation: 25 },
    { name: 'trophy', color: '#fde68a', size: 52, top: '42%', left: '88%', opacity: 0.2, rotation: -10 },
    { name: 'target', color: '#fbcfe8', size: 45, top: '50%', left: '6%', opacity: 0.22, rotation: 15 },
    { name: 'learning', color: '#ddd6fe', size: 55, top: '58%', left: '82%', opacity: 0.2, rotation: -5 },
    { name: 'startups', color: '#a7f3d0', size: 42, top: '65%', left: '12%', opacity: 0.22, rotation: 30 },
    { name: 'collab', color: '#bfdbfe', size: 58, top: '72%', left: '75%', opacity: 0.18, rotation: -25 },
    { name: 'calculator', color: '#fecaca', size: 40, top: '78%', left: '20%', opacity: 0.2, rotation: 12 },
    { name: 'brush', color: '#fbcfe8', size: 46, top: '82%', left: '70%', opacity: 0.2, rotation: -18 },
    { name: 'calendar', color: '#c7d2fe', size: 44, top: '15%', left: '35%', opacity: 0.2, rotation: 8 },
    { name: 'chart', color: '#a7f3d0', size: 48, top: '45%', left: '45%', opacity: 0.18, rotation: -12 },
    { name: 'folder_open', color: '#fde68a', size: 42, top: '60%', left: '55%', opacity: 0.2, rotation: 20 },
    { name: 'task_checklist', color: '#ddd6fe', size: 45, top: '88%', left: '45%', opacity: 0.2, rotation: -8 },
    { name: 'duration', color: '#bfdbfe', size: 38, top: '30%', left: '55%', opacity: 0.18, rotation: 5 },
    { name: 'heart', color: '#fbcfe8', size: 50, top: '75%', left: '50%', opacity: 0.18, rotation: -15 },
    { name: 'network', color: '#c7d2fe', size: 54, top: '10%', left: '50%', opacity: 0.18, rotation: 10 },
    { name: 'comment_info', color: '#a7f3d0', size: 40, top: '95%', left: '25%', opacity: 0.2, rotation: -5 },
    { name: 'assignment', color: '#fde68a', size: 48, top: '3%', left: '70%', opacity: 0.2, rotation: 22 },
    { name: 'verified', color: '#ffffff', size: 52, top: '50%', left: '70%', opacity: 0.18, rotation: -22 },
    { name: 'award', color: '#fef08a', size: 46, top: '85%', left: '88%', opacity: 0.2, rotation: 12 }
  ];

  const styles = {
    container: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      overflow: 'hidden'
    },
    backgroundIconsContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 0
    },
    floatingIcon: (top, left, size, opacity, rotation, delay) => ({
      position: 'absolute',
      top,
      left,
      fontSize: size,
      opacity,
      transform: `rotate(${rotation}deg)`,
      animationName: 'float',
      animationDuration: `${3 + Math.random() * 2}s`,
      animationTimingFunction: 'ease-in-out',
      animationIterationCount: 'infinite',
      animationDelay: `${delay}s`,
      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
      transition: 'all 0.3s ease'
    }),
    card: {
      position: 'relative',
      zIndex: 1,
      background: 'rgba(255, 255, 255, 0.98)',
      borderRadius: '28px',
      padding: '40px',
      maxWidth: '440px',
      width: '90%',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
      backdropFilter: 'blur(0px)',
      animation: 'slideUp 0.6s ease-out'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    logo: {
      height: '75px',
      marginBottom: '16px',
      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
    },
    title: {
      color: '#667eea',
      marginTop: '8px',
      fontSize: '30px',
      fontWeight: 'bold',
      letterSpacing: '-0.5px'
    },
    subtitle: {
      color: '#64748b',
      fontSize: '14px',
      marginTop: '8px'
    },
    error: {
      background: '#fee2e2',
      color: '#dc2626',
      padding: '12px',
      borderRadius: '12px',
      textAlign: 'center',
      marginBottom: '20px',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#1e293b',
      fontSize: '14px'
    },
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },
    inputIcon: {
      position: 'absolute',
      left: '14px',
      color: '#94a3b8',
      zIndex: 2
    },
    input: {
      width: '100%',
      padding: '14px 14px 14px 44px',
      border: '1.5px solid #e2e8f0',
      borderRadius: '14px',
      fontSize: '15px',
      transition: 'all 0.2s',
      outline: 'none',
      fontFamily: 'inherit',
      backgroundColor: 'white'
    },
    button: {
      width: '100%',
      padding: '14px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '14px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginTop: '8px'
    },
    footer: {
      textAlign: 'center',
      marginTop: '28px',
      paddingTop: '20px',
      borderTop: '1px solid #e2e8f0'
    },
    incubatorBadge: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginTop: '8px',
      fontSize: '11px',
      color: '#94a3b8'
    },
    badgeText: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    }
  };

  // Ajouter les animations CSS
  const animations = `
    @keyframes float {
      0%, 100% { 
        transform: translateY(0px) rotate(var(--rotation, 0deg)); 
      }
      50% { 
        transform: translateY(-20px) rotate(var(--rotation, 0deg)); 
      }
    }
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.15; }
      50% { opacity: 0.25; }
    }
    .input-focus:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
    }
  `;

  return (
    <div style={styles.container}>
      <style>{animations}</style>

      {/* Icônes d'arrière-plan flottantes */}
      <div style={styles.backgroundIconsContainer}>
        {backgroundIcons.map((icon, index) => (
          <div
            key={index}
            style={{
              ...styles.floatingIcon(
                icon.top, 
                icon.left, 
                icon.size, 
                icon.opacity, 
                icon.rotation,
                index * 0.2
              ),
              '--rotation': `${icon.rotation}deg`
            }}
          >
            <Icon name={icon.name} size={icon.size} color={icon.color} />
          </div>
        ))}
      </div>

      {/* Formulaire de connexion */}
      <div style={styles.card}>
        <div style={styles.header}>
          <img src="/logo-incubiny.png" alt="Incubiny" style={styles.logo} />
          <h1 style={styles.title}>Incubiny</h1>
          <p style={styles.subtitle}>Plateforme d'incubation de startups</p>
        </div>

        {error && (
          <div style={styles.error}>
            <Icon name="exclamation_point" size={16} color="#dc2626" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputWrapper}>
              <div style={styles.inputIcon}>
                <Icon name="email" size={18} color="#94a3b8" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
                className="input-focus"
                placeholder="admin@incubiny.com"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Mot de passe</label>
            <div style={styles.inputWrapper}>
              <div style={styles.inputIcon}>
                <Icon name="lock" size={18} color="#94a3b8" />
              </div>
              <input
                type="password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
                style={styles.input}
                className="input-focus"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 15px 30px -10px rgba(102, 126, 234, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {loading ? (
              <><Icon name="pending" size={18} color="white" /> Connexion en cours...</>
            ) : (
              <><Icon name="login" size={18} color="white" /> Se connecter</>
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <div style={styles.incubatorBadge}>
            <div style={styles.badgeText}>
              <Icon name="rocket" size={12} color="#94a3b8" />
              <span>Accompagnement personnalisé</span>
            </div>
            <span>•</span>
            <div style={styles.badgeText}>
              <Icon name="learning" size={12} color="#94a3b8" />
              <span>Programme Early Stage</span>
            </div>
          </div>
          <div style={{ ...styles.incubatorBadge, marginTop: '12px' }}>
            <div style={styles.badgeText}>
              <Icon name="calendar" size={10} color="#cbd5e1" />
              <span>© 2026 Incubiny - De l'idée à l'incubation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Connexion;