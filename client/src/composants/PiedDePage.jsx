import React from 'react';
import { useTheme } from '../context/ThemeContext';

function PiedDePage() {
  const { darkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  // Logo selon le mode
  const logoS2T = darkMode ? '/S2T_logo_dark.png' : '/S2T_logo.png';

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
    partnerLogoContainer: {
      width: '100px',
      height: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: darkMode ? 'rgba(255,255,255,0.05)' : '#f8fafc',
      borderRadius: '20px',
      padding: '12px'
    },
    partnerLogo: {
      width: '100%',
      height: '100%',
      objectFit: 'contain'
    },
    partnerName: {
      fontWeight: 'bold',
      fontSize: '20px',
      color: darkMode ? '#f1f5f9' : '#1e293b',
      marginTop: '8px',
      textAlign: 'center'
    },
    partnerSubtitle: {
      fontSize: '12px',
      color: darkMode ? '#94a3b8' : '#64748b',
      textAlign: 'center',
      letterSpacing: '0.5px'
    },
    partnerRole: {
      fontSize: '13px',
      color: darkMode ? '#cbd5e1' : '#475569',
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
    developerInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap'
    },
    links: {
      display: 'flex',
      gap: '20px'
    },
    link: {
      color: darkMode ? '#94a3b8' : '#64748b',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'color 0.2s ease'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.partnersSection}>
        <div style={styles.partnersTitle}>
          🤝 PARTENAIRE OFFICIEL
        </div>

        <div style={styles.partnerCard}>
          <div style={styles.partnerLogoContainer}>
            <img 
              src={logoS2T}
              alt="S2T Tunisie" 
              style={styles.partnerLogo}
              onError={(e) => {
                e.target.src = 'https://placehold.co/100x100?text=S2T';
              }}
            />
          </div>
          <div style={styles.partnerName}>S2T Tunisie</div>
          <div style={styles.partnerSubtitle}>Smart Tunisian Technoparks</div>
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
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#0077b5';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = darkMode ? '#334155' : '#f1f5f9';
                e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
              }}
            >
              🔗 LinkedIn
            </a>
            <a 
              href="https://www.facebook.com/s2t.tunisia/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.socialLink}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1877f2';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = darkMode ? '#334155' : '#f1f5f9';
                e.currentTarget.style.color = darkMode ? '#cbd5e1' : '#64748b';
              }}
            >
                              Facebook
            </a>
          </div>
        </div>
      </div>

      <div style={styles.footerBottom}>
        <div>© {currentYear} Incubiny. Tous droits réservés.</div>
        <div style={styles.developerInfo}>
          <span>💻 Développé par Yasmine La</span>
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