import axios from 'axios';
import 'dotenv/config';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = process.env.OPENROUTER_MODEL || 'qwen/qwen3.6-plus-preview:free';

export async function analyzeProject(projectData) {
  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: MODEL,
        messages: [
          {
            role: "system",
            content: `Tu es un expert en incubation de startups. Analyse le projet et retourne UNIQUEMENT un JSON valide avec cette structure :
            {
              "viabilityScore": (0-100),
              "marketScore": (0-100),
              "teamScore": (0-100),
              "feasibilityScore": (0-100),
              "risks": ["risque1", "risque2", "risque3"],
              "recommendations": ["recommandation1", "recommandation2"],
              "summary": "résumé en 1 phrase"
            }`
          },
          {
            role: "user",
            content: `Analyse ce projet d'incubation : ${JSON.stringify(projectData)}`
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://incubiny-s2t.com',
          'X-Title': 'Incubiny S2T Platform'
        }
      }
    );
    
    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error(' Erreur AI:', error.response?.data || error.message);
    throw new Error('Échec de l’analyse IA');
  }
}