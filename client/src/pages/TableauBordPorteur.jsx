import React from 'react';
import Icon from './Icon';
import { iconColors } from '../styles/iconColors';

function PiedDePage() {
  const currentYear = new Date().getFullYear();

  const styles = {
    container: {
      marginTop: '40px',
      padding: '30px 24px 20px',
      background: `linear-gradient(135deg, ${iconColors.grayBg} 0%, #f1f5f9 100%)`,
      borderRadius: '20px',
      borderTop: `1px solid ${iconColors.primary}20`
    },
    partnersSection: {
      marginBottom: '24px',
      paddingBottom: '24px',
      borderBottom: '1px solid #e2e8f0'
    },
    partnersTitle: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: iconColors.gray,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '20px',
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
      padding: '20px 32px',
      background: iconColors.white,
      borderRadius: '20px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
      maxWidth: '280px',
      margin: '0 auto'
    },
    partnerLogo: {
      width: '80px',
      height: '80px',
      objectFit: 'contain',
      borderRadius: '12px'
    },
    partnerName: {
      fontWeight: 'bold',
      fontSize: '20px',
      color: iconColors.black,
      marginTop: '8px'
    },
    partnerRole: {
      fontSize: '13px',
      color: iconColors.gray,
      textAlign: 'center'
    },
    socialLinks: {
      display: 'flex',
      gap: '16px',
      marginTop: '12px'
    },
    socialLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      borderRadius: '20px',
      background: '#f1f5f9',
      color: iconColors.gray,
      textDecoration: 'none',
      fontSize: '12px',
      transition: 'all 0.2s'
    },
    footerBottom: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px',
      fontSize: '12px',
      color: iconColors.grayLight
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
      color: iconColors.grayLight,
      textDecoration: 'none',
      transition: 'color 0.2s'
    },
    links: {
      display: 'flex',
      gap: '20px'
    },
    link: {
      color: iconColors.grayLight,
      textDecoration: 'none',
      transition: 'color 0.2s',
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
          <Icon name="handshake" size={16} color={iconColors.gray} />
          PARTENAIRE OFFICIEL
          <Icon name="handshake" size={16} color={iconColors.gray} />
        </div>

        <div style={styles.partnerCard}>
          <img 
            src="/S2T_logo.png" 
            alt="S2T Tunisie" 
            style={styles.partnerLogo}
            onError={(e) => {
              e.target.style.display = 'none';
              console.error('Logo S2T non trouvé');
            }}
          />
          
          <div style={styles.partnerName}>S2T Tunisie</div>
          <div style={styles.partnerRole}>
            Pépinière d'entreprises - Accompagnement des startups innovantes
          </div>
          
          <div style={styles.socialLinks}>
            <a 
              href="https://www.linkedin.com/company/s2ttunisia/posts/?feedView=all" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.socialLink}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#0077b5';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.color = iconColors.gray;
              }}
            >
              <Icon name="linkedin" size={14} color="#0077b5" />
              LinkedIn
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
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.color = iconColors.gray;
              }}
            >
              <Icon name="facebook" size={14} color="#1877f2" />
              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bas */}
      <div style={styles.footerBottom}>
        <div style={styles.copyright}>
          <Icon name="copyright" size={12} color={iconColors.grayLight} />
          <span>{currentYear} Incubiny. Tous droits réservés.</span>
        </div>

        <div style={styles.developerInfo}>
          <div style={styles.devLink}>
            <Icon name="code" size={12} color={iconColors.grayLight} />
            <span>Développé par Yasmine La</span>
            <Icon name="heart" size={10} style={styles.heartIcon} />
          </div>
          <div style={styles.links}>
            <a 
              href="#" 
              style={styles.link} 
              onMouseEnter={(e) => e.currentTarget.style.color = iconColors.primary} 
              onMouseLeave={(e) => e.currentTarget.style.color = iconColors.grayLight}
            >
              Conditions d'utilisation
            </a>
            <a 
              href="#" 
              style={styles.link} 
              onMouseEnter={(e) => e.currentTarget.style.color = iconColors.primary} 
              onMouseLeave={(e) => e.currentTarget.style.color = iconColors.grayLight}
            >
              Politique de confidentialité
            </a>
            <a 
              href="#" 
              style={styles.link} 
              onMouseEnter={(e) => e.currentTarget.style.color = iconColors.primary} 
              onMouseLeave={(e) => e.currentTarget.style.color = iconColors.grayLight}
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PiedDePage;