import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

// Extraction du texte PDF
export const extraireTextePDF = async (cheminFichier) => {
  const dataBuffer = fs.readFileSync(cheminFichier);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

// Calcul du score d'impact (0-100)
export const calculerScoreImpact = (texte) => {
  let score = 0;

  const motsImpact = [
    "réduction", "économie", "gain", "amélioration", "optimisation",
    "agriculteur", "patient", "étudiant", "entreprise", "consommateur",
    "IoT", "IA", "capteur", "brevet", "innovation", "prototype",
    "impact", "social", "environnemental", "durable", "green",
    "énergie", "solaire", "health", "educat", "agri"
  ];

  for (let mot of motsImpact) {
    if (texte.toLowerCase().includes(mot)) score += 8;
  }

  if (/\d+%/.test(texte)) score += 15;
  if (/\d{3,}/.test(texte)) score += 10;
  if (/brevet|prototype|MVP|testé|validé/.test(texte.toLowerCase())) score += 15;
  if (/client|cible|marché|besoin/.test(texte.toLowerCase())) score += 10;

  return Math.min(score, 100);
};

// Recommandation de formations
export const recommanderFormations = (score, texte) => {
  let formations = [];

  if (score < 35) {
    formations.push("Formation : Définir son impact technologique");
    formations.push("Formation : Mesurer son impact quantitatif");
    formations.push("Formation : Structurer sa proposition de valeur");
  } else if (score < 65) {
    formations.push("Formation : Mesurer son impact quantitatif");
    formations.push("Formation : Structurer sa proposition de valeur");
    formations.push("Formation : Stratégie de déploiement");
  } else {
    formations.push("Formation : Passer à l'échelle avec l'impact");
    formations.push("Formation : Stratégie de déploiement");
    formations.push("Formation : Pitch & levée de fonds");
  }

  const texteLower = texte.toLowerCase();
  
  if (texteLower.includes("agriculteur") || texteLower.includes("ferme") || texteLower.includes("agri")) {
    formations.push("Formation : Agritech & innovation rurale");
  }
  if (texteLower.includes("santé") || texteLower.includes("patient") || texteLower.includes("medical")) {
    formations.push("Formation : HealthTech & impact patient");
  }
  if (texteLower.includes("éducation") || texteLower.includes("école") || texteLower.includes("formation")) {
    formations.push("Formation : EdTech & impact social");
  }
  if (texteLower.includes("énergie") || texteLower.includes("solaire") || texteLower.includes("environnement")) {
    formations.push("Formation : GreenTech & impact environnemental");
  }

  return [...new Set(formations)].slice(0, 5);
};

// Analyse du secteur
export const analyserSecteur = (texte) => {
  const texteLower = texte.toLowerCase();
  
  if (/(agriculteur|ferme|agri|culture|paysan|elevage)/.test(texteLower)) {
    return { nom: "Agritech", couleur: "#10b981", icone: "🌾" };
  }
  if (/(santé|patient|medical|clinique|hopital|médical)/.test(texteLower)) {
    return { nom: "HealthTech", couleur: "#ef4444", icone: "🏥" };
  }
  if (/(éducation|école|formation|apprentissage|étudiant)/.test(texteLower)) {
    return { nom: "EdTech", couleur: "#3b82f6", icone: "🎓" };
  }
  if (/(énergie|solaire|environnement|recyclage|green)/.test(texteLower)) {
    return { nom: "GreenTech", couleur: "#22c55e", icone: "🌱" };
  }
  if (/(iot|ia|intelligence artificielle|capteur|robot)/.test(texteLower)) {
    return { nom: "DeepTech", couleur: "#8b5cf6", icone: "🤖" };
  }
  
  return { nom: "Innovation générale", couleur: "#667eea", icone: "💡" };
};

// Feedback personnalisé
export const genererFeedback = (score, secteur) => {
  if (score < 35) {
    return "⚠️ Impact potentiel à renforcer. Les formations recommandées vous aideront à mieux définir et mesurer votre impact.";
  } else if (score < 65) {
    return "✅ Bon potentiel d'impact ! Continuez à structurer votre proposition de valeur et préparez-vous à passer à l'échelle.";
  } else {
    return "🎉 Excellent impact détecté ! Votre projet a un fort potentiel. Concentrez-vous sur le passage à l'échelle et la recherche de financement.";
  }
};