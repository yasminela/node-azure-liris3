import pdfParse from 'pdf-parse';

// Extraire le texte d'un fichier PDF
export const extraireTextePDF = async (cheminFichier) => {
  try {
    const dataBuffer = await fs.promises.readFile(cheminFichier);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Erreur extraction PDF:', error);
    return "";
  }
};

// Calculer le score d'impact
export const calculerScoreImpact = (texte) => {
  let score = 40; // Score de base
  
  const motsCles = {
    'revenu': 8, 'chiffre d\'affaires': 8, 'profit': 7,
    'client': 7, 'cible': 6, 'segment': 5,
    'marche': 7, 'marche cible': 8, 'opportunite': 6,
    'concurrent': 6, 'avantage': 7, 'unique': 8,
    'innovation': 8, 'technologie': 7, 'brevet': 8,
    'croissance': 7, 'scalable': 8, 'expansion': 6,
    'partenaire': 5, 'ressource': 5, 'activite': 5,
    'cout': 5, 'depense': 5, 'investissement': 6
  };
  
  const texteLower = texte.toLowerCase();
  
  for (const [mot, points] of Object.entries(motsCles)) {
    if (texteLower.includes(mot)) {
      score += points;
    }
  }
  
  // Bonus pour longueur (document détaillé)
  if (texte.length > 500) score += 5;
  if (texte.length > 1000) score += 5;
  
  return Math.min(100, Math.max(0, score));
};

// Recommander des formations basées sur le score et le contenu
export const recommanderFormations = (score, texte) => {
  const formations = [];
  const texteLower = texte.toLowerCase();
  
  if (score < 50) {
    formations.push('🎯 Formation: "Business Model Canvas - Les fondamentaux"');
    formations.push('📊 Formation: "Définir sa proposition de valeur"');
  }
  
  if (score >= 40 && score < 70) {
    formations.push('📈 Formation: "Optimisation du Business Model"');
    formations.push('💡 Formation: "Stratégie de croissance"');
  }
  
  if (score >= 70) {
    formations.push('🚀 Formation: "Scaling et expansion"');
    formations.push('💰 Formation: "Levée de fonds et pitch"');
  }
  
  if (texteLower.includes('technologie') || texteLower.includes('innovation')) {
    formations.push('💻 Formation: "Innovation technologique"');
  }
  
  if (texteLower.includes('marche') || texteLower.includes('client')) {
    formations.push('🎯 Formation: "Analyse de marché"');
  }
  
  if (texteLower.includes('concurrent')) {
    formations.push('⚔️ Formation: "Veille concurrentielle"');
  }
  
  if (texteLower.includes('financier') || texteLower.includes('budget')) {
    formations.push('💰 Formation: "Prévisions financières"');
  }
  
  return formations.slice(0, 5);
};

// Recommander des événements
export const recommanderEvenements = (score, texte) => {
  const evenements = [];
  const dateProchaine = new Date();
  dateProchaine.setDate(dateProchaine.getDate() + 7);
  const dateSuivante = new Date();
  dateSuivante.setDate(dateSuivante.getDate() + 14);
  
  if (score < 50) {
    evenements.push({
      titre: 'Atelier: Business Model Canvas',
      description: 'Apprenez à structurer votre BMC efficacement',
      type: 'atelier',
      date: dateProchaine.toISOString(),
      dateFin: dateProchaine.toISOString(),
      lieu: 'En ligne'
    });
  }
  
  if (score >= 40 && score < 70) {
    evenements.push({
      titre: 'Webinaire: Optimisation de votre modèle économique',
      description: 'Techniques avancées pour améliorer votre BMC',
      type: 'webinaire',
      date: dateProchaine.toISOString(),
      dateFin: dateProchaine.toISOString(),
      lieu: 'En ligne'
    });
  }
  
  if (score >= 70) {
    evenements.push({
      titre: 'Masterclass: Scale-up et croissance',
      description: 'Comment passer à l\'échelle supérieure',
      type: 'formation',
      date: dateProchaine.toISOString(),
      dateFin: dateProchaine.toISOString(),
      lieu: 'En ligne'
    });
  }
  
  // Événements spécifiques au contenu
  const texteLower = texte.toLowerCase();
  
  if (texteLower.includes('innovation')) {
    evenements.push({
      titre: 'Conférence: Innovation et disruption',
      description: 'Rencontrez des innovateurs et experts',
      type: 'conference',
      date: dateSuivante.toISOString(),
      dateFin: dateSuivante.toISOString(),
      lieu: 'Tunis'
    });
  }
  
  if (texteLower.includes('marche')) {
    evenements.push({
      titre: 'Atelier: Étude de marché',
      description: 'Méthodologies pour analyser votre marché',
      type: 'atelier',
      date: dateSuivante.toISOString(),
      dateFin: dateSuivante.toISOString(),
      lieu: 'En ligne'
    });
  }
  
  if (texteLower.includes('finance')) {
    evenements.push({
      titre: 'Formation: Finance pour startups',
      description: 'Préparez vos prévisions financières',
      type: 'formation',
      date: dateSuivante.toISOString(),
      dateFin: dateSuivante.toISOString(),
      lieu: 'En ligne'
    });
  }
  
  return evenements.slice(0, 3);
};

// Analyser le secteur d'activité
export const analyserSecteur = (texte) => {
  const secteurs = [
    { mots: ['tech', 'digital', 'logiciel', 'application', 'ia', 'data'], icone: '💻', nom: 'Technologie' },
    { mots: ['sante', 'medical', 'bien-etre', 'clinique'], icone: '🏥', nom: 'Santé' },
    { mots: ['education', 'formation', 'apprentissage', 'ecole'], icone: '📚', nom: 'Éducation' },
    { mots: ['finance', 'investissement', 'banque', 'assurance'], icone: '💰', nom: 'Finance' },
    { mots: ['commerce', 'e-commerce', 'vente', 'retail'], icone: '🛒', nom: 'Commerce' },
    { mots: ['agriculture', 'agri', 'ferme', 'aliment'], icone: '🌾', nom: 'Agri-tech' },
    { mots: ['energie', 'environnement', 'vert', 'durable'], icone: '🌱', nom: 'GreenTech' },
    { mots: ['transport', 'logistique', 'mobilite', 'livraison'], icone: '🚚', nom: 'Transport' },
    { mots: ['culture', 'art', 'media', 'contenu'], icone: '🎨', nom: 'Culture & Médias' }
  ];
  
  const texteLower = texte.toLowerCase();
  
  for (const secteur of secteurs) {
    for (const mot of secteur.mots) {
      if (texteLower.includes(mot)) {
        return { icone: secteur.icone, nom: secteur.nom };
      }
    }
  }
  
  return { icone: '🚀', nom: 'Multisectoriel' };
};

// Générer un feedback personnalisé
export const genererFeedback = (score, secteur) => {
  if (score >= 80) {
    return `🎉 Excellent travail ! Votre Business Model Canvas est très solide. Votre projet dans le secteur ${secteur.nom} a un fort potentiel. Continuez sur cette lancée et concentrez-vous sur l'exécution.`;
  } else if (score >= 60) {
    return `👍 Bon travail ! Votre BMC est bien structuré. Quelques points peuvent être améliorés notamment sur la proposition de valeur et l'analyse concurrentielle. Avec un peu de travail, vous pourrez atteindre l'excellence.`;
  } else if (score >= 40) {
    return `📊 Votre BMC est sur la bonne voie mais nécessite des améliorations. Concentrez-vous sur la clarification de votre proposition de valeur et l'identification précise de vos segments clients. N'hésitez pas à suivre les formations recommandées.`;
  } else {
    return `⚠️ Votre BMC demande des améliorations significatives. Nous vous recommandons vivement de suivre les formations de base sur le Business Model Canvas. L'équipe Incubiny est là pour vous accompagner dans cette démarche.`;
  }
};