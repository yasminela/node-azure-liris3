import React, { useState } from 'react';
import Icon from './Icon';
import { iconColors } from '../styles/iconColors';
import { useTheme } from '../context/ThemeContext';

const moisImages = {
  1: '/mois1.png',
  2: '/mois2.png',
  3: '/mois3.png',
  4: '/mois4.png',
  5: '/mois5.png',
  6: '/mois6.png'
};

const etapesProgramme = [
  { 
    mois: 1, 
    titre: "Idéation & Créativité", 
    description: "Transformez votre idée en concept structuré", 
    objectif: "Définir votre vision et valider votre concept",
    actionsCles: [
      "Atelier Posture entrepreneuriale",
      "Méthodologie Design thinking",
      "Intervention Mentors"
    ],
    ateliers: ["Posture entrepreneuriale - Mme Lamia Ben Ammar", "Design Thinking - Mme Sameh Chemli"],
    duree: "4 semaines"
  },
  { 
    mois: 2, 
    titre: "Business Model & Stratégie", 
    description: "Construisez votre modèle économique", 
    objectif: "Finaliser votre Business Model Canvas",
    actionsCles: [
      "Workshop Green Business Model Canvas",
      "Analyse de marché approfondie",
      "Définition de la stratégie pricing"
    ],
    ateliers: ["Green Business Model Canvas - Mme Dorsaf Hlel", "Veille marché & analyse de données - I. Masmoudi, M. Chammem"],
    duree: "4 semaines"
  },
  { 
    mois: 3, 
    titre: "Étude de faisabilité", 
    description: "Validez la viabilité de votre projet", 
    objectif: "Préparer votre dossier de faisabilité",
    actionsCles: [
      "Stratégie de Propriété Intellectuelle",
      "Étude financière prévisionnelle",
      "Analyse des risques"
    ],
    ateliers: ["Propriété intellectuelle - Mme Neila Ben Slima", "Étude financière - Mme Lamia Ben Ammar"],
    duree: "4 semaines"
  },
  { 
    mois: 4, 
    titre: "Prototypage & Solution", 
    description: "Donnez vie à votre produit", 
    objectif: "Développer un prototype fonctionnel",
    actionsCles: [
      "Utilisation du Maker Space",
      "Atelier Proof of Concept",
      "Support technique DATADOIT"
    ],
    ateliers: ["Maker Space - Prototypage", "Proof of Concept - Tech Lab", "Support DATADOIT"],
    duree: "4 semaines"
  },
  { 
    mois: 5, 
    titre: "Branding & Positionnement", 
    description: "Construisez votre identité de marque", 
    objectif: "Développer votre stratégie marketing",
    actionsCles: [
      "Création de l'identité visuelle",
      "Stratégie de contenu digital",
      "Préparation du lancement produit"
    ],
    ateliers: ["Marketing digital & e-réputation - I. Masmoudi", "Proof of Concept (PoC) - Timmo Vander beek", "Immersion startups - Pépinière S2T"],
    duree: "4 semaines"
  },
  { 
    mois: 6, 
    titre: "Préparation à l'incubation", 
    description: "Finalisez votre dossier et pitch", 
    objectif: "Décrocher le label Startup ACT",
    actionsCles: [
      "Préparation du pitch deck",
      "Simulation devant jury",
      "Dossier de candidature"
    ],
    ateliers: ["Atelier pré-label Startup ACT - Coach expert", "Networking avec investisseurs - Réseau d'investisseurs", "Pitch devant comité d'experts - Jury d'incubation"],
    duree: "4 semaines"
  }
];

function EarlyStageTimeline() {
  const { darkMode } = useTheme();
  const [expandedMois, setExpandedMois] = useState(null);
  const [imageLoaded, setImageLoaded] = useState({});

  const getMoisColor = (mois) => {
    const colors = {
      1: '#6366f1',
      2: '#8b5cf6',
      3: '#06b6d4',
      4: '#10b981',
      5: '#f59e0b',
      6: '#ef4444'
    };
    return colors[mois] || '#9333ea';
  };

  const toggleExpand = (mois) => {
    setExpandedMois(expandedMois === mois ? null : mois);
  };

  const handleImageLoad = (mois) => {
    setImageLoaded(prev => ({ ...prev, [mois]: true }));
  };

  const styles = {
    container: {
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '24px',
      padding: '20px',
      marginBottom: '32px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '28px',
      paddingBottom: '20px',
      borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
    },
    title: {
      fontSize: '26px',
      fontWeight: 'bold',
      background: `linear-gradient(135deg, #9333ea, #6366f1)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px'
    },
    badge: {
      background: `linear-gradient(135deg, #9333ea, #6366f1)`,
      color: 'white',
      padding: '6px 16px',
      borderRadius: '30px',
      fontSize: '13px',
      fontWeight: 'bold',
      display: 'inline-block'
    },
    objectifFinal: {
      marginTop: '16px',
      background: darkMode ? '#334155' : '#fef3c7',
      padding: '10px 20px',
      borderRadius: '16px',
      fontSize: '14px',
      fontWeight: '600',
      color: darkMode ? '#fbbf24' : '#92400e',
      display: 'inline-block'
    },
    timelineGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '20px'
    },
    etapeCard: {
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      borderRadius: '20px',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      background: darkMode ? '#1e293b' : 'white'
    },
    etapeImageWrapper: {
      position: 'relative',
      height: '180px',
      overflow: 'hidden',
      background: darkMode ? '#0f172a' : '#f1f5f9'
    },
    etapeImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.3s ease'
    },
    moisBadge: (mois) => ({
      position: 'absolute',
      top: '12px',
      right: '12px',
      background: getMoisColor(mois),
      color: 'white',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      zIndex: 2
    }),
    etapeContent: {
      padding: '16px'
    },
    etapeHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px',
      flexWrap: 'wrap',
      gap: '8px'
    },
    etapeTitre: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: darkMode ? '#f1f5f9' : '#1e293b',
      flex: 1
    },
    dureeBadge: {
      background: darkMode ? '#334155' : '#e2e8f0',
      color: darkMode ? '#94a3b8' : '#64748b',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '500'
    },
    description: {
      color: darkMode ? '#cbd5e1' : '#475569',
      fontSize: '14px',
      lineHeight: '1.5',
      marginBottom: '16px',
      paddingLeft: '12px',
      borderLeft: `3px solid #9333ea`
    },
    expandBtn: {
      background: 'none',
      border: 'none',
      color: '#9333ea',
      cursor: 'pointer',
      padding: '8px 0',
      fontSize: '13px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      width: '100%',
      justifyContent: 'center',
      marginTop: '8px'
    },
    expandedContent: {
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      animation: 'slideDown 0.3s ease'
    },
    section: {
      marginBottom: '16px'
    },
    sectionTitle: {
      fontSize: '13px',
      fontWeight: 'bold',
      color: darkMode ? '#94a3b8' : '#64748b',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    actionsList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    actionItem: {
      padding: '6px 0 6px 20px',
      fontSize: '13px',
      color: darkMode ? '#cbd5e1' : '#475569',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    ateliersList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginTop: '8px'
    },
    atelierTag: {
      background: darkMode ? '#334155' : '#f1f5f9',
      padding: '6px 12px',
      borderRadius: '10px',
      fontSize: '12px',
      color: darkMode ? '#e2e8f0' : '#475569'
    },
    statsRow: {
      display: 'flex',
      gap: '16px',
      marginTop: '16px',
      paddingTop: '12px',
      borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
    },
    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      color: darkMode ? '#94a3b8' : '#64748b'
    },
    footer: {
      marginTop: '32px',
      padding: '24px',
      background: `linear-gradient(135deg, #9333ea, #6366f1)`,
      borderRadius: '20px',
      textAlign: 'center',
      color: 'white'
    },
    footerText: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginTop: '12px'
    },
    footerSubtext: {
      fontSize: '13px',
      opacity: 0.9,
      marginTop: '8px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>
          🚀 Programme Early Stage
        </div>
        <div>
          <span style={styles.badge}>🎓 6 mois d'accompagnement intensif</span>
        </div>
        <div>
          <span style={styles.objectifFinal}>
            🎯 Objectif : Décrocher le label Startup ACT
          </span>
        </div>
      </div>

      <div style={styles.timelineGrid}>
        {etapesProgramme.map((etape) => (
          <div 
            key={etape.mois} 
            style={styles.etapeCard}
            onClick={() => toggleExpand(etape.mois)}
          >
            <div style={styles.etapeImageWrapper}>
              <span style={styles.moisBadge(etape.mois)}>Mois {etape.mois}</span>
              <img 
                src={moisImages[etape.mois]} 
                alt={etape.titre}
                style={styles.etapeImage}
                onLoad={() => handleImageLoad(etape.mois)}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            <div style={styles.etapeContent}>
              <div style={styles.etapeHeader}>
                <div style={styles.etapeTitre}>{etape.titre}</div>
                <span style={styles.dureeBadge}>{etape.duree}</span>
              </div>
              
              <div style={styles.description}>{etape.description}</div>

              {expandedMois === etape.mois && (
                <div style={styles.expandedContent}>
                  <div style={styles.section}>
                    <div style={styles.sectionTitle}>
                      ✅ Actions Clés
                    </div>
                    <div style={styles.actionsList}>
                      {etape.actionsCles.map((action, idx) => (
                        <div key={idx} style={styles.actionItem}>
                          ▸ {action}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={styles.section}>
                    <div style={styles.sectionTitle}>
                      👥 Ateliers
                    </div>
                    <div style={styles.ateliersList}>
                      {etape.ateliers.map((atelier, idx) => (
                        <span key={idx} style={styles.atelierTag}>
                          {atelier}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={styles.statsRow}>
                    <div style={styles.statItem}>
                      📅 {etape.duree}
                    </div>
                    <div style={styles.statItem}>
                      📄 Livrable requis
                    </div>
                  </div>
                </div>
              )}

              <button style={styles.expandBtn}>
                {expandedMois === etape.mois ? "▲ Voir moins" : "▼ Voir plus"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.footer}>
        🏆
        <p style={styles.footerText}>🎤 Pitch devant un comité d'experts</p>
        <p style={styles.footerSubtext}>Préparez-vous à convaincre les meilleurs investisseurs !</p>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `
      }} />
    </div>
  );
}

export default EarlyStageTimeline;