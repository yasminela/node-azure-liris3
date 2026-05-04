import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Icônes solid (gratuites)
import { 
  faHandshake, 
  faHeart, 
  faFileContract, 
  faLock, 
  faEnvelope,
  faCode,
  faCopyright
} from '@fortawesome/free-solid-svg-icons';
// Icônes brands (marques)
import { 
  faLinkedin, 
  faFacebook 
} from '@fortawesome/free-brands-svg-icons';

function PiedDePage() {
  const { darkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  const logoS2T = darkMode ? '/S2T_logo_dark.png' : '/S2T_logo.png';

  const styles = {
    container: {
      marginTop: '60px',
      padding: '40px 24px 30px',
      background: darkMode ? '#1e293b' : '#ffffff',
      borderRadius: '20px 20px 0 0',
      borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      width: '100%',
      position: 'relative',
      bottom: 0
    },
    partnersSection: {
      marginBottom: '30px',
      paddingBottom: '30px',
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
    },
    partnersTitle: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: darkMode ? '#94a3b8' : '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      marginBottom: '25px',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    },
    partnerCard: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px',
      padding: '30px',
      background: darkMode ? '#0f172a' : '#f8fafc',
      borderRadius: '24px',
      maxWidth: '350px',
      margin: '0 auto',
      transition: 'all 0.3s ease'
    },
    partnerLogoContainer: {
      width: '100px',
      height: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: darkMode ? 'rgba(255,255,255,0.08)' : '#ffffff',
      borderRadius: '20px',
      padding: '15px'
    },
    partnerLogo: {
      width: '100%',
      height: '100%',
      objectFit: 'contain'
    },
    partnerName: {
      fontWeight: 'bold',
      fontSize: '22px',
      color: darkMode ? '#ffffff' : '#1e293b',
      marginTop: '5px',
      textAlign: 'center'
    },
    partnerSubtitle: {
      fontSize: '12px',
      color: darkMode ? '#94a3b8' : '#64748b',
      textAlign: 'center'
    },
    partnerRole: {
      fontSize: '13px',
      color: darkMode ? '#cbd5e1' : '#475569',
      textAlign: 'center',
      lineHeight: '1.5'
    },
    socialLinks: {
      display: 'flex',
      gap: '20px',
      marginTop: '15px',
      justifyContent: 'center'
    },
    socialLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 20px',
      borderRadius: '40px',
      background: darkMode ? '#334155' : '#e2e8f0',
      color: darkMode ? '#cbd5e1' : '#475569',
      textDecoration: 'none',
      fontSize: '13px',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    },
    footerBottom: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px',
      fontSize: '13px',
      color: darkMode ? '#94a3b8' : '#64748b',
      marginTop: '20px',
      paddingTop: '10px'
    },
    footerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    footerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      flexWrap: 'wrap'
    },
    developerInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    links: {
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap'
    },
    link: {
      color: darkMode ? '#94a3b8' : '#64748b',
      textDecoration: 'none',
      transition: 'color 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '5px 10px',
      borderRadius: '20px'
    },
    heartIcon: {
      color: '#ef4444',
      margin: '0 3px',
      animation: 'heartbeat 1.5s ease infinite',
      display: 'inline-block'
    }
  };

  return (
    <div style={styles.container}>
      {/* Section Partenaire */}
      <div style={styles.partnersSection}>
        <div style={styles.partnersTitle}>
          <FontAwesomeIcon icon={faHandshake} />
          PARTENAIRE OFFICIEL
          <FontAwesomeIcon icon={faHandshake} />
        </div>

        <div className="card-shine" style={styles.partnerCard}>
          <div style={styles.partnerLogoContainer}>
            <img 
              src={logoS2T}
              alt="S2T Tunisie" 
              style={styles.partnerLogo}
              onError={(e) => {
                e.target.style.display = 'none';
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
              className="btn-shine"
              style={styles.socialLink}
            >
              <FontAwesomeIcon icon={faLinkedin} />
              LinkedIn
            </a>
            <a 
              href="https://www.facebook.com/s2t.tunisia/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-shine"
              style={styles.socialLink}
            >
              <FontAwesomeIcon icon={faFacebook} />
              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div style={styles.footerBottom}>
        <div style={styles.footerLeft}>
          <FontAwesomeIcon icon={faCopyright} />
          <span>{currentYear} Incubiny. Tous droits réservés.</span>
        </div>
        
        <div style={styles.footerRight}>
          <div style={styles.developerInfo}>
            <FontAwesomeIcon icon={faCode} />
            <span>Développé par <strong>Yasmine La</strong></span>
            <FontAwesomeIcon icon={faHeart} style={styles.heartIcon} />
          </div>
          
          <div style={styles.links}>
            <a href="#" className="btn-shine" style={styles.link}>
              <FontAwesomeIcon icon={faFileContract} />
              Conditions
            </a>
            <a href="#" className="btn-shine" style={styles.link}>
              <FontAwesomeIcon icon={faLock} />
              Confidentialité
            </a>
            <a href="#" className="btn-shine" style={styles.link}>
              <FontAwesomeIcon icon={faEnvelope} />
              Contact
            </a>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
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
          .dark .btn-shine::before {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          }
          .card-shine {
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
          }
          .card-shine:hover {
            transform: translateY(-5px);
          }
        `
      }} />
    </div>
  );
}

export default PiedDePage;