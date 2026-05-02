import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Icon from './Icon';
import { iconColors } from '../styles/iconColors';

function PiedDePage() {
  const { darkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  const styles = {
    container: {
      marginTop: '40px',
      padding: '30px 24px 20px',
      background: darkMode ? '#1e293b' : '#f8fafc',
      borderRadius: '20px',
      borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
    },
    partnersSection: {
      marginBottom: '24px',
      paddingBottom: '24px',
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
    },
    partnersTitle: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: darkMode ? '#94a3b8' : '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '20px',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    partnerCard: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      padding: '24px',
      background: darkMode ? '#0f172a' : 'white',
      borderRadius: '20px',
      boxShadow: darkMode ? '0 4px 15px rgba(0,0,0,0.2)' : '0 4px 15px rgba(0,0,0,0.05)',
      maxWidth: '320px',
      margin: '0 auto'
    },
    partnerLogo: {
      width: '100px',
      height: '100px',
      objectFit: 'contain',
      filter: darkMode ? 'brightness(1.1)' : 'none'
    },
    partnerName: {
      fontWeight: 'bold',
      fontSize: '20px',
      color: darkMode ? '#f1f5f9' : '#1e293b',
      marginTop: '8px'
    },
    partnerRole: {
      fontSize: '13px',
      color: darkMode ? '#94a3b8' : '#64748b',
      textAlign: 'center',
      lineHeight: '1.5'
    },
    socialLinks: {
      display: 'flex',
      gap: '16px',
      marginTop: '12px'
    },
    socialLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '30px',
      background: darkMode ? '#334155' : '#f1f5f9',
      color: darkMode ? '#cbd5e1' : '#64748b',
      textDecoration: 'none',
      fontSize: '13px',
      transition: 'all 0.2s ease'
    },
    footerBottom: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px',
      fontSize: '12px',
      color: darkMode ? '#94a3b8' : '#64748b'
    },
    copyright: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    developerInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap'
    },
    devLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: darkMode ? '#94a3b8' : '#64748b',
      textDecoration: 'none'
    },
    links: {
      display: 'flex',
      gap: '20px'
    },
    link: {
      color: darkMode ? '#94a3b8' : '#64748b',
      textDecoration: 'none',
      cursor: 'pointer'
    },
    heartIcon: {
      color: '#ef4444',
      margin: '0 2px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Section Partenaire S2T */}
      <div style={styles.partnersSection}>
        <div style={styles.partnersTitle}>
          🤝 PARTENAIRE OFFICIEL
        </div>

        <div style={styles.partnerCard}>
          <img 
            src="/S2T_logo.png" 
            alt="S2T Tunisie" 
            style={styles.partnerLogo}
            onError={(e) => {
              e.target.style.display = 'none';
              console.error('Logo non trouvé');
            }}
          />
          <div style={styles.partnerName}>S2T Tunisie</div>
          <div style={styles.partnerRole}>
            Pépinière d'entreprises<br />
            Accompagnement des startups innovantes
          </div>
          
          <div style={styles.socialLinks}>
            <a 
              href="https://www.linkedin.com/company/s2ttunisia/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.socialLink}
            >
              🔗 LinkedIn
            </a>
            <a 
              href="https://www.facebook.com/s2t.tunisia/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.socialLink}
            >
                              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bas */}
      <div style={styles.footerBottom}>
        <div style={styles.copyright}>
          © {currentYear} Incubiny. Tous droits réservés.
        </div>

        <div style={styles.developerInfo}>
          <div style={styles.devLink}>
            💻 Développé par Yasmine La
            <span style={styles.heartIcon}>❤️</span>
          </div>
          <div style={styles.links}>
            <a href="#" style={styles.link}>Conditions</a>
            <a href="#" style={styles.link}>Confidentialité</a>
            <a href="#" style={styles.link}>Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PiedDePage;