import React from 'react';
import Icon from './Icon';
import { iconColors } from '../styles/iconColors';

const etapesProgramme = [
  {
    mois: 1,
    titre: "Idéation & Créativité",
    description: "Transformez votre idée en concept structuré",
    objectif: "Définir votre vision et valider votre concept",
    ateliers: [
      "Posture entrepreneuriale - Mme Lamia Ben Ammar",
      "Design Thinking - Mme Sameh Chemli"
    ]
  },
  {
    mois: 2,
    titre: "Business Model & Stratégie",
    description: "Construisez votre modèle économique",
    objectif: "Finaliser votre Business Model Canvas",
    ateliers: [
      "Green Business Model Canvas - Mme Dorsaf Hlel",
      "Veille marché & analyse de données - I. Masmoudi, M. Chammem"
    ]
  },
  {
    mois: 3,
    titre: "Étude de faisabilité",
    description: "Validez la viabilité de votre projet",
    objectif: "Préparer votre dossier de faisabilité",
    ateliers: [
      "Propriété intellectuelle - Mme Neila Ben Slima",
      "Étude financière - Mme Lamia Ben Ammar"
    ]
  },
  {
    mois: 5,
    titre: "Branding & Positionnement",
    description: "Construisez votre identité de marque",
    objectif: "Développer votre stratégie marketing",
    ateliers: [
      "Marketing digital & e-réputation - I. Masmoudi",
      "Proof of Concept (PoC) - Timmo Vander beek",
      "Immersion startups - Pépinière S2T"
    ]
  },
  {
    mois: 6,
    titre: "Préparation à l'incubation",
    description: "Finalisez votre dossier et pitch",
    objectif: "Décrocher le label Startup ACT",
    ateliers: [
      "Atelier pré-label Startup ACT - Coach expert",
      "Networking avec investisseurs - Réseau d'investisseurs",
      "Pitch devant comité d'experts - Jury d'incubation"
    ]
  }
];

function EarlyStageTimeline() {
  const getMoisColor = (mois) => {
    const colors = {
      1: iconColors.earlyStage.mois1,
      2: iconColors.earlyStage.mois2,
      3: iconColors.earlyStage.mois3,
      5: iconColors.earlyStage.mois5,
      6: iconColors.earlyStage.mois6
    };
    return colors[mois] || iconColors.primary;
  };

  const styles = {
    container: {
      background: 'white',
      borderRadius: '20px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    header: {
      textAlign: 'center',
      marginBottom: '28px',
      paddingBottom: '20px',
      borderBottom: `2px solid #e2e8f0`
    },
    title: {
      fontSize: '26px',
      fontWeight: 'bold',
      color: iconColors.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '8px'
    },
    badge: {
      background: iconColors.primary,
      color: iconColors.white,
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'inline-block'
    },
    objectifFinal: {
      marginTop: '12px',
      background: '#fef3c7',
      padding: '10px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#92400e'
    },
    timeline: { display: 'flex', flexDirection: 'column', gap: '20px' },
    etapeCard: {
      border: `1px solid #e2e8f0`,
      borderRadius: '16px',
      overflow: 'hidden'
    },
    etapeHeader: (mois) => ({
      background: iconColors.grayBg,
      padding: '16px 20px',
      borderBottom: `1px solid #e2e8f0`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '10px'
    }),
    etapeMois: (mois) => ({
      background: getMoisColor(mois),
      color: iconColors.white,
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold'
    }),
    etapeTitre: { fontSize: '18px', fontWeight: 'bold', color: iconColors.black },
    etapeBody: { padding: '20px' },
    description: {
      color: iconColors.gray,
      marginBottom: '16px',
      paddingLeft: '12px',
      borderLeft: `3px solid ${iconColors.primary}`,
      fontSize: '14px'
    },
    section: { marginBottom: '16px' },
    sectionTitle: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: iconColors.gray,
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    ateliersList: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    atelierTag: {
      background: '#f1f5f9',
      padding: '8px 12px',
      borderRadius: '10px',
      fontSize: '12px',
      color: iconColors.gray
    },
    footer: {
      marginTop: '24px',
      padding: '20px',
      background: `linear-gradient(135deg, ${iconColors.primary} 0%, ${iconColors.primaryDark} 100%)`,
      borderRadius: '16px',
      textAlign: 'center',
      color: iconColors.white
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>
          <Icon name="rocket" size={28} color={iconColors.primary} />
          Programme Early Stage
        </div>
        <span style={styles.badge}>6 mois d'accompagnement</span>
        <div style={styles.objectifFinal}>
           Objectif final : Décrocher le label Startup ACT et intégrer l'incubation
        </div>
      </div>

      <div style={styles.timeline}>
        {etapesProgramme.map((etape) => (
          <div key={etape.mois} style={styles.etapeCard}>
            <div style={styles.etapeHeader(etape.mois)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={styles.etapeMois(etape.mois)}>Mois {etape.mois}</span>
                <span style={styles.etapeTitre}>{etape.titre}</span>
              </div>
            </div>

            <div style={styles.etapeBody}>
              <div style={styles.description}>{etape.description}</div>

              <div style={styles.section}>
                <div style={styles.sectionTitle}>
                  <Icon name="target" size={14} color={iconColors.primary} />
                  Objectif
                </div>
                <div style={{ fontSize: '13px', color: iconColors.black }}>{etape.objectif}</div>
              </div>
              
              <div style={styles.section}>
                <div style={styles.sectionTitle}>
                  <Icon name="users" size={14} color={iconColors.primary} />
                  Ateliers & accompagnement
                </div>
                <div style={styles.ateliersList}>
                  {etape.ateliers.map((atelier, idx) => (
                    <span key={idx} style={styles.atelierTag}>
                      {atelier}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.footer}>
        <Icon name="trophy" size={24} color={iconColors.white} />
        <p style={{ marginTop: '8px', fontWeight: 'bold' }}>
          À l'issue des 6 mois, pitch devant un comité d'experts
        </p>
      </div>
    </div>
  );
}

export default EarlyStageTimeline;