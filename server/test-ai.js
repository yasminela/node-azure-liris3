import 'dotenv/config';
import { analyzeProject } from './services/aiService.js';

// Vérification de la clé API
console.log('OPENROUTER_API_KEY existe ?', !!process.env.OPENROUTER_API_KEY);
console.log('OPENROUTER_API_KEY début:', process.env.OPENROUTER_API_KEY?.substring(0, 15) + '...');

const testProject = {
  name: "AgriTech Samir",
  description: "Solution IoT pour l'irrigation intelligente en Tunisie",
  sector: "AgriTech",
  teamSize: 3
};

const result = await analyzeProject(testProject);
console.log('Résultat IA:', JSON.stringify(result, null, 2));