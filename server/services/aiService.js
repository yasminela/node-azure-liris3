import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
let pdfParse;

try {
  pdfParse = require('pdf-parse');
} catch (error) {
  console.log('⚠️ pdf-parse non disponible, utilisation du mode simulation');
  pdfParse = null;
}

// Extraction du texte PDF
export const extraireTextePDF = async (cheminFichier) => {
  if (pdfParse) {
    const dataBuffer = fs.readFileSync(cheminFichier);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } else {
    // Mode simulation pour les tests
    return "Projet innovant dans le secteur de la santé avec IoT et IA. Objectif: améliorer la vie des patients. Budget: 150000€. Impact social important. Réduction des coûts de 30%.";
  }
};

// Calcul du score d'impact
export const calculerScoreImpact = (texte) => {
  let score = 20; // Score de base
  
  const motsImpact = [
    "réduction", "économie", "gain", "amélioration", "innovation",
    "impact", "social", "environnemental", "IA", "IoT", "brevet"
  ];
  
  for (let mot of motsImpact) {
    if (texte.toLowerCase().includes(mot)) score += 8;
  }
  
  if (/\d+%/.test(texte)) score += 15;
  if (/\d{3,}/.test(texte)) score += 10;
  
  return Math.min(score, 100);
};

// Recommandation de formations
export const recommanderFormations = (score, texte) => {
  let formations = [];
  
  if (score < 40) {
    formations.push("📘 Formation : Définir son impact technologique");
  } else if (score < 70) {
    formations.push("📊 Formation : Mesurer son impact quantitatif");
  } else {
    formations.push("🚀 Formation : Passer à l'échelle avec l'impact");
  }
  
  if (texte.toLowerCase().includes("santé")) {
    formations.push("🏥 Formation : HealthTech & impact patient");
  }
  if (texte.toLowerCase().includes("agriculteur")) {
    formations.push("🌾 Formation : Agritech & innovation rurale");
  }
  
  return formations;
};

// Analyse du secteur
export const analyserSecteur = (texte) => {
  if (texte.toLowerCase().includes("santé")) {
    return { nom: "HealthTech", couleur: "#ef4444", icone: "🏥" };
  }
  if (texte.toLowerCase().includes("agriculteur")) {
    return { nom: "Agritech", couleur: "#10b981", icone: "🌾" };
  }
  return { nom: "Innovation générale", couleur: "#667eea", icone: "💡" };
};

// Feedback personnalisé
export const genererFeedback = (score, secteur) => {
  if (score < 40) {
    return "Impact à renforcer. Suivez les formations recommandées.";
  } else if (score < 70) {
    return "Bon potentiel ! Continuez à structurer votre projet.";
  } else {
    return "Excellent impact ! Votre projet a un fort potentiel.";
  }
};