// client/src/styles/iconColors.js

export const iconColors = {
  // Couleurs principales de la plateforme
  primary: '#667eea',      // Violet principal
  primaryDark: '#764ba2',   // Violet foncé (dégradé)
  secondary: '#10b981',     // Vert succès
  danger: '#ef4444',        // Rouge erreur
  warning: '#f59e0b',       // Orange avertissement
  info: '#3b82f6',          // Bleu information
  
  // Neutres
  white: '#ffffff',
  black: '#1e293b',
  gray: '#64748b',
  grayLight: '#94a3b8',
  grayBg: '#f8fafc',
  
  // Statuts des étapes
  status: {
    en_attente: '#f59e0b',
    soumise: '#3b82f6',
    validee: '#10b981',
    refusee: '#ef4444',
    en_cours: '#f59e0b'
  },
  
  // Programme Early Stage par mois
  earlyStage: {
    mois1: '#f59e0b',   // Orange - Idéation
    mois2: '#10b981',   // Vert - Business Model
    mois3: '#3b82f6',   // Bleu - Faisabilité
    mois5: '#8b5cf6',   // Violet - Branding
    mois6: '#ec4899'    // Rose - Pré-incubation
  },
  
  // Types d'ateliers
  atelier: {
    obligatoire: { bg: '#e0e7ff', color: '#4338ca' },
    experience: { bg: '#fed7aa', color: '#92400e' },
    evenement: { bg: '#fce7f3', color: '#be185d' },
    soutenance: { bg: '#d1fae5', color: '#065f46' }
  },
  
  // Actions
  action: {
    create: '#10b981',
    edit: '#f59e0b',
    delete: '#ef4444',
    view: '#3b82f6',
    validate: '#10b981',
    reject: '#ef4444',
    upload: '#667eea'
  },
  
  // Navigation
  nav: {
    active: '#667eea',
    inactive: '#64748b',
    hover: '#e2e8f0'
  }
};

export default iconColors;